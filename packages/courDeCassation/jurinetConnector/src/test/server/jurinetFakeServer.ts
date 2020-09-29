import { jurinetCourtDecisionType } from '../../fetcher/api';
import { jurinetCourtDecisionGenerator } from '../generator';

export { jurinetFakeServer };

let jurinetCourtDecisions: jurinetCourtDecisionType[] = generateNJurinetCourtDecisions(
  5,
);

const jurinetFakeServer = {
  reinitialize: () => {
    jurinetCourtDecisions = generateNJurinetCourtDecisions(5);
  },
  getJurinetCourtDecisions() {
    return jurinetCourtDecisions;
  },
};

function generateNJurinetCourtDecisions(n: number) {
  return [...Array(n).keys()].map(() =>
    jurinetCourtDecisionGenerator.generate(),
  );
}
