/**
 * Banner block — Monroe full-width promo banner.
 * A large media image on one side and a text column (heading + paragraph + CTA)
 * on the other. Source: Monroe product-category "Accessories" banner.
 *
 * Expected authored structure (one row, two cells):
 *   row 1: cell 1 = image; cell 2 = heading + paragraph + CTA link
 *
 * @param {Element} block The banner block element
 */
import { revealOnScroll } from '../../scripts/shared.js';

export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;
  const cells = [...row.children];

  const mediaCell = cells.find((c) => c.querySelector('picture, img'));
  const bodyCell = cells.find((c) => c !== mediaCell);

  if (mediaCell) mediaCell.className = 'banner-media';
  if (bodyCell) {
    bodyCell.className = 'banner-body';
    // Promote a standalone link into a styled CTA.
    const cta = bodyCell.querySelector('a');
    if (cta) cta.classList.add('banner-cta');
  }

  revealOnScroll([mediaCell, bodyCell].filter(Boolean), { threshold: 0.15, stagger: 120 });
}
