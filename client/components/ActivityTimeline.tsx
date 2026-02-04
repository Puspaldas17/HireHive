import { Activity } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  CheckCircle,
  Edit,
  MessageSquare,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityTimelineProps {
  activities: Activity[];
}

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "application_created":
      return <FileText className="h-4 w-4" />;
    case "status_change":
      return <CheckCircle className="h-4 w-4" />;
    case "note_added":
      return <MessageSquare className="h-4 w-4" />;
    case "interview_scheduled":
      return <Calendar className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "application_created":
      return "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400";
    case "status_change":
      return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400";
    case "note_added":
      return "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400";
    case "interview_scheduled":
      return "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400";
    default:
      return "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400";
  }
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No activities yet</p>
      </div>
    );
  }

  // Sort activities by timestamp (newest first)
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="space-y-4">
      {sortedActivities.map((activity, index) => (
        <div key={activity.id} className="flex gap-4">
          {/* Timeline connector */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "p-2 rounded-full",
                getActivityColor(activity.type),
              )}
            >
              {getActivityIcon(activity.type)}
            </div>
            {index < sortedActivities.length - 1 && (
              <div className="w-0.5 h-12 bg-border mt-2" />
            )}
          </div>

          {/* Activity content */}
          <div className="flex-1 pt-1 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-foreground">
                  {activity.description}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>

            {/* Display metadata if available */}
            {activity.metadata && activity.type === "status_change" && (
              <div className="mt-2 text-sm bg-muted/50 rounded p-2">
                <span className="text-muted-foreground">
                  {activity.metadata.from} → {activity.metadata.to}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
