# FERC MBR Compliance Management Portal
*Enterprise Regulatory Filing & e-Tariff Automation System*

---

## 1. Project Overview

The **FERC Market-Based Rate (MBR) & e-Tariff Portal** is an enterprise regulatory compliance application built for wholesale energy producers (solar, wind, battery storage, and hybrid power generation). 

It centralizes power generation asset tracking, Power Purchase Agreements (PPAs), corporate ownership hierarchies, market power study parameters, and official electronic regulatory filings submitted to the **Federal Energy Regulatory Commission (FERC)**.

- **Frontend Portal**: `http://localhost:4200`
- **Backend API**: `http://localhost:3000`
- **Database**: PostgreSQL 16 on port `5435`

---

## 2. Tools & Technology Stack

| Layer | Technology | Version | Purpose |
|:---|:---|:---|:---|
| **Frontend Framework** | Angular (Standalone Components) | 18.x | Modular single-page application |
| **State Management** | RxJS (`BehaviorSubject`) | 7.x | Reactive multi-company context synchronization |
| **Styling & Theme** | SCSS / CSS3 | Modern | Regulatory data grids, modals, and responsive layouts |
| **Forms Engine** | Reactive & Template Forms | 18.x | Dynamic validation against FERC filing rules |
| **Web Server** | Nginx Alpine (`nginx:alpine`) | Latest | High-speed static bundle delivery & reverse proxy |
| **Backend Framework** | NestJS (TypeScript) | 10.x | Enterprise REST API and microservices architecture |
| **Runtime Environment**| Node.js LTS (Alpine Linux) | 20.x | Containerized JavaScript runtime |
| **Database ORM** | Prisma ORM | 5.x | Type-safe schema migrations & relational queries |
| **Authentication** | JWT & Passport.js | Latest | Role-Based Access Control (Site Admin, Admin, User) |
| **Database Engine** | PostgreSQL | 16.x | ACID-compliant relational data store |
| **Container Engine** | Docker & Docker Compose | 3.8+ | Multi-container orchestration |

---

## 3. Docker Architecture & Container Details

The application runs entirely within 3 Docker containers connected through a private Docker bridge network:

```
                  [ Web Browser (User) ]
                            │
                       (Port 4200)
                            ▼
     ┌──────────────────────────────────────────────┐
     │  venu-tech-frontend  (Image: nginx:alpine)   │
     │  - Serves Angular 18 Single-Page App         │
     └──────────────────────┬───────────────────────┘
                            │
                  (Internal Port 3000)
                            ▼
     ┌──────────────────────────────────────────────┐
     │  venu-tech-backend   (Image: node:20-alpine) │
     │  - NestJS API & FERC Business Rules Engine   │
     └──────────────────────┬───────────────────────┘
                            │
                  (Internal Port 5432)
                            ▼
     ┌──────────────────────────────────────────────┐
     │  venu-tech-postgres  (Image: postgres:16)    │
     │  - Persistent Volume: venu_db_data_fresh     │
     └──────────────────────────────────────────────┘
```

### Container Port & Volume Configuration
| Container Name | Base Image | Host Port | Container Port | Data Persistence |
|:---|:---|:---|:---|:---|
| **`venu-tech-frontend`** | `nginx:alpine` | `4200` | `80` | Stateless (Compiled bundle) |
| **`venu-tech-backend`** | `node:20-alpine` | `3000` | `3000` | Stateless (TypeScript runtime) |
| **`venu-tech-postgres`** | `postgres:16-alpine` | `5435` | `5432` | Volume: `venu_db_data_fresh` |

> **Note**: Port 80 has been removed from host exposure. Only port **4200** is used to access the application.

---

## 4. How to Run the Application (Exact Commands)

Run all commands from the project root directory:

### Start All Services
```bash
docker-compose up -d
```

### Check Container Status
```bash
docker ps --filter "name=venu-tech"
```
*Expected Output:*
- `venu-tech-frontend` &rarr; `Up (healthy) 0.0.0.0:4200->80/tcp`
- `venu-tech-backend` &rarr; `Up 0.0.0.0:3000->3000/tcp`
- `venu-tech-postgres` &rarr; `Up (healthy) 0.0.0.0:5435->5432/tcp`

