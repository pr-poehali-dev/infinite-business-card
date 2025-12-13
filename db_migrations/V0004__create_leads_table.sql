-- Создание таблицы для хранения лидов с визиток
CREATE TABLE IF NOT EXISTS card_leads (
    id SERIAL PRIMARY KEY,
    card_id INTEGER NOT NULL REFERENCES business_cards(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    message TEXT,
    source VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_contact_info CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Индексы для быстрого поиска
CREATE INDEX idx_card_leads_card_id ON card_leads(card_id);
CREATE INDEX idx_card_leads_created_at ON card_leads(created_at DESC);
CREATE INDEX idx_card_leads_is_read ON card_leads(is_read);

-- Комментарии
COMMENT ON TABLE card_leads IS 'Лиды, оставленные посетителями визиток';
COMMENT ON COLUMN card_leads.card_id IS 'ID визитки, откуда пришёл лид';
COMMENT ON COLUMN card_leads.source IS 'Источник лида (direct, qr, social и т.д.)';
COMMENT ON COLUMN card_leads.is_read IS 'Прочитан ли лид владельцем';
