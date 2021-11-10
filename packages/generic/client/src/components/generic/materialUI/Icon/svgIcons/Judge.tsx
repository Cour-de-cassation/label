import React, { CSSProperties } from 'react';
import { SvgIcon } from '@material-ui/core';

export { Judge };

const DEFAULT_SIZE = 24;

function Judge(props: { style?: CSSProperties }) {
  return (
    <SvgIcon style={props.style}>
      <svg
        width={props.style?.width || DEFAULT_SIZE}
        height={props.style?.height || DEFAULT_SIZE}
        viewBox={`0 0 ${props.style?.height || DEFAULT_SIZE} ${props.style?.width || DEFAULT_SIZE}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 21C8 20.4477 8.44772 20 9 20H15C15.5523 20 16 20.4477 16 21C16 21.5523 15.5523 22 15 22H9C8.44772 22 8 21.5523 8 21Z"
          fill={props.style?.color}
        />
        <path fillRule="evenodd" clipRule="evenodd" d="M13 4V21H11V4H13Z" fill={props.style?.color} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4 4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4C20 4.55228 19.5523 5 19 5H5C4.44772 5 4 4.55228 4 4Z"
          fill={props.style?.color}
        />
        <path d="M19 17C20.6569 17 22 16.1046 22 15H19H16C16 16.1046 17.3431 17 19 17Z" fill={props.style?.color} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15 15C15 14.4477 15.4477 14 16 14H22C22.5523 14 23 14.4477 23 15C23 15.9907 22.3977 16.7651 21.676 17.2463C20.9474 17.732 19.9983 18 19 18C18.0017 18 17.0526 17.732 16.324 17.2463C15.6023 16.7651 15 15.9907 15 15Z"
          fill={props.style?.color}
        />
        <path d="M5 17C6.65685 17 8 16.1046 8 15H2C2 16.1046 3.34315 17 5 17Z" fill={props.style?.color} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1 15C1 14.4477 1.44772 14 2 14H8C8.55228 14 9 14.4477 9 15C9 15.9907 8.3977 16.7651 7.67602 17.2463C6.94735 17.732 5.99832 18 5 18C4.00168 18 3.05265 17.732 2.32398 17.2463C1.6023 16.7651 1 15.9907 1 15Z"
          fill={props.style?.color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.00005 6C5.41689 6 5.79002 6.25857 5.93638 6.64888L8.93638 14.6489L7.06372 15.3511L5.00005 9.848L2.93638 15.3511L1.06372 14.6489L4.06372 6.64888C4.21008 6.25857 4.58321 6 5.00005 6Z"
          fill={props.style?.color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19 6C19.4169 6 19.79 6.25857 19.9364 6.64888L22.9364 14.6489L21.0637 15.3511L19 9.848L16.9364 15.3511L15.0637 14.6489L18.0637 6.64888C18.2101 6.25857 18.5832 6 19 6Z"
          fill={props.style?.color}
        />
      </svg>
    </SvgIcon>
  );
}
