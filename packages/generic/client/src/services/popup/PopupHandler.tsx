import React, { createContext, ReactElement, ReactNode, useState } from 'react';
import { ConfirmationPopup } from 'pelta-design-system';

export { PopupHandlerContext, PopupHandlerContextProvider };

type popupHandlerType = { displayPopup: ({ text }: popupType) => void };

type popupType = {
  text: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const PopupHandlerContext = createContext<popupHandlerType>({
  displayPopup: () => null,
});

function PopupHandlerContextProvider(props: { children: ReactNode }): ReactElement {
  const [popup, setPopup] = useState<popupType | undefined>(undefined);
  const popupHandler = {
    displayPopup: setPopup,
  };

  return (
    <PopupHandlerContext.Provider value={popupHandler}>
      {!!popup && (
        <ConfirmationPopup
          text={popup.text}
          onCancel={() => {
            popup.onCancel();
            setPopup(undefined);
          }}
          onConfirm={() => {
            popup.onConfirm();
            setPopup(undefined);
          }}
        />
      )}
      {props.children}
    </PopupHandlerContext.Provider>
  );
}
