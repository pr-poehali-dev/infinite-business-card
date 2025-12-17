import json
import base64
import boto3
import os
import uuid
from typing import Dict, Any

s3 = boto3.client('s3',
    endpoint_url='https://bucket.poehali.dev',
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Загружает изображение в S3 и возвращает CDN URL
    Args: event - dict с httpMethod, body (base64 изображение и content_type)
          context - объект с request_id, function_name и др.
    Returns: HTTP response с url изображения
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    image_base64: str = body_data.get('image', '')
    content_type: str = body_data.get('content_type', 'image/jpeg')
    
    if not image_base64:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'No image provided'}),
            'isBase64Encoded': False
        }
    
    image_data = base64.b64decode(image_base64)
    
    extension = content_type.split('/')[-1]
    if extension not in ['jpeg', 'jpg', 'png', 'gif', 'webp']:
        extension = 'jpg'
    
    file_key = f"avatars/{uuid.uuid4()}.{extension}"
    
    s3.put_object(
        Bucket='files',
        Key=file_key,
        Body=image_data,
        ContentType=content_type
    )
    
    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'url': cdn_url}),
        'isBase64Encoded': False
    }
