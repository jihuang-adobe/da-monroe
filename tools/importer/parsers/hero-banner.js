/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Full-bleed page hero: a background image with an
 * overlaid heading + paragraph. Source: Monroe product-category "Restore Your
 * Ride" header hero (#page-content div.header-hero).
 *
 * Source structure:
 *   .header-hero-background              → background image (CSS background-image
 *                                          or a nested <img>)
 *   .header-hero-content h1             → heading
 *   .header-hero-content p              → paragraph
 *
 * Output: one block row, two cells — [ image, [heading, paragraph] ].
 */
export default function parse(element, { document }) {
  let image = element.querySelector('.header-hero-background img')
    || element.querySelector('img');

  // The hero photo is usually a CSS background-image on .header-hero-background.
  if (!image) {
    const bgEl = element.querySelector('.header-hero-background[style*="background"], [style*="background-image"]')
      || element.querySelector('.header-hero-background');
    const style = bgEl && bgEl.getAttribute('style');
    const match = style && style.match(/background(?:-image)?\s*:\s*[^;]*url\((['"]?)(.*?)\1\)/i);
    if (match && match[2]) {
      image = document.createElement('img');
      image.src = match[2];
      image.alt = '';
    }
  }
  const heading = element.querySelector('.header-hero-content h1, h1, h2, h3');
  const desc = element.querySelector('.header-hero-content p, p');

  const body = [];
  if (heading) body.push(heading);
  if (desc) body.push(desc);

  if (!image && body.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-banner',
    cells: [[image || '', body]],
  });
  element.replaceWith(block);
}
