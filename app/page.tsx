import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Building2, Calendar, Users, Globe } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
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
            <Button>Schedule Consultation</Button>
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
              <Button size="lg" className="gap-2">
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
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Request Information</h2>
            <p className="text-gray-600 mt-2">Fill in the form below and we'll get back to you within 24 hours</p>
          </div>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" placeholder="+1 234 567 890" required />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="65" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Current Location</Label>
                <Input id="location" placeholder="New York, USA" />
              </div>
              <div>
                <Label htmlFor="country">Desired Country</Label>
                <Input id="country" placeholder="Thailand, Vietnam, Costa Rica..." />
              </div>
            </div>
            <div>
            <Label htmlFor="income">Monthly Retirement Income ($)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input 
                id="income" 
                type="number" 
                placeholder="5000" 
                className="pl-7"
                min="0"
                step="100"
              />
            </div>
          </div>
            <Button type="submit" size="lg" className="w-full gap-2">
              <ArrowRight className="w-4 h-4" /> Submit Request
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