import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobPost } from "@/lib/types";

export function RecruiterDashboard() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs/manage", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setJobs(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-muted-foreground">Manage your job postings and applicants.</p>
        </div>
        <Link to="/recruiter/jobs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Post New Job
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-0">Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.filter((j) => j.status === "OPEN").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mt-6">Your Job Postings</h2>
      
      {jobs.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
          <Link to="/recruiter/jobs/new" className="mt-4 inline-block">
            <Button variant="outline">Create your first job</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
            {jobs.map((job) => (
                <Card key={job.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">{job.title}</CardTitle>
                                <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center"><MapPin className="mr-1 h-3 w-3" /> {job.location || "Remote"}</span>
                                    <span className="flex items-center"><Briefcase className="mr-1 h-3 w-3" /> {job.type}</span>
                                    {job.salary && <span className="flex items-center"><DollarSign className="mr-1 h-3 w-3" /> {job.salary}</span>}
                                </div>
                            </div>
                            <Badge variant={job.status === "OPEN" ? "default" : "secondary"}>{job.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Posted on {new Date(job.postedAt).toLocaleDateString()}</span>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-destructive">Close</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