### View Real-Time Logs
```bash
docker logs -f venu-tech-backend     # Backend logs
docker logs -f venu-tech-frontend    # Frontend Nginx logs
docker logs -f venu-tech-postgres    # Database logs
```

### Rebuild After Code Changes
- **Frontend Changes**:
  ```bash
  npm --prefix frontend run build
  docker cp frontend/dist/mbr/. venu-tech-frontend:/usr/share/nginx/html/
  ```
- **Backend Changes**:
  ```bash
  cd backend && npx tsc --outDir dist && cd ..
  docker cp backend/dist/. venu-tech-backend:/app/dist/
  docker restart venu-tech-backend
  ```

### Stop All Services
```bash
docker-compose down
```

---

## 5. Application Screens & Navigation Directory

### Core Administrative Pages
| Page / Screen | Browser URL Route | Purpose |
|:---|:---|:---|
| **Login** | `http://localhost:4200/login` | Secure JWT user authentication & session management |
| **Account** | `http://localhost:4200/account` | Corporate holding account profile & account groups |
| **Company** | `http://localhost:4200/company` | Subsidiary entity configuration & billing details |
| **Company Admin** | `http://localhost:4200/admin/company` | Multi-tenant company directory with add, edit, and cascade soft-delete |
| **Assets** | `http://localhost:4200/assets` | Power plant asset registry (solar, wind, battery, EIA codes, MW capacity) |
| **User Management**| `http://localhost:4200/user` | Team roles (Site Admin, Account Admin, Company User, Read Only) |
| **Filings** | `http://localhost:4200/filings` | Federal filing candidate batch review & XML filing creation |

### The 11 FERC Compliance Screens (under the "Screens" Menu)
| # | Screen Name | Browser URL Route | FERC Regulatory Purpose |
|:---:|:---|:---|:---|
| **01** | **MBR Authorizations** | `http://localhost:4200/admin/entities/authorization` | Formal federal wholesale market sale authorizations & docket tracking |
| **02** | **Category Status** | `http://localhost:4200/admin/entities/category-status` | Regional seller status (Category 1 small vs. Category 2 large seller) |
| **03** | **Mitigations** | `http://localhost:4200/admin/entities/mitigations` | Regional market power mitigation plans, price caps, and commitments |
| **04** | **Self Limitations** | `http://localhost:4200/admin/entities/self-limitations` | Voluntary energy export and generation capacity caps per BAA |
| **05** | **Operating Reserves** | `http://localhost:4200/admin/entities/operating-reserves` | Spinning reserve and fast-start power market sale approvals |
| **06** | **Entities to Entities** | `http://localhost:4200/admin/entities/entities-to-entities` | Disclosure of parent holding companies and utility sister affiliates |
| **07** | **Entities to Gen Assets** | `http://localhost:4200/admin/entities/entities-to-generator-assets` | Ownership percentage mapping to physical generator units |
| **08** | **Entities to PPAs** | `http://localhost:4200/admin/entities/entities-to-ppas` | Power Purchase Agreements with source & sink balancing authorities |
| **09** | **Entities to Vertical Assets** | `http://localhost:4200/admin/entities/entities-to-vertical-assets` | Non-generation transmission lines, substations, and natural gas pipelines |
| **10** | **Indicative PSS** | `http://localhost:4200/admin/entities/indicative-pss` | Power Supply Studies with seasonal uncommitted capacity evaluations |
| **11** | **Indicative MSS** | `http://localhost:4200/admin/entities/indicative-mss` | Market Screen Studies with seasonal market share assessments |

---

## 6. Automated Testing & Verification

The project includes an end-to-end automated regression test suite covering all APIs, data operations, and the 11 FERC compliance modules.

### Run Tests
```bash
node backend/scripts/full-automation-suite.js
```

### Test Suite Results
```text
================================================================
  AUTOMATION TEST SUITE SUMMARY
  Total Test Cases : 36
  Passed           : 36
  Failed           : 0
  Pass Rate        : 100.0%
================================================================
```

