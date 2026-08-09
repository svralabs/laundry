import { g as getContext, s as sanitize_props, a as spread_props, b as slot, f as fallback, c as attr_class, e as escape_html, d as store_get, h as ensure_array_like, i as attr, u as unsubscribe_stores, j as bind_props } from "../../chunks/index.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import "../../chunks/state.svelte.js";
import { I as Icon, s as settings, a as stats, f as formatDate, g as globalSearch, i as isLoading, t as toasts } from "../../chunks/Icon.js";
import { S as Shirt, C as Calendar } from "../../chunks/shirt.js";
import { X } from "../../chunks/x.js";
import { C as Chevron_right, T as Triangle_alert } from "../../chunks/triangle-alert.js";
import { U as Users } from "../../chunks/users.js";
import { L as List_todo } from "../../chunks/list-todo.js";
import { H as History } from "../../chunks/history.js";
import { S as Settings, R as Refresh_cw } from "../../chunks/settings.js";
import { p as public_env } from "../../chunks/shared-server.js";
import { C as Circle_check } from "../../chunks/circle-check.js";
import { S as Search } from "../../chunks/search.js";
import { P as Plus } from "../../chunks/plus.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function Circle_alert($$renderer, $$props) {
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
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["line", { "x1": "12", "x2": "12", "y1": "8", "y2": "12" }],
    [
      "line",
      { "x1": "12", "x2": "12.01", "y1": "16", "y2": "16" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "circle-alert" },
    $$sanitized_props,
    {
      /**
       * @component @name CircleAlert
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjgiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-alert
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
function Info($$renderer, $$props) {
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
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "info" },
    $$sanitized_props,
    {
      /**
       * @component @name Info
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMTZ2LTQiIC8+CiAgPHBhdGggZD0iTTEyIDhoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/info
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
function Layout_dashboard($$renderer, $$props) {
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
      "rect",
      { "width": "7", "height": "9", "x": "3", "y": "3", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "5", "x": "14", "y": "3", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "9", "x": "14", "y": "12", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "5", "x": "3", "y": "16", "rx": "1" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "layout-dashboard" },
    $$sanitized_props,
    {
      /**
       * @component @name LayoutDashboard
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI5IiB4PSIzIiB5PSIzIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIxNCIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iOSIgeD0iMTQiIHk9IjEyIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIzIiB5PSIxNiIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/layout-dashboard
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
function Menu($$renderer, $$props) {
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
    ["line", { "x1": "4", "x2": "20", "y1": "12", "y2": "12" }],
    ["line", { "x1": "4", "x2": "20", "y1": "6", "y2": "6" }],
    ["line", { "x1": "4", "x2": "20", "y1": "18", "y2": "18" }]
  ];
  Icon($$renderer, spread_props([
    { name: "menu" },
    $$sanitized_props,
    {
      /**
       * @component @name Menu
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iNCIgeDI9IjIwIiB5MT0iMTIiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iNCIgeDI9IjIwIiB5MT0iNiIgeTI9IjYiIC8+CiAgPGxpbmUgeDE9IjQiIHgyPSIyMCIgeTE9IjE4IiB5Mj0iMTgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/menu
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
function Moon($$renderer, $$props) {
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
  const iconNode = [["path", { "d": "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" }]];
  Icon($$renderer, spread_props([
    { name: "moon" },
    $$sanitized_props,
    {
      /**
       * @component @name Moon
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgM2E2IDYgMCAwIDAgOSA5IDkgOSAwIDEgMS05LTlaIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/moon
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
function Sidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let mobileOpen = fallback($$props["mobileOpen"], false);
    const menuItems = [
      {
        href: "/",
        label: "Dashboard",
        icon: Layout_dashboard,
        badge: null
      },
      {
        href: "/customers",
        label: "Customer",
        icon: Users,
        badge: null
      },
      {
        href: "/input",
        label: "Input Cucian",
        icon: Shirt,
        badge: "Baru"
      },
      {
        href: "/status",
        label: "Status Cucian",
        icon: List_todo,
        badge: "status"
      },
      {
        href: "/history",
        label: "Riwayat",
        icon: History,
        badge: null
      },
      {
        href: "/settings",
        label: "Pengaturan",
        icon: Settings,
        badge: null
      }
    ];
    if (mobileOpen) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <aside${attr_class(`fixed top-0 left-0 bottom-0 z-50 w-64 bg-blue-700 dark:bg-slate-900 text-white flex flex-col justify-between shadow-2xl lg:translate-x-0 transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"} `)}><div><div class="h-20 px-6 flex items-center justify-between border-b border-blue-600/60 dark:border-slate-800"><a href="/" class="flex items-center gap-3 group"><div class="w-9 h-9 rounded-xl bg-white/10 dark:bg-blue-600 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">`);
    Shirt($$renderer2, { class: "w-5 h-5 text-white" });
    $$renderer2.push(`<!----></div> <div class="overflow-hidden"><h1 class="font-extrabold text-base tracking-tight text-white leading-snug truncate">${escape_html(store_get($$store_subs ??= {}, "$settings", settings).nama_laundry || "SVRA Laundry")}</h1></div></a> <button type="button" class="lg:hidden p-1.5 rounded-lg text-blue-200 hover:bg-white/10 transition">`);
    X($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></button></div> <nav class="p-4 space-y-1.5"><div class="px-3 pb-2 text-[10px] font-bold text-blue-200/80 dark:text-slate-500 uppercase tracking-widest">Menu Utama</div> <!--[-->`);
    const each_array = ensure_array_like(menuItems);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      const isActive = store_get($$store_subs ??= {}, "$page", page).url.pathname === item.href || store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith(item.href) && item.href !== "/";
      const Icon2 = item.icon;
      $$renderer2.push(`<a${attr("href", item.href)}${attr_class(`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${isActive ? "bg-white text-blue-700 shadow-lg dark:bg-blue-600 dark:text-white font-bold translate-x-1" : "text-blue-100 hover:bg-white/10 hover:text-white dark:text-slate-300 dark:hover:bg-slate-800"}`)}><div class="flex items-center gap-3">`);
      Icon2($$renderer2, {
        class: `w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-blue-600 dark:text-white" : "text-blue-200 dark:text-slate-400"}`
      });
      $$renderer2.push(`<!----> <span>${escape_html(item.label)}</span></div> `);
      if (item.badge === "status") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-400 text-slate-900 shadow-sm">${escape_html(store_get($$store_subs ??= {}, "$stats", stats).sedangDicuci)}</span>`);
      } else if (item.badge) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500 text-white dark:bg-slate-700">${escape_html(item.badge)}</span>`);
      } else if (isActive) {
        $$renderer2.push("<!--[2-->");
        Chevron_right($$renderer2, { class: "w-4 h-4 text-blue-600 dark:text-white" });
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></a>`);
    }
    $$renderer2.push(`<!--]--></nav></div> <div class="p-4 border-t border-blue-600/60 dark:border-slate-800"><div class="bg-white/10 dark:bg-slate-800/80 rounded-xl p-3.5 flex items-center justify-between backdrop-blur-sm"><div class="flex items-center gap-3 overflow-hidden"><div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow">A</div> <div class="overflow-hidden"><p class="text-xs font-bold text-white truncate">Admin Kasir</p> <p class="text-[10px] text-blue-200 dark:text-slate-400 truncate">Kasir Shift 1</p></div></div> <div class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div></div></div></aside>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { mobileOpen });
  });
}
function Navbar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let mobileOpen = fallback($$props["mobileOpen"], false);
    let todayFormatted = formatDate(/* @__PURE__ */ new Date(), " DD MMMM YYYY");
    const publicGasUrl = public_env.PUBLIC_GAS_URL || "";
    $$renderer2.push(`<header class="h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-sm"><div class="flex items-center gap-3 lg:gap-4"><button type="button" class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label="Toggle Navigation">`);
    Menu($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></button> <div class="hidden sm:block"><h2 class="text-base font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">${escape_html(store_get($$store_subs ??= {}, "$settings", settings).nama_laundry || "SVRA Laundry")} `);
    if (publicGasUrl) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">`);
      Circle_check($$renderer2, { class: "w-3 h-3" });
      $$renderer2.push(`<!----> GAS Cloud Live</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></h2> <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium mt-0.5">`);
    Calendar($$renderer2, { class: "w-3.5 h-3.5 text-blue-600 dark:text-blue-400" });
    $$renderer2.push(`<!----> ${escape_html(todayFormatted)}</p></div></div> <div class="flex-1 max-w-md mx-4"><div class="relative">`);
    Search($$renderer2, {
      class: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
    });
    $$renderer2.push(`<!----> <input type="text"${attr("value", store_get($$store_subs ??= {}, "$globalSearch", globalSearch))} placeholder="Cari nota, customer, HP..." class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 outline-none transition-all shadow-inner"/></div></div> <div class="flex items-center gap-2 sm:gap-3">`);
    if (publicGasUrl) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button type="button"${attr("disabled", store_get($$store_subs ??= {}, "$isLoading", isLoading), true)} class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative" title="Sync Spreadsheet">`);
      Refresh_cw($$renderer2, {
        class: `w-5 h-5 ${store_get($$store_subs ??= {}, "$isLoading", isLoading) ? "animate-spin text-blue-600" : ""}`
      });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button type="button" class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Toggle Dark/Light Mode">`);
    {
      $$renderer2.push("<!--[-1-->");
      Moon($$renderer2, { class: "w-5 h-5 text-slate-600" });
    }
    $$renderer2.push(`<!--]--></button> <a href="/input" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all">`);
    Plus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> <span class="hidden sm:inline">Input Cucian</span></a> <div class="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800"><div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-xs shadow-md">AD</div></div></div></header>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { mobileOpen });
  });
}
function Toast($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    $$renderer2.push(`<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0"><!--[-->`);
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let toast = each_array[$$index];
      $$renderer2.push(`<div${attr_class(`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${toast.type === "success" ? "bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100" : ""} ${toast.type === "error" ? "bg-rose-50/95 dark:bg-rose-950/90 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100" : ""} ${toast.type === "warning" ? "bg-amber-50/95 dark:bg-amber-950/90 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100" : ""} ${toast.type === "info" ? "bg-blue-50/95 dark:bg-blue-950/90 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100" : ""} `)}><div class="mt-0.5 shrink-0">`);
      if (toast.type === "success") {
        $$renderer2.push("<!--[0-->");
        Circle_check($$renderer2, { class: "w-5 h-5 text-emerald-600 dark:text-emerald-400" });
      } else if (toast.type === "error") {
        $$renderer2.push("<!--[1-->");
        Circle_alert($$renderer2, { class: "w-5 h-5 text-rose-600 dark:text-rose-400" });
      } else if (toast.type === "warning") {
        $$renderer2.push("<!--[2-->");
        Triangle_alert($$renderer2, { class: "w-5 h-5 text-amber-600 dark:text-amber-400" });
      } else {
        $$renderer2.push("<!--[-1-->");
        Info($$renderer2, { class: "w-5 h-5 text-blue-600 dark:text-blue-400" });
      }
      $$renderer2.push(`<!--]--></div> <div class="flex-1 text-sm"><h4 class="font-semibold text-xs uppercase tracking-wider mb-0.5 opacity-90">${escape_html(toast.title)}</h4> <p class="text-slate-700 dark:text-slate-200 font-medium leading-tight">${escape_html(toast.message)}</p></div> <button type="button" class="shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">`);
      X($$renderer2, { class: "w-4 h-4 text-slate-500" });
      $$renderer2.push(`<!----></button></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _layout($$renderer, $$props) {
  let mobileOpen = false;
  let $$settled = true;
  let $$inner_renderer;
  function $$render_inner($$renderer2) {
    $$renderer2.push(`<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col lg:flex-row font-sans">`);
    Toast($$renderer2);
    $$renderer2.push(`<!----> `);
    Sidebar($$renderer2, {
      get mobileOpen() {
        return mobileOpen;
      },
      set mobileOpen($$value) {
        mobileOpen = $$value;
        $$settled = false;
      }
    });
    $$renderer2.push(`<!----> <div class="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">`);
    Navbar($$renderer2, {
      get mobileOpen() {
        return mobileOpen;
      },
      set mobileOpen($$value) {
        mobileOpen = $$value;
        $$settled = false;
      }
    });
    $$renderer2.push(`<!----> <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6"><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></main> <footer class="py-4 px-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-600">Laundry Management System © 2026. Built with SvelteKit &amp; Google Apps Script REST API.</footer></div></div>`);
  }
  do {
    $$settled = true;
    $$inner_renderer = $$renderer.copy();
    $$render_inner($$inner_renderer);
  } while (!$$settled);
  $$renderer.subsume($$inner_renderer);
}
export {
  _layout as default
};
