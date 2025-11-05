import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Users, Sparkles, MessageSquare, Search } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">SkillSwap</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/auth">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Exchange Skills, Build Community
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Connect with fellow students to trade skills, learn together, and grow your campus network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="hero" className="group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-[var(--shadow-hover)] transition-all duration-300 bg-[var(--gradient-card)]">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
            <p className="text-muted-foreground">
              Sign up and list your skills to share with the community.
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-[var(--shadow-hover)] transition-all duration-300 bg-[var(--gradient-card)]">
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Skills</h3>
            <p className="text-muted-foreground">
              Browse offers and requests to find what you need or can provide.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-[var(--shadow-hover)] transition-all duration-300 bg-[var(--gradient-card)]">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect</h3>
            <p className="text-muted-foreground">
              Message other students directly to arrange skill exchanges.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-[var(--shadow-hover)] transition-all duration-300 bg-[var(--gradient-card)]">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Grow Together</h3>
            <p className="text-muted-foreground">
              Build your skills and strengthen your campus community.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-none">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of students already exchanging skills and building connections on campus.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="hero">
              Join SkillSwap
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 SkillSwap. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
