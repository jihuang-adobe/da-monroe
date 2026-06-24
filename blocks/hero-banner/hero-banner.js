import { revealOnScroll } from '../../scripts/shared.js';

/**
 * Hero Banner block — light/minimal two-up hero.
 * Classifies the media cell and text cell, then reveals them on load with a
 * gentle fade/slide.
 *
 * Expected authored structure (one row, two cells):
 *   row 1: cell 1 = image; cell 2 = heading + paragraph
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

  const toReveal = [bodyCell, mediaCell].filter(Boolean);
  revealOnScroll(toReveal, { threshold: 0.1, stagger: 120 });
}
