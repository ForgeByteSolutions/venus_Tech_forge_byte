# Project Technical Stack, Docker Architecture & Complete Run Guide
**System**: FERC Market-Based Rate (MBR) & e-Tariff Compliance Management Portal  
**Repository**: `venus_Tech_forge_byte`  
**Application URL**: `http://localhost:4200`  
**API Backend URL**: `http://localhost:3000`  
**Database URL**: `postgresql://postgres:postgres123@localhost:5435/venu_tech_db?schema=public`

---

## 1. Complete Technology Stack & Tools

### 1.1 Frontend
- **Framework**: Angular 18 (Standalone Components Architecture)
- **Styling**: SCSS / CSS3 (Responsive Grid, FERC Theme, Custom Form Components)
- **State & Context**: RxJS (`BehaviorSubject`), `CompanyContextService` (Cross-screen Multi-Company Context Synchronization)
- **Forms**: Angular Reactive Forms & Template-Driven Forms (`FormsModule`)
- **HTTP Client**: Angular `HttpClient` with standard HTTP error interceptors
- **Icons & Graphics**: Inline SVG vector icons
- **Build Tool**: Angular CLI (`@angular/cli` 18.x) & Webpack compiler
- **Production Web Server**: Nginx Alpine (`nginx:alpine`)

### 1.2 Backend
- **Framework**: NestJS 10 (Node.js TypeScript framework)
- **Runtime**: Node.js 20 LTS (Alpine Linux container)
- **ORM / Database Client**: Prisma ORM 5.x (`@prisma/client`)
- **API Architecture**: RESTful API with unified compatibility layer (`CompatibilityController` & specialized feature controllers)
- **Validation**: Custom FERC Business Rules Validators & Class-Validator
- **Authentication**: JWT (`@nestjs/jwt`), Passport (`passport-jwt`, `passport-local`), BCrypt
- **Data Serialization**: JSON-based dynamic payload adapters mapping legacy FERC PascalCase, camelCase, and snake_case schemas.

### 1.3 Database & Persistence
- **Database Engine**: PostgreSQL 16
- **Database Name**: `venu_tech_db`
- **Port Mapping**: Host Port `5435` -> Container Port `5432`
- **Volume Storage**: Named volume `venu_db_data_fresh` for persistent data storage across restarts.

---

## 2. Docker Architecture & Container Details

The system runs entirely via Docker Compose using three dedicated containers:

```mermaid
graph TD
    User["Web Browser (User)"] -->|Port 4200| Frontend["venu-tech-frontend (Nginx)"]
    Frontend -->|Reverse Proxy /api| Backend["venu-tech-backend (NestJS :3000)"]
    Backend -->|PostgreSQL Protocol :5432| Postgres["venu-tech-postgres (PostgreSQL 16)"]
```

| Container Name | Base Docker Image | Exposed Host Port | Container Port | Purpose |
|---|---|---|---|---|
| **`venu-tech-frontend`** | `nginx:alpine` | `4200` | `80` | Serves compiled Angular single-page application and proxies API requests. |
| **`venu-tech-backend`** | `node:20-alpine` | `3000` | `3000` | NestJS REST API server handling all business logic, validation, and database queries. |
| **`venu-tech-postgres`** | `postgres:16-alpine` | `5435` | `5432` | Relational database holding companies, users, assets, filings, and all 11 MBR compliance tables. |

---

## 3. Exact Step-by-Step Commands to Run the Application

All commands should be executed from the project root directory: `c:\Users\gunasekhar.p\Music\venus_Tech_forge_byte`

### 3.1 Start All Services (One Single Command)
To launch the entire database, backend, and frontend containers in the background:
```powershell
docker-compose up -d
```

### 3.2 Check Container Status & Health
Verify that all 3 containers are running and healthy:
```powershell
docker ps --filter "name=venu-tech"
```
Expected output:
```text
CONTAINER ID   IMAGE                       STATUS                  PORTS                                     NAMES
d6fa4bd3ff57   venu-tech-frontend:latest   Up (healthy)            0.0.0.0:4200->80/tcp                      venu-tech-frontend
83a02f0d4853   venu-tech-backend:latest    Up                      0.0.0.0:3000->3000/tcp                    venu-tech-backend
a1be39ca3503   venu-tech-postgres:latest   Up (healthy)            0.0.0.0:5435->5432/tcp                    venu-tech-postgres
```

### 3.3 View Live Application Logs
- **Backend Logs**:
  ```powershell
  docker logs -f venu-tech-backend
  ```
- **Frontend Nginx Logs**:
  ```powershell
  docker logs -f venu-tech-frontend
  ```
- **PostgreSQL Database Logs**:
  ```powershell
  docker logs -f venu-tech-postgres
  ```

### 3.4 Rebuilding the Application After Code Changes

