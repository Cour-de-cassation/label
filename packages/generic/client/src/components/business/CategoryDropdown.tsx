import React, { ReactElement, useState } from 'react';
import { settingsModule } from '@label/core';
import { annotatorStateHandlerType } from '../../services/annotatorState';
import { DropdownWithIcon } from '../generic';
import { CategoryIcon } from './CategoryIcon';

export { CategoryDropdown };

const CATEGORY_DROPDOWN_ICON_SIZE = 30;

function CategoryDropdown(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  categories: string[];
  defaultCategory: string;
  onChange: (category: string) => void;
  width?: number;
}): ReactElement {
  const settings = props.annotatorStateHandler.get().settings;
  const [category, setCategory] = useState<string>(props.defaultCategory);

  return (
    <DropdownWithIcon
      color={settingsModule.lib.getAnnotationCategoryColor(category, settings)}
      defaultItem={props.defaultCategory}
      icon={
        <CategoryIcon
          annotatorStateHandler={props.annotatorStateHandler}
          category={category}
          iconSize={CATEGORY_DROPDOWN_ICON_SIZE}
        />
      }
      items={props.categories.map((category) => ({
        value: category,
        displayedText: settingsModule.lib.getAnnotationCategoryText(category, settings),
      }))}
      onChange={handleChange}
      width={props.width}
    />
  );

  function handleChange(category: string) {
    setCategory(category);
    props.onChange(category);
  }
}
