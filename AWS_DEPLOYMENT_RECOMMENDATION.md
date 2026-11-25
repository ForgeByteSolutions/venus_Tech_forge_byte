# AWS Deployment Recommendation & DevOps Handover Guide
*FERC Market-Based Rate (MBR) Compliance Management Portal*

---

## 1. Executive Summary & Cost Comparison

| AWS Service | Monthly Cost | Hardware Specs | Why This Service? |
|:---|:---:|:---|:---|
| **#1 AWS Lightsail (Recommended)** | **$5 - $10 / month**<br>*(First 3 Months Free)* | 1 to 2 vCPU, 2 GB RAM, 60 GB SSD, 3 TB Data Transfer | **Cheapest & Simplest**. 100% predictable flat monthly billing. No unexpected cloud charges. Runs our exact Docker Compose setup with zero code changes. |
| **#2 Standard AWS EC2** | **~$20 - $35 / month** | `t3.medium` or `t4g.small` (2 GB RAM) | Requires manual VPC, Internet Gateway, and separate Elastic IP charges. |
| **#3 AWS App Runner + RDS** | **~$70 - $95 / month** | Managed Containers + Managed RDS Database | Managed high-availability cloud, but 8x to 10x more expensive. |

> **Recommendation for DevOps**: Choose **AWS Lightsail ($5 - $10 / month)**. It gives full root access to an Ubuntu virtual machine, bundles free network bandwidth and a free public static IP, and requires only one command (`docker-compose up -d --build`) to launch the entire application.

---

## 2. Why AWS Lightsail ($5 - $10/month) is the Best Option

1. **Fixed Flat-Rate Billing**: Traditional AWS EC2 bills separately for CPU, EBS disk volumes, static public IPs, and every gigabyte of egress network traffic. Lightsail packages all of these into one flat monthly price ($5 for 1GB RAM or $10 for 2GB RAM).
2. **First 90 Days Free**: AWS provides a 3-month free trial on eligible Lightsail bundles for new AWS accounts.
3. **Zero Architecture Changes**: The application is already containerized with Docker and Docker Compose (`venu-tech-frontend`, `venu-tech-backend`, `venu-tech-postgres`). It runs on Lightsail identically to how it runs locally.
4. **Fast Deployment**: Deployment takes under 5 minutes from start to finish.

---

## 3. Step-by-Step Deployment Instructions for DevOps

Give these 4 simple steps to your DevOps engineer or deployment team:

### Step 1: Create the Lightsail Instance
1. Log in to the **AWS Management Console** and navigate to **Amazon Lightsail**.
2. Click **Create instance**.
3. Choose instance location (e.g., `us-east-1` or closest to your users).
4. Select platform: **Linux/Unix**.
5. Select blueprint: **OS Only** &rarr; **Ubuntu 22.04 LTS**.
6. Select instance plan:
   - **$5.00/month** (1 GB RAM, 1 vCPU, 40 GB SSD, 2 TB transfer)
   - **$10.00/month** (2 GB RAM, 1 vCPU, 60 GB SSD, 3 TB transfer &mdash; **Recommended** for multi-container performance).
7. Name the instance (e.g. `mbr-compliance-portal`) and click **Create instance**.

### Step 2: Configure Firewall & Inbound Ports
In the Lightsail Console, click your instance &rarr; navigate to the **Networking** tab &rarr; scroll down to **IPv4 Firewall** and ensure these ports are open:

| Port | Protocol | Source | Purpose |
|:---:|:---:|:---:|:---|
| **22** | TCP | Admin IP / Any | SSH Terminal Access |
| **80** | TCP | `0.0.0.0/0` | Standard HTTP Web Traffic |
| **443** | TCP | `0.0.0.0/0` | Secure HTTPS Traffic |
| **4200** | TCP | `0.0.0.0/0` | **Angular Portal UI Port** |

*(PostgreSQL port 5432 and NestJS port 3000 remain private within the internal Docker bridge network).*

### Step 3: Run Deployment Commands on the Server
Connect via SSH (either through the browser button on Lightsail or your local SSH client):

```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Docker and Docker Compose
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu

# 3. Clone repository
git clone <YOUR_GIT_REPOSITORY_URL>
cd venus_Tech_forge_byte

# 4. Start all 3 containers in background
docker-compose up -d --build
```

### Step 4: Verify Deployment Health
Verify that the entire system is healthy by running the automated regression suite right on the server:

```bash
node backend/scripts/full-automation-suite.js
```

*Expected Verification Output:*
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

## 4. Initial Access & System Admin Credentials

Once deployed, the portal is immediately accessible in the browser:

- **Web Application Portal**: `http://<YOUR_LIGHTSAIL_STATIC_IP>:4200`
- **Backend API Healthcheck**: `http://<YOUR_LIGHTSAIL_STATIC_IP>:3000/api/health`

### Login Credentials for DevOps & QA Verification
| Role | User Name | Login Email | Password |
|:---|:---|:---|:---|
| **Site Admin (Super User)** | Guna Sekhar (Admin) | `puttugunasekhar@forgebyte.ai` | `Latha@2004` |
| **Account Admin** | Guna Sekhar | `puttuguna@gmail.com` | `Latha@2004` |
| **Company User (Company 1)** | Guna User | `guna@gmail.com` | `Latha@2004` |
| **Company User (Company 2)** | Preetham Kantubhukta | `preetham@forgebyte.ai` | `Latha@2004` |
| **Read Only User (Auditor)** | Internal Auditor | `audit@forgebyte.ai` | `Latha@2004` |

---

## 5. Ready-to-Send DevOps Handover Message

Copy and send this clean message directly to your deployment team:

```text
Hi Team,

Here is the deployment handover information for the FERC MBR & e-Tariff Portal:

1. Recommended AWS Service:
   - Amazon Lightsail (Ubuntu 22.04 LTS)
   - Plan: $5 to $10 / month (First 3 months free under AWS Free Tier)
   - Why: Fixed flat price, no surprise bandwidth/IP charges, runs Docker Compose directly.

2. Firewall Ports to Open:
   - Port 22 (SSH)
   - Port 80 & 443 (HTTP/HTTPS)
   - Port 4200 (Angular Web Application)

3. Launch Commands:
   git clone <REPO_URL>
   cd venus_Tech_forge_byte
   docker-compose up -d --build

4. Verification Command:
   node backend/scripts/full-automation-suite.js (Runs 36 test cases, 100% pass)

5. Admin Verification Credentials:
   - URL: http://<SERVER_IP>:4200
   - Email: puttugunasekhar@forgebyte.ai
   - Password: Latha@2004

Full step-by-step instructions are documented in AWS_DEPLOYMENT_RECOMMENDATION.md.
```

