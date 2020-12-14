import React from 'react';
import { ProblemReportsDataFetcher } from './ProblemReportsDataFetcher';

export { ProblemReports };

function ProblemReports() {
  return (
    <ProblemReportsDataFetcher>
      {({ problemReports }) => (
        <table>
          {problemReports.map((problemReport) => (
            <tr>
              <td>{problemReport._id}</td>
              <td>{problemReport.type}</td>
              <td>{problemReport.text}</td>
            </tr>
          ))}
        </table>
      )}
    </ProblemReportsDataFetcher>
  );
}