#### If you modified Frontend code (`frontend/src`):
```powershell
npm --prefix frontend run build
docker cp frontend/dist/mbr/. venu-tech-frontend:/usr/share/nginx/html/
```

#### If you modified Backend code (`backend/src`):
```powershell
cd backend
npx tsc --outDir dist
cd ..
docker cp backend/dist/. venu-tech-backend:/app/dist/
docker restart venu-tech-backend
```

### 3.5 Stop All Containers
To shut down the entire system:
```powershell
docker-compose down
```

---

## 4. Complete List of Application Pages & Routes

All routes are accessible directly from `http://localhost:4200` once logged in:

### 4.1 Administrative & Core Screens
| Page / Screen Name | Browser URL Route | Key Functionality |
|---|---|---|
| **Login Page** | `http://localhost:4200/login` | Secure JWT authentication with role-based routing. |
| **Account Overview** | `http://localhost:4200/account` | Corporate holding account profile, contact details, and account groups. |
| **Company Details** | `http://localhost:4200/company` | Subsidiary legal entity configuration, contact addresses, and billing setup. |
| **Company Admin Portal** | `http://localhost:4200/admin/company` | Master company directory with add, edit, and cascade soft-delete capabilities. |
| **Generation Assets** | `http://localhost:4200/assets` | Registering physical power plants (solar, wind, battery) with official EIA plant codes, capacity in MW, and BAA assignments. |
| **User Management** | `http://localhost:4200/user` | Team access control, role assignment (Site Admin, Account Admin, Company User, Read Only), and user status toggling. |
| **Filings Preparation** | `http://localhost:4200/filings` | Federal filing candidate batch builder, review of flagged records, and package validation. |
| **My Profile** | `http://localhost:4200/profile` | Personal user settings, contact phone numbers, and password updates. |

---

### 4.2 The 11 FERC Market-Based Rate (MBR) Compliance Screens
Accessible via the **"Screens"** dropdown menu in the top navigation bar:

| # | Screen Name | Browser URL Route | API Endpoint Base | Purpose |
|---|---|---|---|---|
| **01** | **MBR Authorizations** | `http://localhost:4200/admin/entities/authorization` | `/api/MBRAuth/*` | FERC legal authority dockets permitting market-based wholesale power sales. |
| **02** | **Category Status** | `http://localhost:4200/admin/entities/category-status` | `/api/CatStatus/*` | Regional classification (Category 1 = small exempt seller; Category 2 = seller subject to regular market power reviews). |
| **03** | **Mitigations** | `http://localhost:4200/admin/entities/mitigations` | `/api/Mitigation/*` | Formal commitments, offer price caps, and structural mitigation narratives. |
| **04** | **Self Limitations** | `http://localhost:4200/admin/entities/self-limitations` | `/api/SelfLimit/*` | Voluntary energy volume caps placed on specific regional balancing authorities. |
| **05** | **Operating Reserves** | `http://localhost:4200/admin/entities/operating-reserves` | `/api/OR/*` | Approvals to sell fast-response spinning and supplemental reserve power to grid operators. |
| **06** | **Entities to Entities** | `http://localhost:4200/admin/entities/entities-to-entities` | `/api/EtoE/*` | Disclosure of corporate affiliate sister companies, parent companies, and utility IDs. |
| **07** | **Entities to Gen Assets** | `http://localhost:4200/admin/entities/entities-to-generator-assets` | `/api/EtoGen/*` | Direct linkage showing which corporate entity owns which physical generator or battery storage asset. |
| **08** | **Entities to PPAs** | `http://localhost:4200/admin/entities/entities-to-ppas` | `/api/EtoPPAs/*` | Long-term Power Purchase Agreements with counterparties, source BAAs, and sink BAAs. |
| **09** | **Entities to Vertical Assets**| `http://localhost:4200/admin/entities/entities-to-vertical-assets` | `/api/EtoVA/*` | Interconnection substations, high-voltage transmission spurs, and gas pipeline assets. |
| **10** | **Indicative PSS** | `http://localhost:4200/admin/entities/indicative-pss` | `/api/IPSS/*` | Power Supply Studies with sub-modal parameters for uncommitted capacity and market share. |
| **11** | **Indicative MSS** | `http://localhost:4200/admin/entities/indicative-mss` | `/api/IMSS/*` | Market Screen Studies with seasonal sub-modal parameters across Winter, Spring, Summer, and Fall. |

---

## 5. Automated Verification & Testing Commands

To run automated end-to-end regression tests anytime against all 11 screens and backend APIs:
```powershell
node backend/scripts/full-automation-suite.js
```
Expected output:
```text
================================================================
  AUTOMATION TEST SUITE SUMMARY
  Total Test Cases : 36
  Passed           : 36
  Failed           : 0
  Pass Rate        : 100.0%
================================================================
```
