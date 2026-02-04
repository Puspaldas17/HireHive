import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Briefcase, DollarSign, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { JobPost } from "@/lib/types";

export function JobExplorer() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("All");
  const [remote, setRemote] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (location) params.append("location", location);
    if (type && type !== "All") params.append("type", type);
    if (remote) params.append("remote", "true");

    try {
      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly or just fetch on effect
    const timer = setTimeout(() => {
        fetchJobs();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, location, type, remote]);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Hero Search Section */}
      <div className="bg-muted py-12 px-6">
        <div className="container mx-auto max-w-4xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Find Your Next Dream Job</h1>
            <p className="text-lg text-muted-foreground">Browse thousands of job openings from top companies.</p>
          </div>

          <div className="bg-card p-4 rounded-lg shadow-sm border space-y-4 md:space-y-0 md:flex md:gap-4 items-end">
            <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Keywords</label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Job title, skills, or company" 
                        className="pl-9" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Location</label>
                <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="City or State" 
                        className="pl-9" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
            </div>

            <div className="w-[180px] space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="pb-2.5">
               <Button onClick={() => fetchJobs()} className="w-full md:w-auto">Search</Button>
            </div>
          </div>
          
           <div className="flex items-center space-x-2 justify-center">
              <Checkbox 
                id="remote-filter" 
                checked={remote}
                onCheckedChange={(c) => setRemote(c as boolean)}
              />
              <label htmlFor="remote-filter" className="text-sm font-medium leading-none cursor-pointer">
                Remote only
              </label>
            </div>
        </div>
      </div>

      {/* Job List */}
      <div className="container mx-auto max-w-5xl px-6 mt-12">
        <h2 className="text-2xl font-semibold mb-6">Latest Opportunities</h2>
        
        {isLoading ? (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-muted/50 rounded-lg animate-pulse" />
                ))}
            </div>
        ) : jobs.length === 0 ? (
            <div className="text-center py-20 border rounded-lg bg-card text-muted-foreground">
                <p>No jobs found matching your criteria.</p>
                <Button variant="link" onClick={() => { setSearch(''); setLocation(''); setType('All'); setRemote(false); }}>
                    Clear Filters
                </Button>
            </div>
        ) : (
            <div className="grid gap-4">
                {jobs.map((job) => (
                    <Link to={`/jobs/${job.id}`} key={job.id} className="block group">
                        <Card className="hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                            {job.title}
                                        </CardTitle>
                                        <div className="flex items-center text-muted-foreground font-medium">
                                            <Building className="mr-1 h-3 w-3" />
                                            {job.company?.name || "Unknown Company"}
                                        </div>
                                    </div>
                                    {job.postedAt && (
                                         <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(job.postedAt).toLocaleDateString()}
                                         </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                    <div className="flex items-center">
                                        <MapPin className="mr-1 h-4 w-4" />
                                        {job.remote ? "Remote" : job.location || "On-site"}
                                    </div>
                                    <div className="flex items-center">
                                        <Briefcase className="mr-1 h-4 w-4" />
                                        {job.type}
                                    </div>
                                    {job.salary && (
                                        <div className="flex items-center">
                                            <DollarSign className="mr-1 h-4 w-4" />
                                            {job.salary}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.split(',').slice(0, 4).map((skill, i) => (
                                        <Badge key={i} variant="secondary" className="rounded-sm font-normal">
                                            {skill.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
