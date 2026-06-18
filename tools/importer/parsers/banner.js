/* eslint-disable */
/* global WebImporter */
/**
 * Parser for banner. Full-width promo banner: media image + text column
 * (heading + paragraph + CTA). Source: Monroe product-category "Accessories"
 * banner (#page-content div.updated-tout).
 *
 * Source structure (flat): img (showcase) + h2 + p + .tout-cta a, all siblings
 * inside .updated-tout.
 *
 * Output: one block row, two cells — [ image, [heading, paragraph, cta] ].
 */
export default function parse(element, { document }) {
  const image = element.querySelector('.showcase-image img, img.cq-dd-image')
    || element.querySelector('img');
  const heading = element.querySelector('h1, h2, h3, h4');
  const desc = element.querySelector('.tout-content p, p');
  const cta = element.querySelector('.tout-cta a[href], a[href]');

  const body = [];
  if (heading) body.push(heading);
  if (desc) body.push(desc);
  if (cta) {
    const link = document.createElement('a');
    link.href = cta.getAttribute('href');
    link.textContent = (cta.textContent || 'VIEW PRODUCT').trim() || 'VIEW PRODUCT';
    body.push(link);
  }

  if (!image && body.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'banner',
    cells: [[image || '', body]],
  });
  element.replaceWith(block);
}
