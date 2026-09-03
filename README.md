# Link in Bio

A full-stack link-in-bio application where users can create an account, customize their public profile, and manage links to their social networks, websites, and other platforms.

The project was built as a complete full-stack application, including authentication, protected routes, link management, ordering, and a public profile accessible through a unique username.

## Features

* User registration and authentication
* JWT-based protected routes
* Custom public profile
* Add, edit, delete, and reorder links
* Enable or disable individual links
* Support for predefined platforms and custom links
* Link click tracking
* Public profile accessible by username
* Responsive interface

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* React Router
* TanStack Query

### Backend

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT authentication

## Project Structure

```text
link_in_bio/
├── backend/
└── frontend/
```

The frontend and backend are kept as separate applications inside the same repository.

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd link_in_bio
```

### 2. Install dependencies

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

### 3. Configure environment variables

Create the required `.env` files for each application.

Backend example:

```env
DATABASE_URL=
JWT_SECRET=
PORT=3000
```

Frontend example:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Set up the database

From the backend directory:

```bash
pnpm exec prisma migrate dev
```

### 5. Run the project

Backend:

```bash
pnpm run start:dev
```

Frontend:

```bash
pnpm run dev
```

## API

The backend exposes endpoints for:

* Authentication
* User/profile management
* Link CRUD operations
* Link ordering
* Click tracking
* Public profiles

## Status

The project is currently under development.

## License

This project was created for learning and portfolio purposes.
