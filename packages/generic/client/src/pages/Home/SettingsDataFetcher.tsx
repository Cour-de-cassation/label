import React, { ReactElement } from 'react';
import { settingsModule, settingsType } from '@label/core';
import { useGraphQLQuery } from '../../graphQL';
import { DataFetcher } from '../DataFetcher';

export { SettingsDataFetcher };

type settingsGraphQLType = {
  settings: { json: string };
};

function SettingsDataFetcher(props: {
  alwaysDisplayHeader?: boolean;
  children: (fetched: { settings: settingsType }) => ReactElement;
}) {
  const settingsFetchInfo = useGraphQLQuery<'settings'>('settings');
  const settingsDataAdapter = ([data]: [settingsGraphQLType]) =>
    [settingsModule.lib.parseFromJson(data.settings.json)] as [settingsType];

  return (
    <DataFetcher
      alwaysDisplayHeader={props.alwaysDisplayHeader}
      buildComponentWithData={([settings]) => props.children({ settings })}
      fetchInfos={[settingsFetchInfo]}
      dataAdapter={settingsDataAdapter}
    />
  );
}
