import json
import os
import uuid
import requests
import base64
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    '''
    Обработка платежей через ЮKassa
    POST - создание платежа
    GET - проверка статуса платежа по payment_id
    '''
    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'create')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = None
    cur = None
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if method == 'POST':
            headers = event.get('headers', {})
            user_id = headers.get('X-User-Id') or headers.get('x-user-id')
            
            if not user_id:
                return {
                    'statusCode': 401,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            amount = body.get('amount')
            payment_type = body.get('payment_type')
            
            if not amount or not payment_type:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Amount and payment_type are required'}),
                    'isBase64Encoded': False
                }
            
            idempotence_key = str(uuid.uuid4())
            
            shop_id = os.environ.get('YOOKASSA_SHOP_ID')
            secret_key = os.environ.get('YOOKASSA_SECRET_KEY')
            
            auth_string = f"{shop_id}:{secret_key}"
            auth_bytes = base64.b64encode(auth_string.encode()).decode()
            
            payment_data = {
                'amount': {
                    'value': str(amount),
                    'currency': 'RUB'
                },
                'confirmation': {
                    'type': 'redirect',
                    'return_url': body.get('return_url', 'https://visitka.site/dashboard')
                },
                'capture': True,
                'description': f'{payment_type} payment',
                'payment_method_data': {
                    'type': 'bank_card'
                }
            }
            
            payment_methods = body.get('payment_methods', ['bank_card', 'sbp', 'yoo_money'])
            if 'mir' in payment_methods or 'bank_card' in payment_methods:
                payment_data['payment_method_data'] = {'type': 'bank_card'}
            
            yukassa_response = requests.post(
                'https://api.yookassa.ru/v3/payments',
                headers={
                    'Authorization': f'Basic {auth_bytes}',
                    'Idempotence-Key': idempotence_key,
                    'Content-Type': 'application/json'
                },
                json=payment_data
            )
            
            yukassa_data = yukassa_response.json()
            
            metadata_json = json.dumps(yukassa_data)
            cur.execute("""
                INSERT INTO t_p18253922_infinite_business_ca.payments 
                (user_id, amount, payment_type, payment_provider, provider_payment_id, status, metadata)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id, user_id, amount, payment_type, payment_provider, provider_payment_id, status, created_at
            """, (user_id, amount, payment_type, 'yukassa', yukassa_data.get('id'), yukassa_data.get('status'), metadata_json))
            result = cur.fetchone()
            payment = {
                'id': result[0],
                'user_id': result[1],
                'amount': result[2],
                'payment_type': result[3],
                'payment_provider': result[4],
                'provider_payment_id': result[5],
                'status': result[6],
                'created_at': str(result[7])
            }
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'payment': payment,
                    'confirmation_url': yukassa_data.get('confirmation', {}).get('confirmation_url')
                }, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {})
            payment_id = params.get('payment_id')
            
            if not payment_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'payment_id is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "SELECT id, user_id, amount, payment_type, status, created_at FROM t_p18253922_infinite_business_ca.payments WHERE id = %s",
                (payment_id,)
            )
            result = cur.fetchone()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Payment not found'}),
                    'isBase64Encoded': False
                }
            
            payment = {
                'id': result[0],
                'user_id': result[1],
                'amount': result[2],
                'payment_type': result[3],
                'status': result[4],
                'created_at': str(result[5])
            }
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'payment': payment}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Not found'}),
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