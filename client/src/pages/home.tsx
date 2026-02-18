import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, CheckCircle2, Clock, MapPin, Users, Wifi, Coffee, Library } from "lucide-react";
import { useCreateEnquiry } from "@/hooks/use-crm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { insertEnquirySchema } from "@shared/schema";

// --- Hero Section ---
function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-32 lg:pt-32">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground font-display">
            Focus Better at <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Study Hall</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A premium co-study space designed for serious students and professionals. 
            High-speed WiFi, ergonomic seating, and a distraction-free environment to help you achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="rounded-full px-8 text-lg h-14 shadow-xl shadow-primary/20" asChild>
              <a href="#plans">View Plans</a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-lg h-14" asChild>
              <a href="#contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Features Section ---
function Features() {
  const features = [
    { icon: Wifi, title: "High-Speed WiFi", description: "Gigabit internet connection for uninterrupted research and lectures." },
    { icon: Coffee, title: "Coffee & Refreshments", description: "Unlimited premium coffee and tea to keep you energized." },
    { icon: Library, title: "Quiet Zones", description: "Strictly enforced silence zones for deep work and focus." },
    { icon: Clock, title: "Flexible Hours", description: "Open 24/7 to accommodate your unique study schedule." },
  ];

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-display mb-4">Why Choose Study Hall?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">We provide everything you need to be productive, so you can focus on what matters most.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <Card key={i} className="border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Pricing Section ---
function Pricing() {
  const plans = [
    { name: "3 Hours", price: "$15", period: "/day", features: ["Access for 3 hours", "Standard Seat", "WiFi Access"] },
    { name: "5 Hours", price: "$25", period: "/day", features: ["Access for 5 hours", "Standard Seat", "WiFi Access", "1 Coffee Included"], popular: true },
    { name: "15 Hours", price: "$60", period: "/day", features: ["Full Day Access", "Premium Reserved Seat", "Priority WiFi", "Unlimited Coffee", "Locker Access"] },
  ];

  return (
    <section id="plans" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-display mb-4">Simple, Flexible Pricing</h2>
          <p className="text-muted-foreground">Choose a plan that fits your study needs.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <Card key={i} className={`relative border-2 ${plan.popular ? 'border-primary shadow-xl scale-105' : 'border-border shadow-sm'} flex flex-col`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-xl" variant={plan.popular ? 'default' : 'outline'} asChild>
                  <a href="#contact">Select Plan</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Contact Form ---
function Contact() {
  const { mutate, isPending } = useCreateEnquiry();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", course: "", preferredSlot: "3_hours" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      mutate(formData, {
        onSuccess: () => {
          toast({ title: "Enquiry Sent!", description: "We will contact you shortly." });
          setFormData({ name: "", email: "", phone: "", course: "", preferredSlot: "3_hours" });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to send enquiry.", variant: "destructive" });
        }
      });
    } catch (err) {
        // Validation error
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-display mb-6">Ready to start studying?</h2>
            <p className="text-slate-300 mb-8 text-lg">
              Fill out the form to reserve your spot or ask any questions. We'll get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6 text-primary" />
                <span>123 Education Lane, Knowledge City</span>
              </div>
              <div className="flex items-center gap-4">
                <Users className="w-6 h-6 text-primary" />
                <span>(555) 123-4567</span>
              </div>
            </div>
          </div>
          <Card className="bg-white text-slate-900 border-none shadow-2xl">
            <CardHeader>
              <CardTitle>Send Enquiry</CardTitle>
              <CardDescription>We are accepting new students!</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input 
                      placeholder="John Doe" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input 
                      placeholder="(555) 123-4567" 
                      required 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course / Interest</label>
                  <Input 
                    placeholder="e.g. UPSC, JEE, General Study" 
                    value={formData.course}
                    onChange={e => setFormData({...formData, course: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Plan</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.preferredSlot}
                    onChange={e => setFormData({...formData, preferredSlot: e.target.value})}
                  >
                    <option value="3_hours">3 Hours</option>
                    <option value="5_hours">5 Hours</option>
                    <option value="15_hours">15 Hours (Full Day)</option>
                  </select>
                </div>
                <Button type="submit" className="w-full mt-2" disabled={isPending}>
                  {isPending ? "Sending..." : "Submit Enquiry"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen font-body">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl text-primary">
            <BookOpen className="h-8 w-8" />
            <span>Study Hall</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <a href="#" className="hover:text-primary transition-colors">Home</a>
            <a href="#plans" className="hover:text-primary transition-colors">Plans</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Button asChild className="hidden sm:flex">
              <a href="#contact">Join Now</a>
            </Button>
          </div>
        </div>
      </header>

      <Hero />
      <Features />
      <Pricing />
      <Contact />

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Study Hall. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
