import React from 'react';
import { CloudSun, MapPin } from 'lucide-react';

export const WeatherBadge = ({ location, weather }) => {
  if (!location) return null;

  return (
    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-100">
      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
      <span>{location}</span>
      {weather && (
        <>
          <span className="text-blue-300">•</span>
          <CloudSun className="w-3.5 h-3.5 text-amber-500" />
          <span>{weather.temp}°C, {weather.description}</span>
        </>
      )}
    </div>
  );
};
