import json
import time
from typing import Dict, Any, Optional
from dataclasses import dataclass, field

@dataclass
class RateLimitStore:
    requests: Dict[str, list] = field(default_factory=dict)

store = RateLimitStore()

def rate_limit(
    identifier: str,
    max_requests: int = 10,
    window_seconds: int = 60
) -> tuple[bool, Optional[int]]:
    current_time = time.time()
    
    if identifier not in store.requests:
        store.requests[identifier] = []
    
    store.requests[identifier] = [
        req_time for req_time in store.requests[identifier]
        if current_time - req_time < window_seconds
    ]
    
    if len(store.requests[identifier]) >= max_requests:
        oldest_request = store.requests[identifier][0]
        retry_after = int(window_seconds - (current_time - oldest_request))
        return False, retry_after
    
    store.requests[identifier].append(current_time)
    return True, None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
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
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    identifier = body_data.get('identifier', '')
    max_requests = body_data.get('max_requests', 10)
    window_seconds = body_data.get('window_seconds', 60)
    
    if not identifier:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Identifier required'}),
            'isBase64Encoded': False
        }
    
    allowed, retry_after = rate_limit(identifier, max_requests, window_seconds)
    
    if not allowed:
        return {
            'statusCode': 429,
            'headers': {
                'Content-Type': 'application/json',
                'Retry-After': str(retry_after),
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Too many requests',
                'retry_after': retry_after
            }),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'allowed': True,
            'remaining': max_requests - len(store.requests[identifier])
        }),
        'isBase64Encoded': False
    }
