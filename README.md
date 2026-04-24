# 🎓 TalentOS — AI-Powered Campus Placement Portal

<p align="center">
  <strong>One platform. Three personas. Four AI features.</strong><br/>
  A full-stack placement management system that connects students, recruiters, and placement officers through intelligent automation.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-17-DD0031?logo=angular&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-1.5-4285F4?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white" />
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [AI Integration](#-ai-integration)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Design System](#-design-system)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🎯 Overview

**TalentOS** digitizes the entire campus placement lifecycle — from student profile creation to final selection — while leveraging Google Gemini AI to match candidates with opportunities, parse resumes automatically, and provide personalized skill gap analysis.

### The Problem

Traditional placement processes rely on manual spreadsheets, physical notices, and coordinator-driven communication. This creates:
- Slow candidate-to-job matching
- No feedback for students on fit
- Overwhelmed recruiters manually screening hundreds of resumes
- Limited visibility for placement officers on analytics

### The Solution

TalentOS replaces all of this with a structured, AI-powered digital workflow where:
- 📚 **Students** build profiles, upload resumes, and get instant AI-matched job recommendations
- 🏢 **Recruiters** post jobs with AI-extracted skill requirements and see applicants ranked by AI match score
- 👔 **Placement Officers** monitor real-time analytics with interactive charts and export CSV reports

---

## ✨ Features

### 👨‍🎓 Student Portal (Purple & Cream theme)
- ✅ Profile builder with dynamic skill chip input
- ✅ PDF resume upload with **AI-powered auto-parsing**
- ✅ Browse and search jobs with filters
- ✅ **Preview AI match score** before applying
- ✅ Track application status (Applied → Shortlisted → Interview → Selected)
- ✅ Confirm interview time slots
- ✅ View personalized skill gap analysis with learning suggestions
- ✅ In-app notifications

### 🏢 Recruiter Portal (Ocean Blue theme)
- ✅ Post jobs with **AI-extracted required skills**
- ✅ View applicants ranked by AI match score
- ✅ Filter applicants by status
- ✅ Update application status with notes
- ✅ Propose multiple interview time slots
- ✅ Track hiring performance metrics

### 👔 Admin Portal (Dark Navy + Emerald theme)
- ✅ Real-time placement analytics dashboard
- ✅ 3 interactive Chart.js visualizations
- ✅ User management (activate/deactivate)
- ✅ AI-generated insights on placement patterns
- ✅ CSV export of complete placement report

---

## 🤖 AI Integration

TalentOS integrates **Google Gemini API** (`gemini-1.5-flash`) with four meaningful features:

### 1. 📄 Resume Parser
```
Student uploads PDF → Apache PDFBox extracts text → Gemini parses structure
→ Auto-fills name, skills, education, experience in profile
```

### 2. 🎯 Job Skill Extractor
```
Recruiter writes JD → Gemini analyzes text → Returns structured required
and nice-to-have skill arrays → Shown as editable chips on job form
```

### 3. 🧠 AI Match Scorer
```
On application submit → Gemini compares student profile with job requirements
→ Returns match score (0-100), matched skills, missing skills, summary
→ Stored with application, shown to both student and recruiter
```

### 4. 💡 Skill Gap Advisor
```
Student views application → Sees matched skills (green) vs missing skills (pink)
→ Gets one-line personalized learning suggestion from Gemini
```

**Graceful Degradation:** All AI calls are wrapped in try-catch. If Gemini is unavailable or rate-limited, applications still save successfully without AI data.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Angular** | 17 | SPA framework |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Bootstrap** | 5.3.3 | UI foundation |
| **Bootstrap Icons** | 1.11.3 | Icon library |
| **Chart.js** | 4.4.2 | Analytics charts |
| **jwt-decode** | 4.0.0 | JWT client parsing |
| **RxJS** | 7.8 | Reactive HTTP |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Java** | 17 | Programming language |
| **Spring Boot** | 3.2.3 | Application framework |
| **Spring Security** | 6.x | Authentication / authorization |
| **Spring Data JPA** | 3.x | ORM layer |
| **Hibernate** | 6.x | JPA implementation |
| **jjwt** | 0.12.3 | JWT token generation |
| **Apache PDFBox** | 3.0.1 | PDF text extraction |
| **Lombok** | Latest | Boilerplate reduction |
| **Maven** | 3.x | Build management |

### Database & AI
| Technology | Purpose |
|---|---|
| **MySQL** 8.x | Relational database |
| **Google Gemini API** (gemini-1.5-flash) | AI for parsing, matching, skill extraction |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                       │
│   Angular 17 + Bootstrap 5 + Chart.js                   │
│   (Student / Recruiter / Admin UI with 3 themes)        │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (JSON + JWT)
                       │
┌──────────────────────▼──────────────────────────────────┐
│                BUSINESS LOGIC LAYER                      │
│   Spring Boot 3 · Spring Security · JPA                 │
│   ┌──────────┬──────────────┬─────────────────────┐     │
│   │ Auth     │ Business     │  AIService          │     │
│   │ Filter   │ Services     │  → Gemini API       │     │
│   └──────────┴──────────────┴─────────────────────┘     │
└──────────────────────┬──────────────────────────────────┘
          ┌────────────┴──────────────┐
          │                           │
   ┌──────▼──────┐           ┌────────▼─────────┐
   │  MySQL DB   │           │ Google Gemini    │
   │  (Data)     │           │ API (External)   │
   └─────────────┘           └──────────────────┘
```

### Design Patterns
- **MVC** — Controller, Service, Repository separation
- **DTO** — Request/response objects decoupled from entities
- **Repository** — Spring Data JPA interfaces
- **Interceptor** — JWT filter, HTTP error handler
- **Observer** — RxJS Observables
- **Guard** — Route-level access control

---

## 🚀 Getting Started

### Prerequisites

- **Java 17** (OpenJDK or Oracle)
- **Maven 3.x**
- **MySQL 8.x** running locally
- **Node.js v18 or v20 LTS**
- **Angular CLI 17** — install with `npm install -g @angular/cli@17`
- **Google Gemini API Key** — free at [aistudio.google.com](https://aistudio.google.com)

---

### 🖥️ Backend Setup

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/talentos.git
cd talentos/placement-portal-backend
```

**2. Configure `application.properties`**

Edit `src/main/resources/application.properties`:

```properties
# Server
server.port=8081

# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/placement_portal?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT (must be at least 32 chars)
app.jwt.secret=ThisIsAVerySecretKeyForJWTThatMustBe32CharsLong!
app.jwt.expiration=86400000

# Gemini AI
app.gemini.api-key=YOUR_GEMINI_API_KEY
app.gemini.api-url=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent

# File upload
app.file.upload-dir=uploads/resumes
spring.servlet.multipart.max-file-size=5MB
```

**3. Run the backend**
```bash
mvn clean install
mvn spring-boot:run
```

Backend will start at `http://localhost:8081`. Tables auto-create on first run.

**4. Seed an Admin user**
```sql
-- Default password: password123
INSERT INTO users (name, email, password, role, is_active)
VALUES (
  'Admin',
  'admin@talentos.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVYzE1hkde',
  'ADMIN',
  true
);
```

---

### 🎨 Frontend Setup

**1. Navigate to frontend folder**
```bash
cd ../placement-portal-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure API URL**

Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api/v1'
};
```

**4. Run the frontend**
```bash
ng serve
```

Frontend will start at `http://localhost:4200`.

---

### ✅ Verify Everything Works

1. Open `http://localhost:4200` → you should see the **TalentOS login page** with gradient hero
2. Click "Create an account" → register as a **Student**
3. You should be redirected to the purple-themed student dashboard
4. Register another account as **Recruiter** → ocean blue dashboard
5. Log in as seeded Admin (`admin@talentos.com` / `password123`) → dark emerald dashboard

---

## 📁 Project Structure

### Backend
```
placement-portal-backend/
├── src/main/java/com/placement/portal/
│   ├── PlacementPortalApplication.java
│   ├── config/           # Security, CORS, App config
│   ├── security/         # JWT filter, utilities
│   ├── model/            # JPA entities
│   ├── enums/            # Role, Status, JobType
│   ├── repository/       # Spring Data repositories
│   ├── dto/
│   │   ├── request/      # Input DTOs
│   │   └── response/     # Output DTOs (+ ApiResponse wrapper)
│   ├── service/
│   │   ├── *.java        # Business services
│   │   └── ai/           # AIService + Gemini implementation
│   ├── controller/       # 8 REST controllers
│   └── exception/        # Global exception handler
└── src/main/resources/
    ├── application.properties
    └── static/uploads/   # Resume PDF storage
```

### Frontend
```
placement-portal-frontend/
├── src/app/
│   ├── models/           # TypeScript interfaces
│   ├── services/         # HTTP API services
│   ├── guards/           # Auth + Role route guards
│   ├── interceptors/     # JWT injection + error handling
│   ├── shared/           # Navbar, Sidebar, Gauge, Loader, Status Badge
│   ├── pages/
│   │   ├── login/
│   │   ├── register/
│   │   ├── student/      # 8 pages
│   │   ├── recruiter/    # 6 pages
│   │   └── admin/        # 3 pages
│   ├── app.component.ts
│   ├── app.module.ts
│   └── app-routing.module.ts
└── src/styles.scss       # Global design system with 3 themes
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register user |
| `POST` | `/api/v1/auth/login` | Public | Login, returns JWT |

### Student
| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/api/v1/student/profile` | STUDENT |
| `PUT` | `/api/v1/student/profile` | STUDENT |
| `POST` | `/api/v1/student/resume/upload` | STUDENT |
| `GET` | `/api/v1/jobs` | Authenticated |
| `GET` | `/api/v1/student/jobs/{id}/preview` | STUDENT |
| `POST` | `/api/v1/student/applications/{jobId}` | STUDENT |
| `GET` | `/api/v1/student/applications` | STUDENT |

### Recruiter
| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/api/v1/recruiter/jobs` | RECRUITER |
| `POST` | `/api/v1/recruiter/jobs` | RECRUITER |
| `PATCH` | `/api/v1/recruiter/jobs/{id}/toggle` | RECRUITER |
| `POST` | `/api/v1/recruiter/jobs/extract-skills` | RECRUITER |
| `GET` | `/api/v1/recruiter/jobs/{id}/applicants` | RECRUITER |
| `PATCH` | `/api/v1/recruiter/applications/{id}/status` | RECRUITER |
| `POST` | `/api/v1/recruiter/interviews/{id}/propose` | RECRUITER |

### Admin
| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/api/v1/admin/dashboard` | ADMIN |
| `GET` | `/api/v1/admin/users` | ADMIN |
| `PATCH` | `/api/v1/admin/users/{id}/toggle-status` | ADMIN |
| `GET` | `/api/v1/admin/report/csv` | ADMIN |

### Notifications (all authenticated users)
| Method | Endpoint |
|---|---|
| `GET` | `/api/v1/notifications` |
| `GET` | `/api/v1/notifications/unread-count` |
| `PATCH` | `/api/v1/notifications/{id}/read` |
| `PATCH` | `/api/v1/notifications/read-all` |

All protected endpoints require:
```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 📸 Screenshots

### 🔐 Login Page
Split-screen with animated gradient hero on the left (purple → pink → amber blur orbs) and clean form with feature pills on the right.

### 👨‍🎓 Student Dashboard
Editorial purple + cream design with Instrument Serif italic accents. Time-aware greeting, gradient profile card with completion ring, 4 stat cards, AI resume banner, and AI-ranked job list.

### 🏢 Recruiter Dashboard
Ocean blue + Archivo extrabold design. Bold applicant count hero, performance card with gradient navy background, job listings with live metrics.

### 👔 Admin Command Center
Dark navy + emerald theme. "Placement pulse." hero with animated LIVE pill, 6 stat cards, placement rate bar, 3 Chart.js charts (doughnut, bar, horizontal bar), and AI insights panel.

### 📊 AI Match Score Breakdown
Large circular gauge showing match percentage with color coding (green 90+, purple 75+, amber 60+, red <60), matched skills in green blocks, missing skills in pink blocks, and italic AI suggestion.

---

## 🎨 Design System

TalentOS features a **unified design system** with **three distinct role-based themes** that automatically switch based on the logged-in user.

| Role | Theme | Display Font | Body Font | Vibe |
|------|-------|-------------|-----------|------|
| **Student** | Purple + Cream + Pink | Instrument Serif | DM Sans | Editorial, warm, personal |
| **Recruiter** | Ocean Blue + Cyan | Archivo (extrabold) | Manrope | Professional, data-rich |
| **Admin** | Dark Navy + Emerald + Amber | Bricolage Grotesque | IBM Plex Sans | Command center, powerful |

### How It Works

```typescript
// app.component.ts automatically applies theme class
body.classList.add('theme-student');  // or theme-recruiter, theme-admin
```

All CSS variables (colors, fonts, backgrounds) swap based on this body class. **One codebase, three identities.**

### Reusable Components

- `<app-navbar>` — role-aware topbar
- `<app-sidebar>` — menu adapts to role
- `<app-gauge>` — circular AI match score (3 sizes)
- `<app-status-badge>` — color-coded application status
- `<app-loader>` — normal + AI loading modes

---

## 🧪 Testing

### Test Cases Covered

| ID | Scenario | Expected |
|---|---|---|
| TC-01 | Register with valid data | 200 OK + JWT |
| TC-02 | Duplicate email registration | 400 Bad Request |
| TC-03 | Login wrong password | 401 Unauthorized |
| TC-04 | Access protected route without token | 403 Forbidden |
| TC-05 | Student accesses recruiter endpoint | 403 Forbidden |
| TC-06 | Upload non-PDF resume | 400 Bad Request |
| TC-07 | Duplicate job application | 400 Bad Request |
| TC-08 | Apply after deadline | 400 Bad Request |
| TC-09 | AI match score computed | 200 OK + score 0-100 |
| TC-10 | AI down — graceful fallback | Application saves without score |
| TC-11 | CSV export | 200 OK + file download |

---

## 🚢 Deployment

### Backend (Spring Boot)
```bash
mvn clean package
java -jar target/placement-portal-1.0.0.jar
```

### Frontend (Angular)
```bash
ng build --configuration production
# Deploy dist/ folder to Nginx, Apache, or any static host
```

### Production Checklist

- [ ] Set strong JWT secret in environment variables
- [ ] Use production MySQL with backups
- [ ] Configure CORS for production domain only
- [ ] Enable HTTPS with SSL certificates
- [ ] Set Gemini API key via environment variable (never commit)
- [ ] Use cloud storage (S3/GCS) for resume uploads
- [ ] Set up application monitoring (Sentry, LogRocket)

---

## 🗺️ Roadmap

### Planned Features
- [ ] 📧 Email notifications via JavaMail
- [ ] 💬 Real-time chat between students and recruiters (WebSocket)
- [ ] 📹 Integrated video interviews (Google Meet / Zoom embed)
- [ ] 📄 In-app resume builder with PDF export
- [ ] 📱 Mobile app (React Native / Flutter)
- [ ] 🎓 AI-generated mock interview questions
- [ ] 📜 Digital offer letter generator with e-signature
- [ ] 🏆 Gamified profile completion badges
- [ ] 🔔 Push notifications via Firebase

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** — `git checkout -b feature/amazing-feature`
3. **Commit your changes** — `git commit -m 'Add amazing feature'`
4. **Push to the branch** — `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Coding Standards

- Follow existing patterns (Controller → Service → Repository)
- Use DTOs for all API responses (never expose entities)
- Add `@PreAuthorize` annotations for role checks
- Write TypeScript interfaces for all model changes
- Keep components focused — extract reusable logic into services

---

## 🙏 Acknowledgments

- **Google Gemini** for powerful and free AI capabilities
- **Spring Boot & Angular teams** for excellent frameworks
- **Bootstrap & Chart.js** for beautiful UI components
- **Our mentors** for guidance and feedback
---

<p align="center">
  <strong>⭐ If you found this project helpful, please consider giving it a star on GitHub!</strong>
</p>

<p align="center">
  <em>Built with precision · Designed with care · Powered by AI</em>
</p>
