import React, { useMemo, useState } from "react";
import InputPanel from "@/components/InputPanel";
import OutputsPanel from "@/components/OutputsPanel";
import ResultsViewer from "@/components/ResultsViewer";

const SOURCES = [
  { id:"openalex", label:"OpenAlex" },
  { id:"crossref", label:"Crossref" },
  { id:"semanticscholar", label:"Semantic Scholar" },
  { id:"core", label:"CORE" },
  { id:"arxiv", label:"arXiv" },
  { id:"dtic", label:"DTIC (public)" },
  { id:"rand_rss", label:"RAND (RSS)" },
];
const OUTPUTS = [
  { id:"narrative",  label:"Case study narrative" },
  { id:"handout",    label:"Student handout" },
  { id:"moderator",  label:"Moderator's guide" },
  { id:"media",      label:"Multimedia recommendations" },
  { id:"activities", label:"Student activities" },
  { id:"assessment", label:"Student assessment" },
] as const;
type JobStage = "idle"|"search"|"screen"|"draft"|"polish"|"done";
type OutputId = typeof OUTPUTS[number]["id"];
type Generated = Partial<Record<OutputId,string>>;

export default function App(){
  // inputs
  const [topic,setTopic]=useState(""); const [objectives,setObjectives]=useState("");
  const [extras,setExtras]=useState(""); const [complexity,setComplexity]=useState(3);
  const [duration,setDuration]=useState(60); const [bloom,setBloom]=useState("Understanding");
  const [sources,setSources]=useState<string[]>(["openalex","crossref","semanticscholar","dtic"]);

  // outputs
  const [selected,setSelected]=useState<OutputId[]>(OUTPUTS.map(o=>o.id));
  const [stage,setStage]=useState<JobStage>("idle"); const [progress,setProgress]=useState(0);
  const [generated,setGenerated]=useState<Generated>({}); const [active,setActive]=useState<OutputId>("narrative");

  const EST_CALLS = useMemo(()=> estimateCalls(sources.length, selected.length), [sources, selected]);
  const DAILY_CAP = 200;

  const toggleSource=(id:string)=> setSources(prev=> prev.includes(id)? prev.filter(x=>x!==id):[...prev,id]);
  const toggleOutput=(id:OutputId)=>{
    setSelected(prev=> prev.includes(id)? prev.filter(x=>x!==id):[...prev,id]);
    if (active===id) { const first=OUTPUTS.map(o=>o.id).find(o=>o!==id && selected.includes(o)); if(first) setActive(first as OutputId); }
  };

  function startGenerate(){
    if(!topic.trim() || !objectives.trim()) return alert("Topic and Objectives are required.");
    if(selected.length===0) return alert("Select at least one output.");
    if(EST_CALLS>DAILY_CAP) return alert(`Run may exceed daily cap (${DAILY_CAP}). Reduce sources/outputs.`);
    setGenerated({}); setStage("search"); setProgress(5);
    setTimeout(()=>{ setStage("screen"); setProgress(35); },700);
    setTimeout(()=>{ setStage("draft"); setProgress(65); mockDraft(); },1400);
    setTimeout(()=>{ setStage("polish"); setProgress(85); },2100);
    setTimeout(()=>{ setStage("done"); setProgress(100); },2800);
  }
  function mockDraft(){
    const cites = sources.map(id => `https://example.com/${id}/${slug(topic)}`).slice(0,5);
    const citeList = cites.map((u,i)=>`[${i+1}] ${u}`).join("\n");
    const hdr = `Topic: ${topic}\nObjectives: ${objectives}\nBloom: ${bloom}, Complexity ${complexity}/5, Duration ${duration}m`;
    const maybe=(id:OutputId, body:string)=> setGenerated(prev=> selected.includes(id)? {...prev,[id]:body}:prev);
    maybe("narrative",  `# Case Narrative\n${hdr}\n\nContext & problem framing…\n\nCitations:\n${citeList}`);
    maybe("handout",    `# Student Handout\n${hdr}\n\n1) Scenario brief\n2) Actors & Timeline\n3) Guided questions\n\nCitations:\n${citeList}`);
    maybe("moderator",  `# Moderator's Guide\n${hdr}\n\nTiming, prompts, pitfalls…\n\nCitations:\n${citeList}`);
    maybe("media",      `# Multimedia\n${hdr}\n\n• Maps • Short video • Photo set\n\nCitations:\n${citeList}`);
    maybe("activities", `# Activities\n${hdr}\n\n• Think–Pair–Share • Role cards • Injects\n\nCitations:\n${citeList}`);
    maybe("assessment", `# Assessment (Optional)\n${hdr}\n\nRubric skeleton…\n\nCitations:\n${citeList}`);
  }

  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center gap-2 border-b pb-2">
        <div className="w-5 h-5 rounded" style={{background:"var(--accent)"}} />
        <h1 className="text-xl font-semibold">PME Caseboard</h1>
        <span className="pill">Gemini primary</span>
        <span className="pill">Citations required</span>
      </header>

      <section className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-5">
          <InputPanel
            topic={topic} setTopic={setTopic}
            objectives={objectives} setObjectives={setObjectives}
            extras={extras} setExtras={setExtras}
            complexity={complexity} setComplexity={setComplexity}
            duration={duration} setDuration={setDuration}
            bloom={bloom} setBloom={setBloom}
            sources={sources} toggleSource={toggleSource}
            sourceList={SOURCES}
          />
        </div>

        <div className="md:col-span-7 space-y-4">
          <OutputsPanel
            outputs={OUTPUTS as any}
            selected={selected}
            toggle={toggleOutput}
            estCalls={EST_CALLS}
            dailyCap={DAILY_CAP}
            stage={stage}
            onGenerate={startGenerate}
          />
          <div>
            <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
              <div className="h-full" style={{ width: `${progress}%`, background:"linear-gradient(90deg,#60a5fa,#2563eb)"}}/>
            </div>
            <div className="text-xs text-gray-600 mt-1">Progress: {progress}%</div>
          </div>
          <ResultsViewer
            tabs={selected.map(id=>({id,label:(OUTPUTS as any).find((o:any)=>o.id===id)?.label}))}
            active={active} setActive={setActive}
            content={generated as any}
            stage={stage}
          />
        </div>
      </section>
    </div>
  );
}

function estimateCalls(numSources:number,numOutputs:number){ return numSources*3 + numOutputs*2; }
function slug(s:string){ return (s||"topic").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }
