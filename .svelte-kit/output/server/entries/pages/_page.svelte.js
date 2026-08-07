import { s as sanitize_props, a as spread_props, b as slot, f as fallback, e as escape_html, c as attr_class, j as bind_props, af as stringify, d as store_get, h as ensure_array_like, ag as attr_style, u as unsubscribe_stores } from "../../chunks/index.js";
import { I as Icon, b as formatRupiah, g as globalSearch, o as orders, c as customers, a as stats } from "../../chunks/Icon.js";
import { S as StatusBadge } from "../../chunks/StatusBadge.js";
import { S as StepProgress } from "../../chunks/StepProgress.js";
import { P as Plus } from "../../chunks/plus.js";
import { U as Users } from "../../chunks/users.js";
import { C as Circle_check } from "../../chunks/circle-check.js";
function Arrow_up_right($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.474.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "M7 7h10v10" }],
    ["path", { "d": "M7 17 17 7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-up-right" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowUpRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNyA3aDEwdjEwIiAvPgogIDxwYXRoIGQ9Ik03IDE3IDE3IDciIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/arrow-up-right
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Dollar_sign($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.474.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["line", { "x1": "12", "x2": "12", "y1": "2", "y2": "22" }],
    [
      "path",
      { "d": "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "dollar-sign" },
    $$sanitized_props,
    {
      /**
       * @component @name DollarSign
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjIiIHkyPSIyMiIgLz4KICA8cGF0aCBkPSJNMTcgNUg5LjVhMy41IDMuNSAwIDAgMCAwIDdoNWEzLjUgMy41IDAgMCAxIDAgN0g2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/dollar-sign
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Loader_circle($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.474.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [["path", { "d": "M21 12a9 9 0 1 1-6.219-8.56" }]];
  Icon($$renderer, spread_props([
    { name: "loader-circle" },
    $$sanitized_props,
    {
      /**
       * @component @name LoaderCircle
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTJhOSA5IDAgMSAxLTYuMjE5LTguNTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/loader-circle
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Shopping_bag($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.474.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      { "d": "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" }
    ],
    ["path", { "d": "M3 6h18" }],
    ["path", { "d": "M16 10a4 4 0 0 1-8 0" }]
  ];
  Icon($$renderer, spread_props([
    { name: "shopping-bag" },
    $$sanitized_props,
    {
      /**
       * @component @name ShoppingBag
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiAyIDMgNnYxNGEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJWNmwtMy00WiIgLz4KICA8cGF0aCBkPSJNMyA2aDE4IiAvPgogIDxwYXRoIGQ9Ik0xNiAxMGE0IDQgMCAwIDEtOCAwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/shopping-bag
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Trending_down($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.474.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["polyline", { "points": "22 17 13.5 8.5 8.5 13.5 2 7" }],
    ["polyline", { "points": "16 17 22 17 22 11" }]
  ];
  Icon($$renderer, spread_props([
    { name: "trending-down" },
    $$sanitized_props,
    {
      /**
       * @component @name TrendingDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cG9seWxpbmUgcG9pbnRzPSIyMiAxNyAxMy41IDguNSA4LjUgMTMuNSAyIDciIC8+CiAgPHBvbHlsaW5lIHBvaW50cz0iMTYgMTcgMjIgMTcgMjIgMTEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/trending-down
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Trending_up($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.474.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["polyline", { "points": "22 7 13.5 15.5 8.5 10.5 2 17" }],
    ["polyline", { "points": "16 7 22 7 22 13" }]
  ];
  Icon($$renderer, spread_props([
    { name: "trending-up" },
    $$sanitized_props,
    {
      /**
       * @component @name TrendingUp
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cG9seWxpbmUgcG9pbnRzPSIyMiA3IDEzLjUgMTUuNSA4LjUgMTAuNSAyIDE3IiAvPgogIDxwb2x5bGluZSBwb2ludHM9IjE2IDcgMjIgNyAyMiAxMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/trending-up
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function StatCard($$renderer, $$props) {
  let title = $$props["title"];
  let value = $$props["value"];
  let subtitle = fallback($$props["subtitle"], "");
  let icon = $$props["icon"];
  let iconColor = fallback($$props["iconColor"], "text-blue-600 bg-blue-50 dark:bg-blue-950/60");
  let trend = fallback($$props["trend"], "");
  let trendUp = fallback($$props["trendUp"], true);
  $$renderer.push(`<div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5"><div class="flex items-center justify-between gap-3"><div class="min-w-0 flex-1"><p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">${escape_html(title)}</p> <h3 class="text-lg sm:text-xl xl:text-2xl font-extrabold text-slate-800 dark:text-white mt-1 tracking-tight truncate">${escape_html(value)}</h3></div> <div${attr_class(`w-11 h-11 rounded-xl flex items-center justify-center ${stringify(iconColor)} transition-transform group-hover:scale-105 shadow-sm shrink-0`)}>`);
  if (icon) {
    $$renderer.push("<!--[-->");
    icon($$renderer, { class: "w-5 h-5" });
    $$renderer.push("<!--]-->");
  } else {
    $$renderer.push("<!--[!-->");
    $$renderer.push("<!--]-->");
  }
  $$renderer.push(`</div></div> `);
  if (subtitle || trend) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">`);
    if (subtitle) {
      $$renderer.push("<!--[0-->");
      $$renderer.push(`<span class="text-slate-500 dark:text-slate-400 font-medium text-[11px]">${escape_html(subtitle)}</span>`);
    } else {
      $$renderer.push("<!--[-1-->");
    }
    $$renderer.push(`<!--]--> `);
    if (trend) {
      $$renderer.push("<!--[0-->");
      $$renderer.push(`<span${attr_class(`font-bold text-[11px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${trendUp ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900" : "text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900"}`)}>`);
      if (trendUp) {
        $$renderer.push("<!--[0-->");
        Trending_up($$renderer, { class: "w-3 h-3 text-emerald-600 dark:text-emerald-400" });
      } else {
        $$renderer.push("<!--[-1-->");
        Trending_down($$renderer, { class: "w-3 h-3 text-rose-600 dark:text-rose-400" });
      }
      $$renderer.push(`<!--]--> ${escape_html(trend)}</span>`);
    } else {
      $$renderer.push("<!--[-1-->");
    }
    $$renderer.push(`<!--]--></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div>`);
  bind_props($$props, { title, value, subtitle, icon, iconColor, trend, trendUp });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let filteredOrders, recentOrders, activeLaundryProgress;
    const weeklyData = [
      { day: "Sen", orders: 12, rev: 32e4 },
      { day: "Sel", orders: 18, rev: 45e4 },
      { day: "Rab", orders: 15, rev: 39e4 },
      { day: "Kam", orders: 22, rev: 58e4 },
      { day: "Jum", orders: 25, rev: 67e4 },
      { day: "Sab", orders: 34, rev: 92e4 },
      { day: "Min", orders: 28, rev: 75e4 }
    ];
    const maxWeeklyOrders = Math.max(...weeklyData.map((d) => d.orders));
    filteredOrders = store_get($$store_subs ??= {}, "$orders", orders).filter((o) => {
      if (!store_get($$store_subs ??= {}, "$globalSearch", globalSearch)) return true;
      const q = store_get($$store_subs ??= {}, "$globalSearch", globalSearch).toLowerCase();
      return o.invoice.toLowerCase().includes(q) || o.customer_nama && o.customer_nama.toLowerCase().includes(q) || o.customer_hp && o.customer_hp.includes(q);
    });
    recentOrders = filteredOrders.slice(0, 5);
    store_get($$store_subs ??= {}, "$customers", customers).slice(0, 5);
    activeLaundryProgress = filteredOrders.filter((o) => o.status !== "Diambil").slice(0, 4);
    $$renderer2.push(`<div class="space-y-6"><div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-blue-500/30"><div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-xl sm:text-2xl font-extrabold tracking-tight">Ringkasan Dashboard</h1> <p class="text-xs sm:text-sm text-blue-100/90 mt-1">Pantau performa usaha laundry kiloan secara real-time &amp; efisien.</p></div> <div class="flex items-center gap-3"><a href="/input" class="inline-flex items-center gap-2 px-4.5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-95">`);
    Plus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Order Cucian Baru</a></div></div> <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div></div> <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-4">`);
    StatCard($$renderer2, {
      title: "Total Customer",
      value: (
        // Chart Mock Data Generators (Weekly Orders & Revenue)
        store_get($$store_subs ??= {}, "$stats", stats).totalCustomers
      ),
      subtitle: "Terdaftar",
      icon: Users,
      iconColor: "text-blue-600 bg-blue-50 dark:bg-blue-950/60",
      trend: "+12%",
      trendUp: true
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      title: "Order Hari Ini",
      value: store_get($$store_subs ??= {}, "$stats", stats).todayOrders,
      subtitle: "Nota masuk",
      icon: Shopping_bag,
      iconColor: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60",
      trend: "+5 order",
      trendUp: true
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      title: "Sedang Dicuci",
      value: store_get($$store_subs ??= {}, "$stats", stats).sedangDicuci,
      subtitle: "Dalam proses",
      icon: Loader_circle,
      iconColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/60"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      title: "Siap Diambil",
      value: store_get($$store_subs ??= {}, "$stats", stats).siapDiambil,
      subtitle: "Sudah selesai",
      icon: Circle_check,
      iconColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      title: "Omset Hari Ini",
      value: formatRupiah(store_get($$store_subs ??= {}, "$stats", stats).pendapatanHariIni),
      subtitle: "Estimasi bruto",
      icon: Dollar_sign,
      iconColor: "text-teal-600 bg-teal-50 dark:bg-teal-950/60",
      trend: "+8%",
      trendUp: true
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      title: "Omset Bulan Ini",
      value: formatRupiah(store_get($$store_subs ??= {}, "$stats", stats).pendapatanBulanIni),
      subtitle: "Bulan Berjalan",
      icon: Trending_up,
      iconColor: "text-purple-600 bg-purple-50 dark:bg-purple-950/60",
      trend: "+18%",
      trendUp: true
    });
    $$renderer2.push(`<!----></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card space-y-4"><div class="flex items-center justify-between"><div><h3 class="text-base font-extrabold text-slate-800 dark:text-white">Grafik Order Mingguan</h3> <p class="text-xs text-slate-400">Jumlah transaksi masuk 7 hari terakhir</p></div> <span class="px-2.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 rounded-full border border-blue-200 dark:border-blue-800">Minggu Ini</span></div> <div class="h-48 flex items-end justify-between gap-3 pt-6 px-2"><!--[-->`);
    const each_array = ensure_array_like(weeklyData);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      const heightPct = item.orders / maxWeeklyOrders * 100;
      $$renderer2.push(`<div class="flex-1 flex flex-col items-center gap-2 group"><span class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">${escape_html(item.orders)}</span> <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-xl h-36 flex items-end overflow-hidden"><div class="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl group-hover:from-blue-700 group-hover:to-blue-500 transition-all duration-500 shadow-md"${attr_style(`height: ${stringify(heightPct)}%`)}></div></div> <span class="text-xs font-bold text-slate-600 dark:text-slate-400">${escape_html(item.day)}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card flex flex-col justify-between space-y-4"><div class="flex items-center justify-between"><div><h3 class="text-base font-extrabold text-slate-800 dark:text-white">Trend Pendapatan (Omzet)</h3> <p class="text-xs text-slate-400">Pertumbuhan nilai penjualan 7 hari terakhir</p></div> <span class="px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">+24.5%</span></div> <div class="space-y-3 pt-2"><!--[-->`);
    const each_array_1 = ensure_array_like(weeklyData);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let item = each_array_1[$$index_1];
      $$renderer2.push(`<div class="space-y-1"><div class="flex items-center justify-between text-xs font-bold"><span class="text-slate-600 dark:text-slate-400 w-10">${escape_html(item.day)}</span> <span class="text-slate-800 dark:text-white font-mono">${escape_html(formatRupiah(item.rev))}</span></div> <div class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600 rounded-full transition-all duration-500 shadow-sm"${attr_style(`width: ${stringify(Math.max(5, item.rev / 92e4 * 100))}%`)}></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card space-y-4"><div class="flex items-center justify-between"><div><h3 class="text-base font-extrabold text-slate-800 dark:text-white">Order Terbaru</h3> <p class="text-xs text-slate-400">5 Transaksi laundry masuk paling akhir</p></div> <a href="/history" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">Lihat Semua `);
    Arrow_up_right($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></a></div> <div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="border-b border-slate-100 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400"><th class="py-3 px-3">No. Nota</th><th class="py-3 px-3">Customer</th><th class="py-3 px-3">Layanan</th><th class="py-3 px-3">Total</th><th class="py-3 px-3">Status</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">`);
    const each_array_2 = ensure_array_like(recentOrders);
    if (each_array_2.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let ord = each_array_2[$$index_2];
        $$renderer2.push(`<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"><td class="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">${escape_html(ord.invoice)}</td><td class="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">${escape_html(ord.customer_nama || "Umum")}</td><td class="py-3 px-3 text-slate-600 dark:text-slate-400">${escape_html(ord.service_nama || "Cuci Komplit")} (${escape_html(ord.berat)} kg)</td><td class="py-3 px-3 font-bold text-slate-800 dark:text-slate-100">${escape_html(formatRupiah(ord.total))}</td><td class="py-3 px-3">`);
        StatusBadge($$renderer2, { status: ord.status, size: "sm" });
        $$renderer2.push(`<!----></td></tr>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<tr><td colspan="5" class="py-6 text-center text-slate-400">Belum ada data order.</td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div> <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card space-y-4"><div class="flex items-center justify-between"><div><h3 class="text-base font-extrabold text-slate-800 dark:text-white">Progress Cucian</h3> <p class="text-xs text-slate-400">Status pengerjaan cucian</p></div> <a href="/status" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Detail</a></div> <div class="space-y-4">`);
    const each_array_3 = ensure_array_like(activeLaundryProgress);
    if (each_array_3.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let ord = each_array_3[$$index_3];
        $$renderer2.push(`<div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2"><div class="flex items-center justify-between text-xs font-bold"><span class="text-slate-800 dark:text-white">${escape_html(ord.customer_nama)}</span> <span class="text-blue-600 dark:text-blue-400 font-mono">${escape_html(ord.invoice)}</span></div> `);
        StepProgress($$renderer2, { orderId: ord.id, currentStatus: ord.status, compact: true });
        $$renderer2.push(`<!----></div>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="py-8 text-center text-slate-400 text-xs">Tidak ada cucian yang sedang diproses saat ini.</div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
