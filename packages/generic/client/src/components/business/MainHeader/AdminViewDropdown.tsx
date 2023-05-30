import React from 'react';
import { useNavigate } from 'react-router';
import { LabelledDropdown } from 'pelta-design-system';
import { defaultRoutes } from '../../../pages';
import { adminViews, localStorage } from '../../../services/localStorage';
import { wordings } from '../../../wordings';

export { AdminViewDropdown };

function AdminViewDropdown(props: { updateAdminMenu?: () => void }) {
  const navigate = useNavigate();
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
    navigate(defaultRoutes[adminView]);
    if (props.updateAdminMenu) props.updateAdminMenu();
  }
}
