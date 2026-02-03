import { Layout } from "../components/Layout";

export default function Resume() {
  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Resume Management</h1>
        <p className="text-muted-foreground mb-8">
          Upload and manage your resumes
        </p>

        <div className="grid gap-6">
          <div className="rounded-lg border border-border bg-card p-8">
            <p className="text-muted-foreground">
              Resume management coming soon...
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
