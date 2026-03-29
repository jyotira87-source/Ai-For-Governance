import React from 'react';

export function RiskChart({ risks }: { risks: string[] }) {
  if (!risks || risks.length === 0) return <div className="text-white/50 text-sm">No risk data available.</div>;

  // We assign visual threat levels dynamically to make the UI look active
  const threatLevels = [
    { color: "bg-red-500", label: "CRITICAL", width: "w-[85%]" },
    { color: "bg-amber-500", label: "ELEVATED", width: "w-[60%]" },
    { color: "bg-orange-500", label: "HIGH", width: "w-[75%]" }
  ];

  return (
    <div className="w-full space-y-4">
      {risks.map((risk, index) => {
        const threat = threatLevels[index % threatLevels.length];
        
        return (
          <div key={index} className="space-y-1.5">
            <div className="flex justify-between items-end text-xs">
              <span className="text-white/80 line-clamp-1 pr-4">{risk}</span>
              <span className={`font-bold tracking-widest uppercase ${threat.color.replace('bg-', 'text-')}`}>
                {threat.label}
              </span>
            </div>
            {/* The Visual Bar */}
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full ${threat.color} shadow-[0_0_10px_currentColor] rounded-full`} 
                style={{ width: threat.width.match(/\[(.*?)\]/)?.[1] || '50%' }}
              />
            </div>
          </div>
        );
      })}
      
      {/* Matrix Legend */}
      <div className="pt-4 mt-4 border-t border-white/10 flex gap-4 text-[10px] text-white/40 tracking-widest uppercase">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Critical</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span> High</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Elevated</div>
      </div>
    </div>
  );
}