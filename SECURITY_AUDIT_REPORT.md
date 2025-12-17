# Отчет по аудиту безопасности Backend функций

Дата: 17 декабря 2024
Проверено функций: 14

---

## Статус проверки tests.json

### ✅ Функции с tests.json (14/14)
Все функции имеют файл tests.json:
- ai-generate
- analytics
- auth
- cards
- email-notifications
- leads
- payment
- payments
- qr-generator
- quiz-analytics
- rate-limiter
- referrals
- short-urls
- system-monitor
- vk-auth

### ⚠️ Функции с неполными тестами (3)

1. **ai-generate/tests.json** - только health check, нет тестов генерации
2. **email-notifications/tests.json** - только 1 негативный тест
3. **auth/tests.json** - только login тест, нет теста регистрации

---

## 🔴 Критические проблемы безопасности

### 1. SQL Injection уязвимости

#### **analytics/index.py** (Строки 51-58, 62-68, 72-78)
```python
# ИСПОЛЬЗУЕТСЯ параметризация - ✅ БЕЗОПАСНО
cur.execute("""
    SELECT COUNT(*) FROM card_views WHERE card_id = %s
""", (card_id,))
```
**Статус**: ✅ Защищено

#### **cards/index.py** (Строки 38, 62-69, 98, 113-130, 143-171)
```python
# ИСПОЛЬЗУЕТСЯ параметризация - ✅ БЕЗОПАСНО
cur.execute("SELECT * FROM business_cards WHERE id = %s", (card_id,))
```
**Статус**: ✅ Защищено

#### **leads/index.py** (Строка 62, 74-82, 87, 143-146, 156-163)
```python
# ИСПОЛЬЗУЕТСЯ параметризация - ✅ БЕЗОПАСНО
cur.execute("SELECT id, user_id FROM business_cards WHERE id = %s", (card_id,))
```
**Статус**: ✅ Защищено

#### **auth/index.py** (Строки 63-66, 102-105, 130-133)
```python
# ИСПОЛЬЗУЕТСЯ параметризация - ✅ БЕЗОПАСНО
cur.execute("INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s)", ...)
```
**Статус**: ✅ Защищено

**Вывод**: SQL Injection защита реализована корректно во всех функциях

---

### 2. Проблемы с валидацией входных данных

#### ❌ **ai-generate/index.py**
**Проблемы**:
- Строка 72: `verify=False` - ОТКЛЮЧЕНА проверка SSL сертификатов
- Строка 96: `verify=False` - повторное отключение SSL
- Нет ограничения длины prompt (можно отправить очень длинный текст)
- Нет rate limiting на дорогостоящую AI операцию

```python
# КРИТИЧНО: Отключена проверка SSL
auth_response = requests.post(
    'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
    verify=False  # ❌ УЯЗВИМОСТЬ
)
```

**Рекомендации**:
```python
# 1. Включить SSL проверку
verify=True

# 2. Добавить валидацию промпта
if not prompt or len(prompt) > 500:
    return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid prompt length'})}

# 3. Добавить rate limiting
# Интегрировать с rate-limiter функцией
```

---

#### ⚠️ **analytics/index.py**
**Проблемы**:
- Нет валидации типа card_id (может быть строкой с SQL синтаксисом)
- Нет проверки прав доступа к card_id
- Публичный POST без аутентификации может спамить БД

**Рекомендации**:
```python
# Добавить валидацию типа
try:
    card_id = int(card_id)
except (ValueError, TypeError):
    return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid card_id'})}

# Добавить rate limiting для POST
# Проверять владение карточкой для GET запросов
```

---

#### ⚠️ **cards/index.py**
**Проблемы**:
- Строка 57: публичный endpoint отслеживания просмотров без валидации
- Нет защиты от накрутки просмотров (можно спамить)
- Отсутствует санитизация входных данных (name, email, phone, etc.)

**Рекомендации**:
```python
# 1. Добавить rate limiting для /view endpoint
# 2. Валидировать email формат
import re
email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
if email and not email_pattern.match(email):
    return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid email'})}

# 3. Ограничить длину полей
if name and len(name) > 100:
    return {'statusCode': 400, 'body': json.dumps({'error': 'Name too long'})}
```

