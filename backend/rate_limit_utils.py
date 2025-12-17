"""
Утилита для rate limiting внутри функций
Используется in-memory хранилище (работает в serverless)
"""
import time
from typing import Dict, Tuple, Optional
from dataclasses import dataclass, field

@dataclass
class RateLimitStore:
    requests: Dict[str, list] = field(default_factory=dict)

# Глобальное хранилище для всех функций
_store = RateLimitStore()

def check_rate_limit(
    identifier: str,
    max_requests: int = 10,
    window_seconds: int = 60
) -> Tuple[bool, Optional[int]]:
    """
    Проверяет rate limit для идентификатора
    
    Args:
        identifier: уникальный ID (IP, user_id, email)
        max_requests: макс запросов в окне
        window_seconds: размер окна в секундах
    
    Returns:
        (allowed, retry_after): разрешен ли запрос и через сколько повторить
    """
    current_time = time.time()
    
    if identifier not in _store.requests:
        _store.requests[identifier] = []
    
    # Удаляем старые запросы
    _store.requests[identifier] = [
        req_time for req_time in _store.requests[identifier]
        if current_time - req_time < window_seconds
    ]
    
    # Проверяем лимит
    if len(_store.requests[identifier]) >= max_requests:
        oldest_request = _store.requests[identifier][0]
        retry_after = int(window_seconds - (current_time - oldest_request))
        return False, retry_after
    
    # Добавляем текущий запрос
    _store.requests[identifier].append(current_time)
    return True, None
