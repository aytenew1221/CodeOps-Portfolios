# Campus Events Management System – Frontend

A responsive React application for managing campus events, including conferences, workshops, sports activities, science exhibitions, and cultural events.

The frontend communicates with a NestJS REST API backend. Event information is stored in a JSON file through the backend instead of using a database.

## Project Overview

The Campus Events Management System provides a simple interface for viewing, searching, filtering, creating, updating, and deleting campus events.

### Features

- **Dashboard:** View campus event statistics.
- **Event Listing:** Display available campus events.
- **Search Events:** Search by event title, description, or location.
- **Filter Events:** Filter by category and publication status.
- **Create Events:** Add new campus events.
- **Update Events:** Edit existing event information.
- **Delete Events:** Remove events.
- **Event Details:** View event information and associated sessions.
- **Responsive Design:** Supports desktop, tablet, and mobile screens.
- **REST API Integration:** Communicates with the NestJS backend using Fetch API.

## Technologies Used

| Technology | Purpose                           |
| ---------- | --------------------------------- |
| React      | Frontend user interface           |
| JavaScript | Application functionality         |
| Vite       | Development server and build tool |
| CSS3       | Styling and responsive design     |
| Fetch API  | Backend communication             |
| ESLint     | Code quality and linting          |
| NestJS     | Backend REST API                  |
| JSON       | Event and session data storage    |

## Requirements

Before running the project, install:

- Node.js
- npm
- Git
- NestJS backend project

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/aytenew1221/CodeOps-Portfolios.git
```

### 2. Navigate to the frontend folder

```bash
cd CodeOps-Portfolios/practice/campus-events-frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

This variable defines the URL of the NestJS backend API.

**Important:** Restart the Vite development server whenever you change the `.env` file.

### 5. Start the backend

Open another terminal and navigate to:

```bash
cd CodeOps-Portfolios/practice/campus-events-api
```

Configure the backend `.env` file:

```env
PORT=3000
```

Start the backend:

```bash
npm run start:dev
```

The backend API should be available at:

```text
http://localhost:3000/api
```

### 6. Start the frontend

In the frontend terminal:

```bash
npm run dev
```

Open the local URL displayed by Vite. Usually:

```text
http://localhost:5173
```

If port 5173 is already in use, Vite may automatically select another port, such as 5174.

## API Integration

The frontend communicates with the NestJS backend using HTTP requests.

| Method | Endpoint                              | Description             |
| ------ | ------------------------------------- | ----------------------- |
| GET    | `/api/events`                         | Retrieve events         |
| GET    | `/api/events/:id`                     | Retrieve one event      |
| GET    | `/api/events/:id/sessions`            | Retrieve event sessions |
| GET    | `/api/events/:id/sessions/:sessionId` | Retrieve one session    |
| POST   | `/api/events`                         | Create an event         |
| PUT    | `/api/events/:id`                     | Update an event         |
| DELETE | `/api/events/:id`                     | Delete an event         |

The backend reads and writes event data using JSON file storage.

## Available Scripts

Run these commands from the frontend project directory:

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Builds the application for production.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Checks the code using ESLint.

## Running the Application

For successful integration:

1. Start the NestJS backend.
2. Confirm the backend is running on port 3000.
3. Start the React frontend.
4. Open the Vite development URL.
5. View, search, and filter campus events.
6. Create, update, and delete events through the interface.

## Important Notes

- The frontend requires the NestJS backend to be running.
- The frontend API URL is configured using `VITE_API_URL`.
- Event data is stored in a JSON file by the backend.
- Do not commit `.env` files or sensitive configuration values to GitHub.
- Configure appropriate CORS settings in the backend.
- Protect event creation, updating, and deletion endpoints with authorization before deploying publicly.

## Author

**Aytenew Ayele**

GitHub: [@aytenew1221](https://github.com/aytenew1221)

## License

This project is developed for educational and learning purposes.
