// Footer block — Monroe footer. Fetches the footer fragment (content-first),
// builds three stacked sections: primary link row, centered brand logo,
// and a bottom legal bar (DRiV logo + legal links). All copy/links/images
// come from the fragment; only structure/classes are added here.

import { getMetadata } from '../../scripts/aem.js';

function getFooterPath() {
  const meta = getMetadata('footer');
  return meta ? new URL(meta, window.location).pathname : '/footer';
}

async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch(`${getFooterPath()}.plain.html`);
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

export default async function decorate(block) {
  const frag = await fetchFooter();
  block.textContent = '';
  if (!frag) return;

  const sections = [...frag.children].filter((c) => c.tagName === 'DIV');

  // Section 0: full-width promo hero image band (sits above the footer content).
  if (sections[0]) {
    const heroImg = sections[0].querySelector('picture, img');
    if (heroImg) {
      const band = document.createElement('div');
      band.className = 'footer-hero-band';
      band.append(heroImg.closest('picture') || heroImg);
      block.append(band);
    }
  }

  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  // Section 1: primary link row.
  if (sections[1]) {
    const linkRow = document.createElement('div');
    linkRow.className = 'footer-links';
    const ul = sections[1].querySelector('ul');
    if (ul) linkRow.append(ul);
    footer.append(linkRow);
  }

  // Section 2: centered brand logo.
  if (sections[2]) {
    const brand = document.createElement('div');
    brand.className = 'footer-brand';
    const img = sections[2].querySelector('picture, img');
    if (img) brand.append(img.closest('picture') || img);
    footer.append(brand);
  }

  // Section 3: bottom legal bar (DRiV logo + legal links).
  if (sections[3]) {
    const bottom = document.createElement('div');
    bottom.className = 'footer-bottom';
    const logoLink = sections[3].querySelector('p a, p picture, p img');
    if (logoLink) {
      const driv = document.createElement('div');
      driv.className = 'footer-driv';
      driv.append(logoLink.closest('a') || logoLink);
      bottom.append(driv);
    }
    const ul = sections[3].querySelector('ul');
    if (ul) {
      ul.className = 'footer-legal';
      bottom.append(ul);
    }
    footer.append(bottom);
  }

  block.append(footer);
}
