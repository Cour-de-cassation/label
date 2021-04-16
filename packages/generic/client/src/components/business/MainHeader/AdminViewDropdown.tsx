import React from 'react';
import { useHistory } from 'react-router';
import { defaultRoutes } from '../../../pages';
import { adminViews, localStorage } from '../../../services/localStorage';
import { wordings } from '../../../wordings';
import { LabelledDropdown } from '../../generic';

export { AdminViewDropdown };

function AdminViewDropdown() {
  const history = useHistory();
  const defaultAdminView = localStorage.adminViewHandler.get() || 'admin';
  return (
    <LabelledDropdown<typeof adminViews[number]>
      label={wordings.business.adminViews.label}
      items={adminViews.map((adminView) => ({
        text: wordings.business.adminViews.values[adminView],
        value: adminView,
      }))}
      defaultValue={defaultAdminView}
      onChange={onChangeAdminView}
    />
  );

  function onChangeAdminView(adminView: typeof adminViews[number]) {
    localStorage.adminViewHandler.set(adminView);
    history.push(defaultRoutes[adminView]);
  }
}
