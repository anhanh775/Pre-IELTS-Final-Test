const flaggedQuestions = new Set();
function toggleFlag(q, btn){
  q = String(q);
  if(flaggedQuestions.has(q)){ flaggedQuestions.delete(q); btn.classList.remove("active"); }
  else{ flaggedQuestions.add(q); btn.classList.add("active"); }
  const nb = $("nav-"+q);
  if(nb) nb.classList.toggle("flagged", flaggedQuestions.has(q));
}
function addFlagButtons(){
  document.querySelectorAll('#readingUI .note-line .num').forEach(numEl=>{
    const q = numEl.textContent.trim();
    if(!q) return;
    const btn = document.createElement("button");
    btn.className = "flagBtn"; btn.type = "button";
    btn.title = "Đánh dấu câu này để xem lại"; btn.textContent = "⚑";
    btn.onclick = ()=> toggleFlag(q, btn);
    numEl.insertAdjacentElement("afterend", btn);
  });
  document.querySelectorAll('#readingUI .opt-item .stmt b').forEach(bEl=>{
    const q = bEl.textContent.trim();
    if(!q) return;
    const btn = document.createElement("button");
    btn.className = "flagBtn"; btn.type = "button";
    btn.title = "Đánh dấu câu này để xem lại"; btn.textContent = "⚑";
    btn.onclick = ()=> toggleFlag(q, btn);
    bEl.insertAdjacentElement("afterend", btn);
  });
}
addFlagButtons();
function switchPart(n){
  document.querySelectorAll(".partSection").forEach(el=>el.classList.remove("active"));
  $("part-"+n).classList.add("active");
  document.querySelectorAll("#partTabs button").forEach(b=>b.classList.toggle("active", Number(b.dataset.part)===n));
}
READ_GROUPS.forEach(([start,end],gi)=>{
  const g = $("navGroup"+(gi+1));
  for(let i=start;i<=end;i++){
    const b = document.createElement("button");
    b.className = "qnum"; b.textContent = i; b.id = "nav-"+i;
    b.onclick = ()=>{
      switchPart(gi+1);
      setTimeout(()=>{
        const t = META.R[i].type;
        const el = document.querySelector(t==="text" ? `input[data-q="${i}"]` : t==="radio" ? `.checklist[data-q="${i}"]` : `.opt-row[data-q="${i}"]`);
        if(el) el.scrollIntoView({behavior:"smooth", block:"center"});
      }, 50);
    };
    g.appendChild(b);
  }
});
document.addEventListener("input", e=>{ if(e.target.matches('input[type=text][data-q]')) updateNavAnswered(); });
function updateNavAnswered(){
  for(let i=1;i<=40;i++){
    const nb = $("nav-"+i);
    if(nb) nb.classList.toggle("answered", !!collect(META.R,"data-q",i));
  }
}
function highlightSelection(){
  const sel = window.getSelection();
  if(!sel.rangeCount || sel.isCollapsed) return;
  const range = sel.getRangeAt(0);
  const activePane = document.querySelector(".partSection.active .passagePane");
  if(!activePane || !activePane.contains(range.commonAncestorContainer)) return;
  const span = document.createElement("span");
  span.className = "hl";
  span.onclick = ()=>{ const parent=span.parentNode; while(span.firstChild) parent.insertBefore(span.firstChild, span); parent.removeChild(span); };
  try{ range.surroundContents(span); }
  catch(e){ const contents = range.extractContents(); span.appendChild(contents); range.insertNode(span); }
  sel.removeAllRanges();
}
function toggleNotepad(){ $("notepad").classList.toggle("open"); }

let readingTimeLeft = CONFIG.readingMinutes*60;
let readingTimer = null;
function startReadingTimer(){
  updateReadingTimerDisplay();
  readingTimer = setInterval(()=>{
    readingTimeLeft--;
    if(readingTimeLeft<=0){ clearInterval(readingTimer); readingTimeLeft=0; submitReading(); }
    updateReadingTimerDisplay();
  },1000);
}
function updateReadingTimerDisplay(){
  const m = Math.floor(readingTimeLeft/60), s = readingTimeLeft%60;
  $("timerReading").textContent = String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  $("timerReading").classList.toggle("warn", readingTimeLeft<=600);
}

let readingSubmittedFlag = false;
function submitReading(){
  if(readingSubmittedFlag) return;
  readingSubmittedFlag = true;
  clearInterval(readingTimer);
  const g = grade(META.R, READ_KEY, "data-q");
  readingRecord = { score:g.score, total:40, answers:g.answers, timeTakenSec: Math.round((Date.now()-overallStartTime)/1000) };
  $("readingUI").style.display = "none";
  $("interimReading").style.display = "block";
}
