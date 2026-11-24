/* ===== CẤU HÌNH ===== */
const CONFIG = {
  webhook: "PASTE_YOUR_WEB_APP_URL_HERE",   // dán URL Web App của Apps Script (xem README)
  teacherPassword: "gv2026",         // mật khẩu trang giáo viên
  storagePrefix: "pre-ielts-final-lrw:",
  readingMinutes: 60,                // Reading 60 phút
  writingMinutes: 60,                // Writing 60 phút
  writeT1: [50, 80],                 // Task 1: 50–80 từ
  writeT2: 150,                      // Task 2: ~150 từ
  audio: {1:"audio/part1.mp3", 2:"audio/part2.mp3", 3:"audio/part3.mp3", 4:"audio/part4.mp3"}
};
