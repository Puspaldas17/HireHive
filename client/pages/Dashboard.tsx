import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
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
import { getJobApplications } from "../lib/api";
import { JobApplication, JobStatus } from "../lib/types";
import { MoreHorizontal, Plus, Trash2, Edit2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { GlobalSearch } from "../components/GlobalSearch";
import { AdvancedFilters, FilterOptions } from "../components/AdvancedFilters";

type SortBy = "date-desc" | "date-asc" | "updated-desc" | "updated-asc";

export default function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<SortBy>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load applications
  useEffect(() => {
    const loadApplications = async () => {
      if (!user) return;
      try {
        const apps = await getJobApplications(user.id);
        setApplications(apps);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Please log in to view your applications.
          </p>
        </div>
      </Layout>
    );
  }

  // Filter applications
  const filtered = useMemo(() => {
    let result = applications;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.company.toLowerCase().includes(term) ||
          app.jobRole.toLowerCase().includes(term) ||
          app.notes.toLowerCase().includes(term),
      );
    }

    // Advanced filters
    if (filters.status) {
      result = result.filter((app) => app.status === filters.status);
    }

    if (filters.company) {
      result = result.filter((app) =>
        app.company.toLowerCase().includes(filters.company!.toLowerCase()),
      );
    }

    if (filters.jobRole) {
      result = result.filter((app) =>
        app.jobRole.toLowerCase().includes(filters.jobRole!.toLowerCase()),
      );
    }

    if (filters.startDate) {
      result = result.filter(
        (app) => new Date(app.applicationDate) >= new Date(filters.startDate!),
      );
    }

    if (filters.endDate) {
      result = result.filter(
        (app) => new Date(app.applicationDate) <= new Date(filters.endDate!),
      );
    }

    if (filters.hasInterview) {
      result = result.filter((app) => app.interviewDate !== undefined);
    }



    if (filters.hasNotes) {
      result = result.filter((app) => (app.notesList?.length || 0) > 0);
    }

    // Salary range filtering (basic parsing)
    if (filters.minSalary || filters.maxSalary) {
      result = result.filter((app) => {
        if (!app.salary) return false;
        // This is a simple check - in production you'd want to parse salary properly
        const salaryNum = parseInt(app.salary.replace(/[^0-9]/g, ""));
        const minSalary = filters.minSalary ? parseInt(filters.minSalary) : 0;
        const maxSalary = filters.maxSalary
          ? parseInt(filters.maxSalary)
          : Infinity;
        return salaryNum >= minSalary && salaryNum <= maxSalary;
      });
    }

    return result;
  }, [applications, searchTerm, filters]);

  // Sort applications
  const sorted = useMemo(() => {
    const result = [...filtered];
    switch (sortBy) {
      case "date-desc":
        result.sort(
          (a, b) =>
            new Date(b.applicationDate).getTime() -
            new Date(a.applicationDate).getTime(),
        );
        break;
      case "date-asc":
        result.sort(
          (a, b) =>
            new Date(a.applicationDate).getTime() -
            new Date(b.applicationDate).getTime(),
        );
        break;
      case "updated-desc":
        result.sort(
          (a, b) =>
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime(),
        );
        break;
      case "updated-asc":
        result.sort(
          (a, b) =>
            new Date(a.lastUpdated).getTime() -
            new Date(b.lastUpdated).getTime(),
        );
        break;
    }
    return result;
  }, [filtered, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApps = sorted.slice(startIndex, startIndex + itemsPerPage);

  const statusOptions: JobStatus[] = [
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
    "OnHold",
  ];

  return (
    <Layout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Job Applications
          </h1>
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
      <div className="mb-6 space-y-4">
        <GlobalSearch applications={applications} />
        <AdvancedFilters
          filters={filters}
          onFiltersChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1);
          }}
          onClear={() => {
            setFilters({});
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Sort Options */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {isLoading ? "..." : Math.min(startIndex + 1, sorted.length)}{" "}
          to{" "}
          {isLoading
            ? "..."
            : Math.min(startIndex + itemsPerPage, sorted.length)}{" "}
          of {isLoading ? "..." : sorted.length} applications
        </p>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortBy)}
        >
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
        {!isLoading && paginatedApps.length > 0 ? (
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
                  <TableRow
                    key={app.id}
                    className="hover:bg-secondary/50 transition-colors"
                  >
                    <TableCell>
                      <div>
                        <p className="font-semibold text-foreground">
                          {app.company}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {app.jobRole}
                        </p>
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
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to={`/application/${app.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to={`/edit-application/${app.id}`}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : isLoading ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              {applications.length === 0
                ? "No applications yet. Create your first one!"
                : "No applications match your filters."}
            </p>
            {applications.length === 0 && (
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
