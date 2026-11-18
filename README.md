# Campus Events Management API

A RESTful backend for managing campus events and their sessions. Built with **NestJS, TypeScript, and Node.js**.

## Project Overview

The Campus Events Management API allows users to create, view, update, delete, and filter campus events. It also provides endpoints for retrieving event sessions.

**Storage:** Events and sessions are stored in a local JSON file. This project uses JSON file storage as required by the instructor; a database is not required.

## Features

- Create, read, update, and delete events
- Retrieve individual event details
- Retrieve sessions belonging to an event
- Filter events by category, location, and publication status
- Sort and paginate event results
- Validate incoming request data using DTOs
- Organize code using NestJS modules, controllers, and services
- Persist event and session data in a JSON file
- Automated tests using Jest

## Technologies

- Node.js
- NestJS
- TypeScript
- JSON file storage
- Jest

The `data/events.json` file stores the event and session records. The application reads and updates this file when API operations are performed.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/aytenew1221/CodeOps-Portfolios.git
```

### 2. Navigate to the backend project

```bash
cd CodeOps-Portfolios/practice/campus-events-api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure the environment

Create a `.env` file in the backend project root:

```env
PORT=3000
```

### 5. Start the development server

```bash
npm run start:dev
```

The API will run at:

`http://localhost:3000/api`

No database installation or database connection is required for the JSON-based event storage.

## API Endpoints

All endpoints use the `/api` prefix.

| Method | Endpoint                              | Description                    |
| ------ | ------------------------------------- | ------------------------------ |
| GET    | `/api/events`                         | Retrieve events                |
| GET    | `/api/events/:id`                     | Retrieve one event             |
| POST   | `/api/events`                         | Create an event                |
| PUT    | `/api/events/:id`                     | Update an event                |
| DELETE | `/api/events/:id`                     | Delete an event                |
| GET    | `/api/events/:id/sessions`            | Retrieve sessions for an event |
| GET    | `/api/events/:id/sessions/:sessionId` | Retrieve one session           |

## Filtering and Pagination

The events endpoint supports query parameters such as:

- `category` â€” filter by event category
- `location` â€” filter by event location
- `isPublished` â€” filter by publication status (`true` or `false`)
- `sortBy` â€” choose the field used for sorting
- `order` â€” sorting direction
- `page` â€” page number
- `limit` â€” number of results per page

Example requests:

```http
GET /api/events?category=technology
GET /api/events?location=Main%20Hall
GET /api/events?isPublished=false
GET /api/events?page=1&limit=10
```

## Frontend Integration

The React frontend connects to this backend using the API base URL.

In the frontend project's `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the backend and frontend in separate terminals. The frontend sends HTTP requests to the NestJS API, and the backend reads or updates the JSON data file.

## Running Tests

Run the automated tests:

```bash
npm test -- --runInBand
```

Run TypeScript type checking:

```bash
npx tsc --noEmit
```

Build the backend:

```bash
npm run build
```

## Screenshots

The following screenshots demonstrate the API and its functionality:

1. API home â€” `screenshots/01-api-home.png`
2. All events â€” `screenshots/02-all-events.png`
3. Event details â€” `screenshots/03-event-details.png`
4. Event sessions â€” `screenshots/04-event-sessions.png`
5. Event filtering â€” `screenshots/05-filter-events.png`

## Future Improvements

- User authentication and authorization
- Event registration and booking
- Improved event management and reporting
- Additional validation and error handling

## Author

**Aytenew Ayele**

GitHub: [aytenew1221](https://github.com/aytenew1221)

Repository: [CodeOps-Portfolios](https://github.com/aytenew1221/CodeOps-Portfolios)

---

**Note:** This project uses JSON file storage for event and session data, in accordance with the project requirements. It does not require PostgreSQL or another database to run.