---

## 7. Cloud Deployment Suggestion (Cheapest Option)

For hosting this application on AWS, the most cost-effective and simplest service is **AWS Lightsail**.

### Why AWS Lightsail?
- **Flat Cost**: Only **$5.00 to $10.00 / month** (Includes CPU, 2 GB RAM, 60 GB SSD storage, static IP, and 3 TB data transfer).
- **Free Trial**: **First 3 months are completely free** for new AWS accounts.
- **Zero Surprises**: No unpredictable cloud bills for bandwidth or IP addresses.
- **Runs Docker Directly**: Uses the exact same `docker-compose.yml` with zero code modifications.

### 4 Quick Steps for the Deployment Team

1. **Create Instance**: In AWS Console &rarr; Lightsail &rarr; Create Instance &rarr; Choose **Ubuntu 22.04 LTS** &rarr; Select the **$5/mo or $10/mo** plan.
2. **Open Firewall Ports**: In Lightsail instance settings &rarr; Networking &rarr; Open **Port 80**, **Port 443**, and **Port 4200**.
3. **Run Setup on Server**:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose
   git clone <YOUR_GIT_REPO_URL>
   cd venus_Tech_forge_byte
   docker-compose up -d --build
   ```
4. **Access Application**:
   Open browser at `http://<YOUR_SERVER_IP>:4200`

---

## 8. User Roles & Accounts

| Role Name | User Name | Email Address | Access Level |
|:---|:---|:---|:---|
| **Site Admin (Super User)** | Guna Sekhar (Admin) | `puttugunasekhar@forgebyte.ai` | Global administrative access across all accounts |
| **Account Admin** | Guna Sekhar | `puttuguna@gmail.com` | Holding account management & company administration |
| **Company User (Company 1)** | Guna User | `guna@gmail.com` | Operational regulatory filings for Venus Clean Energy |
| **Company User (Company 2)** | Preetham Kantubhukta | `preetham@forgebyte.ai` | Operational regulatory filings for ForgeByte Solar |
| **Read Only User (Auditor)** | Internal Auditor | `audit@forgebyte.ai` | Read-only audit access across all screens |

> **Security Notice**: Passwords have been omitted from documentation for security compliance. Refer to your internal team secrets vault or secure password manager for initial environment credentials.

---

## 9. Specialized Handover Documentation & Test Artifacts

- [DEVELOPER_HANDOVER_GUIDE.md](file:///c:/Users/gunasekhar.p/Music/venus_Tech_forge_byte/DEVELOPER_HANDOVER_GUIDE.md): Complete architecture, schema mapping, multi-company context, local development workflow, and developer guide.
- [AWS_DEPLOYMENT_RECOMMENDATION.md](file:///c:/Users/gunasekhar.p/Music/venus_Tech_forge_byte/AWS_DEPLOYMENT_RECOMMENDATION.md): Dedicated AWS Lightsail $5/mo deployment guide with step-by-step instructions, firewall rules, and ready-to-send DevOps handover note.
- [MBR_COMPLIANCE_PORTAL_FULL_PROJECT_TEST_CASES.xlsx](file:///c:/Users/gunasekhar.p/Music/venus_Tech_forge_byte/MBR_COMPLIANCE_PORTAL_FULL_PROJECT_TEST_CASES.xlsx): **Comprehensive Excel Test Suite Workbook** with 5 interactive sheets covering all test types (Functional, Negative, Boundary, Security/RBAC, Multi-Tenant, FERC 11 screens, and formal QA Sign-off).

- [MBR_MANUAL_UI_FULL_PROJECT_TEST_CASES.xlsx](file:///c:/Users/gunasekhar.p/Music/venus_Tech_forge_byte/MBR_MANUAL_UI_FULL_PROJECT_TEST_CASES.xlsx): **Manual UI / Browser Testing Excel Workbook** with 6 sheets covering real browser steps for Positive, Negative, Boundary, Edge Cases, UI/UX, Dropdown Pre-population, Keyboard Navigation, and Multi-Company Context switching.
