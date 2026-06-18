import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Cards (tout) variant.
 * Product touts on a dark theme. Each tout has a media background
 * (image or looping video), an overlaid heading and a "LEARN MORE" link.
 * Touts are arranged in rows of two where the first card spans 2/3 width
 * and the second spans 1/3 width (alternating emphasis).
 *
 * Expected authored structure: 2 columns per row.
 *   - cell 1: media (image OR a link to a video file)
 *   - cell 2: heading + a "LEARN MORE" link (the whole card becomes clickable)
 *
 * @param {Element} block The cards-tout block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Classify the two cells: media vs body.
    [...li.children].forEach((div) => {
      const hasImage = div.querySelector('picture, img');
      const videoLink = [...div.querySelectorAll('a[href]')].find((a) => (
        /\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(a.getAttribute('href') || '')
      ));
      if (hasImage || videoLink) {
        div.className = 'cards-tout-card-image';
        if (videoLink) {
          // Video cards stack the title above the video (not overlaid).
          li.classList.add('cards-tout-card-video');
          const video = document.createElement('video');
          video.muted = true;
          video.autoplay = true;
          video.loop = true;
          video.playsInline = true;
          video.setAttribute('playsinline', '');
          video.setAttribute('aria-hidden', 'true');
          const source = document.createElement('source');
          source.src = videoLink.getAttribute('href');
          video.append(source);
          videoLink.replaceWith(video);
        }
      } else {
        div.className = 'cards-tout-card-body';
      }
    });

    // Make the whole card a single link, using the body's link (LEARN MORE)
    // or any link present in the card.
    const linkEl = li.querySelector('a[href]:not([href$=".mp4"]):not([href$=".webm"]):not([href$=".ogv"]):not([href$=".mov"])');
    if (linkEl) {
      const wrapper = document.createElement('a');
      wrapper.href = linkEl.getAttribute('href');
      wrapper.className = 'cards-tout-card-link';
      while (li.firstChild) wrapper.append(li.firstChild);
      li.append(wrapper);
      // Unwrap the original inline link, keeping its "LEARN MORE" text.
      linkEl.replaceWith(...linkEl.childNodes);
    }

    ul.append(li);
  });

  // Optimize static images (videos are left untouched).
  ul.querySelectorAll('picture > img').forEach((img) => {
    const picture = img.closest('picture');
    if (picture) {
      picture.replaceWith(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]));
    }
  });

  block.textContent = '';
  block.append(ul);
}
