# HireHive

HireHive is a modern, full-stack web application designed to streamline the hiring process. Built with performance and scalability in mind, it leverages the latest web technologies to provide a seamless experience for both employers and job seekers.

## 🚀 Features

- **Role-Based Access Control**: Distinct portals for **Job Seekers**, **Recruiters**, and **Admins**.
- **Job Management**: Recruiters can create, manage, and track job postings.
- **Application Tracking**: Kanban-style (implied) or list view for tracking application status (Applied, Interview, Offer, Rejected).
- **Resume Management**: Upload and manage resumes securely.
- **Modern UI/UX**: Built with **React** and **Tailwind CSS** for a responsive and accessible design.
- **Rich Interactions**: Utilizes **Framer Motion** for smooth animations.
- **Type Safety**: Fully typed with **TypeScript** across the entire stack.
- **Database ORM**: Uses **Prisma** for robust database component interaction.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: SQLite (Development) / Configurable via Prisma
- **ORM**: [Prisma](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs

### Tooling

- **Test Runner**: [Vitest](https://vitest.dev/)
- **Formatting**: [Prettier](https://prettier.io/)

## 📂 Project Structure

```bash
HireHive/
├── client/                 # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and libraries
│   ├── pages/              # Application views/pages
│   └── App.tsx             # Main application component
├── server/                 # Backend Express application
│   ├── routes/             # API route definitions (auth, jobs, etc.)
│   ├── middleware/         # Express middleware (auth, error handling)
│   └── index.ts            # Server entry point
├── shared/                 # Shared code between client and server (types, schemas)
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
└── package.json            # Project dependencies and workspace scripts
```

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) installed

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Puspaldas17/HireHive.git
    cd HireHive
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

### Configuration

Create a `.env` file in the root directory (or ensure the defaults work for you). The project uses `dotenv` to load environment variables.

**Required Variables:**

```env
# Database connection string (default uses local SQLite file)
DATABASE_URL="file:./dev.db"

# JWT Secret for authentication (Change this for production!)
JWT_SECRET="super-secret-key"

# Optional: Server Port (default: 3000 in prod, 8080 in dev via Vite)
PORT=3000
```

### Running the Application

**Development Mode:**
To start the development server (runs both client and server in development mode with hot-reloading):

```bash
npm run dev
```

The application will be available at `http://localhost:8080` (or `http://localhost:5173`).

### Building for Production

To build the application for production:

```bash
npm run build
```

This command builds both the client (to `dist/spa`) and the server (to `dist/server`).

### Starting Production Server

After building, you can start the production server:

```bash
npm start
```

This serves the static frontend assets and the API from the node backend.

## 🧪 Testing

Run the test suite using Vitest:

```bash
npm test
```

## 📝 License

This project is licensed under the MIT License.
