import {
  ALERT_TYPE,
  Dialog,
  Toast,
} from "react-native-alert-notification";

export const useAlerts = () => {
  const showAlert = (
    description: string,
    type: "SUCCESS" | "DANGER" | "WARNING"
  ) => {
    switch (type) {
      case "SUCCESS":
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "RadiGo",
          textBody: description,
          button: "Cerrar",
        });
        break;
      case "DANGER":
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "RadiGo",
          textBody: description,
          button: "Cerrar",
        });
        break;
      case "WARNING":
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "RadiGo",
          textBody: description,
          button: "Cerrar",
        });
        break;
    }
  };

  const confirmAlert = (
    description: string,
    type: "SUCCESS" | "DANGER" | "WARNING"
  ) => {
    let typeAlert: ALERT_TYPE;
    switch (type) {
      case "SUCCESS":
        typeAlert = ALERT_TYPE.SUCCESS;

        break;
      case "DANGER":
        typeAlert = ALERT_TYPE.DANGER;

        break;
      case "WARNING":
        typeAlert = ALERT_TYPE.WARNING;
        break;
    }
    return new Promise((resolve) => {
      Dialog.show({
        type: typeAlert,
        title: "RadiGo",
        textBody: description,
        button: "Aceptar",
        onPressButton() {
          resolve(true);
          Dialog.hide();
        },
      });
    });
  };
  const toast = (
    description: string,
    type: "SUCCESS" | "DANGER" | "WARNING"
  ) => {
    switch (type) {
      case "SUCCESS":
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "RadiGo",
          textBody: description,
        });
        break;
      case "DANGER":
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "RadiGo",
          textBody: description,

        });
        break;
      case "WARNING":
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "RadiGo",
          textBody: description,

        });
        break;
    }
  };

  return {
    showAlert,
    confirmAlert,
    toast,
  };
};
