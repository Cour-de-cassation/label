import React from 'react';
import { ProblemReports } from './ProblemReports';
import { ProblemReportsDataFetcher } from './ProblemReportsDataFetcher';

export { Admin };

function Admin() {
  return (
    <ProblemReportsDataFetcher>
      {({ problemReports }) => <ProblemReports problemReports={problemReports} />}
    </ProblemReportsDataFetcher>
  );
}
