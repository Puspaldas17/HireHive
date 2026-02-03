import { Layout } from "../components/Layout";

export default function Analytics() {
  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          View your job search statistics and trends
        </p>

        <div className="grid gap-6">
          <div className="rounded-lg border border-border bg-card p-8">
            <p className="text-muted-foreground">
              Analytics dashboard coming soon...
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
