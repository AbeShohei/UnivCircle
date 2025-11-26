import React from 'react';
import { Circle } from '../types';
import { MapPin, Users, Calendar, School } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CircleCardProps {
  circle: Circle;
  variant?: 'default' | 'glass-dark'; // Currently both will look similar in dark mode
}

const CircleCard: React.FC<CircleCardProps> = ({ circle }) => {
  return (
    <Link to={`/circle/${circle.id}`} className="block group h-full">
      <div className="relative overflow-hidden transition-all duration-300 h-full flex flex-col glass-card rounded-2xl hover:bg-white/5 hover:border-white/20 text-white shadow-lg shadow-black/20">
        
        {/* Image Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-dark-800">
          <img 
            src={circle.imageUrl} 
            alt={circle.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent"></div>
          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm backdrop-blur-md bg-black/60 text-white border border-white/10">
            {circle.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow relative">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {circle.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-primary-500/20 text-primary-200 border border-primary-500/30"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-bold mb-2 line-clamp-1 transition-colors text-white group-hover:text-primary-400">
            {circle.name}
          </h3>
          <p className="text-sm line-clamp-2 mb-4 flex-grow text-gray-400 group-hover:text-gray-300 transition-colors">
            {circle.shortDescription}
          </p>

          {/* Meta Info */}
          <div className="space-y-2 text-xs mt-auto pt-4 border-t border-white/10 text-gray-400">
            {/* University Name */}
            <div className="flex items-center gap-2 text-gray-300 font-medium">
              <School className="w-3.5 h-3.5 text-primary-400" />
              <span className="truncate">{circle.university}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 opacity-70" />
              <span className="truncate">{circle.campus.join(' / ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 opacity-70" />
              <span>{circle.activityDays.join('・')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 opacity-70" />
              <span>{circle.memberCount}名</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CircleCard;