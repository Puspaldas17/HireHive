import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Loader,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  getJobApplication,
  deleteJobApplication,
  addNoteToApplication,
} from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { JobApplication, Note } from "../lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { StatusBadge } from "../components/StatusBadge";
import { formatDate } from "../lib/utils";
import { ActivityTimeline } from "../components/ActivityTimeline";
import { NotesSection } from "../components/NotesSection";
import { InterviewNotesForm } from "../components/InterviewNotesForm";

export default function ApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInterviewForm, setShowInterviewForm] = useState(false);

  useEffect(() => {
    const loadApplication = async () => {
      if (!user || !id) {
        toast({
          title: "Error",
          description: "You must be logged in to view an application",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      try {
        const app = await getJobApplication(user.id, id);
        if (!app) {
          toast({
            title: "Error",
            description: "Application not found",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        setApplication(app);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load application",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadApplication();
  }, [user, id, navigate, toast]);

  const handleDelete = async () => {
    if (!user || !id) return;

    setIsDeleting(true);
    try {
      const success = await deleteJobApplication(user.id, id);
      if (success) {
        toast({
          title: "Success",
          description: "Application deleted successfully",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete application",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddNote = useCallback(
    async (content: string, type: Note["type"]) => {
      if (!user || !id) return;

      try {
        const updated = await addNoteToApplication(user.id, id, content, type);
        if (updated) {
          setApplication(updated);
          toast({
            title: "Success",
            description: "Note added successfully",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add note",
          variant: "destructive",
        });
      }
    },
    [user, id, toast],
  );

  const handleAddInterviewNotes = useCallback(
    async (content: string) => {
      await handleAddNote(content, "interview");
      setShowInterviewForm(false);
    },
    [handleAddNote],
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!application) {
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
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Application Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The application you're looking for doesn't exist.
          </p>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </Layout>
    );
  }

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

      <div className="max-w-4xl">
        {/* Header with Title and Actions */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {application.company}
            </h1>
            <p className="text-lg text-muted-foreground">
              {application.jobRole}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/edit-application/${id}`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Application</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this application? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-3 mt-6">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-8">
          <StatusBadge status={application.status} />
        </div>

        {/* Main Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Basic Info */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Application Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Applied On</p>
                <p className="text-foreground font-medium">
                  {formatDate(application.applicationDate)}
                </p>
              </div>
              {application.interviewDate && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Interview Date
                  </p>
                  <p className="text-foreground font-medium">
                    {formatDate(application.interviewDate)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-foreground font-medium">
                  {formatDate(application.lastUpdated)}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">
              Additional Information
            </h2>
            <div className="space-y-4">
              {application.salary && (
                <div>
                  <p className="text-sm text-muted-foreground">Salary Range</p>
                  <p className="text-foreground font-medium">
                    {application.salary}
                  </p>
                </div>
              )}
              {application.jobUrl && (
                <div>
                  <p className="text-sm text-muted-foreground">Job Posting</p>
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    View Job Post
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Notes Section */}
        {application.notes && (
          <div className="rounded-lg border border-border bg-card p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            <p className="text-foreground whitespace-pre-wrap">
              {application.notes}
            </p>
          </div>
        )}

        {/* Status History */}
        {application.statusHistory && application.statusHistory.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Status History</h2>
            <div className="space-y-3">
              {application.statusHistory.map((entry, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <span className="text-foreground font-medium">
                      {entry.status}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      ({formatDate(entry.changedAt)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className="rounded-lg border border-border bg-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Notes</h2>
            {(application.status === "Interview" ||
              application.status === "Offer") &&
              !showInterviewForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInterviewForm(true)}
                >
                  Add Interview Notes
                </Button>
              )}
          </div>
          <NotesSection
            notes={application.notesList || []}
            onAddNote={handleAddNote}
          />
        </div>

        {/* Activity Timeline */}
        {application.activities && application.activities.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
            <ActivityTimeline activities={application.activities} />
          </div>
        )}

        {/* Interview Notes Form Modal */}
        {showInterviewForm && (
          <InterviewNotesForm
            onSubmit={handleAddInterviewNotes}
            onClose={() => setShowInterviewForm(false)}
          />
        )}
      </div>
    </Layout>
  );
}
