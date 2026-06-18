/*
 * Find My Part block — functional clone of monroe.com's part finder.
 *
 * Two search modes (reverse-engineered from the live site):
 *  1. Search by Vehicle — cascading Year → Make → Model dropdowns populated
 *     from the live DRiV catalog API; submitting navigates to the live
 *     vehicle-results page.
 *  2. Search by Part Number — free-text input; submitting navigates to the
 *     live part-number-results page.
 *
 * Authored structure (unchanged): the block's first row is the heading +
 * intro; the second row holds two cells — a "Search by Vehicle" cell (h4 + a
 * <ul> of field labels) and a "Search by Part Number" cell (h4 + <ul>). This
 * decorator replaces those label lists with working form controls.
 */

const CATALOG_BASE = 'https://www.monroe.com/driv/partfinder';
const RESULTS_BASE = 'https://www.monroe.com/find-my-part';

// Brand/locale params the live catalog API requires. vehicle_group_ids 2,8 =
// "Car & Truck", matching the live site's default part-finder configuration.
const CATALOG_PARAMS = {
  brand: 'monroe',
  locale: 'en_US',
  country_code: 'US',
  vehicle_group_ids: '2,8',
};
const VEHICLE_TYPE = { value: '2,8', label: 'Car & Truck' };

function catalogUrl(resource, extra = {}) {
  const params = new URLSearchParams({ ...CATALOG_PARAMS, ...extra });
  return `${CATALOG_BASE}/api.catalog.${resource}?${params.toString()}`;
}

async function fetchCatalog(resource, extra) {
  const res = await fetch(catalogUrl(resource, extra));
  if (!res.ok) throw new Error(`catalog ${resource} ${res.status}`);
  const data = await res.json();
  // Response shape: { years: [...] } / { makes: [...] } / { models: [...] }
  return data[resource] || [];
}

function fillSelect(select, items, placeholder) {
  select.innerHTML = '';
  const opt0 = document.createElement('option');
  opt0.value = '';
  opt0.textContent = placeholder;
  select.append(opt0);
  items.forEach((item) => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.value;
    opt.dataset.label = item.value;
    select.append(opt);
  });
}

function buildVehicleSearch(cell) {
  const ul = cell.querySelector('ul');
  if (!ul) return;

  const form = document.createElement('form');
  form.className = 'finder-vehicle-form';
  form.setAttribute('aria-label', 'Search by vehicle');

  const fields = [
    { key: 'year', label: 'Year' },
    { key: 'make', label: 'Make' },
    { key: 'model', label: 'Model' },
  ];
  const selects = {};

  fields.forEach(({ key, label }) => {
    const wrap = document.createElement('div');
    wrap.className = 'finder-field';
    const sel = document.createElement('select');
    sel.className = 'finder-select';
    sel.name = key;
    sel.setAttribute('aria-label', label);
    fillSelect(sel, [], label);
    if (key !== 'year') sel.disabled = true;
    wrap.append(sel);
    form.append(wrap);
    selects[key] = sel;
  });

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'finder-search-btn';
  button.textContent = 'Search';
  button.disabled = true;
  form.append(button);

  const refreshButton = () => {
    button.disabled = !(selects.year.value && selects.make.value && selects.model.value);
  };

  // Year → load makes
  selects.year.addEventListener('change', async () => {
    selects.make.disabled = true;
    selects.model.disabled = true;
    fillSelect(selects.make, [], 'Make');
    fillSelect(selects.model, [], 'Model');
    refreshButton();
    if (!selects.year.value) return;
    try {
      const makes = await fetchCatalog('makes', { year_id: selects.year.value });
      fillSelect(selects.make, makes, 'Make');
      selects.make.disabled = false;
    } catch (e) { /* leave disabled on failure */ }
  });

  // Make → load models
  selects.make.addEventListener('change', async () => {
    selects.model.disabled = true;
    fillSelect(selects.model, [], 'Model');
    refreshButton();
    if (!selects.make.value) return;
    try {
      const models = await fetchCatalog('models', {
        year_id: selects.year.value,
        make_id: selects.make.value,
      });
      fillSelect(selects.model, models, 'Model');
      selects.model.disabled = false;
    } catch (e) { /* leave disabled on failure */ }
  });

  selects.model.addEventListener('change', refreshButton);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (button.disabled) return;
    const labelOf = (sel) => sel.options[sel.selectedIndex]?.dataset.label || '';
    const params = new URLSearchParams();
    params.set('type[value]', VEHICLE_TYPE.value);
    params.set('type[label]', VEHICLE_TYPE.label);
    params.set('year[value]', selects.year.value);
    params.set('year[label]', labelOf(selects.year));
    params.set('make[value]', selects.make.value);
    params.set('make[label]', labelOf(selects.make));
    params.set('model[value]', selects.model.value);
    params.set('model[label]', labelOf(selects.model));
    window.location.assign(`${RESULTS_BASE}/find-my-part-results.html?${params.toString()}`);
  });

  ul.replaceWith(form);

  // Populate years immediately.
  fetchCatalog('years')
    .then((years) => fillSelect(selects.year, years, 'Year'))
    .catch(() => { /* leave the placeholder if the catalog is unavailable */ });
}

function buildPartNumberSearch(cell) {
  const ul = cell.querySelector('ul');
  if (!ul) return;

  const form = document.createElement('form');
  form.className = 'finder-partnumber-form';
  form.setAttribute('aria-label', 'Search by part number');

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'finder-input';
  input.name = 'part';
  input.placeholder = 'Part Number';
  input.setAttribute('aria-label', 'Part number');

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'finder-search-btn';
  button.textContent = 'Search';

  form.append(input, button);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const part = input.value.trim();
    if (!part) return;
    const params = new URLSearchParams({ part });
    window.location.assign(`${RESULTS_BASE}/part-number-results.html?${params.toString()}`);
  });

  ul.replaceWith(form);
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-finder-${cols.length}-cols`);

  // The panels row is the block's last child; it holds the two search cells.
  const panels = block.lastElementChild;
  const cells = panels ? [...panels.children] : [];

  cells.forEach((cell) => {
    const heading = cell.querySelector('h4');
    const title = (heading?.textContent || '').toLowerCase();
    if (title.includes('vehicle')) {
      buildVehicleSearch(cell);
    } else if (title.includes('part')) {
      buildPartNumberSearch(cell);
    }
  });
}
