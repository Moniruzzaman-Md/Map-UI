// Shared behaviour for mynztrip admin design pages: sidebar accordion, modal, toast, table search.

document.addEventListener("DOMContentLoaded", () => {
  initSidebarAccordion();
  initSidebarCollapse();
  initModals();
  initTableSearch();
  initResetDemoData();
  initSearchableSelects();
  initInfoPopups();
});

// ---------- localStorage persistence ----------
// Lets edits (name changes, mappings, new/merged cities, active toggles)
// survive a browser close/reopen instead of resetting to the seed data
// every time data.js runs.

const STORAGE_PREFIX = "mynztrip:";

function saveToStorage(key, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
}

function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    // revive timestamp strings back into real Date objects
    return JSON.parse(raw, (k, value) => (k === "timestamp" ? new Date(value) : value));
  } catch (e) {
    console.warn("Could not load from localStorage:", e);
    return null;
  }
}

// Replaces an array's contents in place so existing references to it
// (held by other scripts) still see the hydrated data.
function hydrateArray(target, saved) {
  if (!saved) return;
  target.length = 0;
  saved.forEach((item) => target.push(item));
}

// Replaces a plain object's contents in place, same reasoning as above.
function hydrateObject(target, saved) {
  if (!saved) return;
  Object.keys(target).forEach((k) => delete target[k]);
  Object.assign(target, saved);
}

function initResetDemoData() {
  const btn = document.getElementById("resetDemoDataBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
    location.reload();
  });
}

function initSidebarAccordion() {
  document.querySelectorAll(".nav-group").forEach((group) => {
    const trigger = group.querySelector(":scope > .nav-item");
    if (!trigger || !group.querySelector(".submenu")) return;
    trigger.addEventListener("click", () => {
      const isOpen = group.classList.contains("open");
      document.querySelectorAll(".nav-group.open").forEach((g) => {
        if (g !== group) g.classList.remove("open");
      });
      group.classList.toggle("open", !isOpen);
    });
  });

  // nested sub-group inside a submenu, e.g. Hotel Map > Country > System/Supplier
  document.querySelectorAll(".submenu-group").forEach((group) => {
    const trigger = group.querySelector(":scope > .submenu-toggle");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      group.classList.toggle("open");
    });
  });
}

// Collapses the sidebar entirely (not to an icon-only rail — only the
// top-level "Hotel Map" nav item has its own icon, every nested City/
// Country/Hotel group and its System/Supplier/City Mapping links are plain
// text, so a narrow rail would have nothing meaningful to show for most of
// the menu). Toggled from the topbar's hamburger "Menu" button, which
// otherwise has no behavior wired to it. This is a multi-page app (every
// nav click is a real page load, not client-side routing), so the choice
// is persisted in localStorage — same mynztrip:-prefixed convention
// saveToStorage/loadFromStorage use for saved data — and re-applied on
// every page's own DOMContentLoaded so it stays collapsed across pages
// until explicitly re-expanded.
const SIDEBAR_COLLAPSED_KEY = STORAGE_PREFIX + "sidebarCollapsed";

function initSidebarCollapse() {
  const appBody = document.querySelector(".app-body");
  const menuBtn = document.querySelector('.topbar .icon-btn[aria-label="Menu"]');
  if (!appBody || !menuBtn) return;

  function applyCollapsed(collapsed) {
    appBody.classList.toggle("sidebar-collapsed", collapsed);
    menuBtn.setAttribute("aria-expanded", String(!collapsed));
    menuBtn.setAttribute("aria-label", collapsed ? "Show menu" : "Hide menu");
  }

  applyCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1");

  menuBtn.addEventListener("click", () => {
    const collapsed = !appBody.classList.contains("sidebar-collapsed");
    applyCollapsed(collapsed);
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch (e) {
      console.warn("Could not save sidebar collapse state:", e);
    }
  });
}

function initModals() {
  // Delegated on document so it keeps working for rows re-rendered later
  // (search, pagination, after save) instead of only the buttons present at load.
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-modal-target]");
    if (opener) {
      const modal = document.querySelector(opener.getAttribute("data-modal-target"));
      if (modal) openModal(modal, opener);
      return;
    }

    const closer = e.target.closest("[data-modal-close]");
    if (closer) {
      const overlay = closer.closest(".modal-overlay");
      if (overlay) closeModal(overlay);
      return;
    }

    if (e.target.classList.contains("modal-overlay")) {
      closeModal(e.target);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.open").forEach(closeModal);
    }
  });
}

