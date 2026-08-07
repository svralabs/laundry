import { s as sanitize_props, a as spread_props, b as slot, f as fallback, ag as attr_style, h as ensure_array_like, i as attr, c as attr_class, e as escape_html, j as bind_props, af as stringify } from "./index.js";
import { I as Icon, O as ORDER_STATUSES, N as NEXT_STATUS_MAP } from "./Icon.js";
function Arrow_right($$renderer, $$props) {
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
    ["path", { "d": "M5 12h14" }],
    ["path", { "d": "m12 5 7 7-7 7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-right" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJtMTIgNSA3IDctNyA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-right
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
function Check($$renderer, $$props) {
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
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  Icon($$renderer, spread_props([
    { name: "check" },
    $$sanitized_props,
    {
      /**
       * @component @name Check
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgNiA5IDE3bC01LTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/check
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
function StepProgress($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let currentIndex, nextStatus;
    let orderId = $$props["orderId"];
    let currentStatus = $$props["currentStatus"];
    let compact = fallback($$props["compact"], false);
    currentIndex = ORDER_STATUSES.indexOf(currentStatus);
    nextStatus = NEXT_STATUS_MAP[currentStatus];
    $$renderer2.push(`<div class="w-full space-y-3"><div class="relative flex items-center justify-between w-full"><div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-0 rounded-full"></div> <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 dark:bg-blue-500 -z-0 rounded-full transition-all duration-500"${attr_style(`width: ${stringify(currentIndex / (ORDER_STATUSES.length - 1) * 100)}%`)}></div> <!--[-->`);
    const each_array = ensure_array_like(ORDER_STATUSES);
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let st = each_array[index];
      const isDone = index <= currentIndex;
      const isCurrent = index === currentIndex;
      $$renderer2.push(`<button type="button" class="relative z-10 flex flex-col items-center group focus:outline-none"${attr("title", `Klik untuk ubah status ke ${stringify(st)}`)}><div${attr_class(`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-md ${isCurrent ? "ring-4 ring-blue-100 dark:ring-blue-900 bg-blue-600 text-white scale-110" : ""} ${isDone && !isCurrent ? "bg-emerald-500 text-white hover:bg-emerald-600" : ""} ${!isDone ? "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-blue-400" : ""} `)}>`);
      if (isDone && !isCurrent) {
        $$renderer2.push("<!--[0-->");
        Check($$renderer2, { class: "w-4 h-4" });
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`${escape_html(index + 1)}`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (!compact) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span${attr_class(`mt-1.5 text-[10px] sm:text-xs font-semibold transition-colors duration-200 ${isCurrent ? "text-blue-600 dark:text-blue-400 font-bold" : ""} ${isDone && !isCurrent ? "text-slate-700 dark:text-slate-300" : ""} ${!isDone ? "text-slate-400 dark:text-slate-500" : ""} `)}>${escape_html(st)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></button>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (nextStatus && !compact) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center justify-end pt-1"><button type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all duration-200 shadow-sm group">Lanjut ke <strong>${escape_html(nextStatus)}</strong> `);
      Arrow_right($$renderer2, {
        class: "w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
      });
      $$renderer2.push(`<!----></button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { orderId, currentStatus, compact });
  });
}
export {
  StepProgress as S
};
