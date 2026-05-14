

-- Visstemp schema (PostgreSQL) — backend-ready for:
-- - Templates storefront: products, tags, images
-- - Auth + user settings
-- - Favorites
-- - Cart + Checkout
-- - Orders history per user
-- - Online payments + webhook inbox + idempotency
-- - Admin management (RBAC via users.role) + audit trails
--
-- Run:
-- - bash/zsh:    psql "$DATABASE_URL" -f db/schema.sql
-- - PowerShell:  psql "$env:DATABASE_URL" -f db/schema.sql
-- - cmd.exe:     psql "%DATABASE_URL%" -f db/schema.sql

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- UUIDv7 helper:
-- - PostgreSQL 18+: uses built-in uuidv7()
-- - PostgreSQL <18: uses uuid_generate_v7() from extension pg_uuidv7
CREATE OR REPLACE FUNCTION app_uuid_v7()
RETURNS uuid AS $$
DECLARE
  generated uuid;
BEGIN
  IF to_regproc('uuidv7') IS NOT NULL THEN
    EXECUTE 'SELECT uuidv7()' INTO generated;
    RETURN generated;
  ELSIF to_regproc('uuid_generate_v7') IS NOT NULL THEN
    EXECUTE 'SELECT uuid_generate_v7()' INTO generated;
    RETURN generated;
  END IF;

  RAISE EXCEPTION
    'UUIDv7 function not found. Use PostgreSQL 18+ (uuidv7) or install extension pg_uuidv7 (uuid_generate_v7).';
END;
$$ LANGUAGE plpgsql;

-- Updated-at helper
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- 1) Users / Auth / Settings
-- =========================

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT app_uuid_v7(),
  email citext NOT NULL UNIQUE,
  name text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
  avatar_url text NULL,
  is_disabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_users_updated_at') THEN
    CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

-- Optional sessions table (use if you store sessions server-side)
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT app_uuid_v7(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  preferred_category text NOT NULL DEFAULT 'Doanh nghiệp',
  notify_promotions boolean NOT NULL DEFAULT true,
  notify_order_updates boolean NOT NULL DEFAULT true,
  show_profile_public boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_user_settings_updated_at') THEN
    CREATE TRIGGER trg_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

-- =========================
-- 2) Products (Templates)
-- =========================

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT app_uuid_v7(),
  -- maps demo ids like "tpl-01"
  legacy_key text UNIQUE NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NULL,
  group_name text NOT NULL,
  price_vnd integer NOT NULL CHECK (price_vnd >= 0),
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  try_url text NULL,
  -- admin-friendly soft delete
  deleted_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_products_updated_at') THEN
    CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_group_name ON products(group_name);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at);

CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT app_uuid_v7(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_images_product_sort ON product_images(product_id, sort_order);

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT app_uuid_v7(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS product_tags (
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag_id ON product_tags(tag_id);

-- =========================
-- 3) Favorites
-- =========================

CREATE TABLE IF NOT EXISTS favorites (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- =========================
-- 4) Cart + Cart Items
-- =========================

CREATE TABLE IF NOT EXISTS carts (
  id uuid PRIMARY KEY DEFAULT app_uuid_v7(),
  user_id uuid NULL REFERENCES users(id) ON DELETE SET NULL,
  -- for guest carts; store a cookie/session id
  session_id text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_carts_updated_at') THEN
    CREATE TRIGGER trg_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id);

-- Một giỏ guest cho mỗi session (cookie), tránh tạo trùng khi request đồng thời
CREATE UNIQUE INDEX IF NOT EXISTS uq_carts_guest_session_id
  ON carts (session_id)
  WHERE user_id IS NULL AND session_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS cart_items (
  cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  qty integer NOT NULL CHECK (qty > 0),
  price_snapshot_vnd integer NOT NULL CHECK (price_snapshot_vnd >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (cart_id, product_id)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_cart_items_updated_at') THEN
    CREATE TRIGGER trg_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);

-- =========================
-- 5) Orders / Order History / Payments / Webhooks
-- =========================

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT app_uuid_v7(),
  code text NOT NULL UNIQUE,
  user_id uuid NULL REFERENCES users(id) ON DELETE SET NULL,

  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  payment_status text NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded')),

  subtotal_vnd integer NOT NULL CHECK (subtotal_vnd >= 0),
  discount_vnd integer NOT NULL DEFAULT 0 CHECK (discount_vnd >= 0),
  total_vnd integer NOT NULL CHECK (total_vnd >= 0),

  contact_name text NULL,
  contact_email citext NULL,
  note text NULL,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_orders_updated_at') THEN
    CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

CREATE TABLE IF NOT EXISTS order_items (
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  title_snapshot text NOT NULL,
  price_snapshot_vnd integer NOT NULL CHECK (price_snapshot_vnd >= 0),
  qty integer NOT NULL CHECK (qty > 0),
  PRIMARY KEY (order_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Status/history timeline (admin + webhook updates should write here)
CREATE TABLE IF NOT EXISTS order_events (
  id uuid PRIMARY KEY DEFAULT app_uuid_v7(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  actor_user_id uuid NULL REFERENCES users(id) ON DELETE SET NULL,
  source text NOT NULL CHECK (source IN ('system', 'admin', 'webhook', 'customer')),
  event_type text NOT NULL,
  prev_status text NULL,
  next_status text NULL,
  prev_payment_status text NULL,
  next_payment_status text NULL,
  note text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON order_events(order_id, created_at DESC);

-- Idempotency keys for create-order / pay / webhook processing
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key text PRIMARY KEY,
  scope text NOT NULL,
  request_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_idempotency_scope_created ON idempotency_keys(scope, created_at DESC);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT app_uuid_v7(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('vnpay', 'momo', 'stripe', 'manual')),
  provider_ref text NULL,
  status text NOT NULL CHECK (status IN ('created', 'processing', 'succeeded', 'failed', 'cancelled')),
  amount_vnd integer NOT NULL CHECK (amount_vnd >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_payments_updated_at') THEN
    CREATE TRIGGER trg_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_ref ON payments(provider, provider_ref);

-- Webhook inbox: store every webhook payload for processing + retries
CREATE TABLE IF NOT EXISTS payment_webhook_inbox (
  id uuid PRIMARY KEY DEFAULT app_uuid_v7(),
  provider text NOT NULL CHECK (provider IN ('vnpay', 'momo', 'stripe', 'manual')),
  event_id text NULL,
  signature text NULL,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz NULL,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processed', 'failed', 'ignored')),
  error text NULL
);

-- Prevent duplicate processing by (provider,event_id) when event_id exists
CREATE UNIQUE INDEX IF NOT EXISTS uq_webhook_provider_event_id
  ON payment_webhook_inbox(provider, event_id)
  WHERE event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_webhook_received ON payment_webhook_inbox(provider, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_status ON payment_webhook_inbox(status, received_at DESC);

-- =========================
-- 6) Admin audit logs (for product/order management)
-- =========================

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT app_uuid_v7(),
  actor_user_id uuid NULL REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NULL,
  meta jsonb NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_actor_created ON audit_logs(actor_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_entity_created ON audit_logs(entity_type, entity_id, created_at DESC);

COMMIT;

