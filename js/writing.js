/* ============ WRITING ============ */
function countWords(text){
  const t = text.trim();
  if(!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}
function switchTask(n){
  document.querySelectorAll(".taskSection").forEach(el=>el.classList.remove("active"));
  $("task-"+n).classList.add("active");
  document.querySelectorAll("#taskTabs button").forEach(b=>b.classList.toggle("active", Number(b.dataset.task)===n));
}
function updateWordCounts(){
  const w1 = countWords($("answer1").value), w2 = countWords($("answer2").value);
  $("wc1").textContent = w1; $("wc2").textContent = w2;
  $("wc1").className = "count " + (w1>=CONFIG.writeT1[0] && w1<=CONFIG.writeT1[1] ? "ok" : "under");
  $("wc2").className = "count " + (w2>=CONFIG.writeT2 ? "ok" : "under");
  $("pill1").textContent = w1 + " words"; $("pill2").textContent = w2 + " words";
  $("navInfo").textContent = "Task 1: " + w1 + " words · Task 2: " + w2 + " words";
}
$("answer1").addEventListener("input", updateWordCounts);
$("answer2").addEventListener("input", updateWordCounts);

let writingTimeLeft = CONFIG.writingMinutes*60;
let writingTimer = null;
function startWritingTimer(){
  updateWritingTimerDisplay();
  writingTimer = setInterval(()=>{
    writingTimeLeft--;
    if(writingTimeLeft<=0){ clearInterval(writingTimer); writingTimeLeft=0; submitWriting(); }
    updateWritingTimerDisplay();
  },1000);
}
function updateWritingTimerDisplay(){
  const m = Math.floor(writingTimeLeft/60), s = writingTimeLeft%60;
  $("timerWriting").textContent = String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  $("timerWriting").classList.toggle("warn", writingTimeLeft<=600);
}