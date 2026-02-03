import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Menu, LogOut, User, Briefcase } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-foreground">JobTrack</span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden gap-6 md:flex">
          {user && (
            <>
              <Link
                to="/dashboard"
                className="text-foreground hover:text-primary transition"
              >
                Dashboard
              </Link>
              <Link
                to="/analytics"
                className="text-foreground hover:text-primary transition"
              >
                Analytics
              </Link>
              <Link
                to="/resume"
                className="text-foreground hover:text-primary transition"
              >
                Resume
              </Link>
            </>
          )}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Desktop User Menu */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem disabled>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer"
                    >
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard")}
                      className="cursor-pointer"
                    >
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/analytics")}
                      className="cursor-pointer"
                    >
                      Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/resume")}
                      className="cursor-pointer"
                    >
                      Resume
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer"
                    >
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <>
              <Link to="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
