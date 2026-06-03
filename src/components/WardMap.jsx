import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Layers, AlertTriangle, Hammer, CheckCircle } from 'lucide-react';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock Data
const MOCK_CENTER = [19.0760, 72.8777]; // Mumbai Coordinates

const ongoingProjects = [
  { id: 1, lat: 19.0780, lng: 72.8750, title: 'Road Resurfacing', status: 'In Progress', budget: '₹15L' },
  { id: 2, lat: 19.0740, lng: 72.8800, title: 'Park Renovation', status: 'Near Completion', budget: '₹8L' },
  { id: 3, lat: 19.0800, lng: 72.8820, title: 'New Drainage Line', status: 'Tender Stage', budget: '₹25L' },
];

const complaintHeatmap = [
  { id: 1, lat: 19.0770, lng: 72.8790, intensity: 8, type: 'Garbage Dump' }, // High intensity
  { id: 2, lat: 19.0750, lng: 72.8760, intensity: 5, type: 'Street Light Out' }, // Medium
  { id: 3, lat: 19.0790, lng: 72.8740, intensity: 9, type: 'Water Logging' }, // High
  { id: 4, lat: 19.0730, lng: 72.8810, intensity: 3, type: 'Potholes' }, // Low
];

export default function WardMap({ className = "h-[75vh]" }) {
  const [showProjects, setShowProjects] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Helper to determine circle color based on intensity (1-10)
  const getHeatColor = (intensity) => {
    if (intensity > 7) return '#ef4444'; // Red (Severe)
    if (intensity > 4) return '#f59e0b'; // Amber (Moderate)
    return '#3b82f6'; // Blue (Low)
  };

  return (
    <div className={`glass-card p-6 flex flex-col animate-slide-in ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4 mb-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <MapPin size={24} className="text-sky-600" />
            Interactive Ward Map (GIS)
          </h3>
          <p className="text-base text-slate-500 font-medium mt-1">
            Real-time geospatial view of civic issues and development works
          </p>
        </div>

        <div className="flex bg-slate-100 p-2 rounded-2xl border border-slate-200 shadow-inner">
          <button
            onClick={() => setShowProjects(!showProjects)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              showProjects ? 'bg-white text-indigo-700 border border-slate-200 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Hammer size={16} /> Public Works
          </button>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              showHeatmap ? 'bg-white text-rose-700 border border-slate-200 shadow-sm' : 'text-slate-500'
            }`}
          >
            <AlertTriangle size={16} /> Complaint Heatmap
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-slate-300 shadow-inner relative z-0">
        <MapContainer center={MOCK_CENTER} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Render Public Works as Markers */}
          {showProjects && ongoingProjects.map(proj => (
            <Marker key={`proj-${proj.id}`} position={[proj.lat, proj.lng]}>
              <Popup className="rounded-xl">
                <div className="p-2">
                  <h4 className="font-extrabold text-slate-800 text-base mb-1">{proj.title}</h4>
                  <p className="text-sm text-slate-600 font-medium mb-2">Budget: <span className="font-bold text-slate-800">{proj.budget}</span></p>
                  <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold border border-indigo-200">
                    {proj.status}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Complaint Heatmap as Circle Markers */}
          {showHeatmap && complaintHeatmap.map(complaint => (
            <CircleMarker
              key={`comp-${complaint.id}`}
              center={[complaint.lat, complaint.lng]}
              radius={complaint.intensity * 4} // Size based on intensity
              pathOptions={{ 
                color: getHeatColor(complaint.intensity), 
                fillColor: getHeatColor(complaint.intensity), 
                fillOpacity: 0.5,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-extrabold text-slate-800 text-base mb-1 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-rose-500" />
                    {complaint.type}
                  </h4>
                  <p className="text-sm text-slate-600 font-medium">Severity Level: <span className="font-bold text-rose-600">{complaint.intensity}/10</span></p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Floating Legend inside Map */}
        <div className="absolute bottom-6 left-6 z-[400] bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-xl">
          <h5 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">Map Legend</h5>
          <div className="space-y-3 text-sm font-bold text-slate-700">
            <div className="flex items-center gap-3">
              <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" alt="marker" className="w-4" />
              <span>Public Works Projects</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-rose-500 opacity-60 border border-rose-500"></div>
              <span>Severe Issues (Heatmap)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-amber-500 opacity-60 border border-amber-500"></div>
              <span>Moderate Issues</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
