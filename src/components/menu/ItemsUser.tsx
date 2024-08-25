import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle, StyleProp } from 'react-native';
import { globalStyles } from '../../theme/globalStyles';
interface Props {
    title: string | undefined;
    styleView?: StyleProp<ViewStyle>;
    onPress?: () => void
  }
  
export const ItemsUser = ({ title , styleView,onPress}: Props) => {
    return (
        <View style={{...styleView as any ,...styles.content}}>
            <TouchableOpacity
            onPress={onPress}
            >
                <Text style={styles.text}>{title} </Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    content: {
        // borderWidth:1,
        // borderBottomWidth: 2, 
        marginHorizontal: 15,
        width:"90%",
    },
    text:{
       ...globalStyles.Text4,
        marginVertical: 15,
        marginHorizontal:20
    }
});
