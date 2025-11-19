# Docker Setup Guide for Windows

## Problem
Docker Compose is failing because WSL2 (Windows Subsystem for Linux) is not properly configured on your system.

## Solution Steps

### Step 1: Check Virtualization Status

Run this command in PowerShell (no admin required):
```powershell
.\check-virtualization.ps1
```

This will tell you if virtualization is enabled on your system.

---

### If Virtualization is DISABLED:

#### Enable in BIOS/UEFI:
1. Restart your computer
2. Enter BIOS/UEFI settings (press F2, F10, F12, or Del during boot - varies by manufacturer)
3. Find one of these settings:
   - Intel: "Intel Virtualization Technology" or "Intel VT-x"
   - AMD: "AMD-V" or "SVM Mode"
4. Enable it
5. Save and exit BIOS
6. Boot back into Windows
7. Go to Step 2 below

---

### If Virtualization is ENABLED:

#### Step 2: Enable WSL2 Features

Right-click on **enable-wsl2.ps1** and select **"Run with PowerShell (Admin)"**

Or run this in PowerShell as Administrator:
```powershell
.\enable-wsl2.ps1
```

This script will:
- Enable Windows Subsystem for Linux
- Enable Virtual Machine Platform
- Prompt you to restart

**IMPORTANT:** You MUST restart your computer after running this script.

---

### Step 3: Install Ubuntu (After Restart)

After your computer restarts, open PowerShell and run:
```powershell
wsl --install -d Ubuntu
```

This will:
- Download and install Ubuntu
- Prompt you to create a Linux username and password (remember these!)

---

### Step 4: Verify Docker

1. Open **Docker Desktop**
2. Wait for it to fully start (icon should show "Docker Desktop is running")
3. Open PowerShell and test:
   ```powershell
   docker ps
   ```
4. If successful (no errors), proceed to Step 5

---

### Step 5: Start Your Application

Navigate to your project directory and run:
```powershell
cd d:\Project_Github\HOLY_BIBLE
docker compose up -d
```

This will start all services:
- PostgreSQL database
- Redis cache
- Meilisearch (search engine)
- MinIO (file storage)
- Your backend application

---

## Quick Verification Commands

After setup is complete, verify everything is working:

```powershell
# Check Docker is running
docker ps

# Check WSL distributions
wsl --list --verbose

# Check Docker Compose status
docker compose ps

# View logs
docker compose logs -f
```

---

## Troubleshooting

### "WSL2 is not supported" error
- Make sure virtualization is enabled in BIOS
- Run enable-wsl2.ps1 as Administrator
- Restart your computer

### "500 Internal Server Error" from Docker
- Docker Desktop is not fully started - wait a minute
- If persists, restart Docker Desktop
- If still fails, check that WSL2 is installed: `wsl --list`

### Docker Compose services fail to start
- Check if `.env` file exists: `ls .env`
- If not, copy from template: `cp env.template .env`
- Verify environment variables are set correctly

---

## Summary

The issue is that Docker Desktop requires WSL2 on Windows to run Linux containers, and WSL2 requires:
1. ✓ Virtualization enabled in BIOS
2. ✓ Windows features enabled (WSL + Virtual Machine Platform)
3. ✓ A Linux distribution installed (Ubuntu)

Follow the steps above in order, and you'll have Docker working properly!
