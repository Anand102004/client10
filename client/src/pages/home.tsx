import { Link } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Clock3,
  HeartHandshake,
  MapPin,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const infrastructureFeatures = [
  {
    number: "01",
    text: "Chennai's first centrally air conditioned study hall with ample LED lighting.",
    images: ["/gallery/real-1.png", "/ai/infra-layout.svg", "/ai/infra-focus.svg"],
  },
  {
    number: "02",
    text: "Comfortable individual cubical with dual-power sockets along with book shelf and foot rest.",
    images: ["/ai/infra-focus.svg", "/gallery/real-1.png", "/ai/infra-mentor.svg"],
  },
  {
    number: "03",
    text: "Height/tilt adjustment executive rolling chairs with lumbar support for comfort over extended periods.",
    images: ["/ai/infra-mentor.svg", "/ai/infra-layout.svg", "/gallery/real-1.png"],
  },
  {
    number: "04",
    text: "Seamless high speed wi-fi all over the hall via Ubiquity network enterprise access points.",
    images: ["/ai/infra-layout.svg", "/ai/infra-focus.svg", "/ai/infra-mentor.svg"],
  },
  {
    number: "05",
    text: "Servo stabilizer/Spike buster to protect E-gadgets along with UPS backup and inverter for lighting.",
    images: ["/ai/infra-focus.svg", "/gallery/real-1.png", "/ai/infra-layout.svg"],
  },
  {
    number: "06",
    text: "Spacious dining area and Seperate discussion hall available.",
    images: ["/gallery/real-1.png", "/ai/infra-mentor.svg", "/ai/infra-focus.svg"],
  },
  {
    number: "07",
    text: "Student lockers available at reasonable fees for storing books & other belongings.",
    images: ["/ai/infra-layout.svg", "/gallery/real-1.png", "/ai/infra-mentor.svg"],
  },
  {
    number: "08",
    text: "RO water purifier for healthy drinking water.",
    images: ["/ai/infra-mentor.svg", "/ai/infra-layout.svg", "/gallery/real-1.png"],
  },
];

const galleryItems = [
  { src: "/gallery/real-1.png", title: "Quiet Discussion Hall", category: "Study", span: "is-wide is-tall" },
  { src: "/ai/gallery-1.svg", title: "Premium Cabin Zone", category: "Cabin", span: "" },
  { src: "/ai/gallery-2.svg", title: "Dedicated Study Bay", category: "Study", span: "" },
  { src: "/ai/gallery-3.svg", title: "Silent Work Wing", category: "Lighting", span: "is-tall" },
  { src: "/ai/gallery-4.svg", title: "Academic Collaboration", category: "Comfort", span: "" },
  { src: "/ai/gallery-5.svg", title: "Reading & Review Corner", category: "Study", span: "" },
  { src: "/ai/gallery-6.svg", title: "Executive Workspace", category: "Cabin", span: "is-wide" },
  { src: "/gallery/why-choose-us.png", title: "Premium Front Lounge", category: "Comfort", span: "" },
  { src: "/ai/infra-layout.svg", title: "Seat Planning Layout", category: "Lighting", span: "" },
];

const whyChooseItems = [
  {
    icon: Clock3,
    title: "Less Time in the Chair",
    text: "Optimized seating and focused ambience help you stay productive without fatigue.",
    tone: "is-blue",
  },
  {
    icon: HeartHandshake,
    title: "More Efficient",
    text: "Well-planned layout and amenities reduce distractions and improve output.",
    tone: "is-violet",
  },
  {
    icon: Zap,
    title: "Longer Lasting",
    text: "Power backup and reliable infrastructure keep your sessions uninterrupted.",
    tone: "is-coral",
  },
  {
    icon: Shield,
    title: "More Comfortable Experience",
    text: "Ergonomic seating and calm surroundings support extended study hours.",
    tone: "is-green",
  },
];

