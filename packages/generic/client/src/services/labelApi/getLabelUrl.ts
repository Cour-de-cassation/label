import { environment } from '@label/core';

export { getLabelUrl };

function getLabelUrl() {
  return `${window.location.protocol}//${window.location.hostname}:${environment.port.server}`;
}
