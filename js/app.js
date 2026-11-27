/* ============ FLOW CONTROL ============ */
function startTest(){
  const name = $("nameInput").value.trim();
  if(!name){ $("nameInput").focus(); $("nameInput").style.borderColor="var(--red)"; return; }
  candidateName = name;
  overallStartTime = Date.now();
  $("landing").style.display="none";
  $("backLink").style.display="none";
  $("candidateLabelListening").textContent = "Candidate: "+candidateName;
  $("listeningUI").style.display="flex";
  playListenPart(1);
}
function beginReadingPhase(){
  $("interimListening").style.display="none";
  $("candidateLabelReading").textContent = "Candidate: "+candidateName;
  $("readingUI").style.display="flex";
  startReadingTimer();
}
function beginWritingPhase(){
  $("interimReading").style.display="none";
  $("candidateLabelWriting").textContent = "Candidate: "+candidateName;
  $("writingUI").style.display="flex";
  startWritingTimer();
}

let writingSubmittedFlag = false;
async function submitWriting(){
  if(writingSubmittedFlag) return;
  writingSubmittedFlag = true;
  clearInterval(writingTimer);

  const text1 = $("answer1").value.trim();
  const text2 = $("answer2").value.trim();
  const wc1 = countWords(text1);
  const wc2 = countWords(text2);
  const totalTimeTakenSec = Math.round((Date.now()-overallStartTime)/1000);

  const record = {
    testId: "pre-ielts-final",
    name: candidateName,
    listeningScore: listeningRecord ? listeningRecord.score : 0,
    listeningTotal: 40,
    listeningAnswers: listeningRecord ? listeningRecord.answers : {},
    readingScore: readingRecord ? readingRecord.score : 0,
    readingTotal: 40,
    readingAnswers: readingRecord ? readingRecord.answers : {},
    listeningRows: listeningRecord ? rowsFor(listeningRecord.answers, LISTEN_KEY, META.L, SHOW_KEY) : [],
    readingRows: readingRecord ? rowsFor(readingRecord.answers, READ_KEY, META.R) : [],
    text1, text2, wc1, wc2,
    timeTakenSec: totalTimeTakenSec,
    submittedAt: new Date().toISOString()
  };

  window.__lastRecord = record;
  try{ localStorage.setItem("lastRecord", JSON.stringify(record)); }catch(e){}   // bản dự phòng trong máy học sinh
  let saved = false;
  try{
    if(typeof window.storage === "undefined") throw new Error("storage unavailable in this window");
    const key = CONFIG.storagePrefix + candidateName.replace(/\s+/g,"_") + ":" + Date.now();
    const res = await window.storage.set(key, JSON.stringify(record), true);
    saved = !!res;
  }catch(err){ console.error("Could not save result (window.storage):", err); }

  /* ============ GỬI KẾT QUẢ VỀ GOOGLE SHEET ============ */
  // Dán URL Web App của Apps Script vào GOOGLE_SHEET_WEBHOOK_URL bên dưới sau khi deploy (xem hướng dẫn kèm theo).
  const GOOGLE_SHEET_WEBHOOK_URL = CONFIG.webhook;
  if(!GOOGLE_SHEET_WEBHOOK_URL || GOOGLE_SHEET_WEBHOOK_URL.indexOf("PASTE_YOUR") !== -1){
    console.error("CHƯA CẤU HÌNH WEBHOOK: js/config.js đang chạy trên site này vẫn là placeholder → kết quả KHÔNG được gửi về Google Sheet.");
  } else {
    try{
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors", // Apps Script không trả CORS header nên dùng no-cors; không đọc được response nhưng request vẫn tới nơi.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(record)
      });
      saved = true;
    }catch(err){ console.error("Could not send result to Google Sheet:", err); }
  }

  $("saveStatus").textContent = saved
    ? "Your result has been saved and sent to your teacher."
    : "⚠ Your results could NOT be saved for your teacher. Please tell your teacher directly.";
  $("saveStatus").style.color = saved ? "var(--ink-soft)" : "var(--red)";

  $("writingUI").style.display="none";
  $("resultsView").style.display="block";
  $("backLink").style.display="inline";
}
/* Tải bản sao bài làm (.json) — dự phòng nếu mạng lỗi khi nộp */
function downloadBackup(){
  const r = window.__lastRecord; if(!r) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(r,null,2)], {type:"application/json"}));
  a.download = "bai-lam-" + r.name.replace(/\s+/g,"_") + ".json"; a.click();
}
