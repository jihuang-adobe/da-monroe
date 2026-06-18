/**
 * Hero (video) variant.
 * Top-of-page brand banner: headline + logo + CTA, with a looping video below.
 *
 * Expected authored structure (1 column, two rows):
 *   - a row with a link to a video file (e.g. .mp4)
 *   - a row of default content: headline (h1), logo image, CTA link
 *
 * The video link is converted into an autoplay, muted, looping, inline <video>
 * rendered in a rounded media container that is moved below the headline block.
 *
 * @param {Element} block The hero-video block element
 */
export default function decorate(block) {
  // Convert any authored link that points at a video file into a <video>.
  const videoLinks = [...block.querySelectorAll('a[href]')].filter((a) => (
    /\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(a.getAttribute('href') || '')
  ));

  videoLinks.forEach((link) => {
    const src = link.getAttribute('href');
    const wrapper = document.createElement('div');
    wrapper.className = 'hero-video-media';

    const video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');

    const source = document.createElement('source');
    source.src = src;
    video.append(source);
    wrapper.append(video);

    // Replace the link (and its enclosing paragraph if it only held the link).
    const parent = link.parentElement;
    link.replaceWith(wrapper);
    if (parent && parent.tagName === 'P' && parent.textContent.trim() === '') {
      parent.replaceWith(...parent.childNodes);
    }

    // The video is authored in the first row; render it below the headline.
    block.append(wrapper);
  });

  // Mark the paragraph that holds the logo image (and CTA) so it can be
  // stacked and centered via CSS.
  block.querySelectorAll('picture img, img').forEach((img) => {
    if (!img.closest('.hero-video-media')) {
      img.closest('p, div')?.classList.add('hero-video-logo');
    }
  });
}
