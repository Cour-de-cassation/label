import React, { ReactElement } from 'react';
import { fetchedTreatmentType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { TreatmentsDataFetcher };

function TreatmentsDataFetcher(props: {
  alwaysDisplayHeader?: boolean;
  children: (fetched: { treatments: fetchedTreatmentType[] }) => ReactElement;
}) {
  const treatmentsFetchInfo = useApi(() => apiCaller.get<'treatments'>('treatments'));

  return (
    <DataFetcher
      alwaysDisplayHeader={props.alwaysDisplayHeader}
      buildComponentWithData={(treatments: fetchedTreatmentType[]) => props.children({ treatments })}
      fetchInfo={treatmentsFetchInfo}
      dataAdapter={(treatments) =>
        treatments.map((treatment) => ({
          ...treatment,
          documentId: idModule.lib.buildId(treatment.documentId),
          _id: idModule.lib.buildId(treatment._id),
          userId: idModule.lib.buildId(treatment.userId),
        }))
      }
    />
  );
}
