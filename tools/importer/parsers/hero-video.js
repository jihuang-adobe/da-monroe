/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-video
 * Base block: hero
 * Source: https://www.monroe.com/ (homepage hero)
 * Generated: 2026-06-18
 *
 * Target table (from library example):
 *   Row 1: hero media — link to the looping .mp4 video
 *   Row 2: headline (h1) + logo image + CTA link
 *
 * The hero-video block decorate() converts any authored link pointing at a video
 * file (.mp4/.webm/.ogv/.mov) into an inline <video>. So the parser must emit the
 * video source URL as an anchor, NOT as a <video> element.
 */
export default function parse(element, { document }) {
  // --- INPUT EXTRACTION (validated against source.html) ---

  // Headline: <h1 class="font-futura-tot-bol-cond ...">
  const heading = element.querySelector('h1, h2, [class*="title"]');

  // Logo image: <img alt="Monroe Logo"> that is NOT inside the video container.
  // Pick the first img that is not a descendant of a <video>.
  const logo = Array.from(element.querySelectorAll('img')).find(
    (img) => !img.closest('video'),
  );

  // CTA link: the brand yellow button anchor. Exclude any video-file links.
  const ctaLink = Array.from(element.querySelectorAll('a[href]')).find(
    (a) => !/\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(a.getAttribute('href') || ''),
  );

  // Hero media: the looping video. Source URL lives on <video><source src> or
  // a <video src>; fall back to an authored anchor that already points at a video file.
  const videoSourceEl = element.querySelector('video source[src], video[src]');
  let videoUrl = null;
  if (videoSourceEl) {
    videoUrl = videoSourceEl.getAttribute('src');
  } else {
    const videoAnchor = Array.from(element.querySelectorAll('a[href]')).find(
      (a) => /\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(a.getAttribute('href') || ''),
    );
    if (videoAnchor) videoUrl = videoAnchor.getAttribute('href');
  }

  // Empty-block guard: bail gracefully if neither headline nor media exists.
  if (!heading && !videoUrl) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- OUTPUT CONSTRUCTION (matches library example) ---
  const cells = [];

  // Row 1: hero media — emit the video URL as a link so decorate() can build <video>.
  if (videoUrl) {
    const mediaLink = document.createElement('a');
    mediaLink.href = videoUrl;
    mediaLink.textContent = videoUrl;
    cells.push([mediaLink]);
  }

  // Row 2: a single cell containing headline + logo image + CTA link.
  // Wrap in one container so they stay in one cell (one column), matching the
  // library example, instead of being split into separate columns.
  const contentCell = document.createElement('div');
  if (heading) contentCell.append(heading);
  if (logo) contentCell.append(logo);
  if (ctaLink) contentCell.append(ctaLink);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
