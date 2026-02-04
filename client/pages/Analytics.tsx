import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { StatsCard } from "../components/StatsCard";
import { StatusChart } from "../components/StatusChart";
import { TrendsChart } from "../components/TrendsChart";
import { useAuth } from "../hooks/useAuth";
import { getAnalytics } from "../lib/api";
import { AnalyticsStats } from "../lib/types";
import { Loader, TrendingUp, Target, Calendar, CheckCircle } from "lucide-react";

export default function Analytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return;

      try {
        const data = await getAnalytics(user.id);
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [user]);

  if (isLoading || !analytics) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          View your job search statistics and trends
        </p>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Applications"
            value={analytics.totalApplications}
            icon={<Target className="h-6 w-6" />}
            variant="primary"
            description={`${analytics.thisMonth || 0} this month`}
          />
          <StatsCard
            title="Success Rate"
            value={`${analytics.successRate || 0}%`}
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
            description={`${analytics.byStatus.Offer} offers received`}
          />
          <StatsCard
            title="Avg Days to Interview"
            value={analytics.avgDaysToInterview || 0}
            icon={<Calendar className="h-6 w-6" />}
            variant="warning"
            description="Days from application to interview"
          />
          <StatsCard
            title="In Progress"
            value={analytics.byStatus.Interview}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="primary"
            description="Interviews scheduled"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Status Distribution</h2>
            <StatusChart data={analytics.byStatus} />
          </div>

          {/* Monthly Trends */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Applications Trends</h2>
            <TrendsChart data={analytics.monthlyTrends} />
          </div>
        </div>

        {/* Detailed Status Breakdown */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Status Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
              <p className="text-sm text-muted-foreground">Applied</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {analytics.byStatus.Applied}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
              <p className="text-sm text-muted-foreground">Interviews</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {analytics.byStatus.Interview}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
              <p className="text-sm text-muted-foreground">Offers</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {analytics.byStatus.Offer}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950">
              <p className="text-sm text-muted-foreground">On Hold</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {analytics.byStatus.OnHold}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950">
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {analytics.byStatus.Rejected}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
