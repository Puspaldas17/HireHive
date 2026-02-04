# HireHive

HireHive is a modern, full-stack web application designed to streamline the hiring process. Built with performance and scalability in mind, it leverages the latest web technologies to provide a seamless experience for both employers and job seekers.

## 🚀 Features

- **Modern UI/UX**: Built with React and Tailwind CSS for a responsive and accessible design.
- **Rich Interactions**: Utilizes Framer Motion for smooth animations and transitions.
- **Type Safety**: Fully typed with TypeScript on both consumer and server sides.
- **Backend Integration**: Powered by a robust Express.js server.
- **Component Library**: leveraging Shadcn UI (Radix UI) for consistent and customizable components.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
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
- **Validation**: [Zod](https://zod.dev/)

### Tooling

- **Test Runner**: [Vitest](https://vitest.dev/)
- **Formatting**: [Prettier](https://prettier.io/)

## 📂 Project Structure

```bash
HireHive/
├── client/                 # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and libraries
│   ├── pages/              # Application views/pages
│   └── App.tsx             # Main application component
├── server/                 # Backend Express application
│   ├── routes/             # API route definitions
│   └── index.ts            # Server entry point
├── shared/                 # Shared code between client and server
├── public/                 # Static assets
└── package.json            # Project dependencies and scripts
```

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

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

### Running the Application

To start the development server (runs both client and server in development mode):

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

To build the application for production:

```bash
npm run build
```

This command builds both the client and server.

- **Client Build**: `npm run build:client`
- **Server Build**: `npm run build:server`

### Starting Production Server

After building, you can start the production server:

```bash
npm start
```

## 🧪 Testing

Run the test suite using Vitest:

```bash
npm test
```

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by the HireHive Team.
