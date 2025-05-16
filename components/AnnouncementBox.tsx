import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, ArrowRight, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

type Announcement = {
  id: string;
  title: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
  isNew?: boolean;
  expiresAt?: Date; // Optional expiration date
};

interface AnnouncementBoxProps {
  announcements?: Announcement[];
  defaultAnnouncement?: Announcement;
  isInQueue?: boolean; // New prop to adjust positioning when in queue
}

const DEFAULT_ANNOUNCEMENT: Announcement = {
  id: 'default-announcement',
  title: 'New Features Available!',
  description: 'Try out our improved matchmaking system and explore brand new game environments.',
  linkText: 'Learn More',
  linkUrl: '/blog/new-features',
  isNew: true,
};

const STORAGE_KEY = 'announcementBoxState';

const AnnouncementBox = ({ 
  announcements = [], 
  defaultAnnouncement = DEFAULT_ANNOUNCEMENT,
  isInQueue = false
}: AnnouncementBoxProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [expandTransition, setExpandTransition] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  
  // Load the minimized state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setIsMinimized(parsedState.isMinimized);
      } catch (e) {
        console.error('Failed to parse saved announcement state', e);
      }
    }
  }, []);
  
  // Save minimized state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ isMinimized }));
  }, [isMinimized]);
  
  useEffect(() => {
    // Combine passed announcements with default if needed
    const combinedAnnouncements = announcements.length > 0 
      ? announcements 
      : [defaultAnnouncement];
      
    // Filter out expired announcements
    const validAnnouncements = combinedAnnouncements.filter(a => 
      !a.expiresAt || new Date(a.expiresAt) > new Date()
    );
    
    setAllAnnouncements(validAnnouncements);
  }, [announcements, defaultAnnouncement]);
  
  // Cleanup transition timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);
  
  if (allAnnouncements.length === 0) return null;
  
  const currentAnnouncement = allAnnouncements[currentIndex];
  const announcementCount = allAnnouncements.length;
  
  const handleMinimize = () => {
    setIsTransitioning(true);
    // Add the fadeOut class first, then set minimized state after animation
    transitionTimeoutRef.current = setTimeout(() => {
      setIsMinimized(true);
      setIsTransitioning(false);
    }, 400); // Match this to the animation duration
  };
  
  const handleExpand = () => {
    setExpandTransition(true);
    setIsMinimized(false);
    // Reset the expand transition after the animation completes
    transitionTimeoutRef.current = setTimeout(() => {
      setExpandTransition(false);
    }, 400);
  };
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allAnnouncements.length);
  };

  // Minimized pill version
  if (isMinimized) {
    return (
      <div className={`relative mx-auto w-full ${isMobile ? 'max-w-[90%]' : 'max-w-md'} ${isInQueue ? 'mb-6 mt-2' : 'mb-2 mt-4'} animate-fadeIn z-50 flex justify-center`}>
        <div 
          className={`flex items-center gap-1.5 bg-[#E0ECFF] text-[#2563EB] ${isMobile ? 'px-2 py-0.5' : 'px-2.5 py-1'} rounded-full shadow-md cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-105 animate-pulse-subtle max-w-min border border-[#2563EB]/20`}
          onClick={handleExpand}
        >
          <Bell className={`${isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} />
          <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-medium whitespace-nowrap`}>{announcementCount}</span>
        </div>
      </div>
    );
  }

  // Full announcement box
  return (
    <div className={`relative ${isInQueue ? 'mb-6 mt-2' : 'mb-2 mt-4'} mx-auto w-full ${isMobile ? 'max-w-[90%]' : 'max-w-md'} 
      ${isTransitioning ? 'animate-fadeOut' : expandTransition ? 'animate-expandIn' : 'animate-fadeIn'}`}>
      <div className="bg-white rounded-lg p-0.5 shadow-lg border border-[#2563EB]/20">
        <div className={`bg-white rounded-md ${isMobile ? 'p-3' : 'p-4'}`}>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`absolute ${isMobile ? 'top-1.5 right-1.5 h-5 w-5' : 'top-2 right-2 h-6 w-6'} text-muted-foreground hover:text-foreground transition-colors duration-200`}
            onClick={handleMinimize}
          >
            <X className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </Button>
          
          <div className={`flex items-start ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
            <div className="flex-shrink-0 mt-1">
              <div className={`bg-gradient-to-br from-[#2563EB] to-[#3B82F6] ${isMobile ? 'p-1' : 'p-1.5'} rounded-full shadow-sm transform transition-transform duration-200 hover:scale-110`}>
                <Sparkles className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium flex items-center text-[#0F172A]`}>
                {currentAnnouncement.title}
                {currentAnnouncement.isNew && (
                  <span className={`ml-2 ${isMobile ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'} bg-[#E0ECFF] text-[#2563EB] rounded-full font-medium tracking-wide border border-[#2563EB]/40`}>
                    NEW
                  </span>
                )}
              </h3>
              
              <p className={`mt-1 ${isMobile ? 'text-[10px]' : 'text-xs'} text-[#64748B]`}>
                {currentAnnouncement.description}
              </p>
              
              <div className={`${isMobile ? 'mt-1.5' : 'mt-2'} flex items-center justify-between`}>
                {currentAnnouncement.linkText && currentAnnouncement.linkUrl && (
                  <a 
                    href={currentAnnouncement.linkUrl}
                    className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-[#2563EB] hover:text-[#1D4ED8] flex items-center transition-colors duration-200`}
                  >
                    {currentAnnouncement.linkText}
                    <ArrowRight className={`ml-1 ${isMobile ? 'h-2 w-2' : 'h-3 w-3'} transform transition-transform duration-200 group-hover:translate-x-1`} />
                  </a>
                )}
                
                {allAnnouncements.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`${isMobile ? 'h-5 py-0.5 px-1.5 text-[10px]' : 'h-6 py-1 px-2 text-xs'} transition-colors duration-200 text-[#2563EB] hover:bg-[#E0ECFF]/50`}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBox;