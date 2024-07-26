import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react';

import PopupMessageModal from './PopupMessageModal';

type PopupParameters = {
  onDismissed: (userAction: 'Ok' | 'Cancel' | 'Dismiss') => void;
  title: string;
  content: string;
  ok?: string;
  cancel?: string;
};

type ContextType = {
  isVisible: boolean;
  popupParameters: PopupParameters;
  setIsVisible: (isVisible: boolean) => void;
  setPopupParameters: (popupParameters: PopupParameters) => void;
};

const initialState: ContextType = {
  isVisible: false,
  popupParameters: { onDismissed: () => {}, title: '', content: '' },
  setIsVisible: () => {},
  setPopupParameters: () => {},
};

const PopupMessageModalContext = createContext<ContextType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const PopupMessageModalContextProvider: React.FC<PropsType> = props => {
  const [isVisible, setIsVisible] = useState(false);
  const [popupParameters, setPopupParameters] = useState<PopupParameters>(
    initialState.popupParameters,
  );

  return (
    <PopupMessageModalContext.Provider
      value={{ isVisible, popupParameters, setIsVisible, setPopupParameters }}>
      {props.children}
      <PopupMessageModal
        isVisible={isVisible}
        onDismissed={popupResult => {
          popupParameters.onDismissed(popupResult);
          setIsVisible(false);
        }}
        title={popupParameters.title}
        content={popupParameters.content}
        ok={popupParameters.ok}
        cancel={popupParameters.cancel}
      />
    </PopupMessageModalContext.Provider>
  );
};

export function usePopupMessageModal() {
  const context = useContext(PopupMessageModalContext);

  if (!context) {
    throw new Error('PopupMessageModalContext not defined');
  }

  const { setPopupParameters, setIsVisible } = context;

  const displayPopup = useCallback(
    (popupParameters: PopupParameters) => {
      setPopupParameters(popupParameters);
      setIsVisible(true);
    },
    [setIsVisible, setPopupParameters],
  );

  return { displayPopup };
}
