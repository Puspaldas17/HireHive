import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { StatusBadge } from "../components/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useAuth } from "../hooks/useAuth";
import { mockJobApplications } from "../lib/mockData";
import { JobStatus } from "../lib/types";
import { MoreHorizontal, Plus, Trash2, Edit2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type SortBy = "date-desc" | "date-asc" | "updated-desc" | "updated-asc";

export default function Dashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Please log in to view your applications.</p>
        </div>
      </Layout>
    );
  }

  // Get user's applications
  const userApps = mockJobApplications.filter((app) => app.userId === user.id);

  // Filter applications
  const filtered = useMemo(() => {
    let result = userApps;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.company.toLowerCase().includes(term) ||
          app.jobRole.toLowerCase().includes(term) ||
          app.notes.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((app) => app.status === statusFilter);
    }

    return result;
  }, [userApps, searchTerm, statusFilter]);

  // Sort applications
  const sorted = useMemo(() => {
    const result = [...filtered];
    switch (sortBy) {
      case "date-desc":
        result.sort(
          (a, b) =>
            new Date(b.applicationDate).getTime() -
            new Date(a.applicationDate).getTime()
        );
        break;
      case "date-asc":
        result.sort(
          (a, b) =>
            new Date(a.applicationDate).getTime() -
            new Date(b.applicationDate).getTime()
        );
        break;
      case "updated-desc":
        result.sort(
          (a, b) =>
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
        );
        break;
      case "updated-asc":
        result.sort(
          (a, b) =>
            new Date(a.lastUpdated).getTime() -
            new Date(b.lastUpdated).getTime()
        );
        break;
    }
    return result;
  }, [filtered, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApps = sorted.slice(startIndex, startIndex + itemsPerPage);

  const statusOptions: JobStatus[] = ["Applied", "Interview", "Offer", "Rejected", "OnHold"];

  return (
    <Layout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Applications</h1>
          <p className="mt-2 text-muted-foreground">
            Manage and track all your job applications
          </p>
        </div>
        <Link to="/applications/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Input
          placeholder="Search by company, role, or notes..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="sm:col-span-2"
        />

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as JobStatus | "all");
            setCurrentPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "OnHold" ? "On Hold" : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort Options */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {Math.min(startIndex + 1, sorted.length)} to{" "}
          {Math.min(startIndex + itemsPerPage, sorted.length)} of {sorted.length}{" "}
          applications
        </p>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="updated-desc">Recently Updated</SelectItem>
            <SelectItem value="updated-asc">Least Recently Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications Table */}
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        {paginatedApps.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">Company & Role</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[20%]">Applied</TableHead>
                  <TableHead className="w-[20%]">Updated</TableHead>
                  <TableHead className="w-[20%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApps.map((app) => (
                  <TableRow key={app.id} className="hover:bg-secondary/50 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-foreground">{app.company}</p>
                        <p className="text-sm text-muted-foreground">{app.jobRole}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(app.applicationDate), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(app.lastUpdated), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {}}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {}}
                            className="cursor-pointer"
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {}}
                            className="cursor-pointer text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              {userApps.length === 0
                ? "No applications yet. Create your first one!"
                : "No applications match your filters."}
            </p>
            {userApps.length === 0 && (
              <Link to="/applications/new" className="mt-4 inline-block">
                <Button>Create Application</Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
              size="sm"
              className="min-w-10"
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </Layout>
  );
}
