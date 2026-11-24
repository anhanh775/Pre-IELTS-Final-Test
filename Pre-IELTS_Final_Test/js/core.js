function $(id){ return document.getElementById(id); }

/* ============ SHARED STATE ============ */
let candidateName = "";
let overallStartTime = null;
let listeningRecord = null;
let readingRecord = null;
function buildOptGroup(container, qNum, letters, labelMap, vertical, dataAttr){
  const attr = dataAttr || "data-q";
  const wrap = document.createElement("div");
  wrap.className = "opt-item";
  const stmt = document.createElement("div");
  stmt.className = "stmt";
  stmt.innerHTML = `<b>${qNum}</b>${labelMap ? labelMap[qNum] : ""}`;
  wrap.appendChild(stmt);
  const row = document.createElement("div");
  row.className = "opt-row" + (vertical ? " mcq-full" : (letters.length>4 ? " letters" : ""));
  row.setAttribute(attr, qNum);
  letters.forEach(val=>{
    const b = document.createElement("button");
    b.dataset.val = val;
    b.textContent = val;
    row.appendChild(b);
  });
  wrap.appendChild(row);
  container.appendChild(wrap);
}
function setupMultiGroup(id){
  const el = $(id);
  const checkboxes = Array.from(el.querySelectorAll('input[type=checkbox]'));
  checkboxes.forEach(cb=>{
    cb.addEventListener("change", ()=>{
      const checked = checkboxes.filter(c=>c.checked);
      if(checked.length>2){
        // keep only the two most recently checked (evict the oldest)
        checked[0].checked = false;
      }
      checkboxes.forEach(c=>{
        c.closest(".check-row").classList.toggle("checked", c.checked);
      });
    });
  });
}
function buildTFChecklist(container, qNum, options, labelMap, dataAttr){
  const attr = dataAttr || "data-q";
  const wrap = document.createElement("div");
  wrap.className = "opt-item";
  wrap.innerHTML = `<div class="stmt"><b>${qNum}</b>${labelMap ? labelMap[qNum] : ""}</div>`;
  const list = document.createElement("div");
  list.className = "checklist tfng";
  list.setAttribute(attr, qNum);
  options.forEach(opt=>{
    const label = document.createElement("label");
    label.className = "check-row";
    label.innerHTML = `<input type="radio" name="${attr}${qNum}" value="${opt}"><span><b>${opt}</b></span>`;
    list.appendChild(label);
  });
  wrap.appendChild(list);
  container.appendChild(wrap);
}
function buildMCQChecklist(container, qNum, stmtText, opts, dataAttr){
  const attr = dataAttr || "data-q";
  const wrap = document.createElement("div");
  wrap.className = "opt-item";
  wrap.innerHTML = `<div class="stmt"><b>${qNum}</b>${stmtText}</div>`;
  const list = document.createElement("div");
  list.className = "checklist";
  list.setAttribute(attr, qNum);
  Object.keys(opts).forEach(k=>{
    const label = document.createElement("label");
    label.className = "check-row";
    label.innerHTML = `<input type="radio" name="${attr}${qNum}" value="${k}"><span><b>${k}</b> ${opts[k]}</span>`;
    list.appendChild(label);
  });
  wrap.appendChild(list);
  container.appendChild(wrap);
}
function esc(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
const META = {L:{}, R:{}};   // loại từng câu: text | radio | btn | multi

function fillHtml(html, attr, meta){
  const seen = {};
  return html.replace(/\{\{(\d+)(?::(\d+))?\}\}/g, (m,n,wd)=>{
    meta[n] = {type:"text"};
    const num = seen[n] ? "" : `<span class="num">${n}</span> `; seen[n] = 1;
    return `${num}<input type="text" ${attr}="${n}"${wd?` style="width:${wd}px"`:""}>`;
  });
}
function renderBlock(b, attr, meta){
  const d = document.createElement("div"); d.className = "qblock";
  let h = (b.title ? `<h2 class="qtitle">${b.title}</h2>` : "") + `<div class="instructions">${b.ins}</div>`;
  if(b.ref) h += `<div class="refbox"><div class="title">${b.ref.title}</div><div class="row2">${b.ref.items.map(([k,v])=>`<span><b>${k}</b>${v}</span>`).join("")}</div></div>`;
  if(b.t==="html") h += fillHtml(b.html, attr, meta);
  d.innerHTML = h;
  const box = document.createElement("div"); d.appendChild(box);
  const qs = b.items ? Object.keys(b.items) : [];
  if(b.ex){
    const e = document.createElement("div"); e.className = "opt-item";
    e.innerHTML = `<div class="stmt"><b>Example</b>${b.ex.stmt}</div><div class="checklist">` + Object.entries(b.ex.opts).map(([k,v])=>`<label class="check-row${k===b.ex.ans?" checked":""}"><input type="radio" disabled${k===b.ex.ans?" checked":""}><span><b>${k}</b> ${v}</span></label>`).join("") + "</div>";
    box.appendChild(e);
  }
  if(b.t==="mcq")   qs.forEach(q=>{ buildMCQChecklist(box,q,b.items[q].stmt,b.items[q].opts,attr); meta[q]={type:"radio"}; });
  if(b.t==="tf")    qs.forEach(q=>{ buildTFChecklist(box,q,b.opts,b.items,attr); meta[q]={type:"radio"}; });
  if(b.t==="match") qs.forEach(q=>{ buildOptGroup(box,q,b.letters.split(""),b.items,false,attr); meta[q]={type:"btn"}; });
  if(b.t==="multi"){
    const g = document.createElement("div"); g.className = "checklist"; g.id = b.id;
    g.innerHTML = Object.entries(b.opts).map(([k,v])=>`<label class="check-row"><input type="checkbox" value="${k}"><span><b>${k}</b> ${v}</span></label>`).join("");
    box.appendChild(g); b.qs.forEach(q=>meta[q]={type:"multi",grp:b.id});
  }
  return d;
}

LISTEN_PANELS.forEach((p,i)=>{
  const el = document.createElement("div"); el.className = "partPanel"+(i?"":" active"); el.id = "panel-"+(i+1);
  el.innerHTML = `<h2>${p.range}</h2><h1>${p.title}</h1>`;
  p.blocks.forEach(b=>el.appendChild(renderBlock(b,"data-lq",META.L)));
  $("mainListening").appendChild(el);
  p.blocks.filter(x=>x.t==="multi").forEach(x=>setupMultiGroup(x.id));
});
READ_PARTS.forEach((blocks,i)=>{
  const ps = PASSAGES[i], s = document.createElement("div");
  s.className = "partSection"+(i?"":" active"); s.id = "part-"+(i+1);
  s.innerHTML = `<div class="passagePane"><h2>Reading Passage ${i+1}</h2><h1>${ps.title}</h1>${ps.sub?`<div class="sub">${ps.sub}</div>`:""}` +
    ps.paras.map(x=>typeof x==="string" ? `<p>${x}</p>` : `<p><span class="secLabel">${x.l}</span>${x.t}</p>`).join("") + `</div><div class="questionPane"></div>`;
  blocks.forEach(b=>s.lastChild.appendChild(renderBlock(b,"data-q",META.R)));
  $("mainReading").appendChild(s);
});

/* ---- chấm bài dùng chung ---- */
function norm(s){ return String(s).toLowerCase().replace(/\s*\/\s*/g,"/").replace(/\s+/g," ").replace(/[.\s]+$/,"").trim(); }
function collect(meta, attr, n){
  const m = meta[n];
  if(m.type==="text") return [...document.querySelectorAll(`input[${attr}="${n}"]`)].map(i=>i.value.trim()).join("|").replace(/^\|+$/,"");
  if(m.type==="radio"){ const c = document.querySelector(`.checklist[${attr}="${n}"] input:checked`); return c ? c.value : ""; }
  if(m.type==="btn"){ const s = document.querySelector(`.opt-row[${attr}="${n}"] .selected`); return s ? s.dataset.val : ""; }
  return [...document.querySelectorAll(`#${m.grp} input:checked`)].map(c=>c.value).join(" / ");
}
function isRight(meta, KEY, n, given){
  const keys = [].concat(KEY[n]), g = meta[n].type==="multi" ? String(given).split(" / ") : [given];
  return g.some(x=>x && keys.some(k=>norm(k)===norm(x)));
}
function grade(meta, KEY, attr){
  const answers = {}; let score = 0;
  for(let i=1;i<=40;i++){ answers[i] = collect(meta,attr,i); if(isRight(meta,KEY,i,answers[i])) score++; }
  return {score, answers};
}
function reviewTable(answers, KEY, meta){
  let h = '<table class="review"><thead><tr><th>Q</th><th>Answer</th><th>Correct</th><th></th></tr></thead><tbody>';
  for(let i=1;i<=40;i++){
    const given = answers[i] || "", ok = isRight(meta,KEY,i,given);
    const correct = (typeof SHOW_KEY!=="undefined" && meta===META.L && SHOW_KEY[i]) || [].concat(KEY[i]).join(" / ");
    h += `<tr class="${ok?"correct":"wrong"}"><td>${i}</td><td class="given">${esc(given.replace(/\|/g," / ")||"(no answer)")}</td><td>${esc(correct)}</td><td class="mark">${ok?"✓":"✕"}</td></tr>`;
  }
  return h + "</tbody></table>";
}

function rowsFor(answers, KEY, meta, show){
  const r = [];
  for(let i=1;i<=40;i++){
    const g = answers[i] || "";
    r.push({ q:i, given:g.replace(/\|/g," / "), correct:((show&&show[i]) || [].concat(KEY[i]).join(" / ")).replace(/\|/g," / "), ok:isRight(meta,KEY,i,g) });
  }
  return r;
}
