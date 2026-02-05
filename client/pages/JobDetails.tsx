import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Building, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  ArrowLeft, 
  CheckCircle 
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../hooks/useAuth";
import { getJob, applyToJob, getJobApplications } from "../lib/api";
import { JobPost } from "../lib/types";
import { useToast } from "@/components/ui/use-toast";

export function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [job, setJob] = useState<JobPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    async function loadJob() {
      if (!id) return;
      try {
        const data = await getJob(id);
        setJob(data);

        if (user) {
            // Check if already applied
            // Ideally backend returns this info, or we check our applications list
            // For now, let's fetch applications and check.
            try {
                const apps = await getJobApplications(user.id); // Assuming user object has id
                const applied = apps.some(app => app.jobPostId === id);
                setHasApplied(applied);
            } catch (ignore) {
                // Ignore error checking applications (maybe not logged in fully or error)
            }
        }
      } catch (error) {
        toast({
            title: "Error",
            description: "Failed to load job details",
            variant: "destructive",
        });
        navigate("/jobs");
      } finally {
        setIsLoading(false);
      }
    }
    loadJob();
  }, [id, navigate, toast, user]);

  const handleApply = async () => {
    if (!job || !id) return;
    if (!user) {
        toast({
            title: "Authentication required",
            description: "Please login to apply for jobs",
        });
        navigate("/login");
        return;
    }

    setIsApplying(true);
    try {
        await applyToJob(id);
        setHasApplied(true);
        toast({
            title: "Success",
            description: "Application submitted successfully!",
        });
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Failed to apply",
            variant: "destructive",
        });
    } finally {
        setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="container mx-auto max-w-4xl p-10 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container mx-auto max-w-4xl p-6 py-10 flex-1">
      <Button variant="ghost" className="mb-6 pl-0" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
      </Button>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
                <div className="flex items-center text-muted-foreground mt-2 font-medium">
                    <Building className="mr-2 h-4 w-4" />
                    {job.company?.name || "Unknown Company"} 
                    {job.company?.location && <span className="mx-2">•</span>}
                    {job.company?.location}
                </div>
            </div>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Job Description</h3>
                    <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm text-muted-foreground">
                        {job.description}
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                         {job.skills.split(',').map((skill, i) => (
                            <Badge key={i} variant="secondary">
                                {skill.trim()}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <Briefcase className="mr-3 h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Job Type</p>
                                <p className="text-sm text-muted-foreground">{job.type}</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <MapPin className="mr-3 h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Location</p>
                                <p className="text-sm text-muted-foreground">
                                    {job.remote ? "Remote" : job.location || "On-site"}
                                </p>
                            </div>
                        </div>
                        {job.salary && (
                            <div className="flex items-start">
                                <DollarSign className="mr-3 h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Salary</p>
                                    <p className="text-sm text-muted-foreground">{job.salary}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start">
                             <CheckCircle className="mr-3 h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Posted</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(job.postedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <Button 
                            className="w-full text-lg py-6" 
                            onClick={handleApply}
                            disabled={isApplying || hasApplied || user?.role === 'recruiter'}
                        >
                            {hasApplied ? "Applied" : isApplying ? "Applying..." : "Apply Now"}
                        </Button>
                        {user?.role === 'recruiter' && (
                             <p className="text-xs text-center mt-2 text-muted-foreground">Recruiters cannot apply</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
