/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-finder. Base block: columns.
 * Source: https://www.monroe.com/products/restore-your-ride.html
 * Selector: #page-content div.driv-part-finder-main.parbase
 * Generated: 2026-06-18T02:51:35Z
 *
 * Captures the dynamic "Find My Part" widget as a STATIC two-panel placeholder.
 * The live part-finder JS is NOT migrated. Per the `da` project rules the
 * plain.html fragment must NOT contain real <form>/<input>/<select>/<button>
 * controls — headings and field LABELS are captured as text/list content only.
 *
 * Output table (columns block):
 *   Row 1: block name (columns-finder)
 *   Row 2: single cell — "Find My Part" heading + intro paragraph (default content)
 *   Row 3: two cells — vehicle panel (h4 + field-label list) | part-number panel (h4 + label list)
 *
 * columns-finder.js reads block.firstElementChild.children as the columns and
 * styles each `> div > div` as a bordered panel with an `h4` title, so panel
 * titles are emitted as <h4> elements.
 */
export default function parse(element, { document }) {
  // --- Intro: heading + description (validated against source.html) ---
  const heading = element.querySelector(
    'h2.driv-part-finder-main-default-title, .driv-part-finder-main-default-text h2, h2',
  );
  const description = element.querySelector(
    'p.driv-part-finder-main-default-description, .driv-part-finder-main-default-text p, p',
  );

  // Empty-block guard: bail gracefully if essential content is missing.
  if (!heading && !description) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- Helpers to build static (control-free) panel content ---
  const makeHeading = (text) => {
    const h = document.createElement('h4');
    h.textContent = text;
    return h;
  };
  const makeLabelList = (labels) => {
    const ul = document.createElement('ul');
    labels.forEach((label) => {
      const li = document.createElement('li');
      li.textContent = label;
      ul.append(li);
    });
    return ul;
  };
  // Pull the visible label text from a ymm field's <label>, falling back to a
  // default. The source <label> contains a hidden "Search for" sr-only span and
  // the visible field name (e.g. "Year"); strip the sr-only prefix and any
  // stray control text (clear "×", spinner "Loading...").
  const fieldLabel = (selector, fallback) => {
    const label = element.querySelector(selector);
    if (label) {
      const srOnly = label.querySelector('.sr-only, span');
      const srText = srOnly ? srOnly.textContent : '';
      let text = label.textContent;
      if (srText) text = text.replace(srText, '');
      text = text
        .replace(/Search for/i, '')
        .replace(/×/g, '')
        .replace(/Loading\.{0,3}/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (text) return text;
    }
    return fallback;
  };

  // --- Panel 1: Search by Vehicle (Year / Make / Model) ---
  const vehicleTitleEl = element.querySelector(
    '.driv-ymm-search h4, h4.part-number_header, .ymm-search h4',
  );
  const vehicleTitle = vehicleTitleEl ? vehicleTitleEl.textContent.trim() : 'Search by Vehicle';
  const vehicleFields = [
    fieldLabel('.ymm-search-field.years label, .ymm-search-field.years', 'Year'),
    fieldLabel('.ymm-search-field.makes label, .ymm-search-field.makes', 'Make'),
    fieldLabel('.ymm-search-field.models label, .ymm-search-field.models', 'Model'),
  ];
  const vehiclePanel = [makeHeading(vehicleTitle), makeLabelList(vehicleFields)];

  // --- Panel 2: Search by Part Number ---
  // The part-number panel was not present in the cached source snippet; build it
  // from the analyzed structure with a fallback to any second-panel header found.
  const partTitleEl = element.querySelector(
    '.part-number-search h4, .driv-part-number-search h4, [class*="part-number"] h4:not(.part-number_header)',
  );
  const partTitle = partTitleEl ? partTitleEl.textContent.trim() : 'Search by Part Number';
  const partFields = ['Part number'];
  const partPanel = [makeHeading(partTitle), makeLabelList(partFields)];

  // --- Assemble cells to match the columns block table ---
  const cells = [];

  const introCell = [];
  if (heading) introCell.push(heading);
  if (description) introCell.push(description);
  if (introCell.length) cells.push([introCell]);

  cells.push([vehiclePanel, partPanel]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-finder', cells });
  element.replaceWith(block);
}
