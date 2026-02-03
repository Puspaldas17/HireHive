import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewApplication() {
  return (
    <Layout>
      <div className="mb-8">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Add New Application</h1>
        <p className="text-muted-foreground mb-8">
          Create a new job application entry
        </p>

        <div className="rounded-lg border border-border bg-card p-8">
          <p className="text-muted-foreground">
            Application form coming soon...
          </p>
        </div>
      </div>
    </Layout>
  );
}
