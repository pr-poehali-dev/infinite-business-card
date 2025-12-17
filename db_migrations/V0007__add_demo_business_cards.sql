-- Добавление демо-визиток для тестовых аккаунтов

-- Визитка для Free аккаунта (Анна Иванова)
INSERT INTO t_p18253922_infinite_business_ca.business_cards 
(user_id, name, position, company, phone, email, website, description, view_count, is_public, theme, created_at, updated_at)
SELECT 
  u.id,
  'Анна Иванова',
  'Менеджер по продажам',
  'ООО "Успех"',
  '+7 (915) 123-45-67',
  'anna@success.ru',
  'https://success.ru',
  'Помогаю бизнесу находить новых клиентов и увеличивать продажи. 5 лет опыта в B2B.',
  142,
  true,
  'modern',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '2 days'
FROM t_p18253922_infinite_business_ca.users u
WHERE u.email = 'demo-free@visitka.site'
  AND NOT EXISTS (
    SELECT 1 FROM t_p18253922_infinite_business_ca.business_cards bc WHERE bc.user_id = u.id
  );

-- Визитки для Basic аккаунта (Пётр Смирнов)
INSERT INTO t_p18253922_infinite_business_ca.business_cards 
(user_id, name, position, company, phone, email, website, description, view_count, is_public, theme, created_at, updated_at)
SELECT 
  u.id,
  'Пётр Смирнов',
  'IT-консультант',
  'Tech Solutions',
  '+7 (926) 234-56-78',
  'petr@techsol.ru',
  'https://techsolutions.ru',
  'Разрабатываю цифровые решения для бизнеса. Специализация: автоматизация процессов, интеграции, веб-разработка.',
  287,
  true,
  'elegant',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '1 day'
FROM t_p18253922_infinite_business_ca.users u
WHERE u.email = 'demo-basic@visitka.site'
  AND NOT EXISTS (
    SELECT 1 FROM t_p18253922_infinite_business_ca.business_cards bc WHERE bc.user_id = u.id AND bc.name = 'Пётр Смирнов'
  );

INSERT INTO t_p18253922_infinite_business_ca.business_cards 
(user_id, name, position, company, phone, email, website, description, view_count, is_public, theme, created_at, updated_at)
SELECT 
  u.id,
  'Tech Solutions',
  'Команда разработки',
  'Tech Solutions',
  '+7 (495) 777-88-99',
  'info@techsol.ru',
  'https://techsolutions.ru',
  'Корпоративная визитка компании. Создаём современные IT-решения с 2015 года.',
  156,
  true,
  'professional',
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '3 days'
FROM t_p18253922_infinite_business_ca.users u
WHERE u.email = 'demo-basic@visitka.site'
  AND NOT EXISTS (
    SELECT 1 FROM t_p18253922_infinite_business_ca.business_cards bc WHERE bc.user_id = u.id AND bc.name = 'Tech Solutions'
  );

-- Визитки для Pro аккаунта (Мария Петрова)
INSERT INTO t_p18253922_infinite_business_ca.business_cards 
(user_id, name, position, company, phone, email, website, description, view_count, is_public, theme, created_at, updated_at)
SELECT 
  u.id,
  'Мария Петрова',
  'CEO & Founder',
  'Premium Consulting Group',
  '+7 (495) 123-00-00',
  'maria@premium-cg.ru',
  'https://premium-consulting.ru',
  'Руковожу консалтинговой компанией полного цикла. Помогаем бизнесу расти и развиваться стратегически.',
  1543,
  true,
  'luxury',
  NOW() - INTERVAL '60 days',
  NOW()
FROM t_p18253922_infinite_business_ca.users u
WHERE u.email = 'demo-pro@visitka.site'
  AND NOT EXISTS (
    SELECT 1 FROM t_p18253922_infinite_business_ca.business_cards bc WHERE bc.user_id = u.id AND bc.name = 'Мария Петрова'
  );

INSERT INTO t_p18253922_infinite_business_ca.business_cards 
(user_id, name, position, company, phone, email, website, description, view_count, is_public, theme, created_at, updated_at)
SELECT 
  u.id,
  'Premium Events',
  'Отдел мероприятий',
  'Premium Consulting Group',
  '+7 (495) 123-00-01',
  'events@premium-cg.ru',
  'https://premium-events.ru',
  'Организуем бизнес-мероприятия премиум-класса: конференции, форумы, корпоративы.',
  892,
  true,
  'modern',
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '5 days'
FROM t_p18253922_infinite_business_ca.users u
WHERE u.email = 'demo-pro@visitka.site'
  AND NOT EXISTS (
    SELECT 1 FROM t_p18253922_infinite_business_ca.business_cards bc WHERE bc.user_id = u.id AND bc.name = 'Premium Events'
  );

INSERT INTO t_p18253922_infinite_business_ca.business_cards 
(user_id, name, position, company, phone, email, website, description, view_count, is_public, theme, created_at, updated_at)
SELECT 
  u.id,
  'Legal Advisory',
  'Юридический отдел',
  'Premium Consulting Group',
  '+7 (495) 123-00-02',
  'legal@premium-cg.ru',
  'https://premium-legal.ru',
  'Юридическое сопровождение бизнеса: договоры, сделки M&A, корпоративное право.',
  654,
  true,
  'professional',
  NOW() - INTERVAL '50 days',
  NOW() - INTERVAL '7 days'
FROM t_p18253922_infinite_business_ca.users u
WHERE u.email = 'demo-pro@visitka.site'
  AND NOT EXISTS (
    SELECT 1 FROM t_p18253922_infinite_business_ca.business_cards bc WHERE bc.user_id = u.id AND bc.name = 'Legal Advisory'
  );