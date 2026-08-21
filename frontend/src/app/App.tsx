import { useState, useEffect } from "react";
import {
  Menu, X, Phone, MapPin, ArrowRight, Instagram, Facebook,
  Twitter, Linkedin, MessageCircle, Home, Tag, TrendingUp,
  Bed, Bath, Maximize2, Search, Star, ChevronRight, Mail,
} from "lucide-react";

/* ─── TypeScript Interfaces ───────────────────────────────── */

interface Property {
  id: number;
  badge: string;
  name: string;
  location: string;
  price: string;
  image: string;
  beds: number;
  baths: number;
  sqft: string;
}

interface Service {
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  initial: string;
  stars: number;
  quote: string;
}

interface Hero {
  heading: string;
  subheading: string;
  primary_cta_text: string;
}

interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

/* ─── Static Data (Filters & Nav) ─────────────────────────── */

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Properties", href: "#properties" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const LOCATIONS = ["Los Angeles, CA", "Miami Beach, FL", "New York, NY", "Beverly Hills, CA"];
const PROP_TYPES = ["All Properties", "Villa & Estate", "Penthouse", "Townhouse", "Condo"];
const PRICE_RANGES = ["Any Price", "$1M – $3M", "$3M – $6M", "$6M – $10M", "$10M+"];