// Reusable "explain this" popup — a centered popup (not a drawer, see
// .popup-overlay/.popup-box), since it's meant for standalone explanatory
// content rather than a form/action. Content is arbitrary HTML, not just a
// sentence, so callers can use headings/lists/etc., not just plain text.
function showInfoPopup(title, html) {
  let overlay = document.getElementById("infoPopupModal");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "infoPopupModal";
    overlay.className = "modal-overlay popup-overlay";
    overlay.innerHTML = `
      <div class="popup-box popup-box-md">
        <div class="modal-header">
          <h3 id="infoPopupTitle"></h3>
          <button class="modal-close" data-modal-close aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div id="infoPopupBody" class="info-popup-body"></div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }
  overlay.querySelector("#infoPopupTitle").textContent = title;
  overlay.querySelector("#infoPopupBody").innerHTML = html;
  openModal(overlay);
}

// Declarative wiring for showInfoPopup(): any button anywhere in the project
// can trigger it with no page-specific JS — just point data-info-target at a
// <template> holding the (arbitrary HTML) explanation, and set data-info-title.
function initInfoPopups() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-info-target]");
    if (!btn) return;
    const template = document.querySelector(btn.getAttribute("data-info-target"));
    if (!template) return;
    showInfoPopup(btn.dataset.infoTitle || "", template.innerHTML);
  });
}

function openModal(modal, triggerBtn) {
  modal.classList.add("open");
  if (triggerBtn && modal.dataset.fillFrom) {
    const row = triggerBtn.closest("tr");
    modal.querySelectorAll("[data-fill]").forEach((field) => {
      const cell = row?.querySelector(`[data-col="${field.dataset.fill}"]`);
      if (cell) field.value = cell.textContent.trim();
    });
    modal.dataset.activeRow = row ? row.dataset.rowId : "";
  }
}

function closeModal(overlay) {
  overlay.classList.remove("open");
}

const TOAST_ICONS = {
  success:
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  error:
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>',
};
const TOAST_TITLES = { success: "Success", error: "Error" };

// type: "success" | "error" — covers successful/failed operations and validation errors.
function showToast(message, type = "success") {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.innerHTML = `
      <span class="toast-icon"></span>
      <span class="toast-body">
        <span class="toast-title"></span>
        <span class="toast-message"></span>
      </span>
      <button class="toast-close" aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>`;
    document.body.appendChild(toast);
    toast.querySelector(".toast-close").addEventListener("click", () => {
      clearTimeout(toast._timer);
      toast.classList.remove("show");
    });
  }

  toast.className = `toast ${type}`;
  toast.querySelector(".toast-icon").innerHTML = TOAST_ICONS[type] || TOAST_ICONS.success;
  toast.querySelector(".toast-title").textContent = TOAST_TITLES[type] || "Notice";
  toast.querySelector(".toast-message").textContent = message;

  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

// Reusable pagination renderer for all list pages.
// container: element to render controls into
// opts: { total, page, pageSize, onChange({page, pageSize}) }
function renderPagination(container, opts) {
  const { total, pageSize, onChange } = opts;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, opts.page), totalPages);
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pages = getPageList(page, totalPages);

  container.innerHTML = `
    <div class="pagination-info">Showing <strong>${start}</strong> - <strong>${end}</strong> of <strong>${total}</strong></div>
    <div class="pagination-controls">
      <button class="page-btn nav" data-page="${page - 1}" ${page === 1 ? "disabled" : ""}>&laquo; Previous</button>
      ${pages
        .map((p) =>
          p === "..."
            ? `<span class="page-ellipsis">&hellip;</span>`
            : `<button class="page-btn ${p === page ? "active" : ""}" data-page="${p}">${p}</button>`
        )
        .join("")}
      <button class="page-btn nav" data-page="${page + 1}" ${page === totalPages ? "disabled" : ""}>Next &raquo;</button>
    </div>
    <div class="page-size">
      <label for="pageSizeSelect">Rows</label>
      <select id="pageSizeSelect" class="page-size-select" data-no-search>
        ${[10, 25, 50, 100]
          .map((n) => `<option value="${n}" ${n === pageSize ? "selected" : ""}>${n}</option>`)
          .join("")}
      </select>
    </div>`;

  container.querySelectorAll(".page-btn[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      onChange({ page: parseInt(btn.dataset.page, 10), pageSize });
    });
  });

  container.querySelector(".page-size-select").addEventListener("change", (e) => {
    onChange({ page: 1, pageSize: parseInt(e.target.value, 10) });
  });
}

function getPageList(current, total) {
  const maxMiddle = 5;
  if (total <= maxMiddle + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  let start, end;
  if (current <= 3) {
    start = 1;
    end = maxMiddle;
  } else if (current >= total - 2) {
    start = total - maxMiddle + 1;
    end = total;
  } else {
    start = current - 2;
    end = current + 2;
  }
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);
  const result = [];
  if (pages[0] > 1) {
    result.push(1);
    if (pages[0] > 2) result.push("...");
  }
  result.push(...pages);
  if (pages[pages.length - 1] < total) {
    if (pages[pages.length - 1] < total - 1) result.push("...");
    result.push(total);
  }
  return result;
}

// Delays calling fn until typing pauses for `delay` ms — use for any
// search input that will eventually hit a real API, to avoid firing a
// request on every keystroke.
function debounce(fn, delay = 350) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Shared identity + formatting for history entries across all pages.
const CURRENT_USER = { name: "Admin User", email: "admin@mynztrip.com" };

// "Merged"/"Unmerged" are for a city's own merge-composition membership
// changing (added to / removed from a merged city's mergedFrom list) — kept
// distinct from Map/Remap/Unmap since a merge isn't a mapping relationship,
// just this city's own property. Same green/red as the analogous
// addition/removal pair Map/Unmap already use.
const OPERATION_PILL_CLASS = { Create: "success", Edit: "info", "Status Change": "neutral", Map: "success", Remap: "info", Unmap: "danger", Merged: "success", Unmerged: "danger" };

// The one reserved marker for "start a new line here" inside a history
// description string — used when one description needs to show more than
// one distinct fact (e.g. who made a mapping change, and separately what it
// changed from/to) instead of cramming both into one dense run-on line. The
// renderer below splits on this and puts each part on its own line. Never
// use this character in a description for any other purpose.
const HISTORY_LINE_BREAK = "|";

function operationPillHtml(operation) {
  const op = operation || "Edit";
  const cls = OPERATION_PILL_CLASS[op] || "neutral";
  return `<span class="pill operation-pill ${cls}">${op}</span>`;
}

function formatDateOnly(date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${String(date.getDate()).padStart(2, "0")}-${months[date.getMonth()]}-${date.getFullYear()}`;
}

