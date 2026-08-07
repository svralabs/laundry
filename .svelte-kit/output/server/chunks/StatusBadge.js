import { f as fallback, c as attr_class, af as stringify, e as escape_html, j as bind_props } from "./index.js";
import { j as getStatusColor } from "./Icon.js";
function StatusBadge($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let colors, sizeClasses;
    let status = fallback($$props["status"], "Masuk");
    let size = fallback($$props["size"], "md");
    colors = getStatusColor(status);
    sizeClasses = {
      sm: "px-2 py-0.5 text-xs font-semibold",
      md: "px-2.5 py-1 text-xs font-bold",
      lg: "px-3.5 py-1.5 text-sm font-bold"
    }[size];
    $$renderer2.push(`<span${attr_class(`inline-flex items-center gap-1.5 rounded-full border shadow-sm transition-all duration-200 $${stringify(colors.bg)} $${stringify(colors.text)} $${stringify(colors.border)} $${stringify(sizeClasses)}`)}><span${attr_class(`w-1.5 h-1.5 rounded-full $${stringify(colors.dot)} animate-pulse`)}></span> ${escape_html(status)}</span>`);
    bind_props($$props, { status, size });
  });
}
export {
  StatusBadge as S
};
