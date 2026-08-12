'use client';

import React from 'react';
import { TimelineEvent } from '@/types/invite-partner';

interface CaseTimelineProps {
  timelineEvents: TimelineEvent[];
}

export const CaseTimeline: React.FC<CaseTimelineProps> = ({ timelineEvents }) => {
  // Default fallback events matching user screenshot
  const events = [
    {
      id: '1',
      title: 'Invitation sent to emma@example.com',
      timestamp: timelineEvents[0]?.timestamp || '20/07/2026 17:30',
      completed: timelineEvents[0]?.completed ?? true,
    },
    {
      id: '2',
      title: 'Partner opened invitation email.',
      timestamp: '20/07/2026 18:06',
      completed: true,
    },
    {
      id: '3',
      title: 'Partner registered account.',
      timestamp: '20/07/2026 18:10',
      completed: true,
    },
    {
      id: '4',
      title: 'Partner linked to Case LP-2026-000123.',
      timestamp: '20/07/2026 18:20',
      completed: true,
    },
  ];

  return (
    <div className="bg-[#EEE7DA] border-2 border-[#D4C8B4] rounded-2xl p-6 md:p-8 space-y-6 shadow-md w-full">
      <div className="border-b-2 border-[#D4C8B4] pb-4">
        <h2 className="text-sm md:text-base font-extrabold tracking-[0.2em] text-[#0F172A] uppercase">
          CASE TIMELINE
        </h2>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          const isFirst = index === 0;

          return (
            <div key={event.id} className="flex items-center space-x-4 md:space-x-6">
              {/* Left Column: Milestone Node & Vertical Connector Line */}
              <div className="flex flex-col items-center flex-shrink-0 relative">
                {/* Connector Line */}
                {!isLast && (
                  <div className="absolute top-9 bottom-0 w-[2.5px] bg-[#C5A880] -mb-6 z-0" />
                )}

                {/* Node Circle */}
                <div className="w-9 h-9 rounded-full bg-[#C5A880] text-white flex items-center justify-center text-sm font-extrabold z-10 shadow-sm">
                  ✓
                </div>
              </div>

              {/* Right Column: Wide Horizontal Event Card */}
              <div
                className={`flex-1 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                  isFirst
                    ? 'bg-[#FAF2E4] border-2 border-[#C5A880] shadow-sm'
                    : 'bg-[#FAF6EE] border-2 border-[#D4C8B4] shadow-xs'
                }`}
              >
                <div className="space-y-1.5">
                  <span className="text-sm md:text-base font-extrabold text-[#0F172A] block leading-snug">
                    {event.title}
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-[#5A6578] block">
                    {event.timestamp}
                  </span>
                </div>

                {/* Status Pill Badge */}
                <div className="flex-shrink-0 pt-1 sm:pt-0">
                  <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs md:text-sm font-extrabold bg-[#FAF2E4] border border-[#C5A880] text-[#A1743B] shadow-xs">
                    <span>✓</span>
                    <span>Completed</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
