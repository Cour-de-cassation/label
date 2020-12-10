import React from 'react';
import { problemReportType } from '@label/core';

export { ProblemReports };

function ProblemReports(props: { problemReports: problemReportType[] }) {
  return (
    <table>
      {props.problemReports.map((problemReport) => (
        <tr>
          <td>{problemReport._id}</td>
          <td>{problemReport.type}</td>
          <td>{problemReport.text}</td>
        </tr>
      ))}
    </table>
  );
}