---

#### ❌ **auth/index.py**
**Проблемы**:
- Строка 79: Hardcoded fallback secret `'fallback_secret_for_dev'`
- Строка 148: Дублирование fallback secret
- Нет проверки силы пароля
- Нет проверки email формата
- Нет защиты от brute-force атак

```python
# КРИТИЧНО: Слабый секрет по умолчанию
token = jwt.encode(
    {'user_id': user['id'], 'email': user['email']},
    os.environ.get('JWT_SECRET', 'fallback_secret_for_dev'),  # ❌
    algorithm='HS256'
)
```

**Рекомендации**:
```python
# 1. Убрать fallback секрет
JWT_SECRET = os.environ.get('JWT_SECRET')
if not JWT_SECRET:
    raise ValueError('JWT_SECRET environment variable is required')

# 2. Валидировать пароль
import re
password_pattern = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$')
if not password_pattern.match(password):
    return {'statusCode': 400, 'body': json.dumps({
        'error': 'Password must be at least 8 characters with letters and numbers'
    })}

# 3. Валидировать email
if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
    return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid email format'})}

# 4. Добавить rate limiting для логина (защита от brute-force)
```

---

#### ⚠️ **email-notifications/index.py**
**Проблемы**:
- Нет аутентификации - любой может отправлять email
- Нет валидации email адреса получателя
- Нет rate limiting (можно использовать для спама)
- Нет защиты от email injection в subject/content

**Рекомендации**:
```python
# 1. Добавить аутентификацию
headers = event.get('headers', {})
user_id = headers.get('X-User-Id') or headers.get('x-user-id')
if not user_id:
    return {'statusCode': 401, 'body': json.dumps({'error': 'Unauthorized'})}

# 2. Валидировать email
if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', to_email):
    return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid email'})}

# 3. Санитизировать subject и content
subject = subject.replace('\r', '').replace('\n', '')[:200]

# 4. Добавить rate limiting (макс 10 писем в час на пользователя)
```

---

#### ⚠️ **leads/index.py**
**Проблемы**:
- Публичный POST endpoint без rate limiting
- Нет валидации email/phone форматов
- Строка 91-106: hardcoded URL функции email-notifications
- Нет обработки тайм-аута запроса email notification

**Рекомендации**:
```python
# 1. Добавить валидацию email
if email and not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
    return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid email'})}

# 2. Валидировать phone
if phone and not re.match(r'^\+?[0-9\s\-\(\)]{10,20}$', phone):
    return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid phone'})}

# 3. Переместить URL в переменную окружения
EMAIL_NOTIFICATION_URL = os.environ.get('EMAIL_NOTIFICATION_URL')

# 4. Добавить rate limiting для публичного endpoint
```

---

#### ⚠️ **payment/index.py** & **payments/index.py**
**Проблемы**:
- payment/index.py строка 88: нет валидации amount (может быть отрицательным или 0)
- payments/index.py строка 55: нет валидации amount
- Отсутствует проверка maximum amount (защита от ошибок)
- Нет логирования платежных операций

**Рекомендации**:
```python
# Валидировать amount
try:
    amount = float(amount)
    if amount <= 0 or amount > 1000000:
        return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid amount'})}
except (ValueError, TypeError):
    return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid amount format'})}
```

---

#### ⚠️ **vk-auth/index.py**
**Проблемы**:
- Строка 120: импорт `secrets` не используется, но токен нужен
- Строка 128: hardcoded JWT secret `'secret_key_change_in_production'`
- Нет валидации VK response
- Нет проверки user_id от VK

```python
# КРИТИЧНО: Слабый секрет
token = jwt.encode(
    {'user_id': user_id, 'email': vk_email},
    'secret_key_change_in_production',  # ❌ HARDCODED
    algorithm='HS256'
)
```

