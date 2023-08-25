import React, { ReactElement } from 'react';
import { settingsModule, settingsType } from '@label/core';
import { apiCaller, useApi } from '../api';
import { DataFetcher } from './DataFetcher';

export { SettingsDataFetcher };

function SettingsDataFetcher(props: { children: (fetched: { settings: settingsType }) => ReactElement }) {
  const settingsFetchInfo = useApi(buildFetchSettings(), {});
  return (
    <DataFetcher
      buildComponentWithData={(settings: settingsType) => props.children({ settings })}
      fetchInfo={settingsFetchInfo}
      route={'settings'}
    />
  );
}

function buildFetchSettings() {
  return async () => {
    const { data, statusCode } = await apiCaller.get<'settings'>('settings');
    return { data: settingsModule.lib.parseFromJson(data.json) as settingsType, statusCode };
  };
}
