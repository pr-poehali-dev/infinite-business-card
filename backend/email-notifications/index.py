import json
import os
import smtplib
import jwt
import time
from typing import Dict, Tuple, Optional
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# In-memory rate limiting
_rate_limit_store: Dict[str, list] = {}

def check_rate_limit(identifier: str, max_req: int = 10, window: int = 60) -> Tuple[bool, Optional[int]]:
    current = time.time()
    if identifier not in _rate_limit_store:
        _rate_limit_store[identifier] = []
    
    _rate_limit_store[identifier] = [t for t in _rate_limit_store[identifier] if current - t < window]
    
    if len(_rate_limit_store[identifier]) >= max_req:
        oldest = _rate_limit_store[identifier][0]
        return False, int(window - (current - oldest))
    
    _rate_limit_store[identifier].append(current)
    return True, None

def handler(event, context):
    '''
    Отправка email-уведомлений через российский SMTP
    POST /send - отправка email с указанными параметрами
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
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
    
    # Аутентификация - проверка JWT токена
    headers = event.get('headers', {})
    auth_header = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not auth_header:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Unauthorized - token required'}),
            'isBase64Encoded': False
        }
    
    try:
        jwt_secret = os.environ.get('JWT_SECRET')
        if not jwt_secret:
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Server configuration error'}),
                'isBase64Encoded': False
            }
        
        decoded = jwt.decode(auth_header, jwt_secret, algorithms=['HS256'])
        user_id = decoded.get('user_id')
        
        if not user_id:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid token'}),
                'isBase64Encoded': False
            }
        
        # Rate limiting - 10 писем в минуту на пользователя
        allowed, retry_after = check_rate_limit(f'email:{user_id}', max_req=10, window=60)
        
        if not allowed:
            return {
                'statusCode': 429,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Retry-After': str(retry_after)
                },
                'body': json.dumps({'error': 'Too many emails'}),
                'isBase64Encoded': False
            }
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
    
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '465'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    if not all([smtp_host, smtp_port, smtp_user, smtp_password]):
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'SMTP credentials not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        to_email = body.get('to_email')
        subject = body.get('subject')
        email_type = body.get('type', 'text')
        content = body.get('content', '')
        
        if not to_email or not subject:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'to_email and subject are required'}),
                'isBase64Encoded': False
            }
        
        msg = MIMEMultipart('alternative')
        msg['From'] = smtp_user
        msg['To'] = to_email
        msg['Subject'] = subject
        
        if email_type == 'welcome':
            html_content = f"""
            <html>
              <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px;">
                  <h1 style="color: #FFD700; margin-bottom: 20px;">
                    <span style="font-size: 32px;">∞7</span> visitka.site
                  </h1>
                  <h2 style="color: #333;">Добро пожаловать!</h2>
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">
                    Спасибо за регистрацию в visitka.site! Ваш аккаунт успешно создан.
                  </p>
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">
                    Теперь вы можете:
                  </p>
                  <ul style="color: #666; font-size: 16px; line-height: 1.8;">
                    <li>Создавать цифровые визитки</li>
                    <li>Генерировать QR-коды</li>
                    <li>Делиться визитками в мессенджерах</li>
                    <li>Использовать AI для создания логотипов</li>
                  </ul>
                  <a href="https://visitka.site/dashboard" 
                     style="display: inline-block; margin-top: 20px; padding: 12px 30px; 
                            background: #FFD700; color: black; text-decoration: none; 
                            border-radius: 5px; font-weight: bold;">
                    Перейти в личный кабинет
                  </a>
                  <p style="color: #999; font-size: 14px; margin-top: 30px;">
                    С уважением,<br>
                    Команда visitka.site
                  </p>
                </div>
              </body>
            </html>
            """
            msg.attach(MIMEText(html_content, 'html'))
        
        elif email_type == 'payment_success':
            plan_name = body.get('plan_name', 'Премиум')
            amount = body.get('amount', '0')
            html_content = f"""
            <html>
              <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px;">
                  <h1 style="color: #FFD700; margin-bottom: 20px;">
                    <span style="font-size: 32px;">∞7</span> visitka.site
                  </h1>
                  <h2 style="color: #333;">Оплата прошла успешно!</h2>
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">
                    Спасибо за покупку! Ваш платёж успешно обработан.
                  </p>
                  <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Тариф:</strong> {plan_name}</p>
                    <p style="margin: 5px 0;"><strong>Сумма:</strong> {amount}₽</p>
                  </div>
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">
                    Все функции тарифа уже доступны в вашем личном кабинете.
                  </p>
                  <a href="https://visitka.site/dashboard" 
                     style="display: inline-block; margin-top: 20px; padding: 12px 30px; 
                            background: #FFD700; color: black; text-decoration: none; 
                            border-radius: 5px; font-weight: bold;">
                    Открыть личный кабинет
                  </a>
                  <p style="color: #999; font-size: 14px; margin-top: 30px;">
                    С уважением,<br>
                    Команда visitka.site
                  </p>
                </div>
              </body>
            </html>
            """
            msg.attach(MIMEText(html_content, 'html'))
        
        else:
            msg.attach(MIMEText(content, 'plain'))
        
        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port)
        else:
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()
        
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'success': True,
                'message': 'Email sent successfully'
            }),
            'isBase64Encoded': False
        }
    
    except smtplib.SMTPException:
        return {
            'statusCode': 502,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Email service unavailable'}),
            'isBase64Encoded': False
        }
    except Exception:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Failed to send email'}),
            'isBase64Encoded': False
        }