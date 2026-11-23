# Campus Events Backend API

A secure RESTful backend API for managing campus events, sessions, users, and event publishing workflows. Built with **NestJS, TypeScript, JWT authentication, and JSON file-based storage**.

## Project Overview

The Campus Events Backend provides APIs for students, staff, and administrators to manage and discover campus events.

The system supports:

- User registration and login.
- JWT-based authentication.
- Role-based access control.
- Event creation, editing, and deletion.
- Draft and published event management.
- Event session management.
- Public access to published events.
- Protected administrative endpoints.
- Input validation and secure request handling.

## Technology Stack

| Technology        | Purpose              |
| ----------------- | -------------------- |
| Node.js           | JavaScript runtime   |
| NestJS            | Backend framework    |
| TypeScript        | Programming language |
| JWT               | Authentication       |
| bcryptjs          | Password hashing     |
| class-validator   | Request validation   |
| class-transformer | Data transformation  |
| JSON files        | Data persistence     |
| Jest              | Unit testing         |

## User Roles

The system supports three user roles:

| Role    | Permissions                                                     |
| ------- | --------------------------------------------------------------- |
| STUDENT | View published events and sessions                              |
| STAFF   | Create and edit draft events; manage event sessions             |
| ADMIN   | Manage users, events, publishing, and administrative operations |

### Authorization Rules

- Public users can register and log in.
- Public registration creates a STUDENT account.
- Only ADMIN users can create STAFF accounts through the protected staff-management endpoint.
- STAFF and ADMIN users can create draft events.
- STAFF and ADMIN users can edit draft events.
- Only ADMIN users can publish or unpublish events.
- Students and public visitors can access published events only.
- Draft events remain private.

## Getting Started

### 1. Prerequisites

Install:

- Node.js
- npm
- Git

Check your installed versions:

```bash
node --version
npm --version
```

### 2. Clone the Repository

```bash
git clone https://github.com/aytenew1221/CodeOps-Portfolios.git
```

Navigate to the backend:

```bash
cd CodeOps-Portfolios/practice/campus-event3/campus-events-backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend root directory.

```env
PORT=3001
JWT_SECRET=your_long_random_secret
```

**Security:** Replace the example secret with a strong, private random value. Never commit your real `.env` file or share your JWT secret publicly.

### 5. Start the Development Server

```bash
npm run start:dev
```

The API should be available at:

```text
http://localhost:3001/api
```

## API Endpoints

All API endpoints use the `/api` global prefix.

### Authentication

| Method | Endpoint                    | Access                       |
| ------ | --------------------------- | ---------------------------- |
| POST   | `/api/auth/register`        | Public                       |
| POST   | `/api/auth/login`           | Public                       |
| GET    | `/api/auth/me`              | Authenticated                |
| POST   | `/api/auth/bootstrap-admin` | Protected bootstrap workflow |
| POST   | `/api/auth/staff`           | ADMIN                        |

### Events

| Method | Endpoint                    | Access                                |
| ------ | --------------------------- | ------------------------------------- |
| GET    | `/api/events`               | Public – published events             |
| GET    | `/api/events/:id`           | Public – published events             |
| POST   | `/api/events`               | STAFF, ADMIN                          |
| PATCH  | `/api/events/:id`           | STAFF, ADMIN                          |
| DELETE | `/api/events/:id`           | According to configured authorization |
| PATCH  | `/api/events/:id/publish`   | ADMIN                                 |
| PATCH  | `/api/events/:id/unpublish` | ADMIN                                 |
| GET    | `/api/events/manage`        | STAFF, ADMIN                          |

### Event Sessions

Session endpoints are protected according to the configured event-management permissions.

The API supports:

- Creating sessions.
- Viewing event sessions.
- Retrieving individual sessions
