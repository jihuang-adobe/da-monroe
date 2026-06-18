/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Monroe site-wide cleanup.
 *
 * Removes non-authorable site chrome (auto-populated header/nav and footer in EDS),
 * the OneTrust cookie-consent UI, and AEM body-frame layout wrappers.
 *
 * All selectors verified against migration-work/cleaned.html:
 *   - .skip-navigation                line 5    (skip-link, page chrome)
 *   - .body-frame-side-content        line 7    (side rail layout chrome)
 *   - .page-header                    line 246  (auto-populated global nav)
 *   - .footer-par                     line 738  (auto-populated footer)
 *   - .body-frame-trigger-pane        line 927  (slide-out trigger chrome)
 *   - #onetrust-consent-sdk / .ot-*   lines 942-999 (cookie-consent UI)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie-consent UI: remove before block parsing so its markup never
    // pollutes block matching. OneTrust root + any stray .ot-* fragments.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-pc-sdk',
      '[class^="ot-sdk"]',
      '[class*=" ot-sdk"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (header/nav and footer are auto-populated in EDS).
    WebImporter.DOMUtils.remove(element, [
      '.skip-navigation',
      '.page-header',
      '.footer-par',
      '.body-frame-side-content',
      '.body-frame-trigger-pane',
      '.body-frame-global-content',
    ]);

    // Leftover non-content / embedded resource tags.
    WebImporter.DOMUtils.remove(element, [
      'link',
      'noscript',
      'iframe',
      'script',
    ]);
  }
}
