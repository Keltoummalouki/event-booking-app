"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";

// Mock data for featured events
const FEATURED_EVENTS = [
  {
    id: 1,
    title: "Tech Innovation Summit 2024",
    date: "Mars 15, 2024",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2670",
    category: "Technology",
    price: "From €150",
  },
  {
    id: 2,
    title: "Creative Arts Festival",
    date: "Avril 22, 2024",
    location: "Lyon, France",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=2670",
    category: "Art & Culture",
    price: "From €45",
  },
  {
    id: 3,
    title: "Future of Business Conference",
    date: "Mai 10, 2024",
    location: "Bordeaux, France",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=2670",
    category: "Business",
    price: "From €299",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-coral selection:text-white overflow-hidden">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-coral/10 rounded-full blur-[100px] animate-pulse-glow" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 text-coral text-sm font-medium mb-6 animate-reveal">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-coral"></span>
                  </span>
                  Premium Event Experience
                </div>

                <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-tight mb-6 text-navy dark:text-white tracking-tight-custom">
                  Connect. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-coral-hover">
                    Experience.
                  </span> <br />
                  Remember.
                </h1>

                <p className="text-lg lg:text-xl text-slate dark:text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Discover curated events that inspire, educate, and entertain.
                  Booking your next unforgettable memory has never been more seamless.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/events">
                    <button className="px-8 py-4 bg-coral text-white rounded-lg font-medium text-lg shadow-lg shadow-coral/25 hover:bg-coral-hover hover:scale-105 transition-all duration-300 btn-magnetic group flex items-center gap-2">
                      Explore Events
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="px-8 py-4 bg-white dark:bg-white/5 border border-slate/10 dark:border-white/10 text-navy dark:text-white rounded-lg font-medium text-lg hover:bg-slate/5 dark:hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                      Host an Event
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Hero Image / Visual */}
            <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-coral/30 rounded-full animate-float" style={{ animationDelay: "1s" }} />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-slate-100 dark:bg-white/5 rounded-full blur-2xl -z-10" />

                <div className="relative rounded-2xl overflow-hidden glass shadow-2xl skew-y-1 transform perspective-1000 rotate-y-12 hover:rotate-y-0 transition-transform duration-700 ease-out py-8 px-6 border-slate/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/10 dark:to-transparent pointer-events-none" />

                  {/* Mock UI Card inside Hero */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center">
                        <Calendar className="text-coral" size={24} />
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                        Upcoming
                      </div>
                    </div>
                    <div className="h-48 w-full rounded-lg relative overflow-hidden group">
                      <Image
                        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000"
                        alt="Concert"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">Neon Nights Festival</h3>
                      <div className="flex items-center text-slate dark:text-gray-400 text-sm gap-4">
                        <span className="flex items-center gap-1"><MapPin size={14} /> Paris</span>
                        <span className="flex items-center gap-1"><Users size={14} /> 1.2k attending</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate/10 rounded-full overflow-hidden">
                      <div className="h-full bg-coral w-3/4 animate-shimmer" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-cream/50 dark:bg-white/2">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-navy dark:text-white mb-2">Featured Events</h2>
              <p className="text-slate dark:text-gray-400">Discover what everyone is talking about.</p>
            </div>
            <Link href="/events" className="hidden sm:flex items-center gap-2 text-coral hover:text-coral-hover font-medium transition-colors group">
              View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_EVENTS.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group relative bg-white dark:bg-navy-deep rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate/5 dark:border-white/5"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold text-navy dark:text-white">
                    {event.category}
                  </div>
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={event.id === 1}
                    className="object-cover transition-transform duration-500 group-hover:scale-110 saturate-hover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-coral font-medium text-sm flex items-center gap-1.5">
                      <Calendar size={14} /> {event.date}
                    </span>
                    <span className="text-slate dark:text-gray-400 text-sm flex items-center gap-1.5">
                      <MapPin size={14} /> {event.location}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-navy dark:text-white mb-3 group-hover:text-coral transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="pt-4 mt-auto border-t border-slate/5 dark:border-white/5 flex items-center justify-between">
                    <span className="text-lg font-bold text-navy dark:text-white">
                      {event.price}
                    </span>
                    <button className="px-4 py-2 rounded-full bg-slate/5 dark:bg-white/5 text-navy dark:text-white text-sm font-medium group-hover:bg-coral group-hover:text-white transition-all">
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center sm:hidden">
            <Link href="/events" className="inline-flex items-center gap-2 text-coral hover:text-coral-hover font-medium transition-colors button-base">
              View All Events <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-navy-darker border-t border-slate/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-coral rounded-lg flex items-center justify-center text-white font-serif font-bold">
                  E
                </div>
                <span className="font-serif text-lg font-bold text-navy dark:text-white">
                  Event Booking
                </span>
              </Link>
              <p className="text-slate dark:text-gray-400 text-sm leading-relaxed">
                The premier platform for discovering and booking exclusive events worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-navy dark:text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate dark:text-gray-400">
                <li><Link href="/events" className="hover:text-coral transition-colors">Browse Events</Link></li>
                <li><Link href="/host" className="hover:text-coral transition-colors">Host an Event</Link></li>
                <li><Link href="/pricing" className="hover:text-coral transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-navy dark:text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate dark:text-gray-400">
                <li><Link href="/help" className="hover:text-coral transition-colors">Help Center</Link></li>
                <li><Link href="/terms" className="hover:text-coral transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-coral transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-navy dark:text-white mb-4">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="bg-slate/5 dark:bg-white/5 border border-slate/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-coral"
                />
                <button className="bg-coral hover:bg-coral-hover text-white rounded-lg px-3 py-2 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate/10 dark:border-white/5 text-center text-slate dark:text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Event Booking App. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