/* ─── Component ───────────────────────────────────────────── */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [listingMode, setListingMode] = useState<"buy" | "rent">("buy");

  // --- Properly Typed State Variables ---
  const [properties, setProperties] = useState<Property[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [hero, setHero] = useState<Hero | null>(null);
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  
  // Form state for Contact
  const [formData, setFormData] = useState({ full_name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("");

  // --- Fetch Data from Django ---
  useEffect(() => {
    // 1. Fetch Properties
    fetch("http://localhost:8000/api/properties/")
      .then((res) => res.json())
      .then((data: Property[]) => setProperties(data))
      .catch((err) => console.error("Failed to load properties", err));

    // 2. Fetch Services
    fetch("http://localhost:8000/api/services/")
      .then((res) => res.json())
      .then((data: Service[]) => setServices(data))
      .catch((err) => console.error("Failed to load services", err));

    // 3. Fetch Testimonials
    fetch("http://localhost:8000/api/testimonials/")
      .then((res) => res.json())
      .then((data: Testimonial[]) => setTestimonials(data))
      .catch((err) => console.error("Failed to load testimonials", err));

    // 4. Fetch Hero Section
    fetch("http://localhost:8000/api/hero/")
      .then((res) => res.json())
      .then((data: Hero[]) => {
        if (data.length > 0) setHero(data[0]);
      })
      .catch((err) => console.error("Failed to load hero", err));

    // 5. Fetch Business Info (for Contact/Footer)
    fetch("http://localhost:8000/api/business/")
      .then((res) => res.json())
      .then((data: BusinessInfo[]) => {
        if (data.length > 0) setBusiness(data[0]);
      })
      .catch((err) => console.error("Failed to load business info", err));

    // Scroll listener
    const handler = () => setScrolled(window.scrollY > 72);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // --- Handle Contact Form Submission ---
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("Sending...");
    try {
      const res = await fetch("http://localhost:8000/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus("Message Sent!");
        setFormData({ full_name: "", email: "", message: "" });
      } else {
        setFormStatus("Error sending message.");
      }
    } catch (error) {
      setFormStatus("Error sending message.");
    }
  };

  // Helpers for Icons and Dynamic Links
  const getIconForService = (title: string) => {
    if (title.toLowerCase().includes("buy")) return Home;
    if (title.toLowerCase().includes("sell")) return Tag;
    return TrendingUp; 
  };
  
  // Format phone number for WhatsApp URL (removes spaces, dashes, parentheses)
  const waNumber = business?.phone.replace(/\D/g, '') || "18001234567";
  const mapsUrl = business ? `https://maps.google.com/?q=${encodeURIComponent(business.address)}` : "https://maps.google.com";

  return (
    <div className="bg-[#F8F5F0] text-[#2C2C2C] overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ═══════════════════════════════════════ NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#F8F5F0] border-b border-[#D4C9B8]" : "bg-transparent"}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14 flex items-center justify-between h-20">
          <a href="#home" className="flex items-center gap-2.5">
            <span className="text-[1.5rem] font-bold tracking-[0.18em] uppercase" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: scrolled ? "#1E3A2F" : "#F8F5F0", transition: "color 0.4s" }}>
              {business ? business.name : "NESTORA"}
            </span>
            <span className="w-[5px] h-[5px] rounded-full bg-[#B5945A] translate-y-[2px]" />
          </a>
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((lnk) => (
              <a key={lnk.label} href={lnk.href} className="text-[10.5px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 hover:text-[#B5945A]" style={{ color: scrolled ? "#2C2C2C" : "#F8F5F0" }}>{lnk.label}</a>
            ))}
            <a href="#properties" className="text-[10.5px] font-medium tracking-[0.2em] uppercase px-6 py-3 border border-[#B5945A] text-[#B5945A] hover:bg-[#B5945A] hover:text-white transition-all duration-300">View Properties</a>
          </div>
          <button aria-label="Toggle navigation" className="lg:hidden transition-colors" style={{ color: scrolled ? "#2C2C2C" : "#F8F5F0" }} onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════ HERO (DYNAMIC) */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center">
        <div className="absolute inset-0 bg-[#192820]">
          <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&h=1080&fit=crop&auto=format" alt="Grand luxury estate" className="w-full h-full object-cover opacity-50" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#192820]/90 via-[#192820]/55 to-[#192820]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#192820]/70 via-transparent to-[#192820]/30" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-14 w-full pt-32 pb-44">
          <p className="text-[#B5945A] text-[9.5px] tracking-[0.5em] uppercase font-medium mb-6">Luxury Real Estate</p>
          <h1 className="text-[2.8rem] sm:text-[3.8rem] lg:text-[5rem] font-bold text-[#F8F5F0] leading-[1.08] mb-6 max-w-3xl whitespace-pre-line" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {hero ? hero.heading : "Find a Place\nWorth Calling\nHome."}
          </h1>
          <p className="text-[#C5B8A4] text-[1.05rem] leading-relaxed mb-10 max-w-md font-light whitespace-pre-line">
            {hero ? hero.subheading : "Nestora connects discerning buyers with exceptional properties — curated with care, guided with expertise."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#properties" className="inline-flex items-center justify-center gap-3 bg-[#B5945A] text-white text-[10.5px] tracking-[0.22em] uppercase font-medium px-9 py-4 hover:bg-[#9E7E48] transition-colors duration-300">
              {hero ? hero.primary_cta_text : "Explore Properties"} <ArrowRight size={13} />
            </a>
            <a href="#contact" className="inline-flex items-center justify-center gap-3 border border-[#F8F5F0]/45 text-[#F8F5F0] text-[10.5px] tracking-[0.22em] uppercase font-medium px-9 py-4 hover:border-[#F8F5F0]/80 hover:bg-[#F8F5F0]/8 transition-all duration-300">Contact Us</a>
          </div>
        </div>

        {/* Search Panel */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 lg:px-14 translate-y-1/2">
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-white shadow-2xl shadow-black/20">
              <div className="flex border-b border-[#EDE7DC]">
                {(["buy", "rent"] as const).map((mode) => (
                  <button key={mode} onClick={() => setListingMode(mode)} className={`px-8 py-3.5 text-[9.5px] tracking-[0.25em] uppercase font-medium transition-colors border-b-2 -mb-px ${listingMode === mode ? "border-[#1E3A2F] text-[#1E3A2F]" : "border-transparent text-[#9A8E80] hover:text-[#2C2C2C]"}`}>{mode === "buy" ? "Buy" : "Rent"}</button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div className="px-6 py-5 border-b sm:border-b-0 lg:border-r border-[#EDE7DC]">
                  <p className="text-[8.5px] tracking-[0.35em] uppercase font-medium text-[#B5945A] mb-1.5">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-[#9A8E80] shrink-0" />
                    <select className="flex-1 text-[0.875rem] text-[#2C2C2C] bg-transparent border-0 outline-none cursor-pointer appearance-none">{LOCATIONS.map((l) => (<option key={l}>{l}</option>))}</select>
                  </div>
                </div>
                <div className="px-6 py-5 border-b sm:border-b-0 sm:border-r lg:border-r border-[#EDE7DC]">
                  <p className="text-[8.5px] tracking-[0.35em] uppercase font-medium text-[#B5945A] mb-1.5">Property Type</p>
                  <div className="flex items-center gap-2">
                    <Home size={12} className="text-[#9A8E80] shrink-0" />
                    <select className="flex-1 text-[0.875rem] text-[#2C2C2C] bg-transparent border-0 outline-none cursor-pointer appearance-none">{PROP_TYPES.map((t) => (<option key={t}>{t}</option>))}</select>
                  </div>
                </div>
                <div className="px-6 py-5 border-b sm:border-b-0 lg:border-r border-[#EDE7DC]">
                  <p className="text-[8.5px] tracking-[0.35em] uppercase font-medium text-[#B5945A] mb-1.5">Price Range</p>
                  <div className="flex items-center gap-2">
                    <Tag size={12} className="text-[#9A8E80] shrink-0" />
                    <select className="flex-1 text-[0.875rem] text-[#2C2C2C] bg-transparent border-0 outline-none cursor-pointer appearance-none">{PRICE_RANGES.map((p) => (<option key={p}>{p}</option>))}</select>
                  </div>
                </div>
                <button className="flex items-center justify-center gap-3 bg-[#1E3A2F] text-[#F8F5F0] text-[10.5px] tracking-[0.25em] uppercase font-medium px-6 py-5 hover:bg-[#264A39] transition-colors duration-300 group">
                  <Search size={14} /> Search Properties
                  <ChevronRight size={13} className="opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ FEATURED PROPERTIES (DYNAMIC) */}
      <section id="properties" className="pt-40 pb-28 bg-[#F8F5F0]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-5">
            <div>
              <p className="text-[#B5945A] text-[9.5px] tracking-[0.45em] uppercase font-medium mb-3">Curated Selection</p>
              <h2 className="text-[2.5rem] lg:text-[3.25rem] font-bold text-[#2C2C2C] leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Featured Properties</h2>
            </div>
            <a href="#" className="flex items-center gap-2 text-[10.5px] tracking-[0.2em] uppercase font-medium text-[#1E3A2F] border-b border-[#1E3A2F] pb-0.5 hover:text-[#B5945A] hover:border-[#B5945A] transition-colors w-fit">View All Properties <ArrowRight size={11} /></a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.length === 0 ? (
              <p className="text-[#7A7060] italic">Add properties in the Django Admin to see them here.</p>
            ) : (
              properties.map((prop) => (
                <article key={prop.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden bg-[#E8DDD0] aspect-[4/3] mb-0">
                    <img src={prop.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=680&fit=crop&auto=format"} alt={prop.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out" />
                    {prop.badge && (
                      <span className="absolute top-4 left-4 bg-white text-[#2C2C2C] text-[9px] tracking-[0.2em] uppercase font-medium px-3 py-1.5">{prop.badge}</span>
                    )}
                    <div className="absolute inset-0 bg-[#1E3A2F]/0 group-hover:bg-[#1E3A2F]/40 transition-colors duration-500 flex items-end justify-start p-5 opacity-0 group-hover:opacity-100">
                      <span className="text-[#F8F5F0] text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{prop.price}</span>
                    </div>
                  </div>
                  <div className="bg-white px-5 py-5 border-b border-x border-[#EDE7DC]">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3 className="text-[1.125rem] font-semibold text-[#2C2C2C] leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{prop.name}</h3>
                      <span className="text-[#1E3A2F] font-semibold text-[0.95rem] shrink-0" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{prop.price}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#7A7060] text-[0.8125rem] mb-4">
                      <MapPin size={11} /><span>{prop.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[9.5px] text-[#9A8E80] uppercase tracking-widest mb-4 pb-4 border-b border-[#EDE7DC]">
                      <span className="flex items-center gap-1.5"><Bed size={11} /> {prop.beds} Beds</span>
                      <span className="flex items-center gap-1.5"><Bath size={11} /> {prop.baths} Baths</span>
                      <span className="flex items-center gap-1.5"><Maximize2 size={11} /> {prop.sqft} ft²</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ ABOUT SECTION */}
      <section id="about" className="py-28 bg-[#EDE7DC]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -top-5 -left-5 right-10 bottom-10 border border-[#C9BAA5] hidden lg:block" />
              <div className="relative bg-[#1E3A2F] overflow-hidden" style={{ aspectRatio: "3 / 4" }}>
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&h=1200&fit=crop&auto=format"
                  alt="Elegant luxury interior with bespoke furnishings"
                  className="w-full h-full object-cover opacity-85 mix-blend-luminosity"
                />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#B5945A]" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#1E3A2F] px-7 py-5 hidden lg:block">
                <div className="text-3xl font-bold text-[#F8F5F0]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>850+</div>
                <div className="text-[9px] tracking-[0.3em] uppercase text-[#8AAF98] mt-0.5">Properties Sold</div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-[#B5945A] text-[9.5px] tracking-[0.45em] uppercase font-medium mb-3">Our Story</p>
              <h2 className="text-[2.4rem] lg:text-[3rem] font-bold text-[#2C2C2C] leading-tight mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>A Legacy Built<br />on Trust &amp; Excellence</h2>
              <p className="text-[#5A5040] text-[0.9375rem] leading-relaxed mb-4">
                Founded with a singular vision — to redefine the real estate experience — {business?.name || "NESTORA"} has spent over a decade matching exceptional people with exceptional properties.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-9 border-t border-[#C4B9A8] mt-12">
                {[
                  { value: "12+", label: "Years\nExperience" },
                  { value: "850+", label: "Properties\nSold" },
                  { value: "18", label: "Locations\nNationwide" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-[2.25rem] lg:text-[2.75rem] font-bold text-[#1E3A2F] leading-none mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{s.value}</div>
                    <div className="text-[9px] text-[#7A7060] uppercase tracking-widest leading-tight whitespace-pre-line">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ SERVICES (DYNAMIC) */}
      <section className="py-28 bg-[#1E3A2F]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="text-center mb-16">
            <p className="text-[#B5945A] text-[9.5px] tracking-[0.45em] uppercase font-medium mb-3">What We Offer</p>
            <h2 className="text-[2.5rem] lg:text-[3.25rem] font-bold text-[#F8F5F0]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Our Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2D5040]">
            {services.length === 0 ? (
              <p className="text-[#7AA890] italic col-span-3 text-center">Add services in the Django Admin to see them here.</p>
            ) : (
              services.map((service, i) => {
                const Icon = getIconForService(service.title);
                return (
                  <div key={i} className="group px-10 lg:px-14 py-12 hover:bg-[#234539] transition-colors duration-300 cursor-pointer">
                    <div className="w-11 h-11 border border-[#B5945A]/40 group-hover:border-[#B5945A] flex items-center justify-center mb-8 transition-colors duration-300">
                      <Icon size={18} className="text-[#B5945A]" />
                    </div>
                    <h3 className="text-[1.35rem] font-semibold text-[#F8F5F0] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{service.title}</h3>
                    <p className="text-[#7AA890] text-[0.875rem] leading-relaxed mb-8">{service.description}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ TESTIMONIALS (DYNAMIC) */}
      <section className="py-28 bg-[#F8F5F0]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="text-center mb-16">
            <p className="text-[#B5945A] text-[9.5px] tracking-[0.45em] uppercase font-medium mb-3">Client Stories</p>
            <h2 className="text-[2.5rem] lg:text-[3.25rem] font-bold text-[#2C2C2C]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>What Our Clients Say</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {testimonials.length === 0 ? (
              <p className="text-[#7A7060] italic col-span-2 text-center">Add testimonials in the Django Admin to see them here.</p>
            ) : (
              testimonials.map((t, i) => (
                <blockquote key={i} className="bg-[#F2EDE5] p-10 lg:p-12 relative">
                  <span className="absolute top-8 right-10 text-[6rem] leading-none text-[#E8DDD0] select-none" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>&ldquo;</span>
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: t.stars || 5 }).map((_, j) => (
                      <Star key={j} size={12} fill="#B5945A" className="text-[#B5945A]" />
                    ))}
                  </div>
                  <p className="text-[1.15rem] lg:text-[1.275rem] text-[#2C2C2C] leading-relaxed mb-8 italic relative z-10" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-4 pt-6 border-t border-[#D9CFC1]">
                    <div className="w-11 h-11 bg-[#1E3A2F] flex items-center justify-center shrink-0">
                      <span className="text-[#F8F5F0] text-base font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{t.initial}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2C2C2C] text-[0.875rem]">{t.name}</div>
                      <div className="text-[#7A7060] text-[0.75rem] mt-0.5">{t.role}</div>
                    </div>
                  </div>
                </blockquote>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ CONTACT / CTA (DYNAMIC API DATA) */}
      <section id="contact" className="relative">
        <div className="relative min-h-[620px] flex items-center">
          <div className="absolute inset-0 bg-[#1A2E22]">
            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&h=900&fit=crop&auto=format" alt="Stunning luxury home exterior" className="w-full h-full object-cover opacity-35" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A2E22]/90 via-[#1A2E22]/70 to-[#1A2E22]/50" />
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-14 w-full py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-[#B5945A] text-[9.5px] tracking-[0.45em] uppercase font-medium mb-5">Get in Touch</p>
                <h2 className="text-[2.5rem] lg:text-[3.5rem] font-bold text-[#F8F5F0] leading-tight mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Let&apos;s Find Your<br />Perfect Home.</h2>
                
                {/* DYNAMIC CONTACT BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3 flex-wrap mt-10">
                  <a href={`tel:${business?.phone || "+18001234567"}`} className="inline-flex items-center justify-center gap-2.5 bg-[#B5945A] text-white text-[10.5px] tracking-[0.2em] uppercase font-medium px-7 py-4 hover:bg-[#9E7E48] transition-colors duration-300">
                    <Phone size={13} /> Call Now
                  </a>
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2.5 bg-[#1FA544] text-white text-[10.5px] tracking-[0.2em] uppercase font-medium px-7 py-4 hover:bg-[#197E38] transition-colors duration-300">
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                  <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2.5 border border-[#F8F5F0]/45 text-[#F8F5F0] text-[10.5px] tracking-[0.2em] uppercase font-medium px-7 py-4 hover:border-[#F8F5F0]/80 hover:bg-[#F8F5F0]/8 transition-all duration-300">
                    <MapPin size={13} /> Directions
                  </a>
                </div>
              </div>

              {/* DYNAMIC FORM */}
              <form onSubmit={handleContactSubmit} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 lg:p-10">
                <h3 className="text-xl font-semibold text-[#F8F5F0] mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Quick Inquiry</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] tracking-[0.35em] uppercase text-[#9AB0A0] font-medium mb-2">Full Name</label>
                    <input type="text" required placeholder="Your full name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full bg-white/8 border border-white/15 text-[#F8F5F0] placeholder-[#6A8070] text-sm px-4 py-3 outline-none focus:border-[#B5945A] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[9px] tracking-[0.35em] uppercase text-[#9AB0A0] font-medium mb-2">Email Address</label>
                    <input type="email" required placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white/8 border border-white/15 text-[#F8F5F0] placeholder-[#6A8070] text-sm px-4 py-3 outline-none focus:border-[#B5945A] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[9px] tracking-[0.35em] uppercase text-[#9AB0A0] font-medium mb-2">Message</label>
                    <textarea required rows={3} placeholder="Tell us about your ideal property..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-white/8 border border-white/15 text-[#F8F5F0] placeholder-[#6A8070] text-sm px-4 py-3 outline-none focus:border-[#B5945A] transition-colors resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-[#B5945A] text-white text-[10.5px] tracking-[0.25em] uppercase font-medium py-4 hover:bg-[#9E7E48] transition-colors duration-300 flex items-center justify-center gap-2">
                    Send Inquiry <Mail size={13} />
                  </button>
                  {formStatus && (
                    <p className="text-[12px] text-center text-[#B5945A] mt-2">{formStatus}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ EXTENDED FOOTER (DYNAMIC) */}
      <footer className="bg-[#101A12] py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#1C2E1E]">

            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-[1.4rem] font-bold text-[#F8F5F0] tracking-[0.18em] uppercase" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {business ? business.name : "NESTORA"}
                </span>
                <span className="w-[5px] h-[5px] rounded-full bg-[#B5945A] translate-y-[2px]" />
              </div>
              <p className="text-[#4A6A54] text-[0.8125rem] leading-relaxed mb-7">
                Premium real estate services for those who demand more from their property journey. Est. 2013.
              </p>
              <div className="flex items-center gap-2.5">
                {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" aria-label="Social" className="w-8 h-8 border border-[#1C3020] flex items-center justify-center text-[#4A6A54] hover:border-[#B5945A] hover:text-[#B5945A] transition-colors duration-300">
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[#F8F5F0] text-[9px] tracking-[0.35em] uppercase font-medium mb-6">Navigation</h4>
              <ul className="space-y-3.5">
                {["Home", "Properties", "About Us", "Services", "Contact"].map((item) => (
                  <li key={item}><a href="#" className="text-[#4A6A54] text-[0.8125rem] hover:text-[#B5945A] transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[#F8F5F0] text-[9px] tracking-[0.35em] uppercase font-medium mb-6">Services</h4>
              <ul className="space-y-3.5">
                {["Buy Property", "Sell Property", "Property Investment", "Market Analysis"].map((item) => (
                  <li key={item}><a href="#" className="text-[#4A6A54] text-[0.8125rem] hover:text-[#B5945A] transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[#F8F5F0] text-[9px] tracking-[0.35em] uppercase font-medium mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-2.5 text-[#4A6A54] text-[0.8125rem]">
                  <MapPin size={13} className="shrink-0 mt-0.5" />
                  <span>{business ? business.address : "1420 Wilshire Blvd, Suite 800\nLos Angeles, CA 90017"}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={13} className="text-[#4A6A54] shrink-0" />
                  <a href={`tel:${business?.phone || "+18001234567"}`} className="text-[#4A6A54] text-[0.8125rem] hover:text-[#B5945A] transition-colors">
                    {business ? business.phone : "+1 (800) 123-4567"}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={13} className="text-[#4A6A54] shrink-0" />
                  <a href={`mailto:${business?.email || "hello@nestora.com"}`} className="text-[#4A6A54] text-[0.8125rem] hover:text-[#B5945A] transition-colors">
                    {business ? business.email : "hello@nestora.com"}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[#263A28] text-[0.75rem]">
              &copy; {new Date().getFullYear()} {business ? business.name : "Nestora"} Real Estate. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {["Privacy Policy", "Terms of Service"].map((link) => (
                <a key={link} href="#" className="text-[#263A28] text-[0.75rem] hover:text-[#4A6A54] transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <div className="contact-fab-group" aria-label="Quick contact options">
        <a href={`mailto:${business?.email || "hello@nestora.com"}`} className="contact-fab contact-fab-email" aria-label="Email Nestora" title="Email Nestora">
          <span className="contact-fab-tooltip" aria-hidden="true">Email us</span>
          <Mail size={18} strokeWidth={1.8} />
        </a>
        <a href={`tel:${business?.phone || "+18001234567"}`} className="contact-fab contact-fab-phone" aria-label="Call Nestora" title="Call Nestora">
          <span className="contact-fab-tooltip" aria-hidden="true">Call us</span>
          <Phone size={18} strokeWidth={1.8} />
        </a>
        <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="contact-fab contact-fab-whatsapp" aria-label="Message Nestora on WhatsApp" title="Message us on WhatsApp">
          <span className="contact-fab-tooltip" aria-hidden="true">WhatsApp</span>
          <MessageCircle size={19} strokeWidth={1.8} />
        </a>
      </div>
    </div>
  );
}