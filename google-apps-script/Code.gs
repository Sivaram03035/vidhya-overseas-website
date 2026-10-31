/*
 * Vidhya Overseas enquiry receiver.
 * Create a Google Sheet, open Extensions > Apps Script, paste this code.
 * Run setupSheet() once, then Deploy > New deployment > Web app.
 * Execute as: Me. Access: Anyone (only if appropriate for your privacy policy).
 */
const SHEET_NAME = "Enquiries";
const HEADERS = ["Timestamp","Full Name","Email","Mobile","Destination","Qualification","Interested Course","Intended Intake","Budget","Additional Message","Consent","Page URL"];

function setupSheet() {
  const sheet = getSheet_();
  if (sheet.getLastRow() === 0) { sheet.appendRow(HEADERS); sheet.setFrozenRows(1); }
}
function doPost(e) {
  try {
    if (!e?.postData?.contents) return output_({ok:false,message:"No data received"});
    const d = JSON.parse(e.postData.contents);
    const fullName = clean_(d.fullName,120), email = clean_(d.email,254);
    const mobile = clean_(d.mobile,20), destination = clean_(d.destination,80);
    const qualification = clean_(d.qualification,100), course = clean_(d.course,160);
    if (![fullName,email,mobile,destination,qualification,course].every(Boolean)) return output_({ok:false,message:"Required fields missing"});
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return output_({ok:false,message:"Invalid email"});
    if (d.consent !== "Yes") return output_({ok:false,message:"Consent required"});
    if (clean_(d.website,200)) return output_({ok:false,message:"Rejected"});
    const row = [new Date(),fullName,email,mobile,destination,qualification,course,clean_(d.intake,80),clean_(d.budget,80),clean_(d.message,2000),"Yes",clean_(d.pageUrl,1000)].map((v,i)=>i===0?v:safeCell_(v));
    const sheet = getSheet_();
    if (sheet.getLastRow() === 0) { sheet.appendRow(HEADERS); sheet.setFrozenRows(1); }
    sheet.appendRow(row);
    return output_({ok:true,message:"Saved"});
  } catch (err) {
    console.error(err);
    return output_({ok:false,message:"Unable to save"});
  }
}
function doGet() { return output_({ok:true,message:"Vidhya Overseas endpoint active"}); }
function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Bind this script to the target Google Sheet.");
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  return sh;
}
function clean_(v,n) { return String(v == null ? "" : v).trim().slice(0,n); }
function safeCell_(v) { const s=String(v == null ? "" : v); return /^[=+\-@]/.test(s) ? "'"+s : s; }
function output_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
