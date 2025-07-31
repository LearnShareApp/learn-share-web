# Руководство по переиспользуемым компонентам

Этот документ описывает новые переиспользуемые компоненты, созданные для устранения дублирования кода в проекте Learn&Share.

## Созданные компоненты

### 1. Card

Базовый компонент карточки, заменяющий глобальный класс `.card`.

```tsx
import { Card } from "@/components";

<Card padding="medium" variant="default">
  <p>Содержимое карточки</p>
</Card>;
```

**Пропсы:**

- `padding`: "small" | "medium" | "large" - размер отступов
- `variant`: "default" | "elevated" | "outlined" - стиль карточки
- `className`: дополнительные CSS классы
- `onClick`: обработчик клика

### 2. Button

Универсальный компонент кнопки с поддержкой ссылок.

```tsx
import { Button } from "@/components";

<Button variant="primary" size="medium" href="/path">
  Текст кнопки
</Button>;
```

**Пропсы:**

- `variant`: "primary" | "secondary" | "outline" | "ghost"
- `size`: "small" | "medium" | "large"
- `href`: ссылка (превращает кнопку в Link)
- `icon`: иконка
- `iconPosition`: "left" | "right"
- `disabled`: отключить кнопку

### 3. SectionTitle

Компонент для заголовков секций с подзаголовками.

```tsx
import { SectionTitle } from "@/components";

<SectionTitle level={2} align="center" subtitle="Описание секции">
  Заголовок секции
</SectionTitle>;
```

**Пропсы:**

- `level`: 1 | 2 | 3 | 4 - уровень заголовка
- `align`: "left" | "center" | "right"
- `subtitle`: подзаголовок

### 4. EmptyState

Компонент для отображения пустых состояний.

```tsx
import { EmptyState } from "@/components";
import { Users } from "lucide-react";

<EmptyState
  icon={<Users size={48} />}
  title="Нет данных"
  description="Описание пустого состояния"
  actionText="Действие"
  actionHref="/path"
/>;
```

**Пропсы:**

- `icon`: иконка
- `title`: заголовок
- `description`: описание
- `actionText`: текст кнопки действия
- `actionHref` | `onAction`: ссылка или обработчик

### 5. FilterBar

Компонент для поиска и фильтрации.

```tsx
import { FilterBar } from "@/components";

<FilterBar
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  filterValue={selectedFilter}
  onFilterChange={setSelectedFilter}
  filterOptions={[
    { value: "all", label: "Все" },
    { value: "active", label: "Активные" },
  ]}
  showReset={true}
  onReset={handleReset}
/>;
```

### 6. StatCard

Компонент для отображения статистики.

```tsx
import { StatCard } from "@/components";

<StatCard
  number="1,234"
  label="Пользователей"
  trend={{ value: 12, isPositive: true }}
/>;
```

### 7. PageHeader

Компонент заголовка страницы с хлебными крошками.

```tsx
import { PageHeader } from "@/components";

<PageHeader
  title="Заголовок страницы"
  subtitle="Описание страницы"
  breadcrumbs={[{ label: "Главная", href: "/" }, { label: "Текущая страница" }]}
  actions={<Button>Действие</Button>}
/>;
```

### 8. ButtonGroup

Группа кнопок для переключения между опциями.

```tsx
import { ButtonGroup } from "@/components";

<ButtonGroup
  options={[
    { value: "option1", label: "Опция 1" },
    { value: "option2", label: "Опция 2" },
  ]}
  value={selectedOption}
  onChange={setSelectedOption}
/>;
```

## Импорт компонентов

Все компоненты можно импортировать из общего индекса:

```tsx
import {
  Card,
  Button,
  SectionTitle,
  EmptyState,
  FilterBar,
  StatCard,
  PageHeader,
  ButtonGroup,
} from "@/components";
```

## Рефакторинг существующих страниц

### Выполненные изменения:

1. **Главная страница (`src/app/page.tsx`)**:

   - Заменены кнопки на компонент `Button`
   - Заменены заголовки на `SectionTitle`
   - Заменена статистика на `StatCard`

2. **Домашняя страница (`src/app/home/page.tsx`)**:

   - Заменены `.card` классы на компонент `Card`
   - Заменены пустые состояния на `EmptyState`
   - Заменены заголовки на `SectionTitle`

3. **Страница учителей (`src/app/teachers/page.tsx`)**:

   - Заменена панель фильтров на `FilterBar`
   - Заменено пустое состояние на `EmptyState`

4. **Страница уроков (`src/app/lessons/page.tsx`)**:

   - Добавлен `PageHeader`
   - Заменены кнопки фильтров на `ButtonGroup`
   - Заменено пустое состояние на `EmptyState`

5. **Страница "О нас" (`src/app/about/page.tsx`)**:
   - Добавлен `PageHeader`
   - Заменены карточки на компонент `Card`
   - Заменены заголовки на `SectionTitle`

## Преимущества

1. **Консистентность**: Единообразный дизайн по всему приложению
2. **Переиспользование**: Меньше дублирования кода
3. **Поддержка**: Изменения в одном месте влияют на все использования
4. **Типизация**: TypeScript поддержка для всех пропсов
5. **Доступность**: Встроенная поддержка accessibility
6. **Производительность**: Оптимизированные компоненты

## Следующие шаги

Рекомендуется продолжить рефакторинг остальных страниц:

- `src/app/settings/page.tsx`
- `src/app/auth/page.tsx`
- `src/app/admin/page.tsx`
- И другие страницы проекта

Также можно создать дополнительные компоненты:

- `Modal` - для модальных окон
- `Tabs` - для вкладок
- `Form` - для форм
- `Table` - для таблиц
