# Tskhra - Multi-Platform Marketplace

**Tskhra** is a modern, full-featured marketplace web application built with React and TypeScript. It combines three distinct platforms into one unified experience: **Booking** (service scheduling), **E-commerce** (product shopping), and **Swapping** (item trading).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
  - [Routing](#routing)
  - [State Management](#state-management)
  - [Authentication](#authentication)
  - [API Integration](#api-integration)
  - [Real-Time Communication](#real-time-communication)
  - [Internationalization](#internationalization)
  - [Theming](#theming)
- [UI Components](#ui-components)
- [Deployment](#deployment)
- [Dependencies](#dependencies)

---

## Features

### Booking Platform
- Browse service businesses by category and subcategory
- View business details, photo galleries, and working hours
- Schedule service appointments with available time slots
- Real-time notifications for booking requests and status changes
- Calendar view of upcoming bookings (FullCalendar)
- Create and manage your own service business
- Drag-and-drop service ordering

### E-commerce Platform
- Product catalog with category-based browsing
- Full-text product search
- Product detail pages with reviews
- Shopping cart management (locally persisted)
- Product favorites/wishlist

### Swapping Platform
- Post items available for trade
- Browse available swap items in a catalog
- Send and receive trade offers
- Manage open and pending offers
- Image gallery with compression support

### Common Features
- Multi-language support (English and Georgian)
- Keycloak-based authentication (SSO)
- User profile management
- Identity verification (face and document verification via MediaPipe)
- Real-time WebSocket notifications with sound alerts
- Responsive design (mobile-friendly)
- Dark and light theme support
- Interactive product tours (Driver.js)
- Image cropping and compression before upload
- Toast notifications with action support

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 19 |
| **Language** | TypeScript 5.9 |
| **Build Tool** | Vite 7 |
| **Routing** | React Router DOM 7 |
| **State Management** | React Context API + TanStack React Query 5 |
| **Styling** | Tailwind CSS 4 + CSS Variables (oklch) |
| **UI Components** | shadcn/ui (New York style) + Radix UI |
| **Forms** | React Hook Form + Yup validation |
| **HTTP Client** | Axios |
| **Authentication** | Keycloak JS 26 |
| **Real-Time** | STOMP over WebSocket (@stomp/stompjs) |
| **Internationalization** | i18next + react-i18next |
| **Calendar** | FullCalendar 6 |
| **Drag & Drop** | @dnd-kit |
| **Animations** | Motion (Framer Motion) |
| **Icons** | Lucide React + React Icons |
| **Notifications** | Sonner (toasts) + Howler (sound) |
| **Image Processing** | Browser Image Compression + React Easy Crop |
| **Verification** | MediaPipe Tasks Vision + Sumsub WebSDK |
| **Carousel** | React Slick |
| **Date Utilities** | date-fns |
| **Deployment** | Vercel |

---

## Project Structure

```
tskhra-web/
├── public/                    # Static assets (robots.txt, icons, JSON data)
├── src/
│   ├── api/                   # Axios instances & interceptors (public + private)
│   ├── assets/                # Images and static media
│   ├── Booking/               # Booking feature module
│   │   ├── components/        #   Booking-specific components
│   │   ├── hooks/             #   Custom hooks (useCreateBooking, etc.)
│   │   ├── pages/             #   Booking pages
│   │   └── types/             #   TypeScript types
│   ├── Ecommerce/             # E-commerce feature module
│   │   ├── components/        #   Product cards, cart, search
│   │   ├── hooks/             #   Custom hooks (useGetProducts, etc.)
│   │   ├── pages/             #   E-commerce pages
│   │   └── types/             #   TypeScript types
│   ├── Swapping/              # Swapping/trading feature module
│   │   ├── components/        #   Swap cards, offer management
│   │   ├── hooks/             #   Custom hooks (useGetSwapItems, etc.)
│   │   ├── pages/             #   Swap pages
│   │   └── types/             #   TypeScript types
│   ├── Home/                  # Home/landing page module
│   ├── components/            # Shared reusable components
│   │   └── ui/                #   shadcn/ui primitives (Button, Dialog, etc.)
│   ├── config/                # App configuration (i18n setup)
│   ├── context/               # React Context providers
│   │   ├── AuthProvider       #   Keycloak auth state
│   │   ├── WebSocketProvider  #   STOMP WebSocket client
│   │   └── ModalContext       #   Global modal state
│   ├── features/              # Cross-cutting feature components
│   ├── hooks/                 # Shared custom hooks
│   ├── layouts/               # Page layout wrappers
│   │   ├── MainLayout         #   Public pages (navbar + footer)
│   │   ├── AppLayout          #   Protected pages (sidebar + header)
│   │   └── AuthLayout         #   Authentication pages
│   ├── lib/                   # Utility functions (cn, etc.)
│   ├── locales/               # Translation files
│   │   ├── en/                #   English translations
│   │   └── ka/                #   Georgian translations
│   ├── pages/                 # Top-level page components
│   ├── query/                 # React Query client configuration
│   ├── routes/                # Route definitions (createBrowserRouter)
│   ├── shared/                # Shared components & utilities
│   ├── types/                 # Global TypeScript type definitions
│   ├── utils/                 # Helper/utility functions
│   ├── App.tsx                # Root app component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles & Tailwind theme
├── .env.example               # Environment variable template
├── components.json            # shadcn/ui configuration
├── eslint.config.js           # ESLint flat config
├── tsconfig.json              # TypeScript configuration (with @/ path alias)
├── tsconfig.app.json          # App-specific TS config
├── tsconfig.node.json         # Node/build TS config
├── vite.config.ts             # Vite configuration
├── vercel.json                # Vercel deployment config
└── package.json               # Project metadata & dependencies
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn** or **pnpm**
- Access to the backend API server
- Access to the Keycloak authentication server

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/tskhra-team/tskhra-web.git
   cd tskhra-web
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```env
# API Configuration
VITE_API_BASE_URL=http://your-api-server:8081

# Optional
# VITE_AUTH_ENABLED=true
# VITE_DEBUG_MODE=false
```

| Variable | Description | Required |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | Yes |
| `VITE_AUTH_ENABLED` | Enable/disable authentication | No |
| `VITE_DEBUG_MODE` | Enable debug mode | No |

> All environment variables must be prefixed with `VITE_` to be accessible in the client bundle.

### Running the App

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:5173 (default Vite port)
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start the Vite development server with HMR |
| `build` | `npm run build` | Type-check with TypeScript, then build for production |
| `lint` | `npm run lint` | Run ESLint across the entire project |
| `preview` | `npm run preview` | Preview the production build locally |

---

## Architecture

### Routing

The app uses **React Router DOM v7** with `createBrowserRouter` and three layout groups:

**Public Routes** (MainLayout - navbar + footer):
| Route | Page |
|---|---|
| `/` | Home page |
| `/ecommerce` | E-commerce landing |
| `/ecommerce/category/:slug` | Category products |
| `/ecommerce/catalog` | Full product catalog |
| `/ecommerce/search` | Product search results |
| `/ecommerce/product/:id` | Product details |
| `/swapping` | Swapping landing |
| `/swapping/catalog` | Swap item catalog |
| `/booking` | Booking landing |
| `/services` | Services catalog |
| `/booking/business/:id` | Business detail page |

**Protected Routes** (AppLayout - sidebar + header, requires authentication):
| Route | Page |
|---|---|
| `/profile` | User profile |
| `/swapping/my-items` | User's swap items |
| `/swapping/post-item` | Post a new swap item |
| `/swapping/offers` | Trade offers management |
| `/verification` | Identity verification |
| `/create-business` | Create a service business |
| `/my-businesses` | Manage owned businesses |
| `/my-bookings` | View personal bookings |

**Auth Routes** (AuthLayout):
| Route | Page |
|---|---|
| `/login` | Keycloak login |

All routes use **lazy loading** with `React.lazy()` and `Suspense` for code splitting.

### State Management

The application uses a layered state management approach:

- **React Context API** - Global application state (authentication, WebSocket connection, modals)
- **TanStack React Query v5** - Server state management (API data fetching, caching, synchronization, and mutations)
- **Local Component State** (`useState`) - UI-specific ephemeral state

Key context providers:
- `AuthProvider` - Manages Keycloak authentication lifecycle, token storage, and user info
- `WebSocketProvider` - Manages STOMP WebSocket connection for real-time notifications
- `ModalContext` - Controls global modal visibility

### Authentication

Authentication is handled via **Keycloak 26** with the following flow:

1. App initializes with `check-sso` (silent single sign-on check)
2. Unauthenticated users accessing protected routes are redirected to `/login`
3. Login/Register/Logout actions are delegated to the Keycloak server
4. Tokens are automatically refreshed before expiry (5-minute validity check)
5. Axios interceptors attach Bearer tokens and handle 401 responses with automatic token refresh
6. Concurrent requests during token refresh are queued and retried

**Keycloak Configuration:**
- Realm: `tskhra`
- Client ID: `react-client`

### API Integration

The app communicates with a REST API backend using **Axios** with two configured instances:

- **`publicInstance`** - For unauthenticated endpoints (public catalogs, etc.)
- **`privateInstance`** - For authenticated endpoints (includes Authorization header and auto-refresh interceptors)

Features:
- Automatic Bearer token injection
- 401 error handling with token refresh and request retry
- Request queue for concurrent requests during token refresh
- React Query integration for caching and invalidation

### Real-Time Communication

Real-time features are powered by **STOMP over WebSocket**:

- Connects to the backend WebSocket endpoint with authentication token
- Subscribes to user-specific channels:
  - `/user/queue/messages` - New booking notifications
  - `/user/queue/statuschange` - Booking status updates
- Triggers React Query cache invalidation for seamless real-time data sync
- Sound notifications via Howler.js

### Internationalization

The app supports **English** and **Georgian** using i18next:

- **Detection**: Cookie-based language detection with browser navigator fallback
- **Storage**: Language preference saved to localStorage cookie
- **Fallback**: English is the default fallback language
- **Namespaces**: Translations are organized by feature:
  - `common`, `auth`, `home`, `booking`, `ecommerce`, `swapping`, `dashboard`, `categories`, `profile`, `verification`, `modal`, `notifications`

Translation files are located in `src/locales/{lang}/{namespace}.json`.

### Theming

The app supports **dark and light mode** via `next-themes`:

- CSS custom properties using the **oklch** color space
- Theme toggle available in the UI
- Colors defined as CSS variables in `src/index.css`
- Custom color tokens: primary, secondary, accent, destructive, sidebar, and swap-specific colors
- Configurable border radius scale (sm through 4xl)

---

## UI Components

The project uses **shadcn/ui** (New York style) built on **Radix UI** primitives. Available components include:

- **Layout**: Sidebar, Separator, Sheet
- **Forms**: Input, Label, Select, Calendar (date picker), Textarea
- **Feedback**: Dialog, Alert Dialog, Sonner (toasts)
- **Navigation**: Dropdown Menu, Breadcrumb, Tabs
- **Data Display**: Card, Avatar, Badge, Carousel, Table
- **Overlay**: Tooltip, Popover, Sheet

Custom reusable components:
- Image gallery with zoom/crop
- Business cards and product cards
- Booking calendar with time slot picker
- Trade offer cards
- Webcam capture for verification
- Interactive guided tours

---

## Deployment

The project is configured for deployment on **Vercel**:

- `vercel.json` includes SPA rewrite rules to handle client-side routing
- Production build: `npm run build` outputs to the `dist/` directory
- Image optimization is performed at build time via `vite-plugin-image-optimizer`:
  - PNG/JPEG/WebP: 80% quality
  - AVIF: 70% quality
  - SVGs optimized via SVGO

---

## Dependencies

### Core
| Package | Purpose |
|---|---|
| `react` / `react-dom` | UI framework (v19) |
| `react-router-dom` | Client-side routing |
| `typescript` | Type safety |
| `vite` | Build tool and dev server |
| `tailwindcss` | Utility-first CSS framework |

### State & Data
| Package | Purpose |
|---|---|
| `@tanstack/react-query` | Server state management & caching |
| `axios` | HTTP client |
| `@stomp/stompjs` | WebSocket STOMP client |

### UI
| Package | Purpose |
|---|---|
| `radix-ui` | Accessible UI primitives |
| `lucide-react` / `react-icons` | Icon libraries |
| `motion` | Animations |
| `sonner` | Toast notifications |
| `react-slick` | Carousel/slider |
| `@fullcalendar/react` | Calendar component |
| `@dnd-kit/core` | Drag and drop |
| `driver.js` | Guided product tours |
| `react-day-picker` | Date selection |

### Forms & Validation
| Package | Purpose |
|---|---|
| `react-hook-form` | Form state management |
| `@hookform/resolvers` | Validation resolver integration |
| `yup` | Schema validation |

### Auth & Security
| Package | Purpose |
|---|---|
| `keycloak-js` | Keycloak authentication client |
| `@mediapipe/tasks-vision` | Face detection for verification |
| `@sumsub/websdk-react` | Identity verification SDK |

### Media & Images
| Package | Purpose |
|---|---|
| `browser-image-compression` | Client-side image compression |
| `react-easy-crop` | Image cropping |
| `react-webcam` | Camera capture |
| `sharp` | Build-time image optimization |

### Internationalization
| Package | Purpose |
|---|---|
| `i18next` | i18n framework |
| `react-i18next` | React bindings for i18next |
| `i18next-browser-languagedetector` | Auto language detection |

### Utilities
| Package | Purpose |
|---|---|
| `date-fns` | Date formatting and manipulation |
| `clsx` / `tailwind-merge` | Conditional class merging |
| `js-cookie` | Cookie management |
| `howler` | Audio playback (notification sounds) |
| `class-variance-authority` | Component variant management |

---

## License

This is a private project. All rights reserved.
