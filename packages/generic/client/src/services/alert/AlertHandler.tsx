import React, { createContext, ReactElement, ReactNode, useState } from 'react';
import { Snackbar } from '../../components';

export { AlertHandlerContext, AlertHandlerContextProvider };

type alertHandlerType = { displayAlert: ({ text, variant }: alertType) => void };

type alertType = {
  variant: 'alert' | 'success';
  text: string;
};

const AlertHandlerContext = createContext<alertHandlerType>({
  displayAlert: () => null,
});

function AlertHandlerContextProvider(props: { children: ReactNode }): ReactElement {
  const [alert, setAlert] = useState<alertType | undefined>(undefined);
  const alertHandler = {
    displayAlert: setAlert,
  };

  return (
    <AlertHandlerContext.Provider value={alertHandler}>
      {!!alert && (
        <Snackbar variant={alert.variant} text={alert.text} isOpen={!!alert} onClose={() => setAlert(undefined)} />
      )}
      {props.children}
    </AlertHandlerContext.Provider>
  );
}
