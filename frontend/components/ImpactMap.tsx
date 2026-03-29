import React from 'react';

export function ImpactMap({ impact, simulation }: { impact: string[], simulation: string[] }) {
  return (
    <div className="w-full relative py-4">
      {/* Central Core */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent -translate-x-1/2 hidden md:block" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Left Side: Urban/Rural Simulation */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Demographic Simulation
          </h4>
          {simulation?.map((sim, i) => (
            <div key={i} className="bg-gradient-to-r from-blue-500/10 to-transparent border-l-2 border-blue-500 p-3 rounded-r-xl">
              <p className="text-xs text-white/80 leading-relaxed">{sim}</p>
            </div>
          ))}
        </div>

        {/* Right Side: Broad Impact */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Systemic Impact
          </h4>
          {impact?.map((imp, i) => (
            <div key={i} className="bg-gradient-to-l from-purple-500/10 to-transparent border-r-2 border-purple-500 p-3 rounded-l-xl text-right md:text-left md:bg-gradient-to-r md:from-purple-500/10 md:to-transparent md:border-r-0 md:border-l-2 md:rounded-l-none md:rounded-r-xl">
              <p className="text-xs text-white/80 leading-relaxed">{imp}</p>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}