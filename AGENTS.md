# AGENTS.md - Outdoor SaaS Development Guidelines

Full-stack advertising management system with AI assistant.
- **Backend**: Spring Boot 4.0.3 + Java 21 + MyBatis + MySQL
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS 4

---

## Build Commands

### Backend (outdoor-saas-be)
```bash
mvn spring-boot:run              # Dev server (port 16000)
mvn clean package -DskipTests     # Build JAR
mvn test -Dtest=ClassNameTest     # Run single test class
mvn test -Dtest=ClassNameTest#methodName  # Run single test method
mvn test                          # Run all tests with coverage
mvn checkstyle:check              # Lint check
```

### Frontend (outdoor-saas-fe)
```bash
npm run dev     # Dev server (port 3000)
npm run build   # Production build
npm run preview # Preview production
npm run lint    # TypeScript check: tsc --noEmit
```

---

## Technology Stack

**Backend**: Spring Boot 4.0.3, Java 21, MyBatis, MySQL, Flyway, Spring Security + JWT, Kimi AI, Apache POI
**Frontend**: React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, React Router 7, Framer Motion, Lucide React, Recharts

---

## Code Style Guidelines

### General Principles
1. **Type Safety**: Avoid `any`
2. **Consistency**: Follow existing patterns
3. **Chinese Context**: Comments in Chinese
4. **Error Handling**: Always handle exceptions gracefully

---

### Backend (Java/Spring Boot)

**Naming**: Classes PascalCase, methods camelCase, constants UPPER_SNAKE_CASE, tables snake_case

**Package Structure**:
```
com.touhuwai.outdoor.saas
├── controller   # REST endpoints
├── service      # Business logic
├── mapper       # MyBatis data access
├── entity       # Domain models
├── dto          # Data transfer objects
├── config       # Spring configuration
└── common       # Shared utilities
```

**REST API**: GET /api/users, POST /api/users, PUT /api/users/{id}, DELETE /api/users/{id}

**Response Format**: `{ "code": 200, "message": "success", "data": {...} }`

**Error Handling**:
```java
@ExceptionHandler(Exception.class)
public Result<?> handleException(Exception e) {
    log.error("Error: ", e);
    return Result.error(e.getMessage());
}
```

**Transaction**:
```java
@Transactional(rollbackFor = Exception.class)
public void updateCampaign(Long id, CampaignDTO dto) { }
```

---

### Frontend (TypeScript/React)

**Import Order**: React → third-party → components → services → types

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats } from '../services/dashboardService';
```

**Formatting**: 2 spaces, single quotes, trailing commas, semicolons, max 100 chars

**Naming**: Components PascalCase, hooks use prefix, interfaces PascalCase, services camelCase

```typescript
export default function Dashboard() { }
interface HeaderProps { title: string; subtitle?: string; }
export const communityService = {
  getAll: () => request<Community[]>('/community/list'),
};
```

**Component Pattern**:
```typescript
interface Props { title: string; children?: React.ReactNode; }
export default function Header({ title, children }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => { loadData(); }, []);
  return <header>{children}</header>;
}
```

**Error Handling**:
```typescript
try {
  const data = await communityService.getById(id);
} catch (error) {
  console.error('获取数据失败:', error);
  setError(error instanceof Error ? error.message : '请求失败');
}
```

**Tailwind CSS**: Use custom theme colors - `bg-background-light` / `dark:bg-background-dark`, `bg-surface-light` / `dark:bg-surface-dark`, `text-text-light` / `dark:text-text-dark`, `border-border-light` / `dark:border-border-dark`

---

## Key Principles

1. **Backend**: Use transactions, proper logging, input validation
2. **Frontend**: Support dark mode, handle loading/error states
3. **Database**: Flyway migrations, never modify migration files
4. **API**: Consistent response format across all endpoints

---

## Database

MySQL 8.0, migrations in `src/main/resources/db/migration`, Flyway auto-migrate on startup

---

## Environment Variables

**Backend** (outdoor-saas-be/.env):
```
DB_URL=jdbc:mysql://localhost:3306/mvp?...
DB_USERNAME=root
DB_PASSWORD=your_password
KIMI_API_KEY=your_kimi_api_key
```

**Frontend**: Configure in `.env` or `vite.config.ts`
