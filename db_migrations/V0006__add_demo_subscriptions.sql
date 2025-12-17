-- Добавление подписок для демо-аккаунтов
INSERT INTO t_p18253922_infinite_business_ca.user_subscriptions (user_id, plan_id, status, started_at, created_at)
SELECT 
  u.id,
  CASE 
    WHEN u.email = 'demo-free@visitka.site' THEN 1
    WHEN u.email = 'demo-basic@visitka.site' THEN 2
    WHEN u.email = 'demo-pro@visitka.site' THEN 3
  END as plan_id,
  'active',
  NOW(),
  NOW()
FROM t_p18253922_infinite_business_ca.users u
WHERE u.email IN ('demo-free@visitka.site', 'demo-basic@visitka.site', 'demo-pro@visitka.site')
  AND NOT EXISTS (
    SELECT 1 FROM t_p18253922_infinite_business_ca.user_subscriptions us 
    WHERE us.user_id = u.id
  );