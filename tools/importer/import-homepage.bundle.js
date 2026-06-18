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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, h2, [class*="title"]');
    const logo = Array.from(element.querySelectorAll("img")).find(
      (img) => !img.closest("video")
    );
    const ctaLink = Array.from(element.querySelectorAll("a[href]")).find(
      (a) => !/\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(a.getAttribute("href") || "")
    );
    const videoSourceEl = element.querySelector("video source[src], video[src]");
    let videoUrl = null;
    if (videoSourceEl) {
      videoUrl = videoSourceEl.getAttribute("src");
    } else {
      const videoAnchor = Array.from(element.querySelectorAll("a[href]")).find(
        (a) => /\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(a.getAttribute("href") || "")
      );
      if (videoAnchor) videoUrl = videoAnchor.getAttribute("href");
    }
    if (!heading && !videoUrl) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (videoUrl) {
      const mediaLink = document.createElement("a");
      mediaLink.href = videoUrl;
      mediaLink.textContent = videoUrl;
      cells.push([mediaLink]);
    }
    const contentCell = document.createElement("div");
    if (heading) contentCell.append(heading);
    if (logo) contentCell.append(logo);
    if (ctaLink) contentCell.append(ctaLink);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-intro.js
  function parse2(element, { document }) {
    const heading = element.querySelector('h1, h2, h3, [class*="title"], [class*="heading"]');
    const paragraphs = Array.from(element.querySelectorAll("p")).filter(
      (p) => !p.closest("a")
    );
    const ctaLinks = Array.from(element.querySelectorAll("a[href]"));
    if (!heading && paragraphs.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const contentCell = document.createElement("div");
    if (heading) contentCell.append(heading);
    paragraphs.forEach((p) => contentCell.append(p));
    ctaLinks.forEach((a) => contentCell.append(a));
    const cells = [[contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tout.js
  function parse3(element, { document }) {
    const toutAnchors = Array.from(element.querySelectorAll("a[href]")).filter((a) => {
      const href = a.getAttribute("href") || "";
      return !/\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(href);
    });
    const cells = [];
    toutAnchors.forEach((anchor) => {
      const href = anchor.getAttribute("href");
      const videoSource = anchor.querySelector("video source[src], source[src]");
      let mediaCell;
      if (videoSource && /\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(videoSource.getAttribute("src") || "")) {
        const videoLink = document.createElement("a");
        const src = videoSource.getAttribute("src");
        videoLink.href = src;
        videoLink.textContent = src;
        mediaCell = videoLink;
      } else {
        const bgImage = anchor.querySelector('img[class*="object-cover"], img[class*="absolute"]') || anchor.querySelector("img");
        mediaCell = bgImage || "";
      }
      const heading = anchor.querySelector('h2, h1, h3, [class*="title"]');
      const learnMore = document.createElement("a");
      learnMore.href = href;
      const label = anchor.querySelector("span.leading-normal");
      learnMore.textContent = label && label.textContent.trim() || "LEARN MORE";
      const bodyCell = [];
      if (heading) bodyCell.push(heading);
      bodyCell.push(learnMore);
      cells.push([mediaCell, bodyCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-tout", cells });
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

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-video": parse,
    "hero-intro": parse2,
    "cards-tout": parse3
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Monroe homepage with hero video, intro/quality section, and tout product cards",
    urls: [
      "https://www.monroe.com/"
    ],
    blocks: [
      {
        name: "hero-video",
        instances: ["#ky > div.bg-background-gray.overflow-hidden > section:nth-of-type(1)"]
      },
      {
        name: "hero-intro",
        instances: ["#ky > div.bg-background-gray.overflow-hidden > section:nth-of-type(2)"]
      },
      {
        name: "cards-tout",
        instances: ["#ky > div.bg-background-gray.overflow-hidden > section:nth-of-type(3)"]
      }
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
  var import_homepage_default = {
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
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
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
  return __toCommonJS(import_homepage_exports);
})();
