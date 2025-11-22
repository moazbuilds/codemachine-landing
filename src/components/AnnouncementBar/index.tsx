/**
 * AnnouncementBar Component
 *
 * A banner displayed above the navigation to highlight important announcements,
 * product launches, or news. Features responsive design with different layouts
 * for mobile and desktop.
 */

import { ArrowRight } from 'lucide-react'

interface AnnouncementBarProps {
  icon?: string
  message: string
  ctaText: string
  ctaLink: string
}

export function AnnouncementBar({
  icon,
  message,
  ctaText,
  ctaLink,
}: AnnouncementBarProps) {
  return (
    <div className="text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center">
          {/* Desktop Layout */}
          <a
            href={ctaLink}
            className="hidden md:flex items-center gap-3 py-4 text-sm group"
          >
            {icon && (
              <span className="relative flex items-center w-5 h-5 shrink-0">
                <img
                  src={icon}
                  alt="announcement"
                  className="w-full h-full object-contain"
                />
              </span>
            )}
            <span className="lg:whitespace-nowrap">{message}</span>
            <span className="inline-flex items-center gap-1 transition-colors duration-300 text-white hover:text-gray-200 font-medium">
              <span>{ctaText}</span>
              <ArrowRight
                className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </a>

          {/* Mobile Layout */}
          <a
            href={ctaLink}
            className="flex md:hidden items-center gap-3 py-3.5 text-xs sm:gap-2"
          >
            {icon && (
              <span className="relative flex items-center w-6 h-6 shrink-0">
                <img
                  src={icon}
                  alt="announcement"
                  className="w-full h-full object-contain"
                />
              </span>
            )}
            <span className="lg:whitespace-nowrap">{message}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
