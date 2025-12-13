import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    '''
    Управление лидами с визиток
    POST / - создать новый лид (публичный доступ)
    GET /?card_id=X - получить лиды для визитки (требует авторизацию)
    PUT /{id}/read - отметить лид как прочитанный
    '''
    method = event.get('httpMethod', 'GET')
    path_params = event.get('pathParams', {})
    lead_id = path_params.get('id')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # POST - создание лида (публичный доступ)
        if method == 'POST' and not lead_id:
            body = json.loads(event.get('body', '{}'))
            
            card_id = body.get('card_id')
            name = body.get('name')
            email = body.get('email')
            phone = body.get('phone')
            message = body.get('message', '')
            source = body.get('source', 'direct')
            
            if not card_id or not name:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'card_id and name are required'}),
                    'isBase64Encoded': False
                }
            
            if not email and not phone:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Either email or phone is required'}),
                    'isBase64Encoded': False
                }
            
            # Проверка существования карточки
            cur.execute("SELECT id, user_id FROM business_cards WHERE id = %s", (card_id,))
            card = cur.fetchone()
            
            if not card:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Card not found'}),
                    'isBase64Encoded': False
                }
            
            # Сохранение лида
            cur.execute(
                """
                INSERT INTO card_leads (card_id, name, email, phone, message, source)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (card_id, name, email, phone, message, source)
            )
            lead = dict(cur.fetchone())
            conn.commit()
            
            # Отправка уведомления владельцу (опционально)
            try:
                cur.execute("SELECT email FROM users WHERE id = %s", (card['user_id'],))
                user = cur.fetchone()
                
                if user and user['email']:
                    import requests
                    requests.post(
                        'https://functions.poehali.dev/74c49dcb-78dd-46f7-9f32-46f1dffa39be/send',
                        json={
                            'to_email': user['email'],
                            'subject': f'Новый лид с визитки: {name}',
                            'type': 'lead',
                            'lead_data': {
                                'name': name,
                                'email': email or 'Не указан',
                                'phone': phone or 'Не указан',
                                'message': message or 'Без сообщения'
                            }
                        },
                        timeout=3
                    )
            except Exception as e:
                print(f"Failed to send notification: {e}")
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'lead': lead, 'success': True}, default=str),
                'isBase64Encoded': False
            }
        
        # Все остальные методы требуют авторизацию
        headers = event.get('headers', {})
        user_id = headers.get('X-User-Id') or headers.get('x-user-id')
        
        if not user_id:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Unauthorized'}),
                'isBase64Encoded': False
            }
        
        # GET - получение лидов
        if method == 'GET':
            query_params = event.get('queryStringParameters', {})
            card_id = query_params.get('card_id')
            
            if not card_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'card_id is required'}),
                    'isBase64Encoded': False
                }
            
            # Проверка владения карточкой
            cur.execute(
                "SELECT id FROM business_cards WHERE id = %s AND user_id = %s",
                (card_id, user_id)
            )
            if not cur.fetchone():
                return {
                    'statusCode': 403,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Access denied'}),
                    'isBase64Encoded': False
                }
            
            # Получение лидов
            cur.execute(
                """
                SELECT * FROM card_leads 
                WHERE card_id = %s 
                ORDER BY created_at DESC
                """,
                (card_id,)
            )
            leads = [dict(row) for row in cur.fetchall()]
            
            # Подсчёт непрочитанных
            cur.execute(
                "SELECT COUNT(*) as unread_count FROM card_leads WHERE card_id = %s AND is_read = FALSE",
                (card_id,)
            )
            unread_count = cur.fetchone()['unread_count']
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'leads': leads,
                    'unread_count': unread_count
                }, default=str),
                'isBase64Encoded': False
            }
        
        # PUT - отметить как прочитанный
        if method == 'PUT' and lead_id:
            cur.execute(
                """
                UPDATE card_leads 
                SET is_read = TRUE 
                WHERE id = %s 
                AND card_id IN (SELECT id FROM business_cards WHERE user_id = %s)
                RETURNING *
                """,
                (lead_id, user_id)
            )
            lead = cur.fetchone()
            
            if not lead:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Lead not found'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'lead': dict(lead)}, default=str),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
