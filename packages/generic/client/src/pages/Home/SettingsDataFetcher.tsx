import React, { ReactElement } from 'react';
import { useQuery } from '@apollo/client';
import { settingsModule, settingsType } from '@label/core';
import { DataFetcher } from '../../services/dataFetcher';
import { buildGraphQLQuery } from '../../graphQL';

export { SettingsDataFetcher };

type settingsGraphQLType = {
  settings: { json: string };
};

function SettingsDataFetcher(props: { children: (fetched: { settings: settingsType }) => ReactElement }) {
  const settingsFetchInfo = useQuery<settingsGraphQLType>(buildSettingsGraphQLQuery());
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

function buildSettingsGraphQLQuery() {
  return buildGraphQLQuery('settings', 'settings', settingsModule.dataModel);
}
