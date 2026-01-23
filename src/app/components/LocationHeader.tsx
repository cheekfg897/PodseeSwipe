import { Settings } from 'lucide-react';
import podseeLogo from '@/assets/podee_logo_bg_removed.png';

interface LocationHeaderProps {
  tuitionCenter: string;
  radius: number;
  onRadiusChange: (radius: number) => void;
}

export function LocationHeader({ tuitionCenter, radius, onRadiusChange }: LocationHeaderProps) {
  // Truncate long addresses for display
  const displayLocation = tuitionCenter.length > 30 
    ? tuitionCenter.substring(0, 30) + '...' 
    : tuitionCenter;

  return (
    <div className="bg-white shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src={podseeLogo} alt="Podsee" className="h-12 w-auto" />
          <div>
            <p className="text-xs text-gray-500">Near</p>
            <p className="font-semibold text-sm">{displayLocation}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onRadiusChange(2)}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
            radius === 2
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          2 km
        </button>
        <button
          onClick={() => onRadiusChange(5)}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
            radius === 5
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          5 km
        </button>
      </div>
    </div>
  );
}
