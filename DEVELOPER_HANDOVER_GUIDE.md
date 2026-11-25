# Developer Handover Guide
*FERC Market-Based Rate (MBR) Compliance Management Portal*

---

## 1. System Overview & Architecture

The **FERC MBR Compliance Management Portal** is a full-stack, enterprise-grade regulatory filing platform designed for wholesale energy market participants (solar, wind, battery storage, and hybrid generation). It automates the preparation, validation, and electronic filing of Market-Based Rate data to the Federal Energy Regulatory Commission.

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│                  http://localhost:4200                      │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Reverse proxy & REST calls)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Frontend: Angular 18 (Nginx Alpine)                │
│  - Standalone Components Architecture                       │
│  - RxJS BehaviorSubject Context Synchronization             │
│  - Reactive Forms with FERC Validation Engine               │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Internal Port 3000)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Backend: NestJS 10 (Node.js 20 LTS)                │
│  - Modular Microservices Architecture                       │
│  - Dual-Layer Compatibility Controller                      │
│  - JWT & Passport Authentication Middleware                 │
│  - Prisma ORM 5.x Relational Query Engine                   │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Internal Port 5432 / Host 5435)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Database: PostgreSQL 16 Relational DB              │
│  - Multi-tenant Company & Account Schemas                   │
│  - All 11 FERC Compliance Data Tables                       │
│  - Persistent Docker Volume: venu_db_data_fresh             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Default User Accounts & Login Credentials

All accounts are pre-configured in the database and seeded with standard access credentials for testing, development, and administrative audit.

### User Credentials Directory
| Role Name | User Name | Email Address | Password | Permissions & Scope |
|:---|:---|:---|:---|:---|
| **Site Admin** | Guna Sekhar (Admin) | `puttugunasekhar@forgebyte.ai` | `Latha@2004` | Full super-admin access across all accounts, companies, users, and compliance screens. |
| **Account Admin** | Guna Sekhar | `puttuguna@gmail.com` | `Latha@2004` | Management of holding account, account groups, and subsidiary companies. |
| **Company User** | Guna User | `guna@gmail.com` | `Latha@2004` | Operations for **Company 1 (Venus Clean Energy Corp)**: generation assets, PPAs, MBR screens. |
| **Company User** | Preetham Kantubhukta | `preetham@forgebyte.ai` | `Latha@2004` | Operations for **Company 2 (ForgeByte Solar Ventures LLC)**: solar & storage asset filings. |
| **Read Only User** | Internal Auditor | `audit@forgebyte.ai` | `Latha@2004` | Compliance auditor role with view-only permissions across all filings and records. |

### Authentication API Endpoints
- **Login Endpoint**: `POST /auth/login` or `POST /api/Login/GetLogin`
- **Request Body**:
  ```json
  {
    "email": "puttugunasekhar@forgebyte.ai",
    "password": "Latha@2004"
  }
  ```
- **Response**: Returns JWT `access_token`, `refresh_token`, and user profile payload (`uid`, `role`, `cid`, `aid`).

---

## 3. Multi-Company Multi-Tenant Context

The application is architected around multi-company tenant switching without logging out:

| CID | Company Identifier | Legal Company Name | Business Description |
|:---:|:---|:---|:---|
| **1** | `C100001` | **Venus Clean Energy Corp** | Primary utility holding entity with wind, gas, and energy contracts. |
| **2** | `C100002` | **ForgeByte Solar Ventures LLC** | Renewable subsidiary operating utility-scale solar farms and battery storage. |

### How Context Synchronization Works in Frontend:
- `CompanyContextService` stores active `selectedCompanyId` as an RxJS `BehaviorSubject`.
- Every compliance screen subscribes to `currentCompany$`. When the user switches companies via the top-bar dropdown, grids reload records matching the new `cid` instantly.

---

## 4. The 11 FERC Compliance Screens & API Mapping

Each compliance screen communicates with NestJS backend controllers through unified REST endpoints:

