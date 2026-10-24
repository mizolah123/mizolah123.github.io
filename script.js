// Aucun framework : le navigateur exécute directement ce fichier.
const root = document.documentElement;
const themeButton = document.querySelector('.theme');
function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-label', theme === 'light' ? 'Activer le thème sombre' : 'Activer le thème clair');
  document.querySelector('meta[name="theme-color"]').content = theme === 'light' ? '#f7f5f5' : '#09090b';
}
try { setTheme(localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark'); } catch { setTheme('dark'); }
themeButton.addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(next);
  try { localStorage.setItem('portfolio-theme', next); } catch { /* Le thème fonctionne sans stockage. */ }
});
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-category]').forEach(project => {
      project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
    });
  });
});
document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('hamzalahbal33@gmail.com');
    status.textContent = 'Email copié !';
  } catch {
    status.textContent = 'À copier : hamzalahbal33@gmail.com';
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();

