# Full-Stack Quote Application

This is a full-stack web application for collecting, sharing, and voting on quotes. The frontend is built with Next.js, and the backend is powered by NestJS.

![Quotes Page](https://i.imgur.com/example.png) <!-- It's recommended to replace this with an actual screenshot of your application -->

## Features

-   **User Authentication**: Users can register and log in to their accounts.
-   **Browse Quotes**: View a paginated list of all quotes.
-   **Search and Filter**: Search for quotes by text or filter by author.
-   **Add a Quote**: Authenticated users can add new quotes.
-   **Edit/Delete Quotes**: Users can edit or delete quotes they have created (if they have no votes).
-   **Vote**: Users can vote for their favorite quotes.
-   **Statistics**: View a simple bar chart of vote statistics.

## Tech Stack

### Backend

-   **Framework**: [NestJS](https://nestjs.com/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Database**: SQLite
-   **Authentication**: JWT (JSON Web Tokens)

### Frontend

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Library**: [React](https://reactjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: Custom CSS with classes inspired by HTML5UP templates.
-   **Icons**: [Font Awesome](https://fontawesome.com/)
-   **Charts**: [Recharts](https://recharts.org/)

## Project Structure

```
fullstack-pretest/
├── backend/         # NestJS Backend
│   ├── prisma/
│   └── src/
└── frontend/        # Next.js Frontend
    ├── pages/
    └── assets/
```

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v16 or later)
-   [npm](https://www.npmjs.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd Quotes-Application
    ```

2.  **Setup the Backend:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Run database migrations to set up the SQLite database
    npm run db:setup

    # Create a local environment file
    # In the `backend` directory, create a file named `.env`
    # and use same line as .env.example

    # Start the backend server (runs on http://localhost:3000)
    npm run start:dev
    ```

3.  **Setup the Frontend:**
    ```bash
    # Open a new terminal and navigate to the frontend directory
    cd frontend

    # Install dependencies
    npm install

    # Create a local environment file
    # In the `frontend` directory, create a file named `.env.local`
    # and use same line as .env.example

    # Start the frontend development server (runs on http://localhost:3005 or another available port)
    npm run dev
    ```

4.  **Open the application:**
    Open your browser and navigate to `http://localhost:3005`. You should see the application running.

## Available Scripts

### Backend (`/backend`)

-   `npm run dev`: Starts the development server with hot-reloading.
-   `npm run start`: Builds the application for production.
-   `npm run db:setup`: Run database migrations to set up the SQLite database.
-   `npx prisma studio`: Opens the Prisma Studio to view and manage your database.

### Frontend (`/frontend`)

-   `npm run dev`: Starts the Next.js development server.
-   `npm run build`: Builds the Next.js application for production.
-   `npm run start`: Starts the production server. 