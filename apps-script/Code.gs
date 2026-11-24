/* ===== Nhận bài làm từ web → ghi vào Google Sheet =====
   Tự tạo 4 sheet:
   - "Tổng hợp"            : 1 dòng / học sinh (điểm Listening, Reading, số từ, thời gian)
   - "Writing"             : bài viết đầy đủ + các cột để GV nhập điểm (TA, GRA, LR, CC, Overall)
   - "Listening chi tiết"  : đáp án từng câu, ô xanh = đúng, ô đỏ = sai (dòng 2 = đáp án đúng)
   - "Reading chi tiết"    : như trên
*/
const SHEET_NAMES = { sum:'Tổng hợp', wri:'Writing', lis:'Listening chi tiết', rea:'Reading chi tiết' };

function doGet(){ return ContentService.createTextOutput('Webhook OK'); }

function doPost(e){
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try{
    const r = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const when = new Date(r.submittedAt);

    getSheet_(ss, SHEET_NAMES.sum, ['Nộp lúc','Họ tên','Listening (/40)','Reading (/40)','Task 1 (từ)','Task 2 (từ)','Tổng thời gian (phút)'])
      .appendRow([when, safe_(r.name), r.listeningScore, r.readingScore, r.wc1, r.wc2, Math.round(r.timeTakenSec/60)]);

    const wri = getSheet_(ss, SHEET_NAMES.wri, ['Nộp lúc','Họ tên','Task 1 (từ)','Task 1 – bài làm','T1 TA','T1 GRA','T1 LR','T1 CC','T1 Overall',
      'Task 2 (từ)','Task 2 – bài làm','T2 TA','T2 GRA','T2 LR','T2 CC','T2 Overall','Nhận xét'], function(sh){
        sh.setColumnWidth(4, 420); sh.setColumnWidth(11, 420);
        sh.getRange('D:D').setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
        sh.getRange('K:K').setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
        sh.getRange('A:Q').setVerticalAlignment('top');
      });
    wri.appendRow([when, safe_(r.name), r.wc1, safe_(r.text1), '','','','','', r.wc2, safe_(r.text2)]);

    detail_(ss, SHEET_NAMES.lis, r.listeningScore, r.listeningRows, r, when);
    detail_(ss, SHEET_NAMES.rea, r.readingScore, r.readingRows, r, when);
    return ContentService.createTextOutput('OK');
  } finally { lock.releaseLock(); }
}

function getSheet_(ss, name, headers, onCreate){
  let sh = ss.getSheetByName(name);
  if(!sh){
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1,1,1,headers.length).setFontWeight('bold').setBackground('#e7f1fa');
    sh.setFrozenRows(1);
    if(onCreate) onCreate(sh);
  }
  return sh;
}

function detail_(ss, name, score, rows, r, when){
  if(!rows || !rows.length) return;
  let sh = ss.getSheetByName(name);
  if(!sh){
    sh = ss.insertSheet(name);
    const head = ['Nộp lúc','Họ tên','Điểm (/40)'].concat(rows.map(x => 'Q' + x.q));
    sh.appendRow(head);
    sh.appendRow(['', 'Đáp án đúng', ''].concat(rows.map(x => safe_(x.correct))));
    sh.getRange(1,1,2,head.length).setFontWeight('bold').setBackground('#e7f1fa');
    sh.setFrozenRows(2); sh.setFrozenColumns(2);
  }
  sh.appendRow([when, safe_(r.name), score].concat(rows.map(x => safe_(x.given))));
  sh.getRange(sh.getLastRow(), 4, 1, rows.length).setBackgrounds([rows.map(x => x.ok ? '#d9f2e3' : '#f8d7d3')]);
}

// chặn ô bị hiểu nhầm thành công thức (bắt đầu bằng = + - @)
function safe_(s){ s = (s == null) ? '' : String(s); return /^[=+\-@]/.test(s) ? "'" + s : s; }

/* Chạy thử từ trình soạn thảo (chọn hàm testWrite → Run) để kiểm tra mà không cần học sinh làm bài */
function testWrite(){
  const rows = []; for(let i = 1; i <= 40; i++) rows.push({q:i, given: i % 3 ? 'A' : 'B', correct:'A', ok: i % 3 !== 0});
  doPost({ postData: { contents: JSON.stringify({
    name:'Học sinh thử', listeningScore:27, readingScore:27, wc1:62, wc2:158, timeTakenSec:7200,
    text1:'This is a test report.', text2:'This is a test essay.', listeningRows:rows, readingRows:rows,
    submittedAt:new Date().toISOString() }) } });
}
