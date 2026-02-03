import React, { createContext, useState, useEffect } from "react";
import { User, AuthContextType } from "../lib/types";
import { mockUsers } from "../lib/mockData";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("authUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find user in mock data
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error("Invalid email or password");
      }

      // Remove password from stored user
      const userToStore = { ...foundUser };
      delete (userToStore as any).password;

      localStorage.setItem("authUser", JSON.stringify(userToStore));
      setUser(userToStore);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    name: string,
    password: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if user already exists
      if (mockUsers.some((u) => u.email === email)) {
        throw new Error("Email already registered");
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        password, // In production, this would be hashed
      };

      mockUsers.push(newUser);

      // Remove password from stored user
      const userToStore = { ...newUser };
      delete (userToStore as any).password;

      localStorage.setItem("authUser", JSON.stringify(userToStore));
      setUser(userToStore);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("authUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
