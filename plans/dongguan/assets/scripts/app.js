const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 40);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('open', !open);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  });
});

document.querySelectorAll('.section-heading, .decision-layout, .route-map, .weather-layout, .hotel-rail, .activity, .compare, .photo-sequence, .budget-calculator').forEach((element) => {
  element.setAttribute('data-reveal', '');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));

const checklist = document.querySelector('[data-checklist]');
const checkboxes = [...(checklist?.querySelectorAll('input[type="checkbox"]') ?? [])];
const countOutput = document.querySelector('[data-check-count]');
const planSlug = document.body.classList.contains('dongguan-plan') ? 'dongguan' : 'hainan';
const storageKey = `${planSlug}-travel-packing-v1`;

function updateChecklistCount() {
  const checked = checkboxes.filter((box) => box.checked).length;
  if (countOutput) countOutput.textContent = `${checked} / ${checkboxes.length}`;
  localStorage.setItem(storageKey, JSON.stringify(checkboxes.map((box) => box.checked)));
}

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  checkboxes.forEach((box, index) => { box.checked = Boolean(saved[index]); });
} catch {
  localStorage.removeItem(storageKey);
}
updateChecklistCount();
checkboxes.forEach((box) => box.addEventListener('change', updateChecklistCount));
document.querySelector('[data-reset-checks]')?.addEventListener('click', () => {
  checkboxes.forEach((box) => { box.checked = false; });
  updateChecklistCount();
});

const baseBudget = planSlug === 'dongguan' ? 6800 : 16400;
const totalOutput = document.querySelector('[data-total]');
const budgetInputs = [...document.querySelectorAll('[data-budget-item]')];

function updateBudget() {
  const total = budgetInputs.reduce((sum, input) => sum + (input.checked ? Number(input.dataset.budgetItem) : 0), baseBudget);
  if (totalOutput) totalOutput.textContent = total.toLocaleString(document.documentElement.lang === 'en' ? 'en-US' : 'zh-CN');
}

budgetInputs.forEach((input) => input.addEventListener('change', updateBudget));
updateBudget();

const discussionTextZh = `海南 7 天东线计划｜想一起确认的 5 件事
1. 8 月 15 日长沙—海口、8 月 21 日三亚—长沙买哪班，含行李和退改总价多少？
2. 海口取、三亚还的异地还车费是否能接受？
3. 自由潜是否只保留为 D6 可选体验，AIDA2 拆到东莞单独学习？
4. 摩托只在万宁合法路段租 1 天是否足够？
5. 住宿更重视融旅权益和度假感，还是位置、停车与可退？

计划网址：https://lijinzh.github.io/travel-planner/plans/hainan/`;

const discussionTextEn = `Hainan 7-Day East Coast Plan | Five decisions
1. Which August 15 Changsha–Haikou and August 21 Sanya–Changsha flights offer the best total including baggage and change rules?
2. Is the Haikou pickup / Sanya return surcharge acceptable?
3. Should freediving remain an optional D6 experience, with AIDA2 studied separately in Dongguan?
4. Is one legal local motorcycle day around Wanning enough?
5. Should accommodation prioritise resort atmosphere and benefits, or location, parking, and cancellation?

Plan: https://lijinzh.github.io/travel-planner/plans/hainan/en/`;

const isEnglish = document.documentElement.lang === 'en';

const dongguanDiscussionZh = `东莞自由潜之行｜实际成果摘要
1. 8 天内完成 AIDA 二星、三星、四星考核并取得三项认证。
2. 静态闭气 4 分 04 秒。
3. 最大下潜深度 33.9 米，目前还没有摸底。
4. Bestdive 湿衣已订购，国产脚蹼已购买。
5. 下一步计划进行动态平潜训练（DYN）。

计划网址：https://lijinzh.github.io/travel-planner/plans/dongguan/`;

const dongguanDiscussionEn = `Dongguan Freediving Trip | Actual results
1. Completed AIDA 2-, 3- and 4-Star assessments and obtained all three certifications within eight days.
2. Static breath-hold: 4:04.
3. Maximum depth: 33.9 metres; the bottom was not reached yet.
4. Bestdive wetsuit ordered; domestic-made fins bought.
5. Next plan: dynamic apnea / DYN training.

Plan: https://lijinzh.github.io/travel-planner/plans/dongguan/en/`;

document.querySelector('[data-copy-discussion]')?.addEventListener('click', async () => {
  const feedback = document.querySelector('[data-copy-feedback]');
  try {
    const copyText = planSlug === 'dongguan'
      ? (isEnglish ? dongguanDiscussionEn : dongguanDiscussionZh)
      : (isEnglish ? discussionTextEn : discussionTextZh);
    await navigator.clipboard.writeText(copyText);
    if (feedback) feedback.textContent = isEnglish ? 'Report summary copied.' : '复盘摘要已复制。';
  } catch {
    if (feedback) feedback.textContent = isEnglish ? 'Automatic copying is unavailable. Please copy the report summary manually.' : '浏览器没有允许自动复制，请手动复制复盘摘要。';
  }
});
