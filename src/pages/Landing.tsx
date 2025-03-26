import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sprout,
  Shield,
  LineChart,
  AlertTriangle,
  Cloud,
  Droplets,
  ImagePlus,
  Calculator,
  Bell,
  BarChart,
  ChevronRight
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Gradient Overlay on Image */}
      <header className="relative overflow-hidden bg-[#1f3c26]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f3c26] via-[#1f3c26]/90 to-transparent z-10"></div>
          <img
            src="/plant.jpg"
            alt="Healthy Tomato Plants"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 py-6">
          <nav className="flex justify-between items-center mb-10">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full flex items-center justify-center shadow-lg">
                <img
                  src="/tomato.svg"
                  alt="Tomato Expert Logo"
                  className="w-14 h-17"
                />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-white tracking-tight">
                Tomato Expert
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-white hover:text-white/80">
                Login
              </Link>
              <Button
                asChild
                className="bg-[#e84e25] text-white hover:bg-[#c93d17] border-none shadow-md"
              >
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          </nav>

          <div className="flex flex-col lg:flex-row items-center justify-between py-16">
            <div className="lg:w-3/5 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                Protect Your Tomato Crops <br />
                <span className="text-[#e84e25]">
                  From Blight Before It Strikes
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-xl leading-relaxed">
                Our AI-powered Early and Late Blight Assessment System combines
                environmental monitoring, disease prediction, and image analysis
                to protect your harvest and maximize your yield.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#e84e25] text-white hover:bg-[#c93d17] shadow-lg border-none"
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Key Benefits */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#f9f1ec] rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-[#e84e25]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1f3c26] mb-2">
                Early Detection
              </h3>
              <p className="text-gray-600">
                Identify disease risks up to 7 days before symptoms appear,
                giving you time to take preventive action
              </p>
            </div>
            <div className="p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#f9f1ec] rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-[#1f3c26]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1f3c26] mb-2">
                Reduced Crop Loss
              </h3>
              <p className="text-gray-600">
                Minimize yield loss with preemptive treatment recommendations
                customized to your farm's conditions
              </p>
            </div>
            <div className="p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#f9f1ec] rounded-full flex items-center justify-center">
                <BarChart className="h-8 w-8 text-[#e84e25]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1f3c26] mb-2">
                95% Accuracy
              </h3>
              <p className="text-gray-600">
                AI-powered diagnosis combining environmental factors and image
                analysis for reliable results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 bg-[#f9f9f7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#1f3c26]">
              Comprehensive Blight Management System
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our integrated approach combines multiple data sources and
              AI-powered analysis to provide complete protection against early
              and late blight diseases.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="rounded-full bg-[#e8f4ea] p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <Cloud className="h-8 w-8 text-[#1f3c26]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#1f3c26]">
                  Weather Data Integration
                </h3>
                <p className="text-gray-600">
                  Real-time analysis of temperature, humidity, and rainfall data
                  via OpenWeather API to assess disease-conducive conditions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="rounded-full bg-[#e8f4ea] p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <Droplets className="h-8 w-8 text-[#1f3c26]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#1f3c26]">
                  Soil Moisture Analysis
                </h3>
                <p className="text-gray-600">
                  Optional sensor integration provides additional data points
                  for enhanced prediction accuracy in various farm conditions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="rounded-full bg-[#e8f4ea] p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <Calculator className="h-8 w-8 text-[#1f3c26]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#1f3c26]">
                  Cumulative Risk Index
                </h3>
                <p className="text-gray-600">
                  Proprietary algorithm tracks sustained exposure to
                  disease-conducive conditions with weighted environmental
                  factors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="rounded-full bg-[#f9e8e5] p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <ImagePlus className="h-8 w-8 text-[#e84e25]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#1f3c26]">
                  AI-Guided Diagnosis
                </h3>
                <p className="text-gray-600">
                  Gemini 2.0 Flash model analyzes uploaded plant images to
                  detect early symptoms invisible to the human eye.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="rounded-full bg-[#f9e8e5] p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <LineChart className="h-8 w-8 text-[#e84e25]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#1f3c26]">
                  Symptom Onset Prediction
                </h3>
                <p className="text-gray-600">
                  Advanced algorithms estimate when symptoms will appear, giving
                  you a precise timeline for preventive action.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="rounded-full bg-[#f9e8e5] p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-[#e84e25]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#1f3c26]">
                  Smart Notifications
                </h3>
                <p className="text-gray-600">
                  Receive timely, actionable alerts with specific
                  recommendations tailored to your crop's current conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section - Completely Redesigned */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-[#f9f1ec] opacity-50 -skew-x-12 transform origin-top-right"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#1f3c26]">
              How Our System Protects Your Crops
            </h2>

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/3">
                  <div className="bg-[#1f3c26] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mx-auto">
                    1
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <h3 className="text-xl font-semibold mb-3 text-[#1f3c26]">
                    Continuous Data Collection
                  </h3>
                  <p className="text-gray-600">
                    Our system automatically gathers real-time weather data and
                    soil moisture readings (if available) from your farm
                    location.
                  </p>
                </div>
              </div>

              {/* Connector */}
              <div className="relative h-8 flex justify-center">
                <div className="absolute h-full w-0.5 bg-[#e84e25]"></div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/3">
                  <div className="bg-[#1f3c26] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mx-auto">
                    2
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <h3 className="text-xl font-semibold mb-3 text-[#1f3c26]">
                    Advanced Risk Analysis
                  </h3>
                  <p className="text-gray-600">
                    Our AI analyzes collected data to calculate the Cumulative
                    Risk Index (CRI), identifying potential disease outbreaks
                    before visible symptoms appear.
                  </p>
                </div>
              </div>

              {/* Connector */}
              <div className="relative h-8 flex justify-center">
                <div className="absolute h-full w-0.5 bg-[#e84e25]"></div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/3">
                  <div className="bg-[#1f3c26] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mx-auto">
                    3
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <h3 className="text-xl font-semibold mb-3 text-[#1f3c26]">
                    Visual Symptom Validation
                  </h3>
                  <p className="text-gray-600">
                    When risk levels are elevated, the system prompts you to
                    upload plant images for AI-powered analysis to confirm or
                    rule out disease presence.
                  </p>
                </div>
              </div>

              {/* Connector */}
              <div className="relative h-8 flex justify-center">
                <div className="absolute h-full w-0.5 bg-[#e84e25]"></div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/3">
                  <div className="bg-[#1f3c26] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mx-auto">
                    4
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <h3 className="text-xl font-semibold mb-3 text-[#1f3c26]">
                    Personalized Protection Plan
                  </h3>
                  <p className="text-gray-600">
                    Based on combined environmental and visual analysis, you
                    receive specific, time-sensitive treatment recommendations
                    tailored to your farm's unique conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1f3c26] py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-12 w-12 rounded-full flex items-center justify-center">
                <img
                  src="/tomato.svg"
                  alt="Tomato Expert Logo"
                  className="w-8 h-8"
                />
              </div>
              <h1 className="ml-3 text-2xl font-bold">Tomato Expert</h1>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <Link to="/" className="hover:text-[#e84e25] transition-colors">
                Home
              </Link>
              <Link
                to="/login"
                className="hover:text-[#e84e25] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-[#e84e25] transition-colors"
              >
                Sign Up
              </Link>
            </div>
            <div className="mt-6 md:mt-0">
              <p>
                &copy; {new Date().getFullYear()} Tomato Expert. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
