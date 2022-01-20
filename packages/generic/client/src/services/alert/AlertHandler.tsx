import React, { createContext, ReactElement, ReactNode, useState } from 'react';
import { Snackbar, snackbarVariantType } from 'pelta-design-system';

export { AlertHandlerContext, AlertHandlerContextProvider };

type alertHandlerType = { displayAlert: ({ text, variant, autoHide }: alertType) => void };

type alertType = {
  variant: snackbarVariantType;
  text: string;
  autoHide: boolean;
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
        <Snackbar
          variant={alert.variant}
          text={alert.text}
          isOpen
          autoHide={alert.autoHide}
          onClose={() => setAlert(undefined)}
        />
      )}
      {props.children}
    </AlertHandlerContext.Provider>
  );
}
