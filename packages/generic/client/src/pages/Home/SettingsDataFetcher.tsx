import React, { ReactElement } from 'react';
import { settingsModule, settingsType } from '@label/core';
import { apiCaller, useApi } from '../../api';
import { DataFetcher } from '../DataFetcher';

export { SettingsDataFetcher };

function SettingsDataFetcher(props: {
  alwaysDisplayHeader?: boolean;
  children: (fetched: { settings: settingsType }) => ReactElement;
}) {
  const settingsFetchInfo = useApi(() => apiCaller.get<'settings'>('settings'));

  return (
    <DataFetcher
      alwaysDisplayHeader={props.alwaysDisplayHeader}
      buildComponentWithData={(settings: settingsType) => props.children({ settings })}
      fetchInfo={settingsFetchInfo}
      dataAdapter={(settings) => settingsModule.lib.parseFromJson(settings.json) as settingsType}
    />
  );
}
