import { clone } from "./utils.js";

export function loadStoredState(storageKey, defaultState, migrate) {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return clone(defaultState);

  try {
    const saved = JSON.parse(raw);
    const migrated = { ...clone(defaultState), ...saved };
    return typeof migrate === "function" ? migrate(migrated, saved) : migrated;
  } catch {
    return clone(defaultState);
  }
}

export function saveStoredState(storageKey, state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}
