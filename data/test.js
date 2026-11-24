/* ===== DỮ LIỆU ĐỀ: Pre-IELTS Final Test =====
   Placeholder {{n}} = ô điền đáp án câu n ({{n:60}} = ô rộng 60px; lặp {{n}} = nhiều ô cùng 1 câu, ghép bằng "|").
   Đáp án có thể là chuỗi hoặc mảng các cách viết được chấp nhận (không phân biệt hoa/thường). */
const TFI = 'Do the following statements agree with the information given in the text?<br><b>TRUE</b> — agrees &nbsp;·&nbsp; <b>FALSE</b> — contradicts &nbsp;·&nbsp; <b>NOT GIVEN</b> — no information';
const YNI = 'Do the following statements agree with the views of the writer?<br><b>YES</b> — agrees &nbsp;·&nbsp; <b>NO</b> — contradicts &nbsp;·&nbsp; <b>NOT GIVEN</b> — impossible to say';
const TFNG = ['TRUE','FALSE','NOT GIVEN'], YNNG = ['YES','NO','NOT GIVEN'];
const nl = (t) => `<div class="note-line${t[0]==='-'?' sub':''}">${t.replace(/^-/,'')}</div>`;

/* ---------- LISTENING ---------- */
const LISTEN_PANELS = [
 { range:'Questions 1–10', title:'Tax File Number (TFN) application', blocks:[
  { t:'mcq', ins:'Questions 1–4. Choose the correct letter, <b>A, B or C</b>.',
    ex:{ stmt:'What is the applicant’s residency status?', opts:{A:'citizen',B:'temporary visitor',C:'permanent migrant'}, ans:'C' },
    items:{
      1:{stmt:'A TFN is a number used', opts:{A:'exclusively for tax administration.',B:'exclusively by individual tax payers.',C:'for managing several government services.'}},
      2:{stmt:'Without a TFN, the applicant would be', opts:{A:'taxed at a higher rate.',B:'unable to work.',C:'liable for Medicare contributions.'}},
      3:{stmt:'What kind of visa does the applicant have?', opts:{A:'a visa granting indefinite stay',B:'a visa with work rights',C:'a student visa'}},
      4:{stmt:'A TFN is issued', opts:{A:'if you change your name.',B:'only once in a lifetime.',C:'when you claim a government benefit.'}} } },
  { t:'html', ins:'Questions 5–10. Complete the form below. Write <b>NO MORE THAN TWO WORDS AND/OR A NUMBER</b> for each answer.',
    html:`<table class="simpleTable"><tbody>
      <tr><th>Passport #</th><td>{{5}}</td></tr>
      <tr><th>Nationality</th><td>Spanish</td></tr>
      <tr><th>Postal address</th><td>1339 {{6}} Hollywell 1517</td></tr>
      <tr><th>Contact details</th><td>Phone: 09-5577 5076</td></tr>
      <tr><th>Preferred contact person</th><td>Martha {{7}} (landlady) — contact number above</td></tr>
      <tr><th>Title</th><td>{{8}}</td></tr>
      <tr><th>Family name</th><td>Farina</td></tr>
      <tr><th>First given name</th><td>Maria</td></tr>
      <tr><th>Other given name(s)</th><td>Rosa Ana</td></tr>
      <tr><th>Any other names</th><td>Mary = ({{9}})</td></tr>
      <tr><th>Date of birth</th><td>{{10:50}} / {{10:50}} / {{10:70}} (dd/mm/yy)</td></tr>
      <tr><th>Gender</th><td>Female</td></tr>
      <tr><th>Name of spouse</th><td>N/A</td></tr></tbody></table>` } ] },

 { range:'Questions 11–20', title:'Tamerton Centre', blocks:[
  { t:'mcq', ins:'Questions 11–15. You hear a club leader giving information to a group of young people who are planning to do <b>a two-week holiday course</b> at the Tamerton Centre. Choose the correct answer, <b>A, B or C</b>.',
    items:{
      11:{stmt:'The Tamerton Centre was set up in order to encourage people', opts:{A:'to enjoy being in the countryside.',B:'to help conserve the countryside.',C:'to learn more about the countryside.'}},
      12:{stmt:'Last year’s group said that the course', opts:{A:'built their self esteem.',B:'taught them lots of new skills.',C:'made them fitter and stronger.'}},
      13:{stmt:'For the speaker, what’s the most special feature of the course?', opts:{A:'You can choose which activities you do.',B:'There’s such a wide variety of activities.',C:'You can become an expert in new activities.'}},
      14:{stmt:'The speaker advises people to bring', opts:{A:'their own board games.',B:'extra table tennis equipment.',C:'a selection of films on DVD.'}},
      15:{stmt:'Bed-time is strictly enforced because', opts:{A:'it’s a way to reduce bad behaviour.',B:'tiredness can lead to accidents.',C:'it makes it easy to check everyone’s in.'}} } },
  { t:'match', ins:'Questions 16–20. What rules apply to taking different objects to the Centre? Match each object with the correct rule, <b>A–C</b>.',
    ref:{ title:'Rules', items:[['A','You MUST take this'],['B','You CAN take this, if you wish'],['C','You must NOT take this']] },
    letters:'ABC', items:{16:'Electrical equipment',17:'Mobile phone',18:'Sun cream',19:'Aerosol deodorant',20:'Towel'} } ] },

 { range:'Questions 21–30', title:'Dolphin Conservation Trust', blocks:[
  { t:'multi', id:'p3multi1', qs:[21,22], ins:'Questions 21 and 22. Choose <b>TWO</b> letters, A–E.<br>Which <b>TWO</b> things does Alice say about the Dolphin Conservation Trust?',
    opts:{A:'Children make up most of the membership.',B:'It’s the country’s largest conservation organisation.',C:'It helps finance campaigns for changes in fishing practices.',D:'It employs several dolphin experts full-time.',E:'Volunteers help in various ways.'} },
  { t:'mcq', ins:'Questions 23–25. Choose the correct letter, <b>A, B or C</b>.',
    items:{
      23:{stmt:'Why is Alice so pleased the Trust has won the Charity Commission award?', opts:{A:'It has brought in extra money.',B:'It made the work of the trust better known.',C:'It has attracted more members.'}},
      24:{stmt:'Alice says oil exploration causes problems to dolphins because of', opts:{A:'noise.',B:'oil leaks.',C:'movement of ships.'}},
      25:{stmt:'Alice became interested in dolphins when', opts:{A:'she saw one swimming near her home.',B:'she heard a speaker at her school.',C:'she read a book about them.'}} } },
  { t:'match', ins:'Questions 26–30. Which dolphin does Alice make each of the following comments about? Write the correct letter, <b>A, B, C or D</b>.',
    ref:{ title:'Dolphins', items:[['A','Moondancer'],['B','Echo'],['C','Kiwi'],['D','Samson']] },
    letters:'ABCD', items:{26:'It has not been seen this year.',27:'It is photographed more than the others.',28:'It is always very energetic.',29:'It is the newest one in the scheme.',30:'It has an unusual shape.'} } ] },

 { range:'Questions 31–40', title:'Research Methodology', blocks:[
  { t:'html', ins:'Questions 31–40. Complete the notes below. Write <b>NO MORE THAN TWO WORDS</b> for each answer.',
    html:`<div class="note-box bulleted"><h3 style="text-align:center;font-size:16px;">“Research Methodology”</h3>` + [
     'Use scientific method based on empirical evidence (= {{31}})','Find a research problem or question',
     '-a commonly held belief e.g. lack of sleep has negative impact on {{32}}','-review the literature',
     '-an everyday problem: e.g. research different memorisation {{33}}','Define your variables','Develop a hypothesis',
     'Conduct {{34}} research','-books; journals; online databases &amp; websites','-make notes and create {{35}}',
     'Select an experimental design','-pre-experimental = experimental group only','-quasi-experimental = include control group but not random',
     '-true experimental = both kinds of groups + random','Standardise your {{36}}','-compare like with like','Choose your participants',
     'Use different {{37}}','-random sample = select from same group','-stratified random sample = select from subsets with different {{38}}',
     'Conduct tests and collect data','Analyse the results','-use {{39}} methods (to be covered next week)','Write up and communicate results',
     '-{{40}} and {{40}} of paper is important; tips for writing (to be covered next two weeks)'].map(nl).join('') + '</div>' } ] }
];

