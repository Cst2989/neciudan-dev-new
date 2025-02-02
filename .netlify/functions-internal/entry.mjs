import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { renderers } from './renderers.mjs';
import { manifest } from './manifest_179666dd.mjs';

const _page0  = () => import('./chunks/generic_848dea21.mjs');
const _page1  = () => import('./chunks/index_393f8a08.mjs');
const _page2  = () => import('./chunks/about_old_d54b57bf.mjs');
const _page3  = () => import('./chunks/services_be2f8b3d.mjs');
const _page4  = () => import('./chunks/contact_39cee36a.mjs');
const _page5  = () => import('./chunks/pricing_98fd8f55.mjs');
const _page6  = () => import('./chunks/privacy_26fc42bf.mjs');
const _page7  = () => import('./chunks/rss_ccfe2fa4.mjs');
const _page8  = () => import('./chunks/about_1eca921d.mjs');
const _page9  = () => import('./chunks/terms_d437e8bf.mjs');
const _page10  = () => import('./chunks/404_eb65e0e5.mjs');
const _page11  = () => import('./chunks/subscribe_bf2deaed.mjs');
const _page12  = () => import('./chunks/_.._0e55d23c.mjs');
const _page13  = () => import('./chunks/_.._4e51928f.mjs');
const _page14  = () => import('./chunks/_.._603d1ef8.mjs');
const _page15  = () => import('./chunks/index_57e4dcf3.mjs');const pageMap = new Map([["node_modules/astro/dist/assets/endpoint/generic.js", _page0],["src/pages/index.astro", _page1],["src/pages/about_old.astro", _page2],["src/pages/services.astro", _page3],["src/pages/contact.astro", _page4],["src/pages/pricing.astro", _page5],["src/pages/privacy.md", _page6],["src/pages/rss.xml.ts", _page7],["src/pages/about.astro", _page8],["src/pages/terms.md", _page9],["src/pages/404.astro", _page10],["src/pages/api/subscribe.ts", _page11],["src/pages/[...blog]/[category]/[...page].astro", _page12],["src/pages/[...blog]/[tag]/[...page].astro", _page13],["src/pages/[...blog]/[...page].astro", _page14],["src/pages/[...blog]/index.astro", _page15]]);
const _manifest = Object.assign(manifest, {
	pageMap,
	renderers,
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler, pageMap };
