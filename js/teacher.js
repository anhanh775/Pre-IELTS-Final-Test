/* ============ TEACHER PASSWORD GATE ============ */
const TEACHER_PASSWORD = CONFIG.teacherPassword;
function openTeacherGate(){
  $("teacherGate").style.display="flex";
  $("gateError").classList.remove("show");
  $("teacherPw").value = "";
  setTimeout(()=>$("teacherPw").focus(), 50);
}
function closeTeacherGate(){ $("teacherGate").style.display="none"; }
function checkTeacherPassword(){
  if($("teacherPw").value === TEACHER_PASSWORD){ closeTeacherGate(); showTeacher(); }
  else{ $("gateError").classList.add("show"); }
}
document.addEventListener("keydown", e=>{
  if(e.key==="Enter" && $("teacherGate").style.display==="flex") checkTeacherPassword();
});

/* ============ TEACHER DASHBOARD ============ */
async function showTeacher(){
  $("landing").style.display="none";
  $("teacherView").style.display="block";
  $("backLink").style.display="inline";

  if(typeof window.storage === "undefined"){
    $("teacherEmpty").innerHTML = "Bản chạy trên GitHub/website không có kho lưu trữ dùng chung (<code>window.storage</code> chỉ có trong Claude).<br><br>Hãy xem bài làm của học sinh trong <b>Google Sheet</b> đã cấu hình webhook.";
    return;
  }
  try{
    const list = await window.storage.list(CONFIG.storagePrefix, true);
    const keys = (list && list.keys) ? list.keys : [];
    if(keys.length===0){ $("teacherEmpty").textContent = "No submissions yet."; return; }
    const records = [];
    for(const k of keys){
      try{ const res = await window.storage.get(k, true); if(res) records.push(JSON.parse(res.value)); }
      catch(e){ /* skip missing */ }
    }
    records.sort((a,b)=> new Date(b.submittedAt) - new Date(a.submittedAt));
    if(records.length===0){ $("teacherEmpty").textContent = "No submissions yet."; return; }
    $("teacherEmpty").style.display="none";
    $("rosterTable").style.display="table";
    const tbody = $("rosterBody");
    tbody.innerHTML = "";
    records.forEach((r,idx)=>{
      const tr = document.createElement("tr");
      tr.className = "rowMain";
      const mins = Math.floor(r.timeTakenSec/60), secs = r.timeTakenSec%60;
      const dt = new Date(r.submittedAt).toLocaleString();
      tr.innerHTML = `<td>${esc(r.name)}</td><td>${r.listeningScore}/${r.listeningTotal}</td><td>${r.readingScore}/${r.readingTotal}</td><td>${r.wc1} words</td><td>${r.wc2} words</td><td>${dt}</td><td>${mins}m ${secs}s</td>`;
      tr.onclick = ()=>{ document.getElementById("detail-"+idx).classList.toggle("open"); };
      tbody.appendChild(tr);

      const detailTr = document.createElement("tr");
      detailTr.className = "detailRow";
      const td = document.createElement("td");
      td.colSpan = 7;
      const detailDiv = document.createElement("div");
      detailDiv.className = "detailWrap";
      detailDiv.id = "detail-"+idx;

      const listenRowsHtml = r.listeningAnswers ? reviewTable(r.listeningAnswers, LISTEN_KEY, META.L) : "";
      const readRowsHtml = r.readingAnswers ? reviewTable(r.readingAnswers, READ_KEY, META.R) : "";

      detailDiv.innerHTML = `
        <h4>Listening answers (${r.listeningScore}/${r.listeningTotal})</h4>
        ${listenRowsHtml}
        <h4>Reading answers (${r.readingScore}/${r.readingTotal})</h4>
        ${readRowsHtml}
        <h4>Task 1 (${r.wc1} words)</h4>
        <div class="essayBox">${(r.text1 || "(no answer written)").replace(/</g,"&lt;")}</div>
        <h4>Task 2 (${r.wc2} words)</h4>
        <div class="essayBox">${(r.text2 || "(no answer written)").replace(/</g,"&lt;")}</div>
      `;
      td.appendChild(detailDiv);
      detailTr.appendChild(td);
      tbody.appendChild(detailTr);
    });
  }catch(err){
    console.error("Could not load results:", err);
    $("teacherEmpty").innerHTML = "Could not load results.<br><br>Error detail: " + (err && err.message ? err.message : String(err));
  }
}