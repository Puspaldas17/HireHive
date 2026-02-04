import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface InterviewNotesFormProps {
  onSubmit: (notes: string) => Promise<void>;
  onClose: () => void;
  isSubmitting?: boolean;
}

export function InterviewNotesForm({
  onSubmit,
  onClose,
  isSubmitting = false,
}: InterviewNotesFormProps) {
  const [interviewerName, setInterviewerName] = useState('');
  const [round, setRound] = useState('1');
  const [questionsAsked, setQuestionsAsked] = useState('');
  const [yourAnswers, setYourAnswers] = useState('');
  const [reflection, setReflection] = useState('');
  const [followUp, setFollowUp] = useState('');

  const handleSubmit = useCallback(async () => {
    const notesContent = `
INTERVIEW NOTES
================

Interviewer: ${interviewerName || 'Not specified'}
Round: ${round}

QUESTIONS ASKED:
${questionsAsked || 'No notes'}

YOUR ANSWERS:
${yourAnswers || 'No notes'}

REFLECTION:
${reflection || 'No notes'}

FOLLOW-UP ITEMS:
${followUp || 'No items'}
    `.trim();

    await onSubmit(notesContent);
  }, [interviewerName, round, questionsAsked, yourAnswers, reflection, followUp, onSubmit]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-background border border-border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Interview Notes Template</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interviewer">Interviewer Name</Label>
              <Input
                id="interviewer"
                placeholder="John Smith"
                value={interviewerName}
                onChange={(e) => setInterviewerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="round">Interview Round</Label>
              <Input
                id="round"
                placeholder="1"
                type="number"
                min="1"
                value={round}
                onChange={(e) => setRound(e.target.value)}
              />
            </div>
          </div>

          {/* Questions Asked */}
          <div className="space-y-2">
            <Label htmlFor="questions">Questions Asked</Label>
            <Textarea
              id="questions"
              placeholder="List the questions you were asked during the interview..."
              rows={4}
              value={questionsAsked}
              onChange={(e) => setQuestionsAsked(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Write each question on a new line
            </p>
          </div>

          {/* Your Answers */}
          <div className="space-y-2">
            <Label htmlFor="answers">Your Answers & Responses</Label>
            <Textarea
              id="answers"
              placeholder="Record how you answered each question and your key points..."
              rows={4}
              value={yourAnswers}
              onChange={(e) => setYourAnswers(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Include key examples, technical details, or stories you shared
            </p>
          </div>

          {/* Reflection */}
          <div className="space-y-2">
            <Label htmlFor="reflection">Your Reflection & Thoughts</Label>
            <Textarea
              id="reflection"
              placeholder="How do you think the interview went? What went well? What could be improved?"
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
          </div>

          {/* Follow-up */}
          <div className="space-y-2">
            <Label htmlFor="followup">Follow-up Items</Label>
            <Textarea
              id="followup"
              placeholder="Any action items, questions to send, or things to prepare for next round..."
              rows={3}
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : 'Save Interview Notes'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
