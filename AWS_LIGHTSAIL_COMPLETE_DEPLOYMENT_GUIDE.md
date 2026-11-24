# Complete Step-by-Step Production Deployment Guide on AWS Lightsail ($3.50/month)

> **Target Platform**: AWS Lightsail (Ubuntu 22.04 LTS)  
> **Total Monthly Cost**: **\$3.50 / month** (or **\$5.00 / month**, with the **First 3 Months 100% Free**)  
> **Application**: Venu Tech eTariff Management System (Angular 17 Frontend + NestJS Backend + PostgreSQL Database + Nginx Reverse Proxy)

---

## 📌 Real Default Login Credentials (After Deployment)

Once the deployment finishes and you open your server in your browser, use these real credentials to log in:

| Field | Real Value to Type in Login Screen |
| :--- | :--- |
| **Email Address** | `puttugunasekhar@forgebyte.ai` |
| **Password** | `Latha@2004` |
| **Default Role** | `Site Admin` (Full access to all accounts, companies, filings, and users) |

---

## 🎯 Quick Reference: Where Real Values Must Be Replaced

During this guide, there are only **TWO real values** you must replace:

| Placeholder in Guide | What It Means | Where You Get It | Example Real Value |
| :--- | :--- | :--- | :--- |
| `YOUR_SERVER_STATIC_IP` | The public Internet IP address of your AWS server. | AWS Lightsail gives this to you when you click "Create Static IP" in Phase 3. | `54.210.88.194` |
| `YOUR_GITHUB_REPO_URL` | The HTTPS link to your GitHub repository. | Your browser address bar when looking at your repository on GitHub. | `https://github.com/gunasekhar282002/venus_Tech_forge_byte.git` |

Everything else (database username, passwords, ports, environment settings, Nginx configurations) has already been pre-configured with real working values in this guide.

---

