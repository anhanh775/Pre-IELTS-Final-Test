document.addEventListener("click", e=>{
  if(e.target.tagName!=="BUTTON") return;
  const group = e.target.closest(".opt-row");
  if(!group) return;
  group.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));
  e.target.classList.add("selected");
  updateNavAnswered();
});

document.addEventListener("change", e=>{
  if(e.target.type==="radio" && e.target.closest(".checklist")){
    const list = e.target.closest(".checklist");
    list.querySelectorAll(".check-row").forEach(r=>r.classList.remove("checked"));
    e.target.closest(".check-row").classList.add("checked");
  }
});
let currentListenPart = 1;
let listenMaxReachedPart = 1;
let listenReviewInterval = null;
let listenReviewTimeLeft = 120;

// Purely visual: switch which part's questions are shown. Never touches audio playback,
// so students can freely browse Part 1-4 while listening continues uninterrupted.
function viewListenPart(n){
  document.querySelectorAll(".partPanel").forEach(el=>el.classList.remove("active"));
  $("panel-"+n).classList.add("active");
  document.querySelectorAll("#partTabsListening button").forEach(b=>{
    const p = Number(b.dataset.part);
    b.classList.toggle("active", p===n);
  });
}

let audioCtx = null;
let gainNode = null;
let currentSource = null;
let progressRAF = null;
let partStartCtxTime = 0;
let currentBufferDuration = 0;

function getAudioCtx(){
  if(!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = Number($("volCtrl").value);
    gainNode.connect(audioCtx.destination);
  }
  if(audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

async function playListenPart(n){
  currentListenPart = n;
  listenMaxReachedPart = n;
  viewListenPart(n);
  $("partLabelListening").textContent = "Part " + n + " of 4";
  $("audiostatusListening").textContent = "Đang tải audio Part " + n + "…";
  $("navInfoListening").textContent = "Audio Part " + n + " đang phát — bạn có thể điền đáp án trong lúc nghe.";
  $("submitBtnListening").disabled = true;
  $("submitBtnListening").textContent = "Đợi hết audio để nộp bài";

  try{
    const ctx = getAudioCtx();
    const resp = await fetch(CONFIG.audio[n]);
    if(!resp.ok) throw new Error("HTTP "+resp.status+" — "+CONFIG.audio[n]);
    const arrBuf = await resp.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrBuf);
    currentBufferDuration = audioBuffer.duration;

    if(currentSource){ try{ currentSource.onended = null; currentSource.stop(); }catch(e){} }
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gainNode);
    source.onended = ()=>{
      if(progressRAF) cancelAnimationFrame(progressRAF);
      if(currentListenPart < 4){ playListenPart(currentListenPart+1); }
      else{ startListenReview(); }
    };
    currentSource = source;
    $("audiostatusListening").textContent = "Đang phát audio Part " + n + "…";
    partStartCtxTime = ctx.currentTime;
    source.start(0);
    updateProgressLoop();
  }catch(err){
    console.error("Audio playback error:", err);
    $("audiostatusListening").textContent = "Không thể phát audio Part " + n + ". Lỗi: " + (err && err.message ? err.message : String(err));
  }
}

function updateProgressLoop(){
  if(!audioCtx || !currentSource) return;
  const elapsed = audioCtx.currentTime - partStartCtxTime;
  const pct = Math.min(100, (elapsed / currentBufferDuration) * 100);
  $("progressFill").style.width = pct + "%";
  $("timeLabelListening").textContent = formatTime(elapsed) + " / " + formatTime(currentBufferDuration);
  if(elapsed < currentBufferDuration){
    progressRAF = requestAnimationFrame(updateProgressLoop);
  }
}

$("volCtrl").addEventListener("input", e=>{
  if(gainNode) gainNode.gain.value = Number(e.target.value);
});

function formatTime(t){
  const m = Math.floor(t/60), s = Math.floor(t%60);
  return m + ":" + String(s).padStart(2,"0");
}
function startListenReview(){
  $("audiostatusListening").textContent = "Đã nghe xong 4 phần.";
  $("submitBtnListening").disabled = false;
  $("submitBtnListening").textContent = "Submit Listening";
  listenReviewInterval = setInterval(()=>{
    listenReviewTimeLeft--;
    const m = Math.floor(listenReviewTimeLeft/60), s = listenReviewTimeLeft%60;
    $("navInfoListening").textContent = "Thời gian rà lại đáp án: " + m + ":" + String(s).padStart(2,"0");
    if(listenReviewTimeLeft<=0){ clearInterval(listenReviewInterval); submitListening(); }
  }, 1000);
}

function submitListening(){
  clearInterval(listenReviewInterval);
  if(progressRAF) cancelAnimationFrame(progressRAF);
  if(currentSource){ try{ currentSource.onended = null; currentSource.stop(); }catch(e){} }
  const g = grade(META.L, LISTEN_KEY, "data-lq");
  listeningRecord = { score:g.score, total:40, answers:g.answers, timeTakenSec: Math.round((Date.now()-overallStartTime)/1000) };
  $("listeningUI").style.display = "none";
  $("interimListening").style.display = "block";
}
