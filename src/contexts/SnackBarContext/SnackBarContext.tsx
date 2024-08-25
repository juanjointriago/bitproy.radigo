import { createContext, useState } from "react";

type SnackBarContexProps = {
  snackBar: Snack;
  onToggleSnackBar: (tex: string) => void;
  onToggleSnackBarInfo: (
    text: string,
    showOnTop?: boolean,
    showOnBottom?: boolean,
    duration?: number
  ) => void;
  onToggleSnackBarWarning: (
    text: string,
    showOnTop?: boolean,
    showOnBottom?: boolean,
    duration?: number
  ) => void;
  onToggleSnackBarSuccess: (
    text: string,
    showOnTop?: boolean,
    showOnBottom?: boolean,
    duration?: number
  ) => void;
  onToggleSnackBarError: (
    text: string,
    showOnTop?: boolean,
    showOnBottom?: boolean,
    duration?: number
  ) => void;
  onDismissSnackBar: () => void;
};

interface Snack {
  visible: boolean;
  text: string;
  info: boolean;
  warning: boolean;
  success: boolean;
  error: boolean;
  showOnTop: boolean | undefined;
  showOnBottom: boolean | undefined;
  duration?: number;
}

const initSnack: Snack = {
  visible: false,
  text: "",
  info: false,
  warning: false,
  success: false,
  error: false,
  showOnBottom: false,
  showOnTop: false,
  duration: 3000,
};

export const SnackBarContext = createContext({} as SnackBarContexProps);

export const SnackBarProvider = ({ children }: any) => {
  const [snackBar, setSnackBar] = useState<Snack>(initSnack);

  const onToggleSnackBar = (text: string) =>
    setSnackBar({
      ...snackBar,
      visible: !snackBar.visible,
      text,
      showOnBottom: true,
      showOnTop: false,
    });

  const onToggleSnackBarInfo = (
    text: string,
    showOnTop?: boolean,
    showOnBottom?: boolean,
    duration?: number
  ): void => {
    setSnackBar({
      ...snackBar,
      visible: !snackBar.visible,
      text,
      info: !snackBar.info,
      showOnBottom,
      showOnTop,
      duration,
    });
  };

  const onToggleSnackBarWarning = (
    text: string,
    showOnTop?: boolean,
    showOnBottom?: boolean,
    duration?: number
  ) => {
    setSnackBar({
      ...snackBar,
      visible: !snackBar.visible,
      text,
      warning: !snackBar.warning,
      showOnBottom,
      showOnTop,
      duration,
    });
  };

  const onToggleSnackBarSuccess = (
    text: string,
    showOnTop?: boolean,
    showOnBottom?: boolean,
    duration?: number
  ) => {
    setSnackBar({
      ...snackBar,
      visible: !snackBar.visible,
      text,
      success: !snackBar.success,
      showOnBottom,
      showOnTop,
      duration,
    });
  };

  const onToggleSnackBarError = (
    text: string,
    showOnTop?: boolean,
    showOnBottom?: boolean,
    duration?: number
  ) => {
    setSnackBar({
      ...snackBar,
      visible: !snackBar.visible,
      text,
      error: !snackBar.error,
      showOnBottom,
      showOnTop,
      duration,
    });
  };

  const onDismissSnackBar = () => setSnackBar(initSnack);

  return (
    <SnackBarContext.Provider
      value={{
        snackBar,
        onToggleSnackBar,
        onDismissSnackBar,
        onToggleSnackBarInfo,
        onToggleSnackBarSuccess,
        onToggleSnackBarWarning,
        onToggleSnackBarError,
      }}
    >
      {children}
    </SnackBarContext.Provider>
  );
};
