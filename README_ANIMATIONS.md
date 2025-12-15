# 🎨 Библиотека анимаций для ∞7

## 📦 Доступные компоненты

### 1. **Анимации появления**

#### `FadeIn`
Плавное появление элемента с эффектом fade и движением.
```tsx
import FadeIn from '@/components/animations/FadeIn';

<FadeIn delay={0.2} direction="up">
  <h1>Заголовок</h1>
</FadeIn>
```

**Параметры:**
- `delay` - задержка перед анимацией (секунды)
- `duration` - длительность анимации (секунды)
- `direction` - направление движения: 'up', 'down', 'left', 'right', 'none'

---

#### `ScaleIn`
Масштабирование элемента с эффектом bounce.
```tsx
import ScaleIn from '@/components/animations/ScaleIn';

<ScaleIn delay={0.3}>
  <Card>Контент</Card>
</ScaleIn>
```

---

#### `StaggerContainer` + `StaggerItem`
Последовательная анимация списка элементов.
```tsx
import StaggerContainer, { StaggerItem } from '@/components/animations/StaggerContainer';

<StaggerContainer staggerDelay={0.1}>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <Card>{item.content}</Card>
    </StaggerItem>
  ))}
</StaggerContainer>
```

---

### 2. **Интерактивные компоненты**

#### `AnimatedCard`
Карточка с hover эффектом масштабирования и тенью.
```tsx
import AnimatedCard from '@/components/ui/animated-card';

<AnimatedCard hoverScale={1.02}>
  <CardContent>Контент визитки</CardContent>
</AnimatedCard>
```

---

#### `MagneticButton`
Кнопка с магнитным эффектом — следует за курсором.
```tsx
import MagneticButton from '@/components/ui/magnetic-button';

<MagneticButton strength={0.3} onClick={handleClick}>
  Создать визитку
</MagneticButton>
```

---

### 3. **UI эффекты**

#### `PulseDot`
Пульсирующая точка для статусов и индикаторов.
```tsx
import PulseDot from '@/components/ui/pulse-dot';

<PulseDot color="bg-green-500" />
```

---

#### `FloatingElement`
Плавающая анимация для декоративных элементов.
```tsx
import FloatingElement from '@/components/ui/floating-element';

<FloatingElement delay={0.5}>
  <Icon name="Sparkles" />
</FloatingElement>
```

---

#### `SmoothScrollProgress`
Индикатор прогресса прокрутки страницы.
```tsx
import SmoothScrollProgress from '@/components/ui/smooth-scroll';

<SmoothScrollProgress />
```

---

#### `PageTransition`
Плавные переходы между страницами.
```tsx
import PageTransition from '@/components/ui/page-transition';

<PageTransition>
  <YourPageContent />
</PageTransition>
```

---

### 4. **CSS классы для анимаций**

#### Shimmer эффект
```tsx
<div className="shimmer-effect">Загрузка...</div>
```

#### Свечение
```tsx
<div className="glow-effect">Premium контент</div>
```

#### Градиент с анимацией
```tsx
<div className="gradient-animate premium-gradient">
  Премиум тариф
</div>
```

#### Hover эффекты
```tsx
<div className="hover-lift">Поднимается при наведении</div>
<div className="hover-scale">Увеличивается при наведении</div>
```

#### Стеклянный эффект
```tsx
<div className="glass-effect p-6">
  Полупрозрачный контейнер
</div>
```

#### Градиентный текст
```tsx
<h1 className="text-gradient">∞7 — Цифровые Визитки</h1>
```

---

## 🎯 Улучшенный Button

Стандартный компонент Button теперь имеет:
- **Плавные переходы** всех свойств
- **Эффект нажатия** — scale(0.95)
- **Тени при hover** с цветовым акцентом
- **Поднятие вверх** при наведении

```tsx
import { Button } from '@/components/ui/button';

<Button>Создать визитку</Button>
```

---

## 💡 Рекомендации по использованию

### 1. Главная страница
```tsx
<FadeIn direction="up">
  <Hero />
</FadeIn>

<StaggerContainer staggerDelay={0.15}>
  {features.map(feature => (
    <StaggerItem key={feature.id}>
      <AnimatedCard>
        {feature.content}
      </AnimatedCard>
    </StaggerItem>
  ))}
</StaggerContainer>
```

### 2. Дашборд с карточками
```tsx
{cards.map((card, index) => (
  <ScaleIn key={card.id} delay={index * 0.1}>
    <AnimatedCard>
      <BusinessCard {...card} />
    </AnimatedCard>
  </ScaleIn>
))}
```

### 3. CTA секция
```tsx
<div className="relative">
  <FloatingElement>
    <div className="absolute -top-10 right-10">✨</div>
  </FloatingElement>
  
  <MagneticButton onClick={handleCreateCard}>
    Создать премиум визитку
  </MagneticButton>
</div>
```

---

## ⚡️ Performance Tips

1. **Используйте `will-change: transform`** для анимируемых элементов
2. **Ограничивайте количество одновременных анимаций** (до 5-7 на экране)
3. **Для списков используйте `StaggerContainer`** вместо индивидуальных задержек
4. **Избегайте анимаций на мобильных** при низкой производительности

---

## 🚀 Готовые паттерны

### Landing Hero
```tsx
<div className="relative overflow-hidden">
  <SmoothScrollProgress />
  
  <FadeIn>
    <h1 className="text-gradient text-6xl font-bold">
      ∞7 — Цифровые Визитки
    </h1>
  </FadeIn>
  
  <FadeIn delay={0.2} direction="up">
    <p className="text-xl">Премиальные визитки за минуты</p>
  </FadeIn>
  
  <FadeIn delay={0.4}>
    <MagneticButton>
      Создать сейчас
    </MagneticButton>
  </FadeIn>
</div>
```

### Pricing Cards
```tsx
<StaggerContainer staggerDelay={0.2}>
  {plans.map(plan => (
    <StaggerItem key={plan.id}>
      <AnimatedCard className={plan.featured ? 'glow-effect' : ''}>
        <PricingCard {...plan} />
      </AnimatedCard>
    </StaggerItem>
  ))}
</StaggerContainer>
```

---

Все компоненты построены на основе **Framer Motion** и полностью типизированы с TypeScript.
