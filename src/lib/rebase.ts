/** Дописывает подпапку Pages (BASE_URL) к корневым путям в готовой разметке. */
export function rebase(html: string, base: string) {
  if (!base) return html;
  return html
    .replace(/(\s(?:href|src|data-bg|data-src|action)=)(["'])\/(?!\/)/g, `$1$2${base}/`)
    .replace(/url\((['"]?)\/_t\//g, `url($1${base}/_t/`)
    .replace(/url\(&#39;\/_t\//g, `url(&#39;${base}/_t/`);
}
