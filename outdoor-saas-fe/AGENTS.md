# AGENTS.md - Frontend Desktop Coding Guidelines

## Build Commands

```bash
# Development server (runs on port 3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Clean dist folder
npm run clean
```

## Test Commands

```bash
# Type checking (no test runner configured)
npm run lint

# TypeScript compiler check only
tsc --noEmit
```

## Technology Stack

- **Framework**: React 19 with TypeScript 5.8
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State**: React hooks (useState, useEffect)

## Code Style Guidelines

### Imports

Order:
1. React imports
2. Third-party libraries (router, motion, etc.)
3. Components
4. Services/utilities
5. Types/interfaces

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

import { dashboardService } from '../services/dashboardService';
import type { DashboardStats } from '../services/dashboardService';
```

### Formatting

- Indent: 2 spaces
- Use single quotes for strings
- Trailing commas in objects/arrays
- Semicolons required
- Max line length: 100 characters

### Naming Conventions

**Components**: PascalCase, default export
```typescript
export default function Dashboard() { }
export default function Header({ title }: HeaderProps) { }
```

**Hooks**: camelCase with `use` prefix
```typescript
const [isLoading, setIsLoading] = useState(false);
```

**Interfaces/Types**: PascalCase with descriptive names
```typescript
interface HeaderProps {
  title: string;
  subtitle?: string;
}

type TabType = 'overview' | 'detail';
```

**Services**: camelCase object with methods
```typescript
export const communityService = {
  getAll: () => request<Community[]>('/community/list'),
  getById: (id: number) => request<Community>(`/community/${id}`),
};
```

### Component Patterns

**Functional components with explicit return type implicit via inference:**
```typescript
interface Props {
  title: string;
  children?: React.ReactNode;
}

export default function Header({ title, children }: Props) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Initialize state
  }, []);
  
  return (
    <header className="...">
      {children}
    </header>
  );
}
```

**Event handlers:**
```typescript
const handleClick = () => {
  setIsOpen(!isOpen);
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await submitData();
};
```

### Tailwind CSS Patterns

**Custom theme colors (defined in index.css):**
- `bg-background-light` / `dark:bg-background-dark`
- `bg-surface-light` / `dark:bg-surface-dark`
- `text-text-light` / `dark:text-text-dark`
- `text-subtext-light` / `dark:text-subtext-dark`
- `border-border-light` / `dark:border-border-dark`

**Dark mode support:**
```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
```

**Common utilities:**
- Backdrop blur: `backdrop-blur-md`
- Sticky header: `sticky top-0 z-10`
- Transitions: `transition-colors duration-200`
- Flex layouts: `flex items-center justify-between`

### Service/API Patterns

**Base request wrapper (src/services/api.ts):**
```typescript
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  if (data.code !== 200) {
    throw new Error(data.message || '请求失败');
  }

  return data.data;
}
```

**Service definition:**
```typescript
export const serviceName = {
  methodName: () => request<Type>('/endpoint'),
  methodWithParams: (id: number) => request<Type>(`/endpoint/${id}`),
};

export default serviceName;
```

### Error Handling

**API errors:**
```typescript
try {
  const data = await communityService.getById(id);
} catch (error) {
  console.error('获取数据失败:', error);
  setError(error instanceof Error ? error.message : '请求失败');
}
```

**Loading states:**
```typescript
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  setIsLoading(true);
  fetchData()
    .finally(() => setIsLoading(false));
}, []);
```

### Type Guidelines

**Prefer explicit return types on exported functions:**
```typescript
export async function fetchData(): Promise<Community[]> {
  return request<Community[]>('/community/list');
}
```

**Use interfaces for component props:**
```typescript
interface ComponentProps {
  requiredProp: string;
  optionalProp?: number;
  callback: (id: string) => void;
  children?: React.ReactNode;
}
```

**Type assertions when needed:**
```typescript
const data = await response.json() as ApiResponse;
```

### Key Principles

1. **Consistency**: Follow existing component patterns
2. **Type Safety**: Use TypeScript strictly (no `any`)
3. **Dark Mode**: Always support both light and dark themes
4. **Chinese Context**: Comments and user-facing text in Chinese
5. **Component Composition**: Use children props for flexible layouts
6. **Path Alias**: Use `@/` for imports from project root

### Comments

- Use Chinese for comments describing business logic
- Keep comments concise

```typescript
// 初始化数据加载
useEffect(() => {
  loadData();
}, []);
```
