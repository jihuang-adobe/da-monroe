/* eslint-disable */
/* global WebImporter */
/**
 * Parser for table. Base: table.
 * Source: https://www.monroe.com/products/restore-your-ride.html (Product comparison table)
 * Generated: 2026-06-18
 *
 * Standard EDS "table" block. The matched element is the source <table>
 * (selector: #page-content div.table-scroll-wrapper table), a 5-column product
 * comparison table:
 *   - header row: "", "Quick-Strut Assembly", "OESpectrum Shocks & Struts",
 *     "OESpectrum Shock & Mount Assembly", "Reflex Shocks & Struts"
 *   - feature rows: first cell = feature label, remaining cells contain a
 *     checkmark (✓) or are empty.
 *
 * Output (table block): first block row = block name ("table"), then one block
 * row per source <tr>, each containing one cell per source <th>/<td>. Checkmark
 * and empty cells are preserved faithfully.
 *
 * The table block JS treats the first block row as the header (<th>) and the
 * remaining rows as <td> body rows, matching the source markup.
 */
export default function parse(element, { document }) {
  // Collect every row from the source table, in document order, regardless of
  // whether it sits in a <thead> or <tbody>.
  const rows = Array.from(element.querySelectorAll('tr'));

  const cells = [];

  rows.forEach((tr) => {
    // Each <th>/<td> in the source row becomes one cell in the block row.
    const sourceCells = Array.from(tr.querySelectorAll(':scope > th, :scope > td'));

    const rowCells = sourceCells.map((cell) => {
      const text = (cell.textContent || '').replace(/ /g, ' ').trim();

      // Empty / non-breaking-space cells stay empty.
      if (!text) return '';

      // A bare checkmark cell stays a plain checkmark.
      if (text === '✓') return '✓';

      // Otherwise preserve the cell's inner content (e.g. <b>label</b>) so
      // emphasis/markup in header and label cells is not flattened.
      const fragment = document.createElement('div');
      fragment.append(...cell.cloneNode(true).childNodes);
      return fragment;
    });

    cells.push(rowCells);
  });

  // Empty-block guard: no rows found in the source table.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'table', cells });
  element.replaceWith(block);
}
