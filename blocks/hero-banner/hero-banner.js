/**
 * Hero Banner block — Monroe full-bleed page hero.
 * A background image fills the band while the heading + paragraph sit overlaid,
 * left-aligned and vertically centered, in white text.
 * Source: Monroe product-category "Restore Your Ride" header hero.
 *
 * Expected authored structure (one row, two cells):
 *   row 1: cell 1 = background image; cell 2 = heading + paragraph
 *
 * @param {Element} block The hero-banner block element
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;
  const cells = [...row.children];

  const mediaCell = cells.find((c) => c.querySelector('picture, img'));
  const bodyCell = cells.find((c) => c !== mediaCell);

  if (mediaCell) mediaCell.className = 'hero-banner-bg';
  if (bodyCell) bodyCell.className = 'hero-banner-body';
}
