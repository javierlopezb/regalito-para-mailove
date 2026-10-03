// Edit only this value when the real gift code is ready.
const CODIGO_ROBUX = "8HE3U-CYMK4-UF363";

const pages = [...document.querySelectorAll('.page')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let transitioning = false;
let copyTimer;
document.getElementById('gift-code').textContent = CODIGO_ROBUX;

// Preserve original cat images; gracefully identify missing user-supplied files.
document.querySelectorAll('[data-cat]').forEach(img => {
  const unavailable = () => { img.hidden = true; img.parentElement.querySelector('.missing').hidden = false; };
  img.addEventListener('error', unavailable);
  if (img.complete && !img.naturalWidth) unavailable();
});

async function showPage(id) {
  if (transitioning) return;
  transitioning = true;
  const current = pages.find(page => !page.hidden);
  current.classList.add('leaving');
  if (!reducedMotion.matches) await new Promise(resolve => setTimeout(resolve, 250));
  current.hidden = true;
  current.classList.remove('leaving', 'entering');
  const next = document.getElementById(id);
  next.hidden = false;
  next.classList.add('entering');
  next.querySelector('h1').focus({preventScroll:true});
  window.scrollTo({top:0, behavior:reducedMotion.matches ? 'instant' : 'smooth'});
  transitioning = false;
  if (id === 'gift') paperHearts();
}
document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => showPage(button.dataset.answer === 'yes' ? 'gift' : 'sad')));
document.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => showPage('question')));

function paperHearts() {
  if (reducedMotion.matches) return;
  const layer = document.getElementById('confetti');
  layer.replaceChildren();
  for (let i=0; i<18; i++) {
    const heart = document.createElement('span');
    heart.className = 'paper-heart'; heart.textContent = i%3 ? '♥' : '♡';
    heart.style.left = `${Math.random()*100}%`;
    heart.style.color = ['#813a48','#b45d6b','#596536','#d7a3a3'][i%4];
    heart.style.animationDelay = `${Math.random()*.6}s`;
    layer.append(heart);
  }
  setTimeout(() => layer.replaceChildren(), 3300);
}

// Clipboard fallback also works when opened as a local file in many browsers.
async function copyCode() {
  const button = document.getElementById('copy');
  const status = document.getElementById('copy-status');
  let copied = false;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(CODIGO_ROBUX);
    copied = true;
  } catch {
    const field = document.createElement('textarea');
    field.value = CODIGO_ROBUX;
    field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(field); field.select();
    try { copied = document.execCommand('copy'); } catch { copied = false; }
    field.remove(); button.focus({preventScroll:true});
  }
  clearTimeout(copyTimer);
  button.textContent = copied ? 'Copiado ♡' : 'Copiar código ♡';
  status.textContent = copied ? 'Ya puedes pegarlo donde quieras.' : 'Selecciona el código y cópialo manualmente.';
  copyTimer = setTimeout(() => {button.textContent = 'Copiar código ♡'; status.textContent = '';}, 2500);
}
document.getElementById('copy').addEventListener('click', copyCode);
