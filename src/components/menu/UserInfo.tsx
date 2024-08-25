import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { BACKGROUND, SECONDARY_COLOR, globalStyles } from "../../theme/globalStyles";
import { useNavigation } from '@react-navigation/native';
interface Props {
  name: string | undefined;
  email?: string | undefined;
  img?: any;
}

export const UserInfo = ({ name, email, img }: Props) => {
  const navigation = useNavigation()

  return (
    <View style={styles.content}>
      <TouchableOpacity style={{ alignItems:'flex-end',width:80}} onPress={() => navigation.navigate("EditProfileScreen" as never)} >
        <Image
          source={{
            uri:
              img !== undefined
                ? img
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
          }}
          style={styles.imagenUser}
        />
      </TouchableOpacity>
      <View style={{ flex:1,paddingLeft:10 }}>
        <Text style={[styles.textName,{fontSize:20}]}> {name} </Text>
        <Text style={[styles.textTypeUser,{width:180}]}> {email} </Text>
      </View> 
    </View>

  );
};
const styles = StyleSheet.create({
  content: {
    // position:"absolute",
    width:'100%',
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#1F1F1F',
    height: 180,
    borderTopLeftRadius: 20,
  },
  textName: {
    ...globalStyles.Title4,
    // width:'90%',
  },
  textTypeUser: {
    ...globalStyles.Title5,
  },
  imagenUser: {
    width: 70,
    height: 70,
    borderRadius: 200,
    backgroundColor: BACKGROUND,
  },
});
