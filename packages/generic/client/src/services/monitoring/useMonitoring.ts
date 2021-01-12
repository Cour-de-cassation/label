import { useContext } from 'react';
import { MonitoringEntriesHandlerContext } from './MonitoringEntriesHandlerContext';

export { useMonitoring };

function useMonitoring() {
  return useContext(MonitoringEntriesHandlerContext);
}
