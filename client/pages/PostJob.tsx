import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner"; // Assuming sonner is installed/used

export function PostJob() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      skills: formData.get("skills"),
      salary: formData.get("salary"),
      type: formData.get("type"), // Full-time, etc.
      location: formData.get("location"),
      remote: formData.get("remote") === "on",
    };

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create job");
      }

      toast.success("Job posted successfully!");
      navigate("/recruiter/dashboard");
    } catch (error) {
       toast.error("Error posting job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Post a New Job</h1>
        <p className="text-muted-foreground">Reach thousands of job seekers.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg bg-card">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input id="title" name="title" required placeholder="e.g. Senior Frontend Engineer" />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label htmlFor="type">Job Type</Label>
            <Select name="type" required defaultValue="Full-time">
                <SelectTrigger>
                <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
            </Select>
            </div>
            
            <div className="space-y-2">
            <Label htmlFor="salary">Salary Range (Optional)</Label>
            <Input id="salary" name="salary" placeholder="e.g. $100k - $120k" />
            </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="e.g. San Francisco, CA" />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="remote" name="remote" />
          <Label htmlFor="remote">This is a remote position</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">Required Skills</Label>
          <Input id="skills" name="skills" required placeholder="e.g. React, TypeScript, Node.js (comma separated)" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Job Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            required 
            placeholder="Detailed description of the role..." 
            className="min-h-[200px]"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Posting..." : "Post Job"}
          </Button>
        </div>
      </form>
    </div>
  );
}
