import React from 'react';
import { annotationModule, settingsModule } from '@label/core';
import { CategoryIcon, Drawer, Header, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../types';
import { useCustomTheme } from '../../../../styles';

export { EntityDrawer };

const CATEGORY_ICON_SIZE = 40;

function EntityDrawer(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  entityId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const customTheme = useCustomTheme();
  const annotatorState = props.annotatorStateHandler.get();
  const category = annotationModule.lib.entityIdHandler.getCategory(props.entityId);

  return (
    <Drawer isOpen={props.isOpen} onClose={props.onClose}>
      <Header
        leftHeaderComponents={[
          <CategoryIcon
            annotatorStateHandler={props.annotatorStateHandler}
            category={category}
            iconSize={CATEGORY_ICON_SIZE}
          />,
          <Text>{`${settingsModule.lib.getAnnotationCategoryText(category, annotatorState.settings)} : `}</Text>,
          <Text variant="body2">{props.entityId}</Text>,
        ]}
        rightHeaderComponents={[]}
        spaceBetweenComponents={customTheme.spacing * 2}
        variant="mainLeft"
      />
    </Drawer>
  );
}