const LISTEN_KEY = {
  1:'C',2:'A',3:'A',4:'B',5:['JGW 1100536','JGW1100536'],6:['Harbour Drive','Harbor Drive'],7:'Pearce',8:['Miss','Ms','Miss/Ms'],9:['First name','Firstname'],10:['15|11|1983','15|11|83'],
  11:'A',12:'A',13:'B',14:'A',15:'C',16:'C',17:'A',18:'B',19:'C',20:'B',
  21:'C',22:'E',23:'B',24:'A',25:'C',26:'B',27:'C',28:'D',29:'D',30:'A',
  31:'observation',32:'test performance',33:'strategies',34:'background',35:'bibliography',36:'procedures',37:'techniques',38:'characteristics',39:'statistical',40:['format|structure','structure|format']
};
const SHOW_KEY = { 10:'15/11/1983', 21:'C (or E)', 22:'E (or C)', 40:'format, structure' };

/* ---------- READING (passage nằm trong data/passages.js) ---------- */
const READ_GROUPS = [[1,14],[15,27],[28,40]];
const READ_PARTS = [
 [ { t:'html', title:'Questions 1–3', ins:'Complete the summary below.<br>Choose <b>NO MORE THAN THREE WORDS</b> from the passage for each answer.',
     html:'<div class="note-box"><h3>Writing systems</h3>' + [
      'There are three types of writing systems. Logography utilizes written signs representing a {{1}}.',
      'Syllabic writing systems were more common in the ancient world, as they adopt written sign symbolizing a {{2}}.',
      'The most common alphabetical systems use a letter to represent a {{3}}.'].map(nl).join('') + '</div>' },
   { t:'tf', title:'Questions 4–10', ins:TFI, opts:TFNG, items:{
      4:'There is no language that adopts elements from only one writing system.',
      5:'Inca quipus used tally sticks to track payments and commercial transactions.',
      6:'The marks on the outside of the containers originated from pictograms used in Sumerian cuneiform.',
      7:'The first written language was created to document the quantities and types of livestock and food.',
      8:'Cuneiform could not express abstract concepts at all.',
      9:'Affected by the rebus principle, cuneiform combined the elements of both logograms and syllabic writing.',
      10:'Most countries adopt alphabetical writing systems due to their flexibility and simplicity.' } },
   { t:'match', title:'Questions 11–14', ins:'Use the information in the passage to match the options (<b>A–E</b>) with the statements below. Some options may match more than one statement.',
     ref:{ title:'List of options', items:[['A','Egyptians'],['B','Native Americans'],['C','Semites'],['D','Chinese'],['E','Sumerians']] }, letters:'ABCDE',
     items:{ 11:'developed the alphabet from Egyptian hieroglyphs.',12:'used pictures for the purpose of communication.',13:'invented a written language which consisted of signs looked like wedges.',14:'might have independently invented writing 5,000 years ago.' } } ],
 [ { t:'match', title:'Questions 15–19', ins:'Use the information in the passage to match the category of each navigation method (<b>A–C</b>) with the correct statement. You may use any letter more than once.',
     ref:{ title:'List of navigation methods', items:[['A','Guidance'],['B','Path integration'],['C','Route following']] }, letters:'ABC',
     items:{ 15:'Using basic direction from starting point and light intensity to move on.',16:'Using combination of place and direction heading for destination.',17:'Using an iconic building near your destination as orientation.',18:'Using a retrace method from a known place if a mistake happens.',19:'Using a passed spot as reference for a new integration.' } },
   { t:'mcq', title:'Questions 20–22', ins:'Choose the correct letter, <b>A, B, C or D</b>.', items:{
      20:{stmt:'What does the ant of Cataglyphis respond if it has been taken to another location according to the passage?', opts:{A:'Changes the orientation sensors improvingly',B:'Releases biological scent for help from others',C:'Continues to move by the original orientation',D:'Gets completely lost once disturbed'}},
      21:{stmt:'Which of the following statements is true about “cognitive map” in this passage?', opts:{A:'There is no obvious difference between it and a real map.',B:'It exists in our head and is always correct.',C:'It only exists under some cultures.',D:'It was managed by a portion of our memory.'}},
      22:{stmt:'Which of the following descriptions of way findings correctly reflects the function of cognitive map?', opts:{A:'It visualises a virtual route in a large scope.',B:'It reproduces the exact details of every landmark.',C:'Observation plays a more important role.',D:'Store or supermarket is a must in file map.'}} } },
   { t:'tf', title:'Questions 23–27', ins:TFI, opts:TFNG, items:{
      23:'Biological navigation has a state of flexibility.',
      24:'You will always receive a good reaction when you ask directions.',
      25:'When someone follows a route, he or she collects comprehensive perceptional information in mind on the way.',
      26:'Path integration requires more thought from the brain compared with route-following.',
      27:'In familiar surroundings, an exact map of where you are will automatically emerge in your head.' } } ],
 [ { t:'mcq', title:'Questions 28–30', ins:'Choose the correct letter, <b>A, B, C or D</b>.', items:{
      28:{stmt:'In the first paragraph, the writer draws particular attention to', opts:{A:'the lack of medical knowledge in China prior to the Tang era.',B:'the Western interest in Chinese medicine during the Tang era.',C:'the systematic approach taken to medical issues during the Tang era.',D:'the rivalry between Chinese and Western cultures during the Tang era.'}},
      29:{stmt:'During the Tang era, a government doctor’s annual salary depended upon', opts:{A:'the effectiveness of his treatment.',B:'the extent of his medical experience.',C:'the number of people he had successfully trained.',D:'the breadth of his medical expertise.'}},
      30:{stmt:'Which of the following contravened the law during the Tang era?', opts:{A:'a qualified doctor’s refusal to practise',B:'the use of unorthodox medical practices',C:'a patient dying under medical treatment',D:'the receipt of money for medical treatment'}} } },
   { t:'tf', title:'Questions 31–37', ins:YNI, opts:YNNG, items:{
      31:'Academic staff sometimes taught a range of medical subjects during the Tang era.',
      32:'The medical knowledge available during the Tang era only benefited the wealthy.',
      33:'Tang citizens were encouraged to lead a healthy lifestyle.',
      34:'Doctors who behaved in a fraudulent manner were treated in the same way as ordinary criminals during the Tang era.',
      35:'Medical reference books published during the Tang era covered practical and academic issues.',
      36:'Waitai Miyao contained medical data from the Tang era.',
      37:'Chinese medical authors are known to have influenced Indian writing.' } },
   { t:'html', title:'Questions 38–40', ins:'Complete the sentences below.<br>Use <b>NO MORE THAN THREE WORDS</b> for each answer.',
     html:'<div class="note-box">' + [
      'The first known medical writing in China dates back to the {{38}}.',
      'During the Tang era, doctors depended most on {{39}} and single substances to treat their patients.',
      '{{40}} is famous for producing a set of medical rules for Chinese physicians.'].map(nl).join('') + '</div>' } ]
];

const READ_KEY = {
  1:['word','a word'],2:['syllable','a syllable'],3:['single sound','phoneme','a single sound','a phoneme'],
  4:'TRUE',5:'FALSE',6:'NOT GIVEN',7:'TRUE',8:'FALSE',9:'TRUE',10:'NOT GIVEN',11:'C',12:'B',13:'E',14:'A',
  15:'B',16:'C',17:'A',18:'C',19:'B',20:'C',21:'D',22:'A',23:'TRUE',24:'NOT GIVEN',25:'TRUE',26:'FALSE',27:'FALSE',
  28:'C',29:'A',30:'B',31:'YES',32:'NO',33:'NOT GIVEN',34:'YES',35:'YES',36:'NOT GIVEN',37:'NO',
  38:['2nd century','second century','the 2nd century','the second century'],39:['prescriptions','prescription'],40:'Sun Simiao'
};
