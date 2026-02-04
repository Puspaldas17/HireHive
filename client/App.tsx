import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ThemeProvider } from "./components/theme-provider";

// Pages
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { RecruiterDashboard } from "./pages/RecruiterDashboard";
import { PostJob } from "./pages/PostJob";
import Dashboard from "./pages/Dashboard";
import NewApplication from "./pages/NewApplication";
import ApplicationDetails from "./pages/ApplicationDetails";
import EditApplication from "./pages/EditApplication";
import Analytics from "./pages/Analytics";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />

              <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
             <Route
              path="/recruiter/jobs/new"
              element={
                <ProtectedRoute>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            {/* ... other protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications/new"
                element={
                  <ProtectedRoute>
                    <NewApplication />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/application/:id"
                element={
                  <ProtectedRoute>
                    <ApplicationDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-application/:id"
                element={
                  <ProtectedRoute>
                    <EditApplication />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume"
                element={
                  <ProtectedRoute>
                    <Resume />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
  </QueryClientProvider>
);
