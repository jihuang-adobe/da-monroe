/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-product-category.js
  var import_product_category_exports = {};
  __export(import_product_category_exports, {
    default: () => import_product_category_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    let image = element.querySelector(".header-hero-background img") || element.querySelector("img");
    if (!image) {
      const bgEl = element.querySelector('.header-hero-background[style*="background"], [style*="background-image"]') || element.querySelector(".header-hero-background");
      const style = bgEl && bgEl.getAttribute("style");
      const match = style && style.match(/background(?:-image)?\s*:\s*[^;]*url\((['"]?)(.*?)\1\)/i);
      if (match && match[2]) {
        image = document.createElement("img");
        image.src = match[2];
        image.alt = "";
      }
    }
    const heading = element.querySelector(".header-hero-content h1, h1, h2, h3");
    const desc = element.querySelector(".header-hero-content p, p");
    const body = [];
    if (heading) body.push(heading);
    if (desc) body.push(desc);
    if (!image && body.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-banner",
      cells: [[image || "", body]]
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    let cards = [];
    if (element.matches && element.matches("div.tout, .tout, .updated-tout")) {
      cards = [element];
    } else {
      cards = Array.from(element.querySelectorAll("div.tout, .tout"));
    }
    if (cards.length === 0) {
      cards = [element];
    }
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".showcase-image img, .tout-showcase img") || card.querySelector("img");
      const content = card.querySelector(".tout-content") || card;
      const heading = content.querySelector("h1, h2, h3, h4, h5, h6");
      const description = content.querySelector("p");
      const ctaLink = content.querySelector(".tout-cta a[href], a.button-main[href], a[href]");
      const cardCell = [];
      if (image) cardCell.push(image);
      if (heading) cardCell.push(heading);
      if (description) cardCell.push(description);
      if (ctaLink) {
        const link = document.createElement("a");
        link.href = ctaLink.getAttribute("href");
        const title = ctaLink.getAttribute("title");
        if (title && title.trim()) link.title = title.trim();
        link.textContent = (ctaLink.textContent || "VIEW PRODUCT").trim() || "VIEW PRODUCT";
        cardCell.push(link);
      }
      if (image || heading || description) {
        cells.push([cardCell]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/banner.js
  function parse3(element, { document }) {
    const image = element.querySelector(".showcase-image img, img.cq-dd-image") || element.querySelector("img");
    const heading = element.querySelector("h1, h2, h3, h4");
    const desc = element.querySelector(".tout-content p, p");
    const cta = element.querySelector(".tout-cta a[href], a[href]");
    const body = [];
    if (heading) body.push(heading);
    if (desc) body.push(desc);
    if (cta) {
      const link = document.createElement("a");
      link.href = cta.getAttribute("href");
      link.textContent = (cta.textContent || "VIEW PRODUCT").trim() || "VIEW PRODUCT";
      body.push(link);
    }
    if (!image && body.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "banner",
      cells: [[image || "", body]]
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table.js
  function parse4(element, { document }) {
    const rows = Array.from(element.querySelectorAll("tr"));
    const cells = [];
    rows.forEach((tr) => {
      const sourceCells = Array.from(tr.querySelectorAll(":scope > th, :scope > td"));
      const rowCells = sourceCells.map((cell) => {
        const text = (cell.textContent || "").replace(/ /g, " ").trim();
        if (!text) return "";
        if (text === "\u2713") return "\u2713";
        const fragment = document.createElement("div");
        fragment.append(...cell.cloneNode(true).childNodes);
        return fragment;
      });
      cells.push(rowCells);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "table", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-callout.js
  function parse5(element, { document }) {
    const logo = element.querySelector("img.mobile-monroe-m, img");
    const heading = element.querySelector("h1, h2, h3, h4, h5, h6");
    const paragraph = Array.from(element.querySelectorAll("p")).find((p) => p.textContent.trim().length > 0) || null;
    const cta = element.querySelector("a.button-secondary, a.button, a[href]");
    if (!heading && !paragraph && !cta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = [];
    if (logo) imageCell.push(logo);
    const textCell = [];
    if (heading) textCell.push(heading);
    if (paragraph) textCell.push(paragraph);
    if (cta) textCell.push(cta);
    const cells = [
      [imageCell, textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-callout", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-finder.js
  function parse6(element, { document }) {
    const heading = element.querySelector(
      "h2.driv-part-finder-main-default-title, .driv-part-finder-main-default-text h2, h2"
    );
    const description = element.querySelector(
      "p.driv-part-finder-main-default-description, .driv-part-finder-main-default-text p, p"
    );
    if (!heading && !description) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const makeHeading = (text) => {
      const h = document.createElement("h4");
      h.textContent = text;
      return h;
    };
    const makeLabelList = (labels) => {
      const ul = document.createElement("ul");
      labels.forEach((label) => {
        const li = document.createElement("li");
        li.textContent = label;
        ul.append(li);
      });
      return ul;
    };
    const fieldLabel = (selector, fallback) => {
      const label = element.querySelector(selector);
      if (label) {
        const srOnly = label.querySelector(".sr-only, span");
        const srText = srOnly ? srOnly.textContent : "";
        let text = label.textContent;
        if (srText) text = text.replace(srText, "");
        text = text.replace(/Search for/i, "").replace(/×/g, "").replace(/Loading\.{0,3}/gi, "").replace(/\s+/g, " ").trim();
        if (text) return text;
      }
      return fallback;
    };
    const vehicleTitleEl = element.querySelector(
      ".driv-ymm-search h4, h4.part-number_header, .ymm-search h4"
    );
    const vehicleTitle = vehicleTitleEl ? vehicleTitleEl.textContent.trim() : "Search by Vehicle";
    const vehicleFields = [
      fieldLabel(".ymm-search-field.years label, .ymm-search-field.years", "Year"),
      fieldLabel(".ymm-search-field.makes label, .ymm-search-field.makes", "Make"),
      fieldLabel(".ymm-search-field.models label, .ymm-search-field.models", "Model")
    ];
    const vehiclePanel = [makeHeading(vehicleTitle), makeLabelList(vehicleFields)];
    const partTitleEl = element.querySelector(
      '.part-number-search h4, .driv-part-number-search h4, [class*="part-number"] h4:not(.part-number_header)'
    );
    const partTitle = partTitleEl ? partTitleEl.textContent.trim() : "Search by Part Number";
    const partFields = ["Part number"];
    const partPanel = [makeHeading(partTitle), makeLabelList(partFields)];
    const cells = [];
    const introCell = [];
    if (heading) introCell.push(heading);
    if (description) introCell.push(description);
    if (introCell.length) cells.push([introCell]);
    cells.push([vehiclePanel, partPanel]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-finder", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/monroe-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-pc-sdk",
        '[class^="ot-sdk"]',
        '[class*=" ot-sdk"]'
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-navigation",
        ".page-header",
        ".footer-par",
        ".body-frame-side-content",
        ".body-frame-trigger-pane",
        ".body-frame-global-content"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "link",
        "noscript",
        "iframe",
        "script"
      ]);
    }
  }

  // tools/importer/import-product-category.js
  var parsers = {
    "hero-banner": parse,
    cards: parse2,
    banner: parse3,
    table: parse4,
    "columns-callout": parse5,
    "columns-finder": parse6
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "product-category",
    description: "Monroe product category page: intro heading, product feature cards, comparison table, buying-guide card, Find My Part search",
    urls: [
      "https://www.monroe.com/products/restore-your-ride.html"
    ],
    blocks: [
      { name: "hero-banner", instances: ["#page-content div.header-hero.parbase"] },
      { name: "cards", instances: ["#page-content div.tout.parbase"] },
      { name: "banner", instances: ["#page-content div.updated-tout"] },
      { name: "table", instances: ["#page-content div.table-scroll-wrapper table"] },
      { name: "columns-callout", instances: ["#page-content div.fmmp-plaintext"] },
      { name: "columns-finder", instances: ["#page-content div.driv-part-finder-main.parbase"] }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_product_category_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_product_category_exports);
})();
