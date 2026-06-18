/**
 * Hero (intro) variant.
 * Centered, text-only introduction statement on a dark background:
 * heading + paragraph + CTA. No media.
 *
 * The heading reads "QUALITY &<br>DEPENDABILITY"; the source highlights the
 * line after the <br> in brand yellow. We wrap that trailing text in an
 * accent span so CSS can color it without requiring authors to add markup.
 *
 * @param {Element} block The hero-intro block element
 */
export default function decorate(block) {
  if (!block.querySelector(':scope picture, :scope img')) {
    block.classList.add('no-image');
  }

  const heading = block.querySelector('h1, h2, h3');
  const br = heading?.querySelector('br');
  if (heading && br) {
    // Wrap every node after the <br> in an accent span.
    const accent = document.createElement('span');
    accent.className = 'hero-intro-accent';
    let node = br.nextSibling;
    const trailing = [];
    while (node) {
      trailing.push(node);
      node = node.nextSibling;
    }
    if (trailing.length) {
      trailing.forEach((n) => accent.appendChild(n));
      heading.appendChild(accent);
    }
  }
}
