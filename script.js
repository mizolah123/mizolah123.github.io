// Aucun framework : le navigateur exécute directement ce fichier.
const root = document.documentElement;
const themeButton = document.querySelector('.theme');
function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-label', theme === 'light' ? 'Activer le thème sombre' : 'Activer le thème clair');
  document.querySelector('meta[name="theme-color"]').content = theme === 'light' ? '#f7f5f5' : '#080808';
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



// Simulation locale : aucune commande système n’est réellement exécutée.
(() => {
  const output = document.querySelector('#terminal-output');
  const form = document.querySelector('#terminal-form');
  const input = document.querySelector('#terminal-command');
  const status = document.querySelector('#terminal-status');
  if (!output || !form || !input) return;
  let runId = 0;
  const history = [];
  let historyIndex = 0;
  const commands = {
    whoami: 'Hamza Lahbal\nÉlève-ingénieur en Sécurité IT et Confiance Numérique · ENSA Agadir',
    pwd: '/home/hamza/portfolio',
    ls: 'about.txt    skills.txt    projects/    contact.txt',
    'ls -la': 'drwxr-xr-x  hamza  projects/\n-rw-r--r--  hamza  about.txt\n-rw-r--r--  hamza  skills.txt\n-rw-r--r--  hamza  contact.txt',
    'ls projects': 'big-data-security/    amanguard/    cybermizo/    3ecom/',
    'ls projects/': 'big-data-security/    amanguard/    cybermizo/    3ecom/',
    'cat about.txt': 'Cybersécurité · Systèmes & réseaux\nRecherche de PFE 2027. Curieux, passionné par les CTF et l’analyse de logs.',
    'cat skills.txt': 'SOC / SIEM : Wazuh, analyse de logs\nSystèmes : Linux, Windows Server, Active Directory\nRéseaux : TCP/IP, VLAN, VPN IPsec\nDéveloppement : Python, JavaScript, FastAPI\nDonnées : Spark, Kafka, Cassandra',
    'cat contact.txt': 'Email : hamzalahbal33@gmail.com\nTéléphone : +212 762 946 483\nGitHub : github.com/mizolah123',
    contact: 'Email : hamzalahbal33@gmail.com\nTéléphone : +212 762 946 483\nLinkedIn : linkedin.com/in/hamza-lahbal-08a039248/',
    'uname -a': 'Portfolio Linux · environnement simulé en JavaScript',
    help: 'whoami · pwd · ls · ls -la · ls projects/\ncat about.txt · cat skills.txt · cat contact.txt\ncontact · uname -a · date · clear\nCes commandes présentent mon profil ; ce terminal est une simulation.'
  };
  function answer(command) {
    if (command === 'date') return new Intl.DateTimeFormat('fr-MA', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Africa/Casablanca' }).format(new Date());
    return commands[command] ?? 'Commande inconnue. Tape help pour voir les commandes disponibles.';
  }
  function scroll() { output.scrollTop = output.scrollHeight; }
  function line(text, kind) {
    const p = document.createElement('p');
    p.className = kind;
    p.textContent = text;
    output.append(p);
    while (output.childElementCount > 80) output.firstElementChild.remove();
    scroll();
    return p;
  }
  function commandLine(command) {
    const p = line('', 'terminal-command');
    const prompt = document.createElement('span');
    prompt.textContent = 'hamza@portfolio:~$ ';
    const typed = document.createElement('span');
    typed.style.color = 'inherit';
    typed.textContent = command;
    p.append(prompt, typed);
    return typed;
  }
  function stopDemo() {
    runId++;
    output.querySelectorAll('.terminal-typing').forEach(node => node.classList.remove('terminal-typing'));
  }
  function execute(raw) {
    stopDemo();
    const command = raw.trim().replace(/\s+/g, ' ');
    if (!command) return;
    history.push(command);
    historyIndex = history.length;
    if (command === 'clear') output.replaceChildren();
    else {
      commandLine(command);
      line(answer(command), 'terminal-result');
    }
    status.textContent = command === 'clear' ? 'Terminal effacé.' : 'Résultat affiché.';
    input.value = '';
  }
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function demo() {
    stopDemo();
    const id = runId;
    output.replaceChildren();
    status.textContent = '';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (const command of ['whoami', 'pwd', 'ls', 'cat skills.txt']) {
      if (id !== runId) return;
      const typed = commandLine('');
      typed.classList.add('terminal-typing');
      for (const char of command) {
        if (id !== runId) return;
        typed.textContent += char;
        scroll();
        if (!reduced) await wait(55);
      }
      typed.classList.remove('terminal-typing');
      if (id !== runId) return;
      line(answer(command), 'terminal-result');
      if (!reduced) await wait(550);
    }
    status.textContent = 'À toi : essaie une commande.';
  }
  form.addEventListener('submit', event => { event.preventDefault(); execute(input.value); });
  input.addEventListener('focus', stopDemo);
  input.addEventListener('keydown', event => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    historyIndex = Math.max(0, Math.min(history.length, historyIndex + (event.key === 'ArrowUp' ? -1 : 1)));
    input.value = history[historyIndex] ?? '';
  });
  document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => execute(button.dataset.command)));
  document.querySelector('#terminal-replay').addEventListener('click', demo);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); if (!history.length && document.activeElement !== input) demo(); }
    }, { threshold: 0.2 });
    observer.observe(output);
  } else demo();
})();
