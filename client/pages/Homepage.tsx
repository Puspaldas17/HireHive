import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Header } from "../components/Header";
import {
  BarChart3,
  FileText,
  CheckCircle2,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function Homepage() {
  const features = [
    {
      icon: CheckCircle2,
      title: "Track Applications",
      description:
        "Keep track of all your job applications in one place with detailed status updates",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Visualize your job search progress with charts and statistics",
    },
    {
      icon: FileText,
      title: "Resume Management",
      description: "Upload and organize multiple versions of your resume",
    },
    {
      icon: Clock,
      title: "Interview Scheduling",
      description: "Keep track of interview dates and prepare accordingly",
    },
    {
      icon: TrendingUp,
      title: "Application Trends",
      description: "See your application activity over time with monthly trends",
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description:
        "Easily add, edit, and manage your applications with a few clicks",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-1 items-center bg-gradient-to-br from-primary/5 to-accent/5 px-4 py-24">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-5xl font-bold text-foreground md:text-6xl">
            Track Your Job Search Journey
          </h1>
          <p className="mt-6 text-xl text-muted-foreground md:text-2xl">
            JobTrack helps you stay organized and focused during your job
            search. Manage applications, track interviews, and analyze your
            progress all in one place.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
            <Link to="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-foreground">
              Everything You Need
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Powerful features designed to streamline your job search process
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary/5 px-4 py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">500+</div>
              <p className="mt-2 text-muted-foreground">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">50K+</div>
              <p className="mt-2 text-muted-foreground">Applications Tracked</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">95%</div>
              <p className="mt-2 text-muted-foreground">User Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">24/7</div>
              <p className="mt-2 text-muted-foreground">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-foreground">
              What Users Say
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xl">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-foreground">
                "JobTrack helped me organize my job search and land my dream
                role. The analytics feature really helped me understand my
                application patterns."
              </p>
              <p className="mt-4 font-semibold text-foreground">Sarah Johnson</p>
              <p className="text-sm text-muted-foreground">
                Senior Software Engineer
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xl">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-foreground">
                "The best job tracking app I've used. Simple, elegant, and
                packed with features. Highly recommended!"
              </p>
              <p className="mt-4 font-semibold text-foreground">Mike Chen</p>
              <p className="text-sm text-muted-foreground">
                Product Manager
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary px-4 py-24 text-center text-primary-foreground">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold">Ready to Organize Your Job Search?</h2>
          <p className="mt-4 text-lg opacity-90">
            Join hundreds of job seekers using JobTrack to manage their
            applications effectively.
          </p>
          <Link to="/auth/signup" className="mt-8 inline-block">
            <Button
              size="lg"
              variant="secondary"
              className="font-semibold"
            >
              Start Tracking Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted py-6 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 JobTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}
