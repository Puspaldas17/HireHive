import { Layout } from "../components/Layout";
import { StatsCard } from "../components/StatsCard";
import { Users, BarChart3, Database, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  // Mock data - in a real app, this would come from an API
  const stats = {
    totalUsers: 42,
    totalApplications: 156,
    avgApplicationsPerUser: 3.7,
    dataStorageUsed: "2.4 MB",
  };

  const recentActivity = [
    { user: "John Doe", action: "Created new application", time: "2 minutes ago" },
    { user: "Jane Smith", action: "Updated application status", time: "15 minutes ago" },
    { user: "Mike Johnson", action: "Uploaded resume", time: "1 hour ago" },
    { user: "Sarah Williams", action: "Created new application", time: "2 hours ago" },
    { user: "Robert Brown", action: "Added interview notes", time: "3 hours ago" },
  ];

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          System-wide analytics and administration
        </p>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users className="h-6 w-6" />}
            variant="primary"
          />
          <StatsCard
            title="Total Applications"
            value={stats.totalApplications}
            icon={<BarChart3 className="h-6 w-6" />}
            variant="success"
          />
          <StatsCard
            title="Avg per User"
            value={stats.avgApplicationsPerUser}
            icon={<Database className="h-6 w-6" />}
            variant="warning"
            description="Applications per user"
          />
          <Link to="/admin/users">
            <Button variant="outline" className="w-full h-full">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-b-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{item.user}</p>
                    <p className="text-sm text-muted-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="space-y-4">
            {/* Storage Usage */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-3">Storage Usage</h3>
              <p className="text-2xl font-bold text-foreground mb-2">{stats.dataStorageUsed}</p>
              <p className="text-xs text-muted-foreground">Total data stored</p>
            </div>

            {/* Quick Links */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/admin/users">
                  <Button variant="ghost" className="w-full justify-start">
                    Manage Users
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start" disabled>
                  System Logs
                </Button>
                <Button variant="ghost" className="w-full justify-start" disabled>
                  Settings
                </Button>
              </div>
            </div>

            {/* System Status */}
            <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-600" />
                <h3 className="font-semibold text-green-900 dark:text-green-100">System Status</h3>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">All systems operational</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
