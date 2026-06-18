/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-tout. Base: cards.
 * Source: https://www.monroe.com/ (Tout Product Cards section)
 * Generated: 2026-06-18
 *
 * Dark product touts with a media (image or video) background, an overlaid
 * heading and a "LEARN MORE" link, arranged in rows of two with alternating
 * 2/3 + 1/3 width.
 *
 * Source structure: the section contains row-wrapper <div>s. Each tout is an
 * <a href="...product page..."> wrapping:
 *   - media: an <img> OR a <video><source src="...mp4"> (+ an overlay product <img>)
 *   - an <h2> product name
 *   - a "LEARN MORE" inline span/label
 *
 * Output: one block row per tout.
 *   - cell 1: media (image element, OR a link to the video file)
 *   - cell 2: heading (h2) + a "LEARN MORE" link to the product page
 */
export default function parse(element, { document }) {
  // Each tout is an anchor whose href points to a product page (not a media file).
  const toutAnchors = Array.from(element.querySelectorAll('a[href]')).filter((a) => {
    const href = a.getAttribute('href') || '';
    return !/\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(href);
  });

  const cells = [];

  toutAnchors.forEach((anchor) => {
    const href = anchor.getAttribute('href');

    // --- Media cell ---------------------------------------------------------
    // A tout's media is either a <video><source src=".mp4"> (with an overlay
    // product image) or a background <img>.
    const videoSource = anchor.querySelector('video source[src], source[src]');
    let mediaCell;

    if (videoSource && /\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(videoSource.getAttribute('src') || '')) {
      // Represent video as a link to the media file (the block JS converts a
      // link to a .mp4/.webm/... into a <video> element).
      const videoLink = document.createElement('a');
      const src = videoSource.getAttribute('src');
      videoLink.href = src;
      videoLink.textContent = src;
      mediaCell = videoLink;
    } else {
      // Static image background. Prefer the background image (object-cover,
      // absolute) over any inner overlay image.
      const bgImage = anchor.querySelector('img[class*="object-cover"], img[class*="absolute"]')
        || anchor.querySelector('img');
      mediaCell = bgImage || '';
    }

    // --- Body cell ----------------------------------------------------------
    const heading = anchor.querySelector('h2, h1, h3, [class*="title"]');

    // Build a "LEARN MORE" link pointing at the product page.
    const learnMore = document.createElement('a');
    learnMore.href = href;
    // Reuse the source label text if available, else default to "LEARN MORE".
    const label = anchor.querySelector('span.leading-normal');
    learnMore.textContent = (label && label.textContent.trim()) || 'LEARN MORE';

    const bodyCell = [];
    if (heading) bodyCell.push(heading);
    bodyCell.push(learnMore);

    cells.push([mediaCell, bodyCell]);
  });

  // Empty-block guard: no touts found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tout', cells });
  element.replaceWith(block);
}
