import { useRef, useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'motion/react';
import { PlaceCard } from './PlaceCard';
import { Place } from '@/types/place';

interface SwipeableCardProps {
  place: Place;
  onSwipeLeft: () => void;
  onSwipeRight: (place: Place) => void;
  isTop: boolean;
}

export function SwipeableCard({ place, onSwipeLeft, onSwipeRight, isTop }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Swiped right - navigate to location
      onSwipeRight(place);
    } else if (info.offset.x < -threshold) {
      // Swiped left - skip
      onSwipeLeft();
    } else {
      // Not far enough, return to center
      x.set(0);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
        zIndex: isTop ? 2 : 1,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={isTop ? { scale: 1 } : { scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <PlaceCard place={place} />
      
      {/* Overlay indicators */}
      <motion.div
        className="absolute inset-0 flex items-center justify-start pl-12 pointer-events-none"
        style={{
          opacity: useTransform(x, [-200, -50, 0], [1, 0.5, 0]),
        }}
      >
        <div className="bg-red-500 text-white px-6 py-3 rounded-full text-2xl font-bold rotate-12 border-4 border-white">
          SKIP
        </div>
      </motion.div>
      
      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-12 pointer-events-none"
        style={{
          opacity: useTransform(x, [0, 50, 200], [0, 0.5, 1]),
        }}
      >
        <div className="bg-green-500 text-white px-6 py-3 rounded-full text-2xl font-bold -rotate-12 border-4 border-white">
          GO!
        </div>
      </motion.div>
    </motion.div>
  );
}
