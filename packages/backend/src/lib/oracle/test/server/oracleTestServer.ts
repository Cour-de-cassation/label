import { jurinetCourtDecisionType } from '../../api';
import { jurinetCourtDecisionGenerator } from '../generator';

export { oracleTestServer };

let jurinetCourtDecisions: jurinetCourtDecisionType[] = [
  ...Array(5).keys(),
].map(() => jurinetCourtDecisionGenerator.generate());

const oracleTestServer = {
  reinitialize: () => {
    jurinetCourtDecisions = [...Array(5).keys()].map(() =>
      jurinetCourtDecisionGenerator.generate(),
    );
  },
  getJurinetCourtDecisions() {
    return jurinetCourtDecisions;
  },
};
