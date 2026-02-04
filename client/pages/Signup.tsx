import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Header } from "../components/Header";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !name || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (isRecruiter && !companyName) {
      setError("Company Name is required for recruiters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await signup(
        email, 
        name, 
        password, 
        isRecruiter ? "recruiter" : "user", 
        isRecruiter ? companyName : undefined
      );
      // Redirect based on role
      if (isRecruiter) {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Sign Up</h1>
            <p className="mt-2 text-muted-foreground">
              Create your {isRecruiter ? "recruiter" : "seeker"} account
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="recruiter-toggle"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={isRecruiter}
                onChange={(e) => setIsRecruiter(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="recruiter-toggle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I am hiring (Recruiter Account)
              </label>
            </div>

            {isRecruiter && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Company Name
                </label>
                <Input
                  type="text"
                  placeholder="Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-primary hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
