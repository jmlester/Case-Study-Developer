import React from "react";
type Output = { id:string; label:string };
type Props = {
  outputs: Output[]; selected: string[];
  toggle:(id:string)=>void; estCalls:number; dailyCap:number;
  stage:"idle"|"search"|"screen"|"draft"|"polish"|"done";
  onGenerate:()=>void;
};
export default function OutputsPanel(p: Props){
  const running = p.stage!=="idle" && p.stage!=="done";
  return (
    <div className="card space-y-3">
      <h2 className="font-medium">Outputs</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {p.outputs.map(o=>(
          <button key={o.id}
            onClick={()=>p.toggle(o.id)}
            className={`border rounded p-3 text-left hover:bg-gray-50 ${p.selected.includes(o.id)?'ring-2 ring-[var(--accent)] bg-blue-50/40':''}`}>
            <div className="text-sm font-medium">{o.label}</div>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs bg-gray-50 border rounded p-2">
        <div>Est. API calls: <strong>{p.estCalls}</strong> • Daily cap: {p.dailyCap}</div>
        <div>Gemini (free) • fallback templates if quota hits</div>
      </div>
      <div className="flex justify-end">
        <button className={`btn ${running?'opacity-60 cursor-not-allowed':''}`} onClick={p.onGenerate} disabled={running}>
          {running ? "Generating…" : "Generate"}
        </button>
      </div>
    </div>
  );
}
