-- Chạy một lần trên DB đã có dữ liệu:
-- - bash/zsh:    psql "$DATABASE_URL" -f db/migrations/002_uuid_v7_defaults.sql
-- - PowerShell:  psql "$env:DATABASE_URL" -f db/migrations/002_uuid_v7_defaults.sql
-- - cmd.exe:     psql "%DATABASE_URL%" -f db/migrations/002_uuid_v7_defaults.sql
--
-- Mục tiêu:
-- - Giữ nguyên dữ liệu UUID cũ (v4) đang tồn tại.
-- - Chỉ đổi DEFAULT của cột id sang UUIDv7 cho record mới.
--
-- Yêu cầu runtime:
-- - PostgreSQL 18+ (có sẵn uuidv7), hoặc
-- - Cài extension pg_uuidv7 (hàm uuid_generate_v7) cho PostgreSQL thấp hơn.

BEGIN;

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

ALTER TABLE users ALTER COLUMN id SET DEFAULT app_uuid_v7();
ALTER TABLE sessions ALTER COLUMN id SET DEFAULT app_uuid_v7();
ALTER TABLE products ALTER COLUMN id SET DEFAULT app_uuid_v7();
ALTER TABLE product_images ALTER COLUMN id SET DEFAULT app_uuid_v7();
ALTER TABLE tags ALTER COLUMN id SET DEFAULT app_uuid_v7();
ALTER TABLE carts ALTER COLUMN id SET DEFAULT app_uuid_v7();
ALTER TABLE orders ALTER COLUMN id SET DEFAULT app_uuid_v7();
ALTER TABLE order_events ALTER COLUMN id SET DEFAULT app_uuid_v7();
ALTER TABLE payments ALTER COLUMN id SET DEFAULT app_uuid_v7();
ALTER TABLE payment_webhook_inbox ALTER COLUMN id SET DEFAULT app_uuid_v7();
ALTER TABLE audit_logs ALTER COLUMN id SET DEFAULT app_uuid_v7();

COMMIT;

