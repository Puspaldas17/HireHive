import { useState } from "react";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  status: 'active' | 'inactive';
  applications: number;
}

// Mock data
const mockUsers: AdminUser[] = [
  {
    id: "user-1",
    email: "john@example.com",
    name: "John Doe",
    role: "user",
    createdAt: "2024-12-01",
    status: "active",
    applications: 8,
  },
  {
    id: "user-2",
    email: "jane@example.com",
    name: "Jane Smith",
    role: "user",
    createdAt: "2024-12-15",
    status: "active",
    applications: 6,
  },
  {
    id: "user-3",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    createdAt: "2024-11-01",
    status: "active",
    applications: 0,
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleToggleRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
      )
    );
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    );
  };

  return (
    <Layout>
      <div className="mb-8">
        <Link to="/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
        <p className="text-muted-foreground mb-8">
          Manage system users and their permissions
        </p>

        {/* Users Table */}
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">Name & Email</TableHead>
                  <TableHead className="w-[15%]">Role</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[15%]">Applications</TableHead>
                  <TableHead className="w-[15%]">Created</TableHead>
                  <TableHead className="w-[15%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-secondary/50 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => handleToggleRole(user.id)}
                        title="Click to toggle role"
                      >
                        {user.role === 'admin' ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          'User'
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === 'active' ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => handleToggleStatus(user.id)}
                        title="Click to toggle status"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground">{user.applications}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive/90"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> This is a mock admin interface. In a production app, user management would be handled through a real backend with proper authentication and authorization checks.
          </p>
        </div>
      </div>
    </Layout>
  );
}