function HeroSection() {
  return (
    <section id="home" className="pr-hero-wrap pr-section-reveal pr-grand-section">
      <video
        className="pr-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src="https://firebasestorage.googleapis.com/v0/b/lite-learning-lab.appspot.com/o/Hotel%20Management%2FVideo.mp4?alt=media&token=7e8dabed-a7fa-4d26-906e-0944676ee384"
          type="video/mp4"
        />
      </video>
      <div className="pr-hero-overlay" />
      <div className="pr-hero-orb pr-hero-orb-a" />
      <div className="pr-hero-orb pr-hero-orb-b" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          <div className="space-y-7 pr-fade-up">
            <p className="pr-pill pr-pill-light">
              <Sparkles className="h-4 w-4" />
              White & Blue Premium Study Experience
            </p>
            <h1 className="text-4xl md:text-6xl leading-tight text-white">
              PR Study Hall
              <span className="block text-white">where discipline meets excellence.</span>
            </h1>
            <p className="text-[#e7efff] text-lg max-w-xl leading-relaxed">
              Premium infrastructure, calm atmosphere, and a high-performance ecosystem built for aspirants who study
              seriously.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="pr-btn-primary rounded-full px-8 h-12">
                <a href="#contact">Book a Seat</a>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8 h-12 border-white text-white bg-transparent hover:bg-white/10">
                <a href="#gallery">View Gallery</a>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-lg">
              {[
                { value: "24/7", label: "Access" },
                { value: "500+", label: "Students" },
                { value: "98%", label: "Renewal" },
              ].map((item, index) => (
                <div key={item.label} className="pr-stat-box" style={{ animationDelay: `${index * 0.1}s` }}>
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="text-xs tracking-[0.15em] uppercase text-[#d9e5ff]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="pr-section pr-section-reveal pr-grand-section pr-about-shell">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <article className="pr-about-card pr-fade-up">
          <header className="pr-about-topbar">
            <p className="pr-about-brand">PR Study Hall</p>
            <nav className="pr-about-nav">
              <span>Home</span>
              <span>Our Products</span>
              <span>About us</span>
              <span>How it works?</span>
              <span>Contact us</span>
            </nav>
            <span className="pr-about-search">⌕</span>
          </header>

          <div className="pr-about-layout">
            <div className="pr-about-copy">
              <h2 className="pr-about-title">ABOUT US</h2>
              <p className="pr-about-text">
                PR Study Hall is a premium academic space built for learners who want uninterrupted concentration,
                comfort-first seating, and a disciplined study routine.
              </p>
              <p className="pr-about-text">
                We combine a calm environment, reliable infrastructure, and professional support to help students stay
                consistent and perform better every day.
              </p>
              <Button asChild className="pr-about-btn">
                <a href="#contact">LEARN MORE</a>
              </Button>
            </div>

            <div className="pr-about-visual">
              <div className="pr-about-blob pr-about-blob-a" />
              <div className="pr-about-blob pr-about-blob-b" />
              <img src="/gallery/about-us.jpg" alt="PR Study Hall team and students" className="pr-about-image" loading="lazy" />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function InfrastructureSection() {
  return (
    <section id="infrastructure" className="pr-section pr-section-reveal pr-grand-section pr-infra-sheet-wrap">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pr-infra-sheet pr-fade-up">
          <div className="pr-infra-corner pr-infra-corner-tl" />
          <div className="pr-infra-corner pr-infra-corner-br" />

          <div className="pr-infra-brand">
            <img src="/pr-studyhall-logo.png" alt="PR Study Hall" className="pr-infra-brand-logo" />
            <div>
              <p className="pr-infra-brand-name">PARVATHY RAMASWAMY</p>
              <h2 className="pr-infra-brand-title">STUDY HALL</h2>
              <p className="pr-infra-brand-tagline">IMPOSSIBLE IS JUST AN OPINION</p>
            </div>
          </div>

          <div className="pr-infra-ribbon-wrap">
            <span className="pr-infra-ribbon-dot" />
            <h3 className="pr-infra-ribbon">OUR INFRASTRUCTURE</h3>
            <span className="pr-infra-ribbon-dot" />
          </div>

          <div className="pr-infra-grid">
            {infrastructureFeatures.map((item, index) => {
              const isRight = index % 2 !== 0;
              return (
                <article key={item.number} className={`pr-infra-row ${isRight ? "is-right" : ""}`}>
                  <div className="pr-infra-copy">
                    <p className="pr-infra-number">{item.number}</p>
                    <p className="pr-infra-text">{item.text}</p>
                  </div>

                  <div className="pr-infra-gallery">
                    <div className="pr-infra-main">
                      <img src={item.images[0]} alt={`Infrastructure feature ${item.number}`} loading="lazy" />
                    </div>
                    <div className="pr-infra-thumb pr-infra-thumb-a">
                      <img src={item.images[1]} alt="" loading="lazy" aria-hidden="true" />
                    </div>
                    <div className="pr-infra-thumb pr-infra-thumb-b">
                      <img src={item.images[2]} alt="" loading="lazy" aria-hidden="true" />
                    </div>
                    <span className="pr-infra-chip pr-infra-chip-dark" />
                    <span className="pr-infra-chip pr-infra-chip-cyan" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  return (
    <section id="why-choose" className="pr-section pr-section-reveal pr-grand-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <article className="pr-why-panel pr-fade-up">
          <h2 className="pr-why-title">Why Choose Us?</h2>
          <div className="pr-why-grid">
            <div className="pr-why-list">
              {whyChooseItems.map((item, i) => (
                <div className={`pr-why-item ${item.tone}`} key={item.title} style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className="pr-why-item-icon">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="pr-why-item-title">{item.title}</h3>
                    <p className="pr-why-item-text">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pr-why-photo-wrap">
              <div className="pr-why-photo-accent" />
              <img src="/gallery/why-choose-us.png" alt="Students in premium study hall setup" className="pr-why-photo" loading="lazy" />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function CompanySection() {
  return (
    <section id="company" className="pr-section pr-section-soft pr-section-reveal pr-grand-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Vision", text: "To be the most trusted premium study destination for ambitious aspirants." },
            { title: "Mission", text: "Create disciplined, distraction-free spaces that improve academic outcomes." },
            { title: "Values", text: "Consistency, professionalism, respect, focus and growth." },
          ].map((item, i) => (
            <Card key={item.title} className="pr-feature-clean pr-fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <CardHeader>
                <CardTitle className="text-3xl text-[#123f87]">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#4e75b5]">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const filters = ["View all", "Study", "Cabin", "Lighting", "Comfort"];
  const [activeFilter, setActiveFilter] = useState("View all");
  const visibleItems = activeFilter === "View all"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="pr-section pr-section-reveal pr-grand-section pr-gallery-classic-wrap">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <article className="pr-gallery-classic pr-fade-up">
          <header className="pr-gallery-head">
            <p className="pr-gallery-brand">PR Study Hall</p>
            <div className="pr-gallery-mini-nav" aria-hidden="true">
              <span>Portfolio</span>
              <span>Designers</span>
              <span>Premium Halls</span>
            </div>
            <h2 className="pr-gallery-classic-title">Inspirations</h2>
            <div className="pr-gallery-filter-row">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`pr-gallery-filter-btn ${activeFilter === filter ? "is-active" : ""}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </header>

          <div className="pr-gallery-grid">
            {visibleItems.map((item, index) => (
              <article key={`${item.src}-${item.title}`} className={`pr-gallery-card-premium ${item.span}`} style={{ animationDelay: `${index * 0.05}s` }}>
                <img src={item.src} alt={item.title} className="pr-gallery-photo-premium" loading="lazy" />
                <div className="pr-gallery-overlay">
                  <p className="pr-gallery-tag">{item.category}</p>
                  <h3 className="pr-gallery-card-title">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function ContactSection() {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", course: "", preferredSlot: "5_hours" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setTimeout(() => {
      toast({ title: "Enquiry Submitted", description: "Demo mode: UI-only submission saved locally." });
      setFormData({ name: "", email: "", phone: "", course: "", preferredSlot: "5_hours" });
      setIsPending(false);
    }, 700);
  };

  return (
    <section id="contact" className="pr-section pr-section-soft pr-section-reveal pr-grand-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="pr-clean-card pr-fade-up">
            <CardHeader>
              <CardDescription className="pr-kicker">Contact Us</CardDescription>
              <CardTitle className="text-4xl text-[#123f87]">Reserve your seat today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-[#4a72b2]">
              <p>Start your focused study journey in our premium learning space.</p>
              <p className="inline-flex items-center gap-2"><MapPin className="h-5 w-5 text-[#1c57ab]" />123 Education Lane, Knowledge City</p>
              <p className="inline-flex items-center gap-2"><Users className="h-5 w-5 text-[#1c57ab]" />+91 90000 12345</p>
            </CardContent>
          </Card>

          <Card className="pr-clean-card pr-fade-up" style={{ animationDelay: "0.15s" }}>
            <CardHeader>
              <CardTitle className="text-[#123f87]">Send Enquiry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input required placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="pr-input" />
                  <Input required placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="pr-input" />
                </div>
                <Input type="email" required placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pr-input" />
                <Input placeholder="Course / Exam Focus" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} className="pr-input" />
                <select value={formData.preferredSlot} onChange={(e) => setFormData({ ...formData, preferredSlot: e.target.value })} className="pr-input">
                  <option value="3_hours">3 Hours</option>
                  <option value="5_hours">5 Hours</option>
                  <option value="15_hours">15 Hours</option>
                </select>
                <Button type="submit" className="pr-btn-primary w-full h-11" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit Enquiry"}
                  {!isPending && <ArrowRight className="h-4 w-4 ml-2" />}
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
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".pr-section-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#123f87] pr-luxury-ui">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1f3a86]/86 backdrop-blur-md border-b border-[#2f4d9f] pr-grand-header">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#home" className="inline-flex items-center gap-3 pr-logo-chip">
            <img src="/pr-studyhall-logo.png" alt="PR Study Hall" className="h-12 w-12 object-contain" />
            <span className="text-[#123f87] font-semibold tracking-[0.2em] text-xs sm:text-sm">PR STUDY HALL</span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm text-white">
            <a href="#about" className="pr-nav-link">About</a>
            <a href="#infrastructure" className="pr-nav-link">Infrastructure</a>
            <a href="#why-choose" className="pr-nav-link">Why Choose</a>
            <a href="#company" className="pr-nav-link">Company</a>
            <a href="#gallery" className="pr-nav-link">Gallery</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">Log In</Button>
            </Link>
            <Button asChild className="hidden sm:inline-flex pr-btn-primary rounded-full px-6">
              <a href="#contact">Enroll</a>
            </Button>
          </div>
        </div>
      </header>

      <HeroSection />
      <WhyChooseSection />
     
      <InfrastructureSection />
      
      <CompanySection />
       <AboutSection />
      <GallerySection />
      <ContactSection />

      <footer className="border-t border-[#d9e8fd] py-8 text-center text-[#5a80ba] text-sm">
        <p>&copy; {new Date().getFullYear()} PR Study Hall. All rights reserved.</p>
      </footer>
    </div>
  );
}
