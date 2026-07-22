"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Building2, Calendar, Users, Globe, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api-client";

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    current_location: "",
    retirement_status: "",
    monthly_income: "",
    desired_move_date: "",
    desired_country: "",
    budget: "",
    timeline: "",
    medical_requirements: "",
    family_info: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const scrollToForm = () => {
    document.getElementById('request-info')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Convert string values to proper types
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : null,
        current_location: formData.current_location || null,
        retirement_status: formData.retirement_status || null,
        monthly_income: formData.monthly_income ? parseFloat(formData.monthly_income) : null,
        desired_move_date: formData.desired_move_date || null,
        desired_country: formData.desired_country || null,
        budget: formData.budget || null,
        timeline: formData.timeline || null,
        medical_requirements: formData.medical_requirements || null,
        family_info: formData.family_info || null,
        lead_source: "landing_page",
      };

      await api.post("/api/leads", leadData);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        age: "",
        current_location: "",
        retirement_status: "",
        monthly_income: "",
        desired_move_date: "",
        desired_country: "",
        budget: "",
        timeline: "",
        medical_requirements: "",
        family_info: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-xl">
              RP
            </div>
            <span className="text-xl font-semibold text-gray-800">Retirees Paradise</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Staff Login</Button>
            </Link>
            <Button onClick={scrollToForm}>Schedule Consultation</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Your Dream Retirement Awaits
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
                Retirement Destination
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Discover top retirement destinations in Thailand, Vietnam, Costa Rica, and more.
              Get personalized guidance from our experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" onClick={scrollToForm}>
                <Calendar className="w-5 h-5" /> Request Information
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Building2 className="w-5 h-5" /> View Facilities
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Retirees Paradise?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <CardTitle>Global Locations</CardTitle>
                <CardDescription>Thailand, Vietnam, Costa Rica, Ecuador, Peru, and more</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Access to premium retirement communities across the world.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <CardTitle>Expert Guidance</CardTitle>
                <CardDescription>Personalized consultation and support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Our experts help you navigate every step of your retirement journey.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <CardTitle>Premium Facilities</CardTitle>
                <CardDescription>Luxury retirement communities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  World-class amenities and healthcare access at every location.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Request Information Form */}
      <section id="request-info" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Request Information</h2>
            <p className="text-gray-600 mt-2">Fill in the form below and we'll get back to you within 24 hours</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-700 font-medium">✅ Thank you! Your request has been submitted. We'll be in touch soon.</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone" 
                  placeholder="+1 234 567 890" 
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="65"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current_location">Current Location</Label>
                <Input 
                  id="current_location" 
                  placeholder="New York, USA"
                  value={formData.current_location}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="retirement_status">Retirement Status</Label>
                <Input 
                  id="retirement_status" 
                  placeholder="Retired / Planning / Considering"
                  value={formData.retirement_status}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthly_income">Monthly Retirement Income ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input 
                    id="monthly_income" 
                    type="number" 
                    placeholder="5000" 
                    className="pl-7"
                    min="0"
                    step="100"
                    value={formData.monthly_income}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="desired_move_date">Desired Move Date</Label>
                <Input 
                  id="desired_move_date" 
                  placeholder="January 2026"
                  value={formData.desired_move_date}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="desired_country">Desired Country</Label>
                <Input 
                  id="desired_country" 
                  placeholder="Thailand, Vietnam, Costa Rica..."
                  value={formData.desired_country}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Input 
                  id="budget" 
                  placeholder="e.g., $50,000 - $100,000"
                  value={formData.budget}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Input 
                id="timeline" 
                placeholder="e.g., 6 months, 1 year, flexible"
                value={formData.timeline}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="medical_requirements">Medical/Health Requirements</Label>
              <Input 
                id="medical_requirements" 
                placeholder="Any specific medical needs or health concerns"
                value={formData.medical_requirements}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="family_info">Family Information</Label>
              <Input 
                id="family_info" 
                placeholder="Will you be relocating with family members?"
                value={formData.family_info}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
              {loading ? (
                <>Submitting...</>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" /> Submit Request
                </>
              )}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center text-sm text-gray-500">
          <p>© 2026 Retirees Paradise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}