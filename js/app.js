export function boot(init = window.choifukuInitApp) {
  if (typeof init === "function") init();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => boot());
} else {
  boot();
}
