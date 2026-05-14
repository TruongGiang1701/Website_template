-- Chạy một lần trên DB đã tạo từ schema cũ (chưa có unique guest session):
-- - bash/zsh:    psql "$DATABASE_URL" -f db/migrations/001_cart_guest_session_unique.sql
-- - PowerShell:  psql "$env:DATABASE_URL" -f db/migrations/001_cart_guest_session_unique.sql
-- - cmd.exe:     psql "%DATABASE_URL%" -f db/migrations/001_cart_guest_session_unique.sql

CREATE UNIQUE INDEX IF NOT EXISTS uq_carts_guest_session_id
  ON carts (session_id)
  WHERE user_id IS NULL AND session_id IS NOT NULL;
