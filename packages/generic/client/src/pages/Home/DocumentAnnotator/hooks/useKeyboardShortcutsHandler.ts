import { useEffect } from 'react';

export { useKeyboardShortcutsHandler };

function useKeyboardShortcutsHandler(onUndo: () => void, onRedo: () => void): void {
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
      onRedo();
    } else if (event.ctrlKey && event.key === 'z') {
      onUndo();
    }
  }
}
