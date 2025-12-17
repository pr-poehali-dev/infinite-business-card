# 🚀 Infinite Business Card — Обзор проекта

**Цифровые визитки нового поколения для современного бизнеса**

[![Security Score](https://img.shields.io/badge/Security%20Score-100%2F100-brightgreen)](SECURITY_FINAL_REPORT.md)
[![Production Ready](https://img.shields.io/badge/Production-Ready-success)](https://visitka.site)

---

## 📋 Что это

**Infinite Business Card** — SaaS-платформа для создания умных цифровых визиток с аналитикой, интеграциями и реферальной программой.

### ✨ Возможности

- 📱 Создание визиток за 2 минуты
- 📊 Аналитика просмотров в реальном времени
- 💰 Прием платежей через ЮКасса
- 👤 Авторизация через VK
- 🎁 Реферальная программа
- 📧 Email-уведомления
- 🔒 Enterprise-уровень безопасности (100/100)

---

## 🛠️ Технологии

**Frontend:** React + TypeScript + Vite + Tailwind CSS  
**Backend:** Python 3.11 Cloud Functions  
**Database:** PostgreSQL  
**Auth:** JWT + VK OAuth  
**Payments:** ЮКасса  
**Security:** 100/100 score, OWASP Top 10 защита

---

## 🚀 Запуск для России

### 1. Секреты (обязательно)

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-32-chars
VK_APP_ID=your-vk-app-id
VK_SECRET_KEY=your-vk-secret-key
YUKASSA_SHOP_ID=your-shop-id
YUKASSA_SECRET_KEY=your-secret
```

### 2. Запуск

```bash
bun install
bun run dev
```

### 3. Деплой

Через poehali.dev:
- Нажмите "Опубликовать"
- Привяжите домен (например, visitka.site)
- SSL сертификат выпустится автоматически

---

## 📁 Структура

```
src/               # Frontend (React)
backend/           # Cloud Functions (Python)
db_migrations/     # SQL миграции
public/            # Статика
docs/              # Документация
```

---

## 🔒 Безопасность

✅ **Security Score: 100/100**  
✅ Защита от OWASP Top 10  
✅ Rate limiting на всех endpoints  
✅ JWT + bcrypt + SSL/TLS  
✅ Автоматический мониторинг 24/7

Подробнее: [SECURITY_FINAL_REPORT.md](SECURITY_FINAL_REPORT.md)

---

## 📞 Поддержка

- 💬 Telegram: https://t.me/+QgiLIa1gFRY4Y2Iy
- 📧 Email: support@visitka.site
- 🌐 Сайт: https://visitka.site
- 📚 Docs: https://docs.poehali.dev

---

**Сделано с ❤️ в России**
