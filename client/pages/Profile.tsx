import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground mb-8">
          Manage your account settings and preferences
        </p>

        <div className="rounded-lg border border-border bg-card p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Name</label>
                <p className="mt-1 text-foreground">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Email</label>
                <p className="mt-1 text-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground">
            More profile settings coming soon...
          </p>
        </div>
      </div>
    </Layout>
  );
}