function formatTimeOnly(date) {
  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
}

function formatTimestamp(date) {
  return `${formatDateOnly(date)} ${formatTimeOnly(date)}`;
}

// Wraps a value in the same fixed-fade-truncate treatment used by the hotel
// list tables (.truncatable/.truncatable-text/.is-overflowing, see
// css/styles.css) so a long username/email fades out at the right edge
// instead of wrapping or hard-clipping — full value is always available via
// the native title tooltip on hover. Actual overflow detection (adding
// .is-overflowing) happens after insertion, in showHistoryList() below,
// since it needs real layout to measure against.
function historyValueHtml(value) {
  return `<div class="truncatable truncatable--historyvalue" title="${value}"><span class="truncatable-text">${value}</span></div>`;
}

// Splits one description on HISTORY_LINE_BREAK into its separate facts
// (e.g. "who mapped it" and "what it changed from/to"), trimming the
// incidental whitespace a template literal like `${a}${HISTORY_LINE_BREAK}${b}`
// doesn't leave, but a hand-written one might. A description with no marker
// in it just comes back as a single-item array.
function splitDescriptionLines(description) {
  return (description || "")
    .split(HISTORY_LINE_BREAK)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Within one grouped card (see renderHistoryList below), clusters that
// group's entries by operation — a batch Save can easily produce several
// entries with the *same* operation (e.g. mapping 3 new cities in one click
// is 3 "Map" entries), and repeating an identical pill 3 times in a row read
// as noisy/unorganized. Clusters preserve first-seen order across the group
// (not alphabetical), so the card still roughly follows the order the batch
// was applied in. Every entry's own description is also split on
// HISTORY_LINE_BREAK (see splitDescriptionLines above), so a single dense
// description (e.g. a Remap's "who" + "old -> new") reads as separate lines
// too. Once both of these apply at once — several entries sharing one
// operation, each of which ALSO splits into several lines — flattening
// everything into one plain list of lines made it impossible to tell where
// one entry's lines ended and the next entry's began. Each entry's own
// lines are now kept together in their own `.history-op-desc-entry` group;
// `.history-op-desc-entry:not(:last-child)` (css/styles.css) draws a dashed
// divider + extra spacing between entries, while lines within one entry
// keep the original tight spacing — so a 2-entry Remap cluster reads as two
// visually distinct blocks instead of 4 run-together lines. A cluster that
// resolves to exactly one line total still renders exactly as before (pill,
// then that line, on the same line, no wrapper at all).
function renderHistoryDescriptionLines(group) {
  const order = [];
  const byOperation = new Map();
  group.forEach((h) => {
    const op = h.operation || "Edit";
    if (!byOperation.has(op)) {
      byOperation.set(op, []);
      order.push(op);
    }
    byOperation.get(op).push(splitDescriptionLines(h.description));
  });
  return order
    .map((op) => {
      const entries = byOperation.get(op).filter((lines) => lines.length);
      const totalLines = entries.reduce((sum, lines) => sum + lines.length, 0);
      const body =
        totalLines > 1
          ? `<div class="history-op-desc-list">${entries
              .map((lines) => `<div class="history-op-desc-entry">${lines.map((l) => `<div>${l}</div>`).join("")}</div>`)
              .join("")}</div>`
          : entries[0]?.[0];
      return `<div class="history-op-line">${operationPillHtml(op)}${body}</div>`;
    })
    .join("");
}

// Shared card-per-entry history renderer, used by every "View History" drawer
// project-wide. Every history entry is expected to already carry a fully
// formed `description` string — a property snapshot for Create, or an
// "old -> new" changelog for Edit/Status Change — built at the point the
// action happened (see each page's save/toggle handlers). Newest entry first.
// Entries that share a `groupId` (set by applyMapping() in js/data.js when
// one batch Save touches several rows) are merged into a single card — see
// renderHistoryDescriptionLines above for how same-operation entries within
// that group are organized. An entry with no groupId (every entity except a
// system city's batch-mapping history) is its own one-entry group, so it
// still renders as a normal single-line card.
function renderHistoryList(entries, emptyMessage = "No history yet") {
  if (!entries.length) {
    return `<p style="text-align:center; color:var(--text-muted); padding:28px 0;">${emptyMessage}</p>`;
  }

  const groups = [];
  const groupIndexById = new Map();
  entries.forEach((h) => {
    if (h.groupId && groupIndexById.has(h.groupId)) {
      groups[groupIndexById.get(h.groupId)].push(h);
      return;
    }
    if (h.groupId) groupIndexById.set(h.groupId, groups.length);
    groups.push([h]);
  });

  const ordered = [...groups].reverse();
  return ordered
    .map(
      (group, i) => `
      <div class="history-entry">
        <div class="history-entry-label">Entry ${i + 1} of ${groups.length}</div>
        <div class="history-card">
          <table class="history-card-v2">
            <tbody>
              <tr class="history-user-row">
                <td class="history-value-cell history-user-name">${historyValueHtml(group[0].userName)}</td>
                <td class="history-datetime-cell">${formatDateOnly(group[0].timestamp)}</td>
              </tr>
              <tr class="history-email-row">
                <td class="history-value-cell history-user-email">${historyValueHtml(group[0].userEmail)}</td>
                <td class="history-datetime-cell">${formatTimeOnly(group[0].timestamp)}</td>
              </tr>
              <tr class="history-description-row">
                <td colspan="2" class="history-description-cell">
                  ${renderHistoryDescriptionLines(group)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>`
    )
    .join("");
}

// Sets #historyList's content and measures real overflow on every
// .truncatable value just inserted (username/email — see historyValueHtml
// above), toggling the fade mask on. Safe to measure immediately even
// before the History modal is opened: .modal-overlay uses
// visibility:hidden while closed (not display:none), so scrollWidth/
// clientWidth are already accurate. Use this instead of setting
// #historyList.innerHTML directly so the fade never gets forgotten on a
// new call site.
function showHistoryList(entries, emptyMessage) {
  const el = document.getElementById("historyList");
  el.innerHTML = renderHistoryList(entries, emptyMessage);
  el.querySelectorAll(".truncatable").forEach((t) => {
    t.classList.toggle("is-overflowing", t.scrollWidth > t.clientWidth + 1);
  });
}

function initTableSearch() {
  document.querySelectorAll("[data-table-search]").forEach((input) => {
    const table = document.querySelector(input.getAttribute("data-table-search"));
    if (!table) return;
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      table.querySelectorAll("tbody tr").forEach((row) => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    });
  });
}

