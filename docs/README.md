# Kuro - Pet Recovery Portfolio

## Project Goal
Kuro is a **portfolio/demo project**: a stable public showcase for recruiters, reviewers, and classmates to explore the app's design and engineering. It is not presented as a supported public pet-recovery service.

## Current Status
The core report flow, Google OAuth flow, socket authentication, live pet-report updates, feed pagination, and direct report pages have been implemented. The messaging feature is intentionally incomplete and marked as such.

## Technology Stack
- **Frontend**: React, React Router, MUI, Leaflet, Socket.IO client
- **Backend**: Node.js, Express, PostgreSQL with PostGIS, Node-pg-migrate
- **Socket.IO**: Real-time pet report updates via authenticated sockets
- **Build**: Vite + React, Node/Express server

## Local Setup
### Prerequisites
- Node.js (v20+)
- PostgreSQL with PostGIS extension
- npm or npm

### Installation
**Frontend**
```
cd client
npm install
npm run build
```

**Server**
```
cd server
npm install
npm run db:migrate
npm run build
```

### Environment Variables
Create `.env` files from the provided `.env.example` files:

**client/.env**
```
VITE_API_BASE_URL=http://localhost:8080
```

**server/.env**
```
DATABASE_URL=postgresql://kuro:***REMOVED***@localhost:5432/kuro_db
PORT=80
NODE_ENV=production
JWT_SECRET=change-this-to-a-long-random-string
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:80
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Running
```
# Start server
cd server
npm run dev

# Start client
cd client
npm run dev
```

## Portfolio Features (Complete)
- User authentication (signup, login, logout, Google OAuth)
- Report creation (lost/found with map location)
- Cursor-based feed pagination
- Direct report URLs
- Live pet-report updates via Socket.IO

### Messaging (Incomplete - marked in checklist)
- Conversations created per report
- Message sending/receiving via Socket.IO
- Read/unread state management

## Screenshots
- Home: docs/screenshots/home.png
- Map: docs/screenshots/map.png
- Report Form: docs/screenshots/report-form1.png
- Report Form 2: docs/screenshots/report-form2.png

