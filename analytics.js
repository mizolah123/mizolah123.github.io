/* Google Analytics : chargé uniquement après accord du visiteur. */
(() => {
  'use strict';
  const ID = 'G-RH72SWH2CM';
  const KEY = 'portfolio-analytics-consent';
  let enabled = false;
  let choice = null;
  try { choice = localStorage.getItem(KEY); } catch {}
  window['ga-disable-' + ID] = true;

  function start() {
    if (enabled) return;
    enabled = true;
    window['ga-disable-' + ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ID, {
      send_page_view: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.append(script);
  }

  const panel = document.querySelector('#analytics-consent');
  const settings = document.querySelector('#analytics-settings');
  if (!panel || !settings) return;

  function setChoice(value) {
    choice = value;
    try { localStorage.setItem(KEY, value); } catch {}
    panel.hidden = true;
    if (value === 'accepted') start();
    else {
      window['ga-disable-' + ID] = true;
      // Retire les cookies GA du site après un retrait du consentement.
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (!/^_ga(?:_|$)/.test(name)) return;
        for (const domain of ['', '; domain=' + location.hostname, '; domain=.' + location.hostname]) {
          document.cookie = name + '=; Max-Age=0; path=/' + domain;
        }
      });
      if (enabled) location.reload();
    }
    settings.focus({ preventScroll: true });
  }

  document.querySelector('#analytics-accept').addEventListener('click', () => setChoice('accepted'));
  document.querySelector('#analytics-refuse').addEventListener('click', () => setChoice('refused'));
  settings.addEventListener('click', () => {
    panel.hidden = false;
    document.querySelector('#analytics-refuse').focus({ preventScroll: true });
  });
  if (choice === 'accepted') start();
  panel.hidden = choice === 'accepted' || choice === 'refused';

  document.addEventListener('click', event => {
    if (!enabled || choice !== 'accepted') return;
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (!url.pathname.endsWith('/assets/CV_Hamza_Lahbal.pdf')) return;
    // Événement distinct de file_download, éventuellement généré automatiquement par GA4.
    window.gtag('event', 'cv_download', {
      send_to: ID,
      file_name: 'CV_Hamza_Lahbal.pdf',
      file_extension: 'pdf',
      link_url: url.href,
      transport_type: 'beacon'
    });
    // Aucun preventDefault : le téléchargement fonctionne même si Analytics est bloqué.
  });
})();