## Table of Contents
1. [Phase 1: Save & Push Code to GitHub in VS Code](#phase-1-save--push-code-to-github-in-vs-code)
2. [Phase 2: Open Browser & Create Your AWS Lightsail Server](#phase-2-open-browser--create-your-aws-lightsail-server)
3. [Phase 3: Attach Free Static IP & Open Firewall Ports](#phase-3-attach-free-static-ip--open-firewall-ports)
4. [Phase 4: Connect to Your Server Terminal](#phase-4-connect-to-your-server-terminal)
5. [Phase 5: Add 2 GB Swap Memory (Prevents Server Crashes)](#phase-5-add-2-gb-swap-memory-prevents-server-crashes)
6. [Phase 6: Install Required Software (Docker, Node 20, Nginx, PM2)](#phase-6-install-required-software-docker-node-20-nginx-pm2)
7. [Phase 7: Clone Project & Start PostgreSQL Database](#phase-7-clone-project--start-postgresql-database)
8. [Phase 8: Build & Launch NestJS Backend API](#phase-8-build--launch-nestjs-backend-api)
9. [Phase 9: Build Angular 17 Production Frontend](#phase-9-build-angular-17-production-frontend)
10. [Phase 10: Configure Nginx Web Server](#phase-10-configure-nginx-web-server)
11. [Phase 11: Open & Test Your Live Website](#phase-11-open--test-your-live-website)
12. [Phase 12: Troubleshooting Handbook (Exact Solutions for Any Error)](#phase-12-troubleshooting-handbook)

---

## Phase 1: Save & Push Code to GitHub in VS Code

We must make sure all latest TypeScript fixes, Angular configurations, and backend routing fixes are committed and sent to GitHub.

### Step-by-Step Instructions:
1. Open **VS Code** on your computer.
2. In the top menu, click **Terminal** &rarr; **New Terminal** (or press <kbd>Ctrl</kbd> + <kbd>`</kbd>).
3. Copy and paste the following three commands into the terminal, pressing <kbd>Enter</kbd> after each one:

```powershell
git add .
git commit -m "Production configuration ready for AWS deployment"
git push origin main
```

> **Visual Check**: VS Code should show `Writing objects: 100%` and `main -> main`. All code is now safely backed up on GitHub.

---

## Phase 2: Open Browser & Create Your AWS Lightsail Server

Now we create the dedicated cloud virtual server that runs 24 hours a day, 7 days a week.

### Step-by-Step Instructions:
1. Open your web browser (Chrome, Edge, Firefox, or Safari).
2. Go to the Lightsail console URL: **[https://lightsail.aws.amazon.com](https://lightsail.aws.amazon.com)**
3. Log in with your **AWS Root Account** email and password.
4. On the Lightsail homepage, click the large blue button that says: **Create instance**.

### Choosing Your Server Options:
1. **Instance Location (AWS Region)**:
   - Near the top, you will see **Instance location**.
   - If you want to change the country where the server lives, click **Change Region and zone** (for example: *Virginia (us-east-1)*, *Frankfurt (eu-central-1)*, or *Mumbai (ap-south-1)*).
   - Leaving the default region is completely fine.
2. **Select a Platform**:
   - Click the circle radio button for **Linux/Unix**.
3. **Select a Blueprint**:
   - Click the tab labeled **OS Only** (Do **NOT** click "Apps + OS").
   - Click the square icon for **Ubuntu 22.04 LTS** (or **Ubuntu 24.04 LTS**).
4. **Choose Your Instance Plan**:
   - Scroll down to the pricing table. You will see cards labeled **\$3.50**, **\$5.00**, **\$10.00**.
   - Notice the green notification: **"First 3 months free on select plans"**.
   - Click the **\$5.00/month** card (1 GB RAM, 2 vCPUs, 40 GB SSD, 2 TB data transfer). It is **100% free for the first 90 days** and provides ample RAM for building Angular and running PostgreSQL!
5. **Name Your Instance**:
   - Scroll to the bottom under **Identify your instance**.
   - In the text box labeled **Name your instance**, type: `venu-tech-server`
6. **Launch**:
   - Click the large orange button at the bottom: **Create instance**.
   - You will see a square card on your dashboard for `venu-tech-server` with a gray badge that says **"Pending"**.
   - Wait **45 to 60 seconds** and refresh your browser. The badge will turn bright green and say **"Running"**!

---

## Phase 3: Attach Free Static IP & Open Firewall Ports

By default, cloud servers receive a temporary IP address that can change when rebooted. Attaching a **Static IP** is 100% free in Lightsail and ensures your website address never changes.

### Step 1: Create and Attach the Static IP
1. At the top navigation bar of AWS Lightsail, click the **Networking** tab.
2. Click the orange button: **Create static IP**.
3. Under the section **Attach to an instance**, click the dropdown menu and select: `venu-tech-server`.
4. In the text box under **Name your static IP**, type: `venu-tech-static-ip`.
5. Click the orange button: **Create**.
6. A screen will appear displaying your permanent public IP address (for example: `54.210.88.194`).
   > [!IMPORTANT]
   > **Write down this IP address!** This is your **`YOUR_SERVER_STATIC_IP`**. Anyone on the internet will use this address to view your website.

---

### Step 2: Open Web Firewall Ports (80 and 443)
1. At the top navigation bar, click back to the **Instances** tab.
2. Click directly on the name of your server: `venu-tech-server`.
3. Inside your server's settings, click the **IPv4 Firewall** tab (or **Networking** tab depending on AWS UI version).
4. Scroll down to the **IPv4 Firewall** table. You will see that only `SSH (port 22)` is currently open.
5. Click **+ Add rule**.
   - In the **Application** dropdown, select **HTTP**. (Port 80 will fill in automatically).
   - Click **Create**.
6. Click **+ Add rule** again.
   - In the **Application** dropdown, select **HTTPS**. (Port 443 will fill in automatically).
   - Click **Create**.
7. Click **+ Add rule** a third time.
   - In the **Application** dropdown, leave it as **Custom**.
   - Protocol: **TCP**.
   - Port: type `3000` (this allows backend API testing directly if ever needed).
   - Click **Create**.

Your firewall is now properly opened to the public internet!

---

## Phase 4: Connect to Your Server Terminal

AWS provides a secure browser terminal with one click.

1. On your instance page (`venu-tech-server`), click the **Connect** tab.
2. Click the orange button labeled: **Connect using SSH**.
3. A new black browser pop-up window will appear with white text.
4. After 5 seconds, you will see a prompt like this:
   ```text
   ubuntu@venu-tech-server:~$ 
   ```
   **You are now officially inside your cloud server's command line!**

---

## Phase 5: Add 2 GB Swap Memory (Prevents Server Crashes)

During Angular 17 builds, the compiler uses extra RAM. Adding 2 GB of virtual swap memory guarantees your server never runs out of memory, never freezes, and never restarts.

In your black browser terminal window, copy and paste this command block and press <kbd>Enter</kbd>:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

> **Visual Check**: The output of `free -h` will show `Swap: 2.0Gi 0B 2.0Gi`. Your virtual safety memory is active!

---

## Phase 6: Install Required Software (Docker, Node 20, Nginx, PM2)

We will now install the four essential tools to run our application:
1. **Docker**: To run PostgreSQL 16 database.
2. **Node.js 20 LTS**: To build and run NestJS and Angular.
3. **Nginx**: High-speed web server to host the Angular files.
4. **PM2**: Process manager to keep NestJS running 24/7.

### Step 1: Update Linux Packages
Copy and paste this into the terminal and press <kbd>Enter</kbd>:

```bash
sudo apt update && sudo apt upgrade -y
```
*(Wait 1 to 2 minutes while updates install).*

---

### Step 2: Install Docker & Docker Compose
Copy and paste this into the terminal and press <kbd>Enter</kbd>:

```bash
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

---

### Step 3: Install Node.js 20 LTS, Nginx, and PM2
Copy and paste this into the terminal and press <kbd>Enter</kbd>:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx
sudo npm install -g pm2
node -v
npm -v
```

> **Visual Check**: The terminal will print `v20.x.x` and `10.x.x`. All foundational software is installed!

---

## Phase 7: Clone Project & Start PostgreSQL Database

Now we download your project repository onto the server and launch the PostgreSQL database container.

### Step 1: Clone the GitHub Repository
Run this command in the terminal (replace `YOUR_GITHUB_REPO_URL` with your actual GitHub repository URL):

```bash
git clone https://github.com/gunasekhar282002/venu_tech_forge_byte.git app
cd app
```

> [!NOTE]
> If your repository is **Private**, the terminal will ask for:
> - **Username**: Your GitHub username.
> - **Password**: Your GitHub **Personal Access Token** (generate one in GitHub &rarr; Settings &rarr; Developer Settings &rarr; Personal Access Tokens &rarr; Tokens (classic)).

---

### Step 2: Create the Backend `.env` File
Run this command to create the production environment file for your backend:

```bash
cat << 'EOF' > backend/.env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5433/venu_tech_db?schema=public"
PORT=3000
JWT_SECRET="production-super-secret-jwt-key-venu-2026"
JWT_REFRESH_SECRET="production-super-secret-refresh-key-venu-2026"
FRONTEND_URL="*"
EOF
```

---

### Step 3: Start PostgreSQL Container
Run this command to launch the database on port 5433:

```bash
docker-compose up -d
docker ps
```

> **Visual Check**: `docker ps` will show a running container:
> `postgres:16 ... 0.0.0.0:5433->5432/tcp ... venu-tech-postgres`.
> Your PostgreSQL database is active and listening!

---

## Phase 8: Build & Launch NestJS Backend API

Now we initialize the database tables, insert seed data, build the backend, and run it under PM2.

In your terminal, copy and paste this command block and press <kbd>Enter</kbd>:

```bash
cd /home/ubuntu/app/backend
npm install
npx prisma generate --schema=src/prisma/schema.prisma
npx prisma db push --schema=src/prisma/schema.prisma
node scripts/prisma-seed-runtime.js
npm run build
pm2 start dist/main.js --name "venu-backend"
pm2 save
pm2 startup
```

> **Visual Check**:
> 1. `npx prisma db push` will print: `The database is now in sync with the Prisma schema`.
> 2. `node scripts/prisma-seed-runtime.js` will print: `Seed completed successfully`.
> 3. PM2 will print a table showing `venu-backend` with status **online** in green!
>
> **Quick Test**: Run `curl http://localhost:3000/api/diagnostics/health`. You will receive `{"status":"ok"}`.

---

## Phase 9: Build Angular 17 Production Frontend

Now we build the Angular frontend into optimized, production-ready static HTML, JavaScript, and CSS files.

In your terminal, copy and paste this command block and press <kbd>Enter</kbd>:

```bash
cd /home/ubuntu/app/frontend
npm install
export NODE_OPTIONS="--max-old-space-size=2048"
npm run build --configuration=production
```

*(Wait 1 to 2 minutes while Angular compiles. When complete, the built files will be located in `/home/ubuntu/app/frontend/dist/venus-etariff-workspace/browser`).*

---

## Phase 10: Configure Nginx Web Server

Nginx acts as the front door for your server:
1. When visitors open `http://YOUR_SERVER_STATIC_IP`, Nginx serves the Angular frontend.
2. When the Angular app calls `/api/...`, Nginx seamlessly passes the request behind the scenes to NestJS on port 3000.
3. This eliminates CORS errors completely!

### Step 1: Write the Nginx Configuration
Copy and paste this entire block into the terminal and press <kbd>Enter</kbd>:

```bash
sudo cat << 'EOF' > /etc/nginx/sites-available/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root /var/www/venu-frontend;
    index index.html;

    # Gzip Compression for maximum speed
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 1. Frontend Angular Routes (SPA fallback)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. Backend API Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50M;
    }
}
EOF
```

---

### Step 2: Copy Frontend Files to the Web Directory
Copy and paste this command block into the terminal:

```bash
sudo mkdir -p /var/www/venu-frontend
sudo cp -r /home/ubuntu/app/frontend/dist/mbr/* /var/www/venu-frontend/
sudo chown -R www-data:www-data /var/www/venu-frontend
sudo chmod -R 755 /var/www/venu-frontend
```

---

### Step 3: Test and Restart Nginx
Run this command to test the configuration and reload Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

> **Visual Check**: `sudo nginx -t` will output:
> `nginx: configuration file /etc/nginx/nginx.conf test is successful`.
> Nginx is now running and live!

---

## Phase 11: Open & Test Your Live Website

1. Open your regular computer web browser (Google Chrome, Edge, etc.).
2. In the top address bar, type your server's Static IP address:
   ```text
   http://YOUR_SERVER_STATIC_IP
   ```
   *(For example: `http://54.210.88.194`)*
3. **The Venu Tech eTariff login page will appear!**
4. Enter the real seed login credentials:
   - **Email**: `puttugunasekhar@forgebyte.ai`
   - **Password**: `Latha@2004`
5. Click **Log In**.
6. You will be taken directly into the application dashboard. You can create companies, add assets, edit entities, manage accounts, and create filings with real PostgreSQL database persistence in the cloud!

---

## Phase 12: Troubleshooting Handbook

If you see any error at any stage, find your exact symptom below and run the one-line fix:

### Issue 1: "Database connection refused" or "PrismaClientInitializationError"
- **Reason**: The Docker PostgreSQL container stopped or has not started yet.
- **Instant Fix**:
  ```bash
  cd /home/ubuntu/app
  docker-compose up -d
  docker ps
  ```

---

### Issue 2: "502 Bad Gateway" when opening `/api/...` in browser
- **Reason**: The NestJS backend process crashed or stopped.
- **Instant Fix**:
  ```bash
  pm2 status
  pm2 logs venu-backend --lines 30
  pm2 restart venu-backend
  ```

---

### Issue 3: "404 Not Found" when refreshing an Angular page (e.g. `/company` or `/account`)
- **Reason**: Nginx is looking for a physical folder instead of routing back to `index.html`.
- **Instant Fix**: Verify `try_files $uri $uri/ /index.html;` exists in `/etc/nginx/sites-available/default`, then run:
  ```bash
  sudo systemctl restart nginx
  ```

---

### Issue 4: "JavaScript heap out of memory" during `npm run build`
- **Reason**: Node memory limit was exceeded.
- **Instant Fix**:
  ```bash
  export NODE_OPTIONS="--max-old-space-size=2048"
  npm run build --configuration=production
  ```

---

### Issue 5: Port 3000 or 5433 already in use
- **Reason**: An old zombie process is holding onto the port.
- **Instant Fix**:
  ```bash
  sudo fuser -k 3000/tcp
  sudo fuser -k 5433/tcp
  pm2 restart venu-backend
  ```

---

### Issue 6: Website does not open in browser (Loading indefinitely)
- **Reason**: Port 80 is blocked in the AWS Lightsail firewall.
- **Instant Fix**:
  1. Go to AWS Lightsail &rarr; Click `venu-tech-server`.
  2. Click **IPv4 Firewall** tab.
  3. Ensure a rule exists for **Application: HTTP, Port: 80**. If missing, click **+ Add rule** &rarr; select **HTTP** &rarr; click **Create**.

---

## 🛠️ Handy Maintenance Commands (Save for Later)

Keep these commands handy for future updates:

| What You Want to Do | Command to Run in Server Terminal |
| :--- | :--- |
| **Pull code updates from GitHub** | `cd /home/ubuntu/app && git pull && cd backend && npm run build && pm2 restart venu-backend` |
| **View live backend logs** | `pm2 logs venu-backend` |
| **Check server RAM usage** | `free -h` |
| **Restart backend server** | `pm2 restart venu-backend` |
| **Restart Nginx web server** | `sudo systemctl restart nginx` |
| **Check PostgreSQL container status** | `docker ps` |
