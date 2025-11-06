# Care-Crew 🏥

A comprehensive healthcare platform with microservices architecture, featuring AI-powered triage, telehealth capabilities, and patient management systems.

## 🚀 Project Overview

Care-Crew is a modern healthcare technology platform designed to provide seamless patient care experiences through:
- AI-powered medical triage
- Telehealth and video consultations
- Patient data management
- Hospital registry and administration
- Digital health tools and analytics

## 📁 Project Structure

```
Care-Crew/
├── backend/              # Microservices backend
│   ├── admin-service/
│   ├── ai-triage-service/
│   ├── ambulance-service/
│   ├── analytics-service/
│   ├── auth-service/
│   ├── body-scan-service/
│   ├── care-circle-service/
│   ├── digital-lobby-service/
│   ├── digital-twin-service/
│   ├── doctor-copilot-service/
│   ├── doctor-queue-service/
│   ├── gamification-service/
│   ├── health-score-service/
│   ├── hospital-registry-service/
│   ├── india-analytics-service/
│   ├── insurance-decoder-service/
│   ├── medical-locker-service/
│   ├── medicine-scanner-service/
│   ├── neural-care-service/
│   ├── nurse-avatar-service/
│   ├── patient-data-service/
│   ├── rpm-data-service/
│   ├── sync-service/
│   ├── voice-service/
│   └── webrtc-signal-service/
├── hcp-portal/          # Healthcare Provider Portal (Next.js)
├── mobile/              # Mobile application (Flutter)
├── infrastructure/      # Infrastructure as Code
│   ├── docker/
│   ├── terraform/
│   └── ci-cd/
├── database/            # Database schemas and migrations
└── docs/                # Project documentation

```

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Cloud:** Google Cloud Platform
- **AI/ML:** Google Cloud AI Platform

### Frontend (HCP Portal)
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **State Management:** Zustand
- **Authentication:** Clerk

### Mobile
- **Framework:** Flutter
- **Language:** Dart

### Infrastructure
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **IaC:** Terraform
- **CI/CD:** GitHub Actions (configured)

## 🚦 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker and Docker Compose
- PostgreSQL
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gagankumar44/Care-Crew.git
   cd Care-Crew
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../hcp-portal
   npm install
   ```

4. **Set up environment variables**
   - Copy `.env.example` files in each service
   - Configure your database, API keys, and service URLs

5. **Start services with Docker**
   ```bash
   docker-compose up -d
   ```

## 📚 Documentation

- [HCP Portal Documentation](./docs/hcp-portal-docs/)
- [Project Documentation](./docs/project-docs/)
- [Dashboard Quick Start](./hcp-portal/DASHBOARD_QUICKSTART.md)
- [Troubleshooting Guide](./hcp-portal/TROUBLESHOOTING.md)

## 🔐 Security

- All services implement HIPAA-compliant security measures
- JWT-based authentication
- Environment variables for sensitive data
- Secure API endpoints with Helmet.js

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 👥 Authors

- MediAR Team

## 🙏 Acknowledgments

- Healthcare providers and patients for feedback
- Open source community for tools and libraries

---

**Note:** This is a healthcare application. Ensure all HIPAA and local healthcare regulations are followed when deploying.

