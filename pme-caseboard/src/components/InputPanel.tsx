import React from "react";
const BLOOMS = ["Remembering","Understanding","Applying","Analyzing","Evaluating","Creating"] as const;
type Props = {
  topic:string; setTopic:(v:string)=>void;
  objectives:string; setObjectives:(v:string)=>void;
  extras:string; setExtras:(v:string)=>void;
  complexity:number; setComplexity:(n:number)=>void;
  duration:number; setDuration:(n:number)=>void;
  bloom:string; setBloom:(v:string)=>void;
  sources:string[]; toggleSource:(id:string)=>void;
  sourceList: {id:string,label:string}[];
};
export default function InputPanel(p: Props){
  const label = ({1:"Very low",2:"Low",3:"Moderate",4:"High",5:"Very high"} as any)[p.complexity] || "Moderate";
  return (
    <div className="card space-y-4">
      <h2 className="font-medium">Inputs</h2>
      <div>
        <label className="block text-sm mb-1">Focus topic *</label>
        <input className="border w-full p-2 rounded" value={p.topic} onChange={e=>p.setTopic(e.target.value)} placeholder="e.g., Maritime deterrence in the Baltic Sea"/>
      </div>
      <div>
        <label className="block text-sm mb-1">Goals & objectives *</label>
        <textarea className="border w-full p-2 rounded" value={p.objectives} onChange={e=>p.setObjectives(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm mb-1">Extra guidance (optional)</label>
        <textarea className="border w-full p-2 rounded" value={p.extras} onChange={e=>p.setExtras(e.target.value)} />
      </div>

      <details className="border rounded p-3 bg-gray-50">
        <summary className="text-sm font-medium cursor-pointer">Optional pedagogy & sources</summary>
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-sm mb-1">Complexity: {label}</label>
            <input type="range" min={1} max={5} value={p.complexity} onChange={e=>p.setComplexity(parseInt(e.target.value)||3)} className="w-full"/>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-sm mb-1">Duration (mins)</label>
              <input type="number" className="border w-full p-2 rounded" value={p.duration} onChange={e=>p.setDuration(parseInt(e.target.value)||60)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Bloom's level</label>
              <select className="border w-full p-2 rounded text-sm" value={p.bloom} onChange={e=>p.setBloom(e.target.value)}>
                {BLOOMS.map(b=> <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Source libraries</label>
            <div className="grid grid-cols-2 gap-2">
              {p.sourceList.map(s=>(
                <label key={s.id} className="flex items-center gap-2 border p-2 rounded text-sm">
                  <input type="checkbox" checked={p.sources.includes(s.id)} onChange={()=>p.toggleSource(s.id)} />
                  {s.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
