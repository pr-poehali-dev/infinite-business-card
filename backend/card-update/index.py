import json
import os
import psycopg2
import jwt
from datetime import datetime

def handler(event, context):
    '''
    Обновление данных визитки пользователя
    PUT / - обновить визитку (требуется авторизация)
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'PUT':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    auth_token = headers.get('x-auth-token') or headers.get('X-Auth-Token')
    
    if not auth_token:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Authorization required'}),
            'isBase64Encoded': False
        }
    
    jwt_secret = os.environ.get('JWT_SECRET')
    if not jwt_secret:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Server configuration error'}),
            'isBase64Encoded': False
        }
    
    try:
        payload = jwt.decode(auth_token, jwt_secret, algorithms=['HS256'])
        user_id = payload.get('user_id')
    except jwt.ExpiredSignatureError:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Token expired'}),
            'isBase64Encoded': False
        }
    except jwt.InvalidTokenError:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Invalid token'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    card_slug = body.get('slug')
    
    if not card_slug:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Card slug required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    card_slug_escaped = card_slug.replace("'", "''")
    
    cur.execute(
        f"SELECT user_id FROM t_p18253922_infinite_business_ca.cards WHERE slug = '{card_slug_escaped}'"
    )
    card_owner = cur.fetchone()
    
    if not card_owner or card_owner[0] != user_id:
        cur.close()
        conn.close()
        return {
            'statusCode': 403,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Access denied'}),
            'isBase64Encoded': False
        }
    
    update_fields = []
    if 'name' in body:
        name_escaped = body['name'].replace("'", "''")
        update_fields.append(f"name = '{name_escaped}'")
    if 'position' in body:
        position_escaped = body['position'].replace("'", "''")
        update_fields.append(f"position = '{position_escaped}'")
    if 'company' in body:
        company_escaped = body['company'].replace("'", "''")
        update_fields.append(f"company = '{company_escaped}'")
    if 'phone' in body:
        phone_escaped = body['phone'].replace("'", "''")
        update_fields.append(f"phone = '{phone_escaped}'")
    if 'email' in body:
        email_escaped = body['email'].replace("'", "''")
        update_fields.append(f"email = '{email_escaped}'")
    if 'website' in body:
        website_escaped = body['website'].replace("'", "''")
        update_fields.append(f"website = '{website_escaped}'")
    if 'description' in body:
        description_escaped = body['description'].replace("'", "''")
        update_fields.append(f"description = '{description_escaped}'")
    if 'photo_url' in body:
        photo_url_escaped = body['photo_url'].replace("'", "''")
        update_fields.append(f"photo_url = '{photo_url_escaped}'")
    if 'logo_url' in body:
        logo_url_escaped = body['logo_url'].replace("'", "''")
        update_fields.append(f"logo_url = '{logo_url_escaped}'")
    
    if not update_fields:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'No fields to update'}),
            'isBase64Encoded': False
        }
    
    update_fields.append(f"updated_at = '{datetime.now().isoformat()}'")
    update_query = f"UPDATE t_p18253922_infinite_business_ca.cards SET {', '.join(update_fields)} WHERE slug = '{card_slug_escaped}'"
    
    cur.execute(update_query)
    conn.commit()
    
    cur.execute(
        f"SELECT id, slug, name, position, company, phone, email, website, description, photo_url, logo_url FROM t_p18253922_infinite_business_ca.cards WHERE slug = '{card_slug_escaped}'"
    )
    updated_card = cur.fetchone()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({
            'success': True,
            'card': {
                'id': updated_card[0],
                'slug': updated_card[1],
                'name': updated_card[2],
                'position': updated_card[3],
                'company': updated_card[4],
                'phone': updated_card[5],
                'email': updated_card[6],
                'website': updated_card[7],
                'description': updated_card[8],
                'photo_url': updated_card[9],
                'logo_url': updated_card[10]
            }
        }),
        'isBase64Encoded': False
    }