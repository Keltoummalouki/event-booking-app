'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, Users, Heart } from 'lucide-react';
import { Event } from '@/types/event.types';

interface PublicEventCardProps {
  event: Event;
  index: number;
}

export default function PublicEventCard({ event, index }: PublicEventCardProps) {
  const date = new Date(event.date);
  const day = date.toLocaleDateString('en-US', { day: '2-digit' });
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const fullDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="relative"
    >
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
        <div className="relative h-44 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              event.coverImageUrl ||
              'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000'
            }
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-white rounded-lg px-2 py-1 text-center shadow">
            <div className="text-lg font-bold">{day}</div>
            <div className="text-[10px] uppercase text-slate-500">{month}</div>
          </div>
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow"
            aria-label="favorite"
          >
            <Heart size={16} className="text-coral" />
          </button>
        </div>

        <div className="p-5">
          <span className="inline-flex items-center px-2.5 py-1 text-xs rounded-full bg-coral/10 text-coral">
            Dance & Music
          </span>

          <h3 className="mt-3 font-serif text-lg font-bold text-navy line-clamp-2">
            {event.title}
          </h3>

          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-coral" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-coral" />
              <span>
                {fullDate} · {time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-coral" />
              <span>{event.capacity} seats</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>By {event.organizer?.firstName || 'Organizer'}</span>
            <span>From $99.99</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href={`/events/${event.id}`}
              className="text-center py-2 rounded-lg bg-coral text-white text-sm font-medium"
            >
              Buy Tickets
            </Link>
            <Link
              href={`/events/${event.id}`}
              className="text-center py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
