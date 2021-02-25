import { displayModeType } from '@label/core';

const DISPLAY_MODE_STORAGE_KEY = 'DISPLAY_MODE';

export { displayModeHandler };

const displayModeHandler = {
  set,
  get,
};

function set(displayMode: displayModeType) {
  localStorage.setItem(DISPLAY_MODE_STORAGE_KEY, displayMode);
}

function get() {
  return localStorage.getItem(DISPLAY_MODE_STORAGE_KEY) as displayModeType | null;
}
