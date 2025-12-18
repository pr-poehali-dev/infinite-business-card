-- Add Yandex ID and Telegram ID columns for OAuth support
ALTER TABLE t_p18253922_infinite_business_ca.users 
ADD COLUMN IF NOT EXISTS yandex_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS telegram_id VARCHAR(255);

-- Create indexes for fast OAuth lookups
CREATE INDEX IF NOT EXISTS idx_users_yandex_id ON t_p18253922_infinite_business_ca.users(yandex_id);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON t_p18253922_infinite_business_ca.users(telegram_id);
