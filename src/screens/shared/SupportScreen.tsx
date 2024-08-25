import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { BackButton } from "../../components/buttons/BackButton";
import { globalStyles } from "../../theme/globalStyles";
import { InputText } from "../../components/input/InputText";
import { useSupport } from "../../service/hooks/useSupport";
import { Info } from "../../interfaces/SupportInterfaces";

export const SupportScreen = () => {
  const { getSupportInfo } = useSupport();

  const [info, setInfo] = useState<Info>();

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = () => {
    getSupportInfo()
      .then((resp) => {
        setInfo(resp.data.info);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <View style={{ height: 60 }}>
        <BackButton />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[globalStyles.Title6, { marginBottom: 10, left: 22 }]}>
          Soporte
        </Text>
        <ScrollView style={{ marginBottom: 50 }}>
          <View style={{ flex: 1, marginHorizontal: 25 }}>
            <Text style={[globalStyles.Text, { marginVertical: 10 }]}>
              Teléfono:
            </Text>
            <InputText
              styleTextInput={{ right: 40 }}
              text="Teléfono"
              name="telefono"
              keyboardType={"default"}
              value={info?.phone_primary}
              maxLength={15}
              editable={false}
            />
            <Text style={[globalStyles.Text, { marginVertical: 10 }]}>
              Teléfono Secundario:
            </Text>

            <InputText
              styleTextInput={{ right: 40 }}
              text="Teléfono Secundario:"
              name="telefonosecundario"
              keyboardType={"default"}
              value={info?.phone_secondary}
              maxLength={15}
              editable={false}
            />
            <Text style={[globalStyles.Text, { marginVertical: 10 }]}>
              E-mail:
            </Text>

            <InputText
              styleTextInput={{ right: 40 }}
              text="E-mail:"
              name="email"
              keyboardType={"default"}
              value={info?.email}
              maxLength={15}
              editable={false}
            />
            <Text style={[globalStyles.Text, { marginVertical: 10 }]}>
              Dirección:
            </Text>

            <InputText
              styleTextInput={{ right: 40 }}
              text="Dirección:"
              name="direccion"
              keyboardType={"default"}
              value={info?.direction}
              maxLength={15}
              editable={false}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
};
