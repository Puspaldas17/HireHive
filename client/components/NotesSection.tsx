import { useState, useCallback } from "react";
import { Note } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, X } from "lucide-react";

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (content: string, type: Note["type"]) => Promise<void>;
  isLoading?: boolean;
}

export function NotesSection({
  notes,
  onAddNote,
  isLoading = false,
}: NotesSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [type, setType] = useState<Note["type"]>("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddNote(content, type);
      setContent("");
      setType("general");
      setShowForm(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [content, type, onAddNote]);

  const getNoteTypeLabel = (type: Note["type"]) => {
    switch (type) {
      case "interview":
        return "Interview Note";
      case "followup":
        return "Follow-up";
      default:
        return "General Note";
    }
  };

  const getNoteTypeBadgeColor = (type: Note["type"]) => {
    switch (type) {
      case "interview":
        return "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300";
      case "followup":
        return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Note Form */}
      {showForm && (
        <div className="p-4 border border-border rounded-lg bg-muted/50 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="noteType">Note Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as Note["type"])}
            >
              <SelectTrigger id="noteType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Note</SelectItem>
                <SelectItem value="interview">Interview Note</SelectItem>
                <SelectItem value="followup">Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="noteContent">Note Content</Label>
            <Textarea
              id="noteContent"
              placeholder="Add your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? "Adding..." : "Add Note"}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${getNoteTypeBadgeColor(note.type)}`}
                >
                  {getNoteTypeLabel(note.type)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(note.createdAt)}
                </span>
              </div>
              <p className="text-foreground whitespace-pre-wrap text-sm">
                {note.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notes yet</p>
          </div>
        )}
      </div>

      {/* Add Note Button */}
      {!showForm && (
        <Button
          variant="outline"
          onClick={() => setShowForm(true)}
          disabled={isLoading}
          className="w-full"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      )}
    </div>
  );
}
