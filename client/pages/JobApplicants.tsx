import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobApplication } from "@/lib/types";

// Extended type for this view since we include user details
interface Applicant extends JobApplication {
  user: {
    name: string;
    email: string;
  };
}

export function JobApplicants() {
  const { id } = useParams<{ id: string }>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/jobs/${id}/applicants`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch applicants");
        return res.json();
      })
      .then((data) => setApplicants(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button variant="ghost" className="pl-0" onClick={() => navigate("/recruiter/dashboard")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applicants</h1>
        <p className="text-muted-foreground">Reviewing candidates for this position.</p>
      </div>

      <div className="grid gap-4">
        {applicants.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-muted/50">
                <p className="text-muted-foreground">No applicants yet.</p>
            </div>
        ) : (
            applicants.map((app) => (
            <Card key={app.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                    <User className="mr-2 h-4 w-4 text-primary" />
                    {app.user.name}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                    Status: <span className="font-medium text-foreground capitalize">{app.status}</span>
                </div>
                </CardHeader>
                <CardContent>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Mail className="mr-2 h-3 w-3" />
                        {app.user.email}
                    </div>
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-3 w-3" />
                        Applied on {new Date(app.applicationDate).toLocaleDateString()}
                    </div>
                </div>
                </CardContent>
            </Card>
            ))
        )}
      </div>
    </div>
  );
}
