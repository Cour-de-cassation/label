import React, { ReactElement } from 'react';
import { settingsModule, settingsType } from '@label/core';
import { apiCaller, useApi } from '../../api';
import { DataFetcher } from '../DataFetcher';

export { SettingsDataFetcher };

function SettingsDataFetcher(props: {
  alwaysDisplayHeader?: boolean;
  children: (fetched: { settings: settingsType }) => ReactElement;
}) {
  const settingsFetchInfo = useApi(buildFetchSettings());
  return (
    <DataFetcher
      alwaysDisplayHeader={props.alwaysDisplayHeader}
      buildComponentWithData={(settings: settingsType) => props.children({ settings })}
      fetchInfo={settingsFetchInfo}
    />
  );
}

function buildFetchSettings() {
  return async () => {
    const {
      data: { json },
      statusCode,
    } = await apiCaller.get<'settings'>('settings');

    try {
      const data = settingsModule.lib.parseFromJson(json) as settingsType;
      return { data, statusCode };
    } catch (_) {
      return { data: undefined, statusCode };
    }
  };
}
