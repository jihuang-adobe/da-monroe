/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards. Base: cards.
 * Source: https://www.monroe.com/products/restore-your-ride.html
 * Generated: 2026-06-18
 *
 * Light, image-on-top product cards. On the Restore Your Ride page the section
 * holds 6 product cards, each a `div.tout.parbase`. The page-templates selector
 * `#page-content div.tout.parbase` matches each card individually, so the import
 * script calls this parser ONCE PER card element.
 *
 * Source structure (one .tout):
 *   div.tout.parbase
 *     .showcase-image .image > div > img         (product image)
 *     .tout-content
 *       h4                                        (product name; may contain <sup>)
 *       p                                         (description)
 *       .tout-cta > a.button-main                 ("VIEW PRODUCT" link)
 *
 * Output: a single-card cards block.
 *   - First row: block name ("cards").
 *   - One content row with one cell containing the image followed by the
 *     body content (heading + description + VIEW PRODUCT link). The cards
 *     block's decorateDefault() separates the image into .cards-card-image and
 *     the remaining content into .cards-card-body, image-on-top.
 *
 * Defensive: this parser handles being called either on a single `.tout` card
 * (the expected case per the page-templates mapping) or on a container that
 * holds multiple `.tout` siblings — in which case one row is emitted per card.
 */
export default function parse(element, { document }) {
  // Determine the set of cards to process. Normally `element` IS one .tout card.
  // If it instead contains multiple .tout descendants, treat each as a card.
  let cards = [];
  if (element.matches && element.matches('div.tout, .tout, .updated-tout')) {
    cards = [element];
  } else {
    cards = Array.from(element.querySelectorAll('div.tout, .tout'));
  }
  if (cards.length === 0) {
    // Fall back to treating the element itself as a single card container.
    cards = [element];
  }

  const cells = [];

  cards.forEach((card) => {
    // --- Image --------------------------------------------------------------
    // Prefer the showcase image; fall back to any image inside the card.
    const image = card.querySelector('.showcase-image img, .tout-showcase img')
      || card.querySelector('img');

    // --- Body content -------------------------------------------------------
    const content = card.querySelector('.tout-content') || card;
    const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
    const description = content.querySelector('p');

    // "VIEW PRODUCT" link — points at the product page.
    const ctaLink = content.querySelector('.tout-cta a[href], a.button-main[href], a[href]');

    const cardCell = [];
    if (image) cardCell.push(image);
    if (heading) cardCell.push(heading);
    if (description) cardCell.push(description);
    if (ctaLink) {
      // Normalize the CTA: keep it as a link with clean label text.
      const link = document.createElement('a');
      link.href = ctaLink.getAttribute('href');
      const title = ctaLink.getAttribute('title');
      if (title && title.trim()) link.title = title.trim();
      link.textContent = (ctaLink.textContent || 'VIEW PRODUCT').trim() || 'VIEW PRODUCT';
      cardCell.push(link);
    }

    // Only emit a row if the card has meaningful content.
    if (image || heading || description) {
      cells.push([cardCell]);
    }
  });

  // Empty-block guard: nothing usable found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
