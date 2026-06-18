/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-intro.
 * Base block: hero.
 * Source URL: https://www.monroe.com/
 * Generated: 2026-06-18
 *
 * Dark centered text-only hero: an h2 heading (with an accent word in a
 * span), a supporting paragraph, and a single CTA link. No media.
 * Produces a single content row matching the library example:
 *   [ heading (h2) + paragraph + CTA link ]
 */
export default function parse(element, { document }) {
  // Heading: h2 in source; allow h1/h3 + title-class fallbacks for variation.
  const heading = element.querySelector('h1, h2, h3, [class*="title"], [class*="heading"]');

  // Supporting paragraph(s). Scope to direct descendants of the content wrapper
  // to avoid capturing text nested inside the CTA link.
  const paragraphs = Array.from(element.querySelectorAll('p')).filter(
    (p) => !p.closest('a'),
  );

  // CTA link(s). Source has a single styled anchor; collect any present.
  const ctaLinks = Array.from(element.querySelectorAll('a[href]'));

  // Empty-block guard: bail gracefully if no essential content found.
  if (!heading && paragraphs.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Build a single content cell stacking heading, paragraph(s), CTA(s).
  // Wrap in one container so the importer renders ONE cell (one column),
  // not one column per element. The single row holds this single cell.
  const contentCell = document.createElement('div');
  if (heading) contentCell.append(heading);
  paragraphs.forEach((p) => contentCell.append(p));
  ctaLinks.forEach((a) => contentCell.append(a));

  const cells = [[contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-intro', cells });
  element.replaceWith(block);
}
