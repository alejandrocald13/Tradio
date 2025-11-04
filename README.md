# Tradio – Full Stack Stock Trading Platform

## Overview
**Tradio** is a full-stack web application inspired by modern investment platforms such as **Hapi**.  
It enables users to **buy and sell stocks**, manage their **portfolio**, and receive **automated reports**, while administrators can manage users, transactions, and the stock catalog.

---

## Architecture

| Component | Technology | Hosting | Description |
|------------|-------------|----------|--------------|
| **Frontend** | Django | [Render](https://back.g3.atenea.lat) | Visual layer of the platform with dashboards and user interface. |
| **Backend** | Next.js | [Vercel](https://front.g3.atenea.lat) | API providing business logic and data management. |
| **Authentication** | Auth0 | — | Login and register system with secure JWT sessions. |
| **Asynchronous Tasks** | Celery + Redis | [Railway](https://railway.app) | Manages background processes such as emails and scheduled updates. |
| **Database** | PostgreSQL | [Neon.tech](https://neon.tech) | Stores users, transactions, and stock data. |
| **Documentation** | Swagger | [Swagger Link](https://back.g3.atenea.lat/api/docs) | API reference and test interface. |

---

## Key Features
- **Auth0 Integration:** Secure login and register with JWT-based sessions.  
- **Admin Dashboard:** Manage users, transactions, and available stocks.  
- **Stock Trading:** Simulated buying and selling with validation of funds and market hours.  
- **Portfolio Tracking:** Real-time monitoring of performance, balance, and reports.  
- **Automated Emails:** Notifications for user verification and transactions.  
- **Non-Repudiation:** IP, timestamps, and user logging for audit compliance.  
- **Soft Deletes:** Prevents data loss by logically disabling records.  
- **Responsive UI:** Modern interface accessible on any device.  
- **API Security:** Role-based permissions and protected routes.

---

## Tech Stack

```
Frontend:   Django (Render)
Backend:    Next.js (Vercel)
Database:   PostgreSQL (Neon)
Auth:       Auth0
Async:      Celery + Redis (Railway)
Docs:       Swagger (OpenAPI 3.0)
```

---

## Local Development

### Clone the repository
```bash
git clone https://github.com/alejandrocald13/Tradio
cd tradio
```

### Run the applications
#### Backend (Next.js)
```bash
cd backend
npm instal
npm run dev
```

#### Frontend (Django)
```bash
cd frontend
pip install -r requirements.txt
python manage.py runserver
```

### Access locally
```text
Frontend: http://localhost:3000
Backend API: http://localhost:8000/api
Swagger Docs: http://localhost:8000/api/docs
```

---

## Additional Resources
- [Auth0 Documentation](https://auth0.com/docs)
- [Celery with Redis](https://docs.celeryq.dev/)
- [Render Deployment Guide](https://render.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Swagger OpenAPI](https://swagger.io/)

### Developers of Tradio
- Roberto Alejandro Calderón Martínez - 1557723 
- Mayda Daniela Matul Alvarado - 1535523
- Josué David Bautista Orózco - 1532523
- Christian Andrés Villegas Velasco - 1592623
- Juan José Luarca Rodríguez - 1512623
- Iván Alexander Ordoñez López - 1567523
- José Antonio Ronquillo Meza - 1547223