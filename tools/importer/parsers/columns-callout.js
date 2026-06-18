/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-callout.
 * Base block: columns
 * Source URL: https://www.monroe.com/products/restore-your-ride.html
 * Source selector: #page-content div.fmmp-plaintext
 * Generated: 2026-06-18
 *
 * Centered dark callout: Monroe "M" logo image + H3 heading + paragraph + CTA link.
 * blocks/columns-callout/columns-callout.js treats block.firstElementChild.children
 * as columns; a column whose sole content is a <picture> becomes the image column
 * (ordered above the text). So we emit a single row with two cells:
 *   cell 1 -> logo image (image column)
 *   cell 2 -> heading + paragraph + CTA link (text column)
 */
export default function parse(element, { document }) {
  // Logo image (Monroe "M"). Validated against source: <img class="mobile-monroe-m">.
  const logo = element.querySelector('img.mobile-monroe-m, img');

  // Heading. Source uses <h3>; allow other levels as fallback.
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');

  // Descriptive paragraph. First non-empty <p> in the text content.
  const paragraph = Array.from(element.querySelectorAll('p'))
    .find((p) => p.textContent.trim().length > 0) || null;

  // CTA link. Validated: <a class="button-secondary disable-hover" href="...">.
  const cta = element.querySelector('a.button-secondary, a.button, a[href]');

  // Empty-block guard: bail gracefully if no meaningful content found.
  if (!heading && !paragraph && !cta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Image cell: logo only (becomes columns-callout-img-col in decorate()).
  const imageCell = [];
  if (logo) imageCell.push(logo);

  // Text cell: heading + paragraph + CTA, in source order.
  const textCell = [];
  if (heading) textCell.push(heading);
  if (paragraph) textCell.push(paragraph);
  if (cta) textCell.push(cta);

  const cells = [
    [imageCell, textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-callout', cells });
  element.replaceWith(block);
}
