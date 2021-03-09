import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { TreatmentsDataFetcher };

function TreatmentsDataFetcher(props: {
  children: (fetched: { treatmentsWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'> }) => ReactElement;
}) {
  const treatmentsWithDetailsFetchInfo = useApi(buildFetchTreatments());

  return (
    <DataFetcher
      buildComponentWithData={(treatmentsWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'>) =>
        props.children({ treatmentsWithDetails })
      }
      fetchInfo={treatmentsWithDetailsFetchInfo}
    />
  );
}

function buildFetchTreatments() {
  return async () => {
    const { data: treatmentsWithDetails, statusCode } = await apiCaller.get<'treatmentsWithDetails'>(
      'treatmentsWithDetails',
    );

    return {
      data: treatmentsWithDetails.map((treatmentWithDetails) => ({
        ...treatmentWithDetails,
        treatment: {
          ...treatmentWithDetails.treatment,
          documentId: idModule.lib.buildId(treatmentWithDetails.treatment.documentId),
          _id: idModule.lib.buildId(treatmentWithDetails.treatment._id),
        },
      })),
      statusCode,
    };
  };
}
