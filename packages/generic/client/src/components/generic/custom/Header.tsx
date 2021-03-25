import React, { ReactElement, CSSProperties } from 'react';
import { ComponentsList } from '../../../components';

export { Header };

function Header(props: {
  leftHeaderComponents: ReactElement[];
  rightHeaderComponents: ReactElement[];
  spaceBetweenComponents: number;
  style?: CSSProperties;
  variant: 'classic' | 'mainLeft' | 'mainRight';
}): ReactElement {
  const styles = buildStyles();
  return (
    <div style={{ ...styles.mainContainer, ...props.style }}>
      <div style={styles.leftContainer}>
        <ComponentsList components={props.leftHeaderComponents} spaceBetweenComponents={props.spaceBetweenComponents} />
      </div>
      <div style={styles.rightContainer}>
        <ComponentsList
          components={props.rightHeaderComponents}
          spaceBetweenComponents={props.spaceBetweenComponents}
        />
      </div>
    </div>
  );

  function buildStyles() {
    const { left, right } = buildHeaderSized();

    return {
      mainContainer: {
        display: 'flex',
      },
      leftContainer: {
        display: 'flex',
        alignItems: 'center',
        width: `${left}%`,
      },
      rightContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: `${right}%`,
      },
    };
  }

  function buildHeaderSized() {
    switch (props.variant) {
      case 'classic':
        return { left: 50, right: 50 } as const;
      case 'mainLeft':
        return { left: 92, right: 8 } as const;
      case 'mainRight':
        return { left: 8, right: 92 } as const;
    }
  }
}
