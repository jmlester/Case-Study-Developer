import React from "react";
type Props = {
  tabs: {id:string,label:string}[];
  active:string; setActive:(id:string)=>void;
  content: Record<string,string>;
  stage:"idle"|"search"|"screen"|"draft"|"polish"|"done";
};
export default function ResultsViewer(p: Props){
  return (
    <div className="card">
      <h2 className="font-medium">Results</h2>
      <div className="mt-2 flex flex-wrap gap-2 text-sm">
        {p.tabs.map(t=>(
          <button key={t.id}
            className={`px-3 py-1.5 border rounded ${p.active===t.id?'bg-gray-100 border-[var(--accent)]':''}`}
            onClick={()=>p.setActive(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-2 border rounded p-3 text-sm bg-gray-50 whitespace-pre-wrap min-h-[160px]">
        {p.content[p.active] ? p.content[p.active] : (p.stage==="idle" ? "Select outputs and click Generate." : "Working… partial results will appear as they complete.")}
      </div>
    </div>
  );
}
