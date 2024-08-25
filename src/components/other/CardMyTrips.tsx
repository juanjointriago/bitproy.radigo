import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import TimeLineTrips from "./TimeLineTrips";
import { PRIMARY_COLOR } from "../../theme/globalStyles";
import moment from "moment";

interface Props {
  dataDirections: any;
  nameUser: any;
  date: string;
  stars: any;
  price: any;
  style?: any;
  showStar?: boolean;
  styleCard?: any;
}

const CardMyTrips = ({
  dataDirections,
  nameUser,
  date,
  stars,
  price,
  style,
  showStar = true,
  styleCard
}: Props) => {
  let trLocale = require('moment/locale/es');
  moment.updateLocale('es', trLocale)
  return (
    <View
      style={{
        width: "90%",
        backgroundColor: "#F1F4F5",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 20,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.32,
        shadowRadius: 6.46,
        elevation: 20,
        ...styleCard as any
      }}
    >
      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={{ width: "70%", justifyContent: "center" }}>
          <Text style={{ width: 215, fontSize: 18, fontWeight: "700" }}>
            {nameUser}
          </Text>
          <Text style={{ top: 10, width: 215, fontSize: 13, color: "#666666" }}>
            {moment(date).format('LL')}
          </Text>
        </View>
        {showStar && (
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "flex-start",
              flexDirection: "row",
            }}
          >
            <FontAwesome name="star" size={24} color="#F3B304" />
            <Text style={{ fontSize: 18, marginHorizontal: 5 }}>{stars}</Text>
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          top: 10,
        }}
      >
        <TimeLineTrips
          style={{
            width: 200,
            paddingVertical: 13,
            left: 10,
            paddingRight: 20,
          }}
          currentPosition={1}
          num={2}
          data={dataDirections}
        ></TimeLineTrips>

        <View
          style={{
            left: 10,
            width: 120,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{ fontSize: 18, textAlign: "center", fontWeight: "600" }}
          >
            ${price}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CardMyTrips;