**Рекомендации**:
```python
# 1. Использовать переменную окружения
JWT_SECRET = os.environ.get('JWT_SECRET')
if not JWT_SECRET:
    return {'statusCode': 500, 'body': json.dumps({'error': 'JWT not configured'})}

# 2. Валидировать VK user_id
if not vk_user_id or not isinstance(vk_user_id, (int, str)):
    return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid VK user'})}
```

---

### 3. Проблемы с обработкой ошибок

#### ⚠️ **ai-generate/index.py**
```python
except Exception as e:
    return {
        'statusCode': 500,
        'body': json.dumps({'error': str(e)})  # ❌ Раскрывает внутренние ошибки
    }
```
**Проблема**: Раскрытие деталей ошибок пользователю (включая API ключи, пути)

**Рекомендация**:
```python
except Exception as e:
    # Логировать полную ошибку
    print(f"AI generation error: {str(e)}")
    # Возвращать общее сообщение
    return {
        'statusCode': 500,
        'body': json.dumps({'error': 'Image generation failed'})
    }
```

#### ✅ Хорошая обработка ошибок
- **analytics/index.py**: Rollback транзакции + закрытие соединений
- **auth/index.py**: Специфичная обработка IntegrityError
- **payment/index.py**: Обработка RequestException отдельно

---

### 4. Проблемы с аутентификацией

#### ⚠️ **Слабая проверка аутентификации**
Многие функции используют только заголовок `X-User-Id` без проверки JWT:

```python
# ❌ Небезопасно - можно подменить заголовок
user_id = headers.get('X-User-Id')
if not user_id:
    return {'statusCode': 401, ...}
```

**Затронутые функции**:
- cards/index.py (строка 86)
- ai-generate/index.py (строка 40)
- leads/index.py (строка 119)
- payments/index.py (строка 41)
- referrals/index.py (строка 47)

**Рекомендация**: Добавить middleware для проверки JWT токена

```python
def verify_jwt_token(event):
    """Проверяет JWT токен из заголовка Authorization"""
    auth_header = event.get('headers', {}).get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None, {'statusCode': 401, 'body': json.dumps({'error': 'Missing token'})}
    
    token = auth_header.replace('Bearer ', '')
    try:
        JWT_SECRET = os.environ.get('JWT_SECRET')
        if not JWT_SECRET:
            raise ValueError('JWT_SECRET not configured')
        
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload['user_id'], None
    except jwt.ExpiredSignatureError:
        return None, {'statusCode': 401, 'body': json.dumps({'error': 'Token expired'})}
    except jwt.InvalidTokenError:
        return None, {'statusCode': 401, 'body': json.dumps({'error': 'Invalid token'})}

# Использование
user_id, error = verify_jwt_token(event)
if error:
    return error
```

---

### 5. Проблемы с управлением соединениями к БД

#### ⚠️ **analytics/index.py** (Строка 34)
```python
conn = psycopg2.connect(os.environ['DATABASE_URL'])
cur = conn.cursor()
# ❌ Открывается ДО try блока - может утечь
```

#### ✅ **Правильный подход** (auth/index.py)
```python
conn = None
cur = None
try:
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    # ...
finally:
    if cur:
        cur.close()
    if conn:
        conn.close()
```

**Затронутые функции**:
- analytics/index.py
- referrals/index.py  
- short-urls/index.py

**Рекомендация**: Переместить все подключения к БД внутрь try блока

---

### 6. Отсутствие rate limiting

#### ❌ Критичные endpoints без rate limiting:
1. **auth/index.py** - login/register (уязвимо к brute-force)
2. **cards/index.py** - POST /view (можно накручивать счетчики)
3. **leads/index.py** - POST публичный (спам лидами)
4. **email-notifications/index.py** - POST (спам email)
5. **ai-generate/index.py** - POST (дорогостоящие AI запросы)

**Рекомендация**: Интегрировать rate-limiter функцию во все публичные endpoints

