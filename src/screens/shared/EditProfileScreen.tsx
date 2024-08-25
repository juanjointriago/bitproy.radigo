import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { BackButton } from "../../components/buttons/BackButton";
import { ALERT, globalStyles } from "../../theme/globalStyles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import useBank from "../../service/hooks/useBank";
import { DataBankInterface } from "../../interfaces/BankInterface";
import useUser from "../../service/hooks/useUser";
import { useAlerts } from "../../service/hooks/useAlerts";

interface Props extends StackScreenProps<any, any> {}

const EditProfileScreen = ({ navigation }: Props) => {
  const { user, logOut } = useContext(AuthContext);
  const { getBankById } = useBank();
  const { deleteUser } = useUser();
  const { toast, confirmAlert } = useAlerts();
  const [dataPay, setDataPay] = useState<DataBankInterface>();

  useEffect(() => {
    getDataPay();
  }, []);

  const getDataPay = () => {
    getBankById().then((res) => {
      setDataPay(res.data);
    });
  };

  const deleteAccount = async () => {
    let alert = await confirmAlert("¿Deseas eliminar la cuenta?", "WARNING");
    if (alert) {
      deleteUser()
        .then((res) => {
          toast("Cuenta eliminada", "SUCCESS");
          logOut();
        })
        .catch((err) => {
          toast(err.response.data.msg, "DANGER");
        });
    }
  };

  return (
    <>
      <BackButton />
      <View style={{ flex: 1, marginHorizontal: 20 }}>
        <Text
          style={[
            globalStyles.Title6,
            { marginTop: 80, marginBottom: 10, left: 10 },
          ]}
        >
          Edición perfil
        </Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ProfileScreen");
          }}
          style={{
            width: "100%",
            backgroundColor: "#F1F4F5",
            borderRadius: 20,
            marginTop: 30,
            shadowColor: "#000",
            height: 130,
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.32,
            shadowRadius: 6.46,
            elevation: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={[globalStyles.Title6, { fontSize: 16 }]}>
            Datos Personales
          </Text>
        </TouchableOpacity>

        {user?.role_id === 3 && (
          <>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("IdentityUserScreen");
              }}
              style={{
                width: "100%",
                backgroundColor: "#F1F4F5",
                borderRadius: 20,
                marginTop: 30,
                shadowColor: "#000",
                height: 130,
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.32,
                shadowRadius: 6.46,
                elevation: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={[globalStyles.Title6, { fontSize: 16 }]}>
                Cédula y licencia
              </Text>
            </TouchableOpacity>

            {dataPay !== null && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AccountBankScreen", { data: dataPay });
                }}
                style={{
                  width: "100%",
                  backgroundColor: "#F1F4F5",
                  borderRadius: 20,
                  marginTop: 30,
                  shadowColor: "#000",
                  height: 130,
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.32,
                  shadowRadius: 6.46,
                  elevation: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={[globalStyles.Title6, { fontSize: 16 }]}>
                  Datos Bancarios
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <View
          style={{
            position: "absolute",
            bottom: 55,
            alignSelf: "center",
          }}
        >
          <TouchableOpacity onPress={deleteAccount}>
            <Text
              style={[
                globalStyles.Title6,
                {
                  fontSize: 16,
                  color: ALERT,
                },
              ]}
            >
              Eliminar cuenta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default EditProfileScreen;
