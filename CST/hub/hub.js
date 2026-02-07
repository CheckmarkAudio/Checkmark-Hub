import { appRegistry } from "./registry.js";

(() => {
  const themeStorageKey = "cst.hub.theme";
  const root = document.body;
  const toggle = document.querySelector(".hub-theme-toggle");

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    if (toggle) {
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  };

  const storedTheme = localStorage.getItem(themeStorageKey);
  if (storedTheme === "light" || storedTheme === "dark") {
    applyTheme(storedTheme);
  } else {
    applyTheme(root.getAttribute("data-theme") || "dark");
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem(themeStorageKey, nextTheme);
    });
  }

  const appsById = new Map(appRegistry.map((app) => [app.id, app]));
  const navItems = Array.from(document.querySelectorAll("[data-app-id]"));
  const emptyState = document.querySelector(".hub-empty");
  const iframeShell = document.querySelector(".hub-iframe-shell");
  const iframe = document.querySelector(".hub-workspace-iframe");
  const openInNewTab = document.querySelector(".hub-open-external");
  const contextPill = document.querySelector(".hub-context-pill");
  const contextLabel = contextPill
    ? contextPill.textContent.replace(/\s+/g, " ").trim()
    : "default";
  const lastAppStorageKey = `cst.hub.lastApp.${contextLabel || "default"}`;

  let activeApp = null;

  const setActiveNav = (appId) => {
    navItems.forEach((item) => {
      const isActive = item.dataset.appId === appId;
      item.classList.toggle("is-active", isActive);
      if (isActive) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });
  };

  const setEmptyState = () => {
    activeApp = null;
    if (emptyState) {
      emptyState.hidden = false;
    }
    if (iframeShell) {
      iframeShell.hidden = true;
    }
    if (iframe) {
      iframe.removeAttribute("src");
      iframe.title = "Workspace";
    }
    if (openInNewTab) {
      openInNewTab.hidden = true;
      openInNewTab.disabled = true;
    }
    setActiveNav(null);
  };

  const setActiveApp = (appId, { persist = true } = {}) => {
    const app = appsById.get(appId);
    if (!app) {
      return;
    }

    activeApp = app;
    if (iframe) {
      iframe.src = app.path;
      iframe.title = app.label;
    }
    if (emptyState) {
      emptyState.hidden = true;
    }
    if (iframeShell) {
      iframeShell.hidden = false;
    }
    if (openInNewTab) {
      openInNewTab.hidden = false;
      openInNewTab.disabled = false;
    }
    setActiveNav(app.id);

    if (persist) {
      localStorage.setItem(lastAppStorageKey, app.id);
    }
  };

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const appId = item.dataset.appId;
      if (!appId) {
        return;
      }

      if (!appsById.has(appId)) {
        return;
      }

      setActiveApp(appId);
    });
  });

  if (openInNewTab) {
    openInNewTab.addEventListener("click", () => {
      if (!activeApp) {
        return;
      }
      window.open(activeApp.path, "_blank", "noopener");
    });
  }

  setEmptyState();

  const storedAppId = localStorage.getItem(lastAppStorageKey);
  if (storedAppId && appsById.has(storedAppId)) {
    setActiveApp(storedAppId, { persist: false });
  }
})();
