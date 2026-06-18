// Header block — Monroe nav. Fetches the nav fragment (content-first),
// builds a utility bar + main nav, wires hover dropdowns (desktop) and a
// hamburger drawer with accordion (mobile). All copy/links come from the
// fragment; only controls/markup are created here.

const DESKTOP = window.matchMedia('(min-width: 900px)');

// Inline SVGs for the social icons (source uses an icomoon icon font).
const SOCIAL_ICONS = {
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.62c-3.15 0-3.52.01-4.76.07-.9.04-1.39.2-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.12.32-.28.81-.32 1.71-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.04.9.2 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.12.81.28 1.71.32 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.9-.04 1.39-.2 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.12-.32.28-.81.32-1.71.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.04-.9-.2-1.39-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.12-.81-.28-1.71-.32-1.24-.06-1.61-.07-4.76-.07Zm0 2.76a5.42 5.42 0 1 1 0 10.84 5.42 5.42 0 0 1 0-10.84Zm0 1.62a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm5.6-2.9a1.27 1.27 0 1 1 0 2.54 1.27 1.27 0 0 1 0-2.54Z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.5a3 3 0 0 0-2.12-2.12C19.5 3.86 12 3.86 12 3.86s-7.5 0-9.38.52A3 3 0 0 0 .5 6.5C0 8.38 0 12 0 12s0 3.62.5 5.5a3 3 0 0 0 2.12 2.12c1.88.52 9.38.52 9.38.52s7.5 0 9.38-.52a3 3 0 0 0 2.12-2.12C24 15.62 24 12 24 12s0-3.62-.5-5.5ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"/></svg>',
};

function iconFor(label) {
  const key = label.trim().toLowerCase();
  return SOCIAL_ICONS[key] || '';
}

function getNavPath() {
  const meta = document.querySelector('meta[name="nav"]');
  const content = meta && meta.content;
  return content ? new URL(content, window.location).pathname : '/nav';
}

async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch(`${getNavPath()}.plain.html`);
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  // Fragment image paths are relative to /content (e.g. images/logo.png).
  // Make them absolute so they resolve on any page depth.
  tmp.querySelectorAll('img[src^="images/"], source[srcset^="images/"]').forEach((el) => {
    if (el.src) el.setAttribute('src', `/content/${el.getAttribute('src')}`);
    if (el.getAttribute('srcset')) el.setAttribute('srcset', `/content/${el.getAttribute('srcset')}`);
  });
  return tmp;
}

function buildUtilityBar(section) {
  const bar = document.createElement('div');
  bar.className = 'nav-utility';

  const links = document.createElement('div');
  links.className = 'nav-utility-links';
  section.querySelectorAll(':scope > p > a').forEach((a) => {
    links.append(a);
  });
  if (links.children.length) bar.append(links);

  const socialList = section.querySelector(':scope > ul');
  if (socialList) {
    const social = document.createElement('div');
    social.className = 'nav-social';
    socialList.querySelectorAll(':scope > li > a').forEach((a) => {
      const label = a.textContent.trim();
      a.setAttribute('aria-label', label);
      a.innerHTML = iconFor(label);
      social.append(a);
    });
    bar.append(social);
  }
  return bar;
}

function buildMainNav(section) {
  const main = document.createElement('div');
  main.className = 'nav-main';

  const brandP = [...section.querySelectorAll(':scope > p')].find((p) => p.querySelector('img'));
  if (brandP) {
    const brand = document.createElement('div');
    brand.className = 'nav-brand';
    brand.append(brandP.querySelector('a') || brandP);
    main.append(brand);
  }

  const list = section.querySelector(':scope > ul');
  if (list) {
    list.className = 'nav-list';
    list.querySelectorAll(':scope > li').forEach((li) => {
      const sub = li.querySelector(':scope > ul');
      if (sub) {
        li.classList.add('nav-drop');
        li.setAttribute('aria-expanded', 'false');
        sub.classList.add('nav-dropdown');
        const trigger = li.querySelector(':scope > a');
        if (trigger) trigger.classList.add('nav-drop-trigger');
        li.addEventListener('mouseenter', () => {
          if (DESKTOP.matches) li.setAttribute('aria-expanded', 'true');
        });
        li.addEventListener('mouseleave', () => {
          if (DESKTOP.matches) li.setAttribute('aria-expanded', 'false');
        });
        if (trigger) {
          trigger.addEventListener('click', (e) => {
            if (!DESKTOP.matches) {
              e.preventDefault();
              const open = li.getAttribute('aria-expanded') === 'true';
              li.setAttribute('aria-expanded', open ? 'false' : 'true');
            }
          });
        }
      }
    });
    main.append(list);
  }

  const ctaP = [...section.querySelectorAll(':scope > p')].reverse()
    .find((p) => p.querySelector('a') && !p.querySelector('img'));
  if (ctaP) {
    const cta = ctaP.querySelector('a');
    cta.className = 'nav-cta';
    main.append(cta);
  }
  return main;
}

export default async function decorate(block) {
  const frag = await fetchNav();
  block.textContent = '';
  if (!frag) return;

  const sections = [...frag.children].filter((c) => c.tagName === 'DIV');
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main navigation');

  if (sections[0]) nav.append(buildUtilityBar(sections[0]));
  if (sections[1]) nav.append(buildMainNav(sections[1]));

  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-menu-open', open);
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(hamburger, nav);
  block.append(wrapper);

  DESKTOP.addEventListener('change', () => {
    nav.classList.remove('nav-open');
    document.body.classList.remove('nav-menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    nav.querySelectorAll('.nav-drop').forEach((li) => li.setAttribute('aria-expanded', 'false'));
  });
}
