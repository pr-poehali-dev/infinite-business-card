"""
Валидаторы для входных данных
"""
import re
from typing import Tuple

def validate_email(email: str) -> Tuple[bool, str]:
    """Проверка email"""
    if not email or len(email) > 255:
        return False, "Email too long or empty"
    
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        return False, "Invalid email format"
    
    return True, ""

def validate_password(password: str) -> Tuple[bool, str]:
    """Проверка пароля"""
    if not password:
        return False, "Password required"
    
    if len(password) < 6:
        return False, "Password too short (min 6 chars)"
    
    if len(password) > 100:
        return False, "Password too long (max 100 chars)"
    
    return True, ""

def validate_phone(phone: str) -> Tuple[bool, str]:
    """Проверка телефона"""
    if not phone:
        return False, "Phone required"
    
    # Убираем все кроме цифр и +
    clean = re.sub(r'[^\d+]', '', phone)
    
    if len(clean) < 10 or len(clean) > 15:
        return False, "Invalid phone length"
    
    return True, ""

def validate_name(name: str) -> Tuple[bool, str]:
    """Проверка имени"""
    if not name:
        return False, "Name required"
    
    if len(name) < 2:
        return False, "Name too short"
    
    if len(name) > 100:
        return False, "Name too long"
    
    return True, ""

def validate_url(url: str) -> Tuple[bool, str]:
    """Проверка URL"""
    if not url:
        return False, "URL required"
    
    if len(url) > 2000:
        return False, "URL too long"
    
    pattern = r'^https?://.+\..+'
    if not re.match(pattern, url):
        return False, "Invalid URL format"
    
    return True, ""
