
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plant, Shield, LineChart, AlertTriangle, ChevronRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-plant to-plant-dark text-white">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-tomato flex items-center justify-center">
                <span className="text-white font-bold">TE</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-white">Tomato Expert</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-white hover:text-white/80">Login</Link>
              <Button asChild className="bg-white text-plant hover:bg-white/90">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          </nav>

          <div className="flex flex-col lg:flex-row items-center justify-between py-12">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Advanced Plant Disease Detection</h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-xl">
                Identify and treat plant diseases early with our AI-powered diagnostic tool. Protect your crops and maximize your yield.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-plant hover:bg-white/90">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/diagnosis">Try Demo</Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img 
                src="/placeholder.svg" 
                alt="Plant Disease Detection" 
                className="max-w-full h-auto rounded-lg shadow-xl" 
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Tomato Expert</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides everything you need to monitor and maintain plant health.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-plant/10 hover:border-plant/30 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-plant/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Plant className="h-6 w-6 text-plant" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Disease Detection</h3>
                <p className="text-muted-foreground">
                  AI-powered identification of common plant diseases from images.
                </p>
              </CardContent>
            </Card>

            <Card className="border-plant/10 hover:border-plant/30 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-warning/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Early Warnings</h3>
                <p className="text-muted-foreground">
                  Proactive alerts for potential disease outbreaks based on conditions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-plant/10 hover:border-plant/30 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-plant/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-plant" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Treatment Plans</h3>
                <p className="text-muted-foreground">
                  Customized recommendations to treat identified diseases effectively.
                </p>
              </CardContent>
            </Card>

            <Card className="border-plant/10 hover:border-plant/30 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-accent/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Field Insights</h3>
                <p className="text-muted-foreground">
                  Comprehensive analytics and tracking of plant health over time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to diagnose and treat plant diseases using our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-plant text-white w-12 h-12 flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Images</h3>
              <p className="text-muted-foreground">
                Take clear photos of affected plants and upload them to our platform.
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-plant text-white w-12 h-12 flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Diagnosis</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your images and provides an accurate disease diagnosis.
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-plant text-white w-12 h-12 flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply Treatment</h3>
              <p className="text-muted-foreground">
                Follow our customized treatment plans to restore plant health.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-plant hover:bg-plant-dark">
              <Link to="/register">
                Start Using Tomato Expert
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar py-12 text-sidebar-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-10 w-10 rounded-full bg-tomato flex items-center justify-center">
                <span className="text-white font-bold">TE</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold">Tomato Expert</h1>
            </div>
            <div className="flex space-x-8">
              <Link to="/" className="hover:text-white">Home</Link>
              <Link to="/diagnosis" className="hover:text-white">Diagnosis</Link>
              <Link to="/alerts" className="hover:text-white">Alerts</Link>
              <Link to="/insights" className="hover:text-white">Insights</Link>
            </div>
            <div className="mt-6 md:mt-0">
              <p>&copy; {new Date().getFullYear()} Tomato Expert. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
