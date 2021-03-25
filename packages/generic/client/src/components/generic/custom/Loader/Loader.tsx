import React from 'react';

export { Loader };

const DEFAULT_SIZE = 15;

function Loader(props: { size?: number }) {
  const styles = buildStyles();
  return <div className="loader" style={styles.loader} />;

  function buildStyles() {
    const size = props.size || DEFAULT_SIZE;

    return {
      loader: {
        borderColor: 'inherit',
        border: '2px solid',
        borderTop: '1px solid transparent',
        width: `${size}px`,
        height: `${size}px`,
      },
    };
  }
}
