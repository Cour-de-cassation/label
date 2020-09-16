import { oracleSynchronizer } from './synchronizer';

export { oracle };

const oracle = {
  async synchronizeAllCourtDecisions() {
    await oracleSynchronizer.synchronizeJurinetCourtDecisions();
  },
};
