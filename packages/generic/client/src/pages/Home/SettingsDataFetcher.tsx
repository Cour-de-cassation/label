import React, { ReactElement } from 'react';
import { settingsModule, settingsType } from '@label/core';
import { DataFetcher } from '../../services/dataFetcher';
import { useGraphQLQuery } from '../../graphQL';

export { SettingsDataFetcher };

type settingsGraphQLType = {
  settings: { json: string };
};

function SettingsDataFetcher(props: { children: (fetched: { settings: settingsType }) => ReactElement }) {
  const settingsFetchInfo = useGraphQLQuery<'settings'>('settings');
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