```python
import requests

def check_rate_limit(identifier, max_requests=10, window_seconds=60):
    """Проверяет rate limit через rate-limiter функцию"""
    try:
        response = requests.post(
            os.environ.get('RATE_LIMITER_URL'),
            json={
                'identifier': identifier,
                'max_requests': max_requests,
                'window_seconds': window_seconds
            },
            timeout=2
        )
        if response.status_code == 429:
            return False, response.json().get('retry_after', 60)
        return True, None
    except:
        # Если rate-limiter недоступен, пропускаем запрос
        return True, None

# Использование в функции
allowed, retry_after = check_rate_limit(f"auth_login_{email}")
if not allowed:
    return {
        'statusCode': 429,
        'headers': {'Retry-After': str(retry_after)},
        'body': json.dumps({'error': 'Too many requests'})
    }
```

---

### 7. Проблемы с секретами и конфигурацией

#### ❌ **Hardcoded секреты**:

1. **auth/index.py** (строка 79, 148):
   - `'fallback_secret_for_dev'` - слабый JWT секрет по умолчанию

2. **vk-auth/index.py** (строка 128):
   - `'secret_key_change_in_production'` - hardcoded JWT секрет

3. **leads/index.py** (строка 93):
   - Hardcoded URL функции: `'https://functions.poehali.dev/74c49dcb-...'`

**Рекомендация**: Все секреты и URLs должны быть в переменных окружения

```python
# Проверять наличие критичных секретов при старте
REQUIRED_SECRETS = ['JWT_SECRET', 'DATABASE_URL']
missing_secrets = [s for s in REQUIRED_SECRETS if not os.environ.get(s)]
if missing_secrets:
    raise ValueError(f"Missing required secrets: {', '.join(missing_secrets)}")
```

---

### 8. Отсутствие логирования безопасности

Ни одна функция не логирует события безопасности:
- Неудачные попытки входа
- Подозрительная активность
- Изменения критичных данных
- Платежные операции

**Рекомендация**: Добавить структурированное логирование

```python
import json
import sys

def log_security_event(event_type, user_id=None, details=None):
    """Логирует события безопасности"""
    log_entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'event_type': event_type,
        'user_id': user_id,
        'details': details
    }
    print(json.dumps(log_entry), file=sys.stderr)

# Использование
log_security_event('login_failed', None, {'email': email, 'ip': source_ip})
log_security_event('payment_created', user_id, {'amount': amount, 'type': payment_type})
```

---

## Приоритезированный список рекомендаций

### 🔴 КРИТИЧНО (исправить немедленно):

1. **ai-generate/index.py**: Включить SSL проверку (`verify=True`)
2. **auth/index.py**: Удалить fallback JWT секрет
3. **vk-auth/index.py**: Удалить hardcoded JWT секрет
4. **email-notifications/index.py**: Добавить аутентификацию
5. Все функции: Заменить `X-User-Id` на проверку JWT токена

### 🟠 ВЫСОКИЙ ПРИОРИТЕТ (в течение недели):

1. Добавить rate limiting для auth, cards/view, leads, email-notifications, ai-generate
2. Добавить валидацию email/phone/password во всех функциях
3. Улучшить обработку ошибок (не раскрывать детали)
4. Исправить управление БД соединениями в analytics, referrals, short-urls
5. Добавить валидацию amount в payment функциях

### 🟡 СРЕДНИЙ ПРИОРИТЕТ (в течение месяца):

1. Добавить логирование безопасности
2. Улучшить tests.json для ai-generate, email-notifications, auth
3. Добавить ограничения на длину полей (name, description, etc.)
4. Добавить проверку владения ресурсом в analytics GET
5. Переместить hardcoded URLs в переменные окружения

### 🟢 НИЗКИЙ ПРИОРИТЕТ (долгосрочно):

1. Добавить метрики и мониторинг
2. Внедрить автоматическое тестирование безопасности
3. Добавить документацию API с примерами безопасного использования
4. Регулярный security аудит кода

---

## Общие рекомендации по архитектуре

### 1. Создать middleware для общих задач

Создать файл `backend/shared/middleware.py`:

