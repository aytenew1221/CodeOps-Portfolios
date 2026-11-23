# Campus Events – Frontend

A modern, responsive campus event management application built with **Next.js, React, and TypeScript**. The platform allows students to discover campus events while authorized staff and administrators manage event creation, editing, sessions, and publication.

## Features

### Student Features

- Browse published campus events.
- View event details, dates, locations, and categories.
- Access event information through a responsive interface.
- Register for an account and log in.
- View available event sessions.

### Staff Features

- Create new events as drafts.
- Edit existing draft events.
- Manage event sessions.
- Access authorized event management pages.

### Administrator Features

- View and manage campus events.
- Create and edit events.
- Publish draft events.
- Unpublish previously published events.
- Manage event sessions.
- Control access to administrative features.

### Security

- JWT-based authentication.
- Role-based access control.
- Protected administrative pages.
- Authenticated API requests.
- Publication controls restricted to administrators.
- Authentication token management.

## Technology Stack

| Technology     | Purpose             |
| -------------- | ------------------- |
| Next.js 16.4.6 | Frontend framework  |
| React 19       | UI development      |
| TypeScript     | Type safety         |
| CSS            | Application styling |
| NestJS         | Backend REST API    |
| JWT            | Authentication      |
| Git and GitHub | Version control     |

## Requirements

Install the following before running the project:

- Node.js 24 or compatible supported version.
- npm.
- Git.
- Campus Events NestJS backend.

## Installation

Clone the repository:

```bash
git clone YOUR_FRONTEND_REPOSITORY_URL
```

Navigate into the project:

```bash
cd campus-events-frontend
```

Install dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

This connects the frontend to the NestJS backend.

Do not commit private credentials, authentication secrets, or environment files containing sensitive information.

## Running the Application

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The backend should be running separately at:

```text
http://localhost:3001
```

## Available Scripts

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start development server       |
| `npm run build` | Build production application   |
| `npm run start` | Start production server        |
| `npm run lint`  | Run lint checks, if configured |

## Event Publishing Workflow

The application implements a role-based event publishing workflow.

1. Staff and administrators can create events.
2. Newly created events are saved as drafts.
3. Authorized staff and administrators can edit drafts.
4. Only administrators can publish events.
5. Administrators can unpublish published events.
6. Students can browse published events only.
7. Draft events are not publicly accessible.

Publication status is controlled by the backend API rather than ordinary event creation or editing forms.

## Backend API Integration

The frontend communicates with the NestJS backend through REST API endpoints.

Base URL:

```text
http://localhost:3001/api
```

Important API operations include:

| Method | Endpoint                | Purpose                     |
| ------ | ----------------------- | --------------------------- |
| GET    | `/events`               | Retrieve published events   |
| GET    | `/events/:id`           | Retrieve event details      |
| POST   | `/events`               | Create an event draft       |
| PATCH  | `/events/:id`           | Update an event             |
| PATCH  | `/events/:id/publish`   | Publish an event            |
| PATCH  | `/events/:id/unpublish` | Unpublish an event          |
| GET    | `/events/manage`        | Retrieve manageable events  |
| POST   | `/auth/login`           | Authenticate a user         |
| GET    | `/auth/me`              | Retrieve authenticated user |

Protected endpoints require a valid JWT access token and appropriate permissions.

## Testing and Build

Check TypeScript:

```bash
npx tsc --noEmit
```

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Development Workflow

1. Start the NestJS backend on port `3001`.
2. Start the Next.js frontend on port `3000`.
3. Sign in using an authorized account.
4. Test event creation and editing.
5. Test session management.
6. Test administrator publishing and unpublishing.
7. Verify that students can only access published events.

## Future Improvements

- Event registration and attendance management.
- Event search and advanced filtering.
- Email notifications.
- Event image uploads.
- Student event dashboards.
- Improved accessibility.
- Automated frontend testing.
- Production deployment and monitoring.

## License

This project is developed for educational and campus event management purposes.