| # | Screen Name | Route | Controller Endpoint | Primary Data Entity |
|:---:|:---|:---|:---|:---|
| **01** | **MBR Authorizations** | `/admin/entities/authorization` | `/api/MBRAuth/*` | FERC Docket numbers & authorization orders |
| **02** | **Category Status** | `/admin/entities/category-status` | `/api/CatStatus/*` | Regional Category 1 (exempt) vs Category 2 |
| **03** | **Mitigations** | `/admin/entities/mitigations` | `/api/Mitigation/*` | Market power mitigation dockets & price caps |
| **04** | **Self Limitations** | `/admin/entities/self-limitations` | `/api/SelfLimit/*` | Voluntary energy export caps per BAA |
| **05** | **Operating Reserves** | `/admin/entities/operating-reserves` | `/api/OR/*` | Fast-start spinning & operating reserve authority |
| **06** | **Entities to Entities** | `/admin/entities/entities-to-entities` | `/api/EtoE/*` | Parent corporate owners & affiliate utility links |
| **07** | **Entities to Gen Assets** | `/admin/entities/entities-to-generator-assets` | `/api/EtoGen/*` | Asset ownership % mapping to physical generators |
| **08** | **Entities to PPAs** | `/admin/entities/entities-to-ppas` | `/api/EtoPPAs/*` | Wholesale Power Purchase Agreements & BAAs |
| **09** | **Entities to Vertical Assets**| `/admin/entities/entities-to-vertical-assets` | `/api/EtoVA/*` | Transmission lines, substations, gas pipelines |
| **10** | **Indicative PSS** | `/admin/entities/indicative-pss` | `/api/IPSS/*` | Power Supply Studies with seasonal capacity |
| **11** | **Indicative MSS** | `/admin/entities/indicative-mss` | `/api/IMSS/*` | Market Screen Studies with seasonal market share |

### Edit & Delete Operations Key Notes:
1. **Edit Pre-population**: Dropdown controls bind to specific numeric strings (e.g. `'1'` for Base Case, `'2'` for Sensitivity Analysis). The compatibility layer maps string descriptors to value codes upon opening the edit modal.
2. **Reference ID Requirement**: FERC validation requires that when `RecordType` is `'Update'`, the `referenceId` must be a valid positive integer pointing to the previous filing record.
3. **Soft-Delete Mechanics**: All delete operations set `isActive = false` or soft-delete the record to preserve audit history as mandated by regulatory compliance rules.

---

## 5. Local Development & Build Workflow

### Directory Layout
```
venus_Tech_forge_byte/
├── frontend/                # Angular 18 Single-Page Application
│   ├── src/app/
│   │   ├── admin/           # All 11 FERC Compliance screens & company admin
│   │   ├── auth/            # Login and authentication guard
│   │   ├── services/        # ApiService, CompanyContextService
│   │   └── shared/          # Navigation, modals, reusable tables
│   └── package.json
├── backend/                 # NestJS 10 REST API Server
│   ├── src/
│   │   ├── controllers/     # CompatibilityController & REST endpoints
│   │   ├── modules/         # Auth, Account, Company, Asset, Filing modules
│   │   └── prisma/          # schema.prisma, seed.ts, migrations
│   ├── scripts/             # full-automation-suite.js
│   └── package.json
├── docker-compose.yml       # Production container orchestration
└── README.md                # Master project documentation
```

### Development Commands
- **Start All via Docker**:
  ```bash
  docker-compose up -d
  ```
- **Rebuild Frontend without Restarting Container**:
  ```bash
  npm --prefix frontend run build
  docker cp frontend/dist/mbr/. venu-tech-frontend:/usr/share/nginx/html/
  ```
- **Recompile Backend**:
  ```bash
  cd backend && npx tsc --outDir dist && cd ..
  docker cp backend/dist/. venu-tech-backend:/app/dist/
  docker restart venu-tech-backend
  ```

---

## 6. Automated Regression Test Suite

An end-to-end regression test suite verifies all APIs, database operations, and MBR screens in under 10 seconds.

```bash
node backend/scripts/full-automation-suite.js
```

### Verified Test Matrix (36 Test Cases - 100% Pass Rate)
- **Suite 1: Common Lookups** (BAA codes, FERC regions, Entity ID types)
- **Suite 2: Accounts & Account Groups** (CRUD operations)
- **Suite 3: Company Profiles & Multi-Tenant** (CID 1 and CID 2 data isolation)
- **Suite 4: User Management** (Add, list, permissions, soft-delete)
- **Suite 5: Generation Assets** (Create plant, edit capacity, soft-delete)
- **Suite 6: All 11 FERC Compliance Screens** (Insert, Edit, Delete, Parameter updates)
- **Suite 7: Filing Candidate Selection & Flags** (Toggle submission readiness)
