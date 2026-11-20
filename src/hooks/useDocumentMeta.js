import { useEffect } from 'react';

const SITE = 'NOVA WEAR';
// Placeholder production origin, swap for the real domain when deployed.
const BASE_URL = 'https://nova-wear.example.com';
const DEFAULT_DESC =
  'NOVA WEAR is a premium fashion concept store: considered outerwear, fine knitwear and modern tailoring designed to last. Portfolio demo.';

function setMeta(selector, attr, key, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Sets title, description, Open Graph tags and canonical URL for the current route. */
export function useDocumentMeta({ title, description = DEFAULT_DESC, image = '/og-image.jpg', path } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE}` : `${SITE} — Modern Essentials. Elevated.`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image.startsWith('/') ? BASE_URL + image : image);
    setMeta('meta[property="og:url"]', 'property', 'og:url', BASE_URL + (path ?? window.location.pathname));

    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', BASE_URL + (path ?? window.location.pathname));
  }, [title, description, image, path]);
}
