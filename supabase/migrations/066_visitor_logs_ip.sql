-- 065: visitor_logs에 ip_address 컬럼 추가
ALTER TABLE visitor_logs ADD COLUMN IF NOT EXISTS ip_address text;

CREATE INDEX IF NOT EXISTS visitor_logs_ip_address_idx ON visitor_logs(ip_address);