```python
import os
import jwt
import re
from typing import Tuple, Optional, Dict, Any

def verify_jwt(event: Dict[str, Any]) -> Tuple[Optional[str], Optional[Dict]]:
    """Проверяет JWT токен и возвращает user_id или ошибку"""
    auth_header = event.get('headers', {}).get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None, {'statusCode': 401, 'body': '{"error": "Missing token"}'}
    
    token = auth_header.replace('Bearer ', '')
    try:
        JWT_SECRET = os.environ.get('JWT_SECRET')
        if not JWT_SECRET:
            raise ValueError('JWT_SECRET not configured')
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return str(payload['user_id']), None
    except jwt.ExpiredSignatureError:
        return None, {'statusCode': 401, 'body': '{"error": "Token expired"}'}
    except jwt.InvalidTokenError:
        return None, {'statusCode': 401, 'body': '{"error": "Invalid token"}'}

def validate_email(email: str) -> bool:
    """Валидирует email формат"""
    pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    return bool(pattern.match(email))

def validate_phone(phone: str) -> bool:
    """Валидирует телефон формат"""
    pattern = re.compile(r'^\+?[0-9\s\-\(\)]{10,20}$')
    return bool(pattern.match(phone))

def sanitize_string(text: str, max_length: int = 500) -> str:
    """Очищает и обрезает строку"""
    if not text:
        return ''
    return text.strip()[:max_length]

def cors_headers() -> Dict[str, str]:
    """Возвращает стандартные CORS заголовки"""
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id',
        'Access-Control-Max-Age': '86400'
    }

def error_response(status_code: int, message: str, log_details: str = None) -> Dict[str, Any]:
    """Возвращает стандартизированный ответ об ошибке"""
    if log_details:
        print(f"Error: {log_details}")
    
    # Не раскрываем детали в 500 ошибках
    if status_code >= 500:
        message = "Internal server error"
    
    return {
        'statusCode': status_code,
        'headers': {**cors_headers(), 'Content-Type': 'application/json'},
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }
```

### 2. Стандартизировать структуру функций

Каждая функция должна следовать единой структуре:

```python
import json
from typing import Dict, Any
from shared.middleware import verify_jwt, cors_headers, error_response

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Описание функции"""
    
    # 1. CORS preflight
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': ''}
    
    # 2. Аутентификация (если требуется)
    user_id, auth_error = verify_jwt(event)
    if auth_error:
        return auth_error
    
    # 3. Бизнес-логика в try-except
    try:
        # Основная логика
        pass
    except ValueError as e:
        return error_response(400, str(e))
    except Exception as e:
        return error_response(500, "Operation failed", log_details=str(e))
```

---

## Итоговая оценка безопасности

| Категория | Оценка | Комментарий |
|-----------|--------|-------------|
| SQL Injection | ✅ 9/10 | Везде используется параметризация |
| Input Validation | ⚠️ 4/10 | Много пропущенных проверок |
| Authentication | ⚠️ 5/10 | Слабая проверка JWT, hardcoded секреты |
| Error Handling | ⚠️ 6/10 | Раскрытие деталей ошибок |
| Rate Limiting | ❌ 2/10 | Почти нигде не реализовано |
| Logging | ❌ 1/10 | Отсутствует security logging |
| Tests Coverage | ⚠️ 6/10 | Есть базовые тесты, но неполные |

**Общая оценка безопасности: 5/10 (Требуются улучшения)**

---

## Контрольный список для новых функций

При добавлении новой функции убедиться что:

- [ ] Используется параметризация SQL запросов (защита от SQL Injection)
- [ ] Реализована проверка JWT токена (не просто X-User-Id)
- [ ] Добавлена валидация всех входных данных (email, phone, length, type)
- [ ] Реализован rate limiting для публичных endpoints
- [ ] Обработка ошибок не раскрывает детали реализации
- [ ] БД соединения открываются внутри try блока
- [ ] Все секреты в переменных окружения (нет hardcoded)
- [ ] Добавлено логирование критичных операций
- [ ] Создан tests.json с позитивными и негативными тестами
- [ ] Документирован API endpoint

---

Дата составления отчета: 17 декабря 2024
Проведен: Claude Code Security Audit
