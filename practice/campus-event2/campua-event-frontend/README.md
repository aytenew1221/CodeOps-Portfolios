# Campus Events Frontend

A modern, responsive web application for discovering, managing, and creating university campus events. The application allows students and campus communities to explore upcoming events, view event details, access session information, and create new events.

Built with **Next.js, React, TypeScript, and Tailwind CSS**, using a NestJS backend API.

## Features

### 1. Home Page

- Welcome section introducing the Campus Events platform.
- Purple-themed hero section and responsive layout.
- Upcoming published events fetched from the backend.
- Quick navigation to explore and create events.
- Loading, error, and empty states.

### 2. All Events Page

- Display events retrieved from the backend API.
- Search events by title.
- Filter events by category and location.
- Filter by publication status.
- Sort events by date or title.
- Pagination for event listings.

### 3. Event Details Page

- View complete event information.
- Display event title, description, location, category, and date.
- Display related sessions.
- Navigate to individual session details.

### 4. Session Details Page

- Display session title.
- View session start and end times.
- Display room information.
- Show related event information.
- Navigate back to the related event.

### 5. Create Event Page

- Create new campus events.
- Enter event title and description.
- Provide event location and date.
- Select an event category.
- Choose whether the event is published.
- Submit event information to the backend API.
- Display validation and submission errors.

## Technology Stack

| Technology       | Purpose                       |
| ---------------- | ----------------------------- |
| Next.js 16       | Frontend framework            |
| React 19         | User interface                |
| TypeScript       | Type safety                   |
| Tailwind CSS 4   | Styling and responsive design |
| Native Fetch API | Backend communication         |
| Node.js          | JavaScript runtime            |
| NestJS           | Backend REST API              |
| Git and GitHub   | Version control               |

## Requirements

Before running the project, install:

- Node.js (recommended: Node.js 20 or later).
- npm.
- Git.
- A running Campus Events NestJS backend.

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the frontend folder

```bash
cd campua-event-frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the frontend root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

This variable connects the frontend to the NestJS backend running on port `3000`.

### 5. Start the backend

Make sure the Campus Events NestJS backend is running on:

```text
http://localhost:3000
```

### 6. Start the frontend

```bash
npm run dev -- -p 3001
```

Open the application:

```text
http://localhost:3001
```

## Available Scripts

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Create production build  |
| `npm run start`    | Start production server  |
| `npm run lint`     | Run ESLint               |
| `npx tsc --noEmit` | Check TypeScript errors  |

## Backend API Integration

The frontend communicates with the NestJS backend through the native Fetch API.

The API service is located at:

```text
src/services/eventService.ts
```

### Main API Endpoints

| Method | Endpoint                              | Description              |
| ------ | ------------------------------------- | ------------------------ |
| GET    | `/api/events`                         | Retrieve events          |
| GET    | `/api/events/:id`                     | Retrieve event details   |
| GET    | `/api/events/:id/sessions`            | Retrieve event sessions  |
| GET    | `/api/events/:id/sessions/:sessionId` | Retrieve session details |
| POST   | `/api/events`                         | Create a new event       |

### Environment Configuration

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

The backend must be available for event data and event creation features to work.

## Application Routes

| Route                               | Page            |
| ----------------------------------- | --------------- |
| `/`                                 | Home            |
| `/events`                           | All Events      |
| `/events/[id]`                      | Event Details   |
| `/events/[id]/sessions/[sessionId]` | Session Details |
| `/create-event`                     | Create Event    |

## Design and User Interface

The application uses a responsive design with consistent styling.

- Home page: Purple theme.
- Navigation bar: Ethiopian flag colors.
- Event cards: Purple accents.
- Event Details: Purple and white.
- Session Details: Purple and white.
- Create Event: Blue theme.

The interface is designed to work on desktop, tablet, and mobile devices.