// ---------- Searchable select (progressive enhancement for every <select>) ----------
// Every dropdown in the project — filters, form pickers, even the pagination
// page-size select — gets a search box so long option lists (countries,
// cities, suppliers) stay easy to find. Works generically: it hides the
// original <select> and drives it from a custom trigger + panel, so all
// existing code that reads/sets .value, .disabled, or listens for "change"
// on the select keeps working untouched.

const VALUE_DESCRIPTOR = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value");
const DISABLED_DESCRIPTOR = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "disabled");

function enhanceSearchableSelect(select) {
  if (select._searchableEnhanced || select.hasAttribute("data-no-search")) return;
  select._searchableEnhanced = true;

  const originalClassName = select.className;

  const wrapper = document.createElement("div");
  wrapper.className = "searchable-select";
  select.classList.add("searchable-select-native");
  select.parentNode.insertBefore(wrapper, select);
  wrapper.appendChild(select);

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = originalClassName + " searchable-select-trigger";
  trigger.innerHTML = `<span class="searchable-select-label"></span><svg class="searchable-select-caret" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  wrapper.appendChild(trigger);

  const inlineStyle = select.getAttribute("style");
  if (inlineStyle) {
    wrapper.setAttribute("style", inlineStyle);
    trigger.style.width = "100%";
  }

  const label = trigger.querySelector(".searchable-select-label");

  const panel = document.createElement("div");
  panel.className = "searchable-select-panel";
  panel.innerHTML = `
    <input type="text" class="searchable-select-search" placeholder="Search..." autocomplete="off" />
    <div class="searchable-select-options"></div>`;
  document.body.appendChild(panel);

  const searchInput = panel.querySelector(".searchable-select-search");
  const optionsList = panel.querySelector(".searchable-select-options");

  let visibleOptions = [];
  let highlightedIndex = -1;

  function currentOptions() {
    return Array.from(select.options).filter((o) => !o.disabled);
  }

  function syncLabel() {
    const opt = select.options[select.selectedIndex];
    label.textContent = opt ? opt.textContent : "";
    trigger.classList.toggle("placeholder", !opt || !opt.value);
  }

  function syncDisabled() {
    trigger.disabled = select.disabled;
  }

  function renderOptions(filterText) {
    const q = filterText.trim().toLowerCase();
    const all = currentOptions();
    visibleOptions = q ? all.filter((o) => o.textContent.toLowerCase().includes(q)) : all;
    optionsList.innerHTML = visibleOptions.length
      ? visibleOptions
          .map((o, i) => {
            // A page can flag an <option> as already-mapped-elsewhere via
            // data-mapped="true" (e.g. city-mapping.html's left-panel
            // supplier-city picker) to get the same color-coded treatment
            // as the mapping checklists, without this generic component
            // knowing what "mapped" means for that page.
            const classes = ["searchable-select-option"];
            if (o.value === select.value) classes.push("selected");
            if (o.dataset.mapped === "true") classes.push("mapped-elsewhere");
            return `<div class="${classes.join(" ")}" data-index="${i}">${o.textContent}</div>`;
          })
          .join("")
      : `<div class="searchable-select-empty">No matches found</div>`;
    highlightedIndex = visibleOptions.findIndex((o) => o.value === select.value);
    updateHighlight();
  }

  function updateHighlight() {
    optionsList.querySelectorAll(".searchable-select-option").forEach((el, i) => {
      el.classList.toggle("highlighted", i === highlightedIndex);
    });
    const activeEl = optionsList.children[highlightedIndex];
    if (activeEl) activeEl.scrollIntoView({ block: "nearest" });
  }

  function position() {
    const rect = trigger.getBoundingClientRect();
    panel.style.left = `${rect.left}px`;
    panel.style.width = `${rect.width}px`;
    panel.style.top = `${rect.bottom + 4}px`;
    const spaceBelow = window.innerHeight - rect.bottom;
    const panelHeight = panel.offsetHeight;
    if (spaceBelow < panelHeight + 8 && rect.top > panelHeight + 8) {
      panel.style.top = `${rect.top - panelHeight - 4}px`;
    }
  }

  function open() {
    if (select.disabled) return;
    document.querySelectorAll(".searchable-select-panel.open").forEach((p) => {
      if (p !== panel) p.classList.remove("open");
    });
    panel.classList.add("open");
    wrapper.classList.add("open");
    searchInput.value = "";
    renderOptions("");
    position();
    searchInput.focus();
  }

  function close() {
    panel.classList.remove("open");
    wrapper.classList.remove("open");
  }

  function isOpen() {
    return panel.classList.contains("open");
  }

  function selectOption(opt) {
    select.value = opt.value;
    close();
    trigger.focus();
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  trigger.addEventListener("click", () => (isOpen() ? close() : open()));

  trigger.addEventListener("keydown", (e) => {
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      open();
    }
  });

  searchInput.addEventListener("input", () => renderOptions(searchInput.value));

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      highlightedIndex = Math.min(highlightedIndex + 1, visibleOptions.length - 1);
      updateHighlight();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      highlightedIndex = Math.max(highlightedIndex - 1, 0);
      updateHighlight();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (visibleOptions[highlightedIndex]) selectOption(visibleOptions[highlightedIndex]);
    } else if (e.key === "Escape") {
      close();
      trigger.focus();
    }
  });

  optionsList.addEventListener("click", (e) => {
    const el = e.target.closest(".searchable-select-option");
    if (!el) return;
    const opt = visibleOptions[parseInt(el.dataset.index, 10)];
    if (opt) selectOption(opt);
  });

  document.addEventListener("click", (e) => {
    if (isOpen() && !trigger.contains(e.target) && !panel.contains(e.target)) close();
  });
  // Scrolling the options list itself (by hand, or via the scrollIntoView
  // call in updateHighlight() when opening) fires a scroll event too — only
  // treat scrolling OUTSIDE the panel as "user scrolled the page away".
  window.addEventListener(
    "scroll",
    (e) => {
      if (isOpen() && !panel.contains(e.target)) close();
    },
    true
  );
  window.addEventListener("resize", () => isOpen() && close());

  // Two-way sync: existing page code sets `.value`/`.disabled` on the
  // original select directly (e.g. resetting a form, cascading a country ->
  // state pick) — intercept those so the custom trigger stays in sync
  // without requiring any changes at the call sites.
  Object.defineProperty(select, "value", {
    configurable: true,
    get() {
      return VALUE_DESCRIPTOR.get.call(select);
    },
    set(v) {
      VALUE_DESCRIPTOR.set.call(select, v);
      syncLabel();
    },
  });
  Object.defineProperty(select, "disabled", {
    configurable: true,
    get() {
      return DISABLED_DESCRIPTOR.get.call(select);
    },
    set(v) {
      DISABLED_DESCRIPTOR.set.call(select, v);
      syncDisabled();
    },
  });

  select._searchableRefresh = () => {
    syncLabel();
    syncDisabled();
  };

  syncLabel();
  syncDisabled();
}

// Enhances every select on the page now, plus any added later — covers
// dynamically populated filters (countries/cities/suppliers loaded after
// page scripts run) and the pagination page-size select, which is fully
// rebuilt on every render().
function initSearchableSelects() {
  document.querySelectorAll("select").forEach(enhanceSearchableSelect);

  new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.matches?.("select")) enhanceSearchableSelect(node);
        node.querySelectorAll?.("select").forEach(enhanceSearchableSelect);
      });
      if (m.type === "childList" && m.target.matches?.("select") && m.target._searchableRefresh) {
        m.target._searchableRefresh();
      }
    }
  }).observe(document.body, { childList: true, subtree: true, attributes: false });
}
