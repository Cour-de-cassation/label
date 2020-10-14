import React, { ReactElement } from 'react';
import { useQuery } from '@apollo/client';
import { settingsModule, settingsType } from '@label/core';
import { DataFetcher } from '../../../services/dataFetcher';
import { settingsGraphQLType, SETTINGS_GRAPHQL_QUERY } from '../DocumentAnnotator/graphql';

export { SettingsDataFetcher };

function SettingsDataFetcher(props: { children: (fetched: { settings: settingsType }) => ReactElement }) {
  const settingsFetchInfo = useQuery<settingsGraphQLType>(SETTINGS_GRAPHQL_QUERY);
  const settingsDataAdapter = ([data]: [settingsGraphQLType]) =>
    [settingsModule.lib.parseFromJson(data.settings.json)] as [settingsType];

  return (
    <DataFetcher<[settingsGraphQLType], [settingsType]>
      fetchInfos={[settingsFetchInfo]}
      dataAdapter={settingsDataAdapter}
    >
      {([settings]: [settingsType]) => props.children({ settings })}
    </DataFetcher>
  );
}
