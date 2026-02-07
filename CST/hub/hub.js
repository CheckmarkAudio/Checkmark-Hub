(() => {
  const storageKey = "cst.hub.theme";
  const root = document.body;
  const toggle = document.querySelector(".hub-theme-toggle");

  if (!toggle) {
    return;
  }

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  };

  const storedTheme = localStorage.getItem(storageKey);
  if (storedTheme === "light" || storedTheme === "dark") {
    applyTheme(storedTheme);
  } else {
    applyTheme(root.getAttribute("data-theme") || "dark");
  }

  toggle.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(storageKey, nextTheme);
  });
})();
