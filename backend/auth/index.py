import json
import os
import bcrypt
import hashlib
import jwt
from datetime import datetime, timedelta
import psycopg2

def handler(event, context):
    '''
    Аутентификация и регистрация пользователей
    POST /register - регистрация нового пользователя
    POST /login - вход в систему
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    conn = None
    cur = None
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if action == 'register':
            email = body.get('email', '')
            password = body.get('password', '')
            name = body.get('name', '')
            
            if not email or not password or not name:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Email, password and name are required'}),
                    'isBase64Encoded': False
                }
            
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            cur.execute(
                "INSERT INTO t_p18253922_infinite_business_ca.users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id, email, name",
                (email, password_hash, name)
            )
            result = cur.fetchone()
            user = {'id': result[0], 'email': result[1], 'name': result[2]}
            
            cur.execute(
                "INSERT INTO t_p18253922_infinite_business_ca.user_subscriptions (user_id, plan_id, status) VALUES (%s, %s, %s)",
                (user['id'], 1, 'active')
            )
            
            conn.commit()
            
            token = jwt.encode(
                {'user_id': user['id'], 'email': user['email'], 'exp': datetime.utcnow() + timedelta(days=30)},
                os.environ.get('JWT_SECRET', 'fallback_secret_for_dev'),
                algorithm='HS256'
            )
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'token': token, 'user': user}),
                'isBase64Encoded': False
            }
        
        elif action == 'login':
            email = body.get('email', '')
            password = body.get('password', '')
            
            if not email or not password:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Email and password are required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "SELECT id, email, name, password_hash FROM t_p18253922_infinite_business_ca.users WHERE email = %s",
                (email,)
            )
            result = cur.fetchone()
            
            if not result:
                return {
                    'statusCode': 401,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Invalid credentials'}),
                    'isBase64Encoded': False
                }
            
            stored_hash = result[3]
            is_valid = False
            
            # Проверка bcrypt хеша
            if stored_hash.startswith('$2b$'):
                is_valid = bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
            # Проверка старого SHA256 хеша (backward compatibility)
            else:
                sha256_hash = hashlib.sha256(password.encode()).hexdigest()
                is_valid = (sha256_hash == stored_hash)
                
                # Если пароль верный - обновляем на bcrypt
                if is_valid:
                    new_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                    cur.execute(
                        "UPDATE t_p18253922_infinite_business_ca.users SET password_hash = %s WHERE id = %s",
                        (new_hash, result[0])
                    )
                    conn.commit()
            
            if not is_valid:
                return {
                    'statusCode': 401,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Invalid credentials'}),
                    'isBase64Encoded': False
                }
            
            user = {'id': result[0], 'email': result[1], 'name': result[2]}
            
            token = jwt.encode(
                {'user_id': user['id'], 'email': user['email'], 'exp': datetime.utcnow() + timedelta(days=30)},
                os.environ.get('JWT_SECRET', 'fallback_secret_for_dev'),
                algorithm='HS256'
            )
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'token': token, 'user': user}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid action'}),
                'isBase64Encoded': False
            }
    
    except psycopg2.IntegrityError:
        if conn:
            conn.rollback()
        return {
            'statusCode': 409,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'User with this email already exists'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()