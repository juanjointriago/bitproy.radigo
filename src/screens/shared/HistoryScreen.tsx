import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { BackButton } from "../../components/buttons/BackButton";
import { globalStyles } from "../../theme/globalStyles";
import CardMyTrips from "../../components/other/CardMyTrips";
import useTravel from "../../service/hooks/useTravel";
import { SafeAreaView } from "react-native-safe-area-context";
import { Travel } from "../../interfaces/ITravel";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import EmptyList from "../../components/other/EmptyList";

const HistoryScreen = () => {
  const limit = 5;

  const { user } = useContext(AuthContext);
  const { getTravelsByUserLogged } = useTravel();

  const [loading, setLoading] = useState(false);
  const [travels, setTravels] = useState<Travel[]>([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getTravels();
    setPage(limit);
  }, []);

  const getTravels = () => {
    setLoading(true);
    getTravelsByUserLogged({
      idStatus: 3,
      offset: page,
      limit: limit,
    })
      .then((res) => {
        setCount(res.data.count);
        setTravels((prevItems) => [...prevItems, ...res.data.travels]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading;
      });
  };

  const renderItem = ({ item }: any) => (
    <View style={{ width: "100%", alignItems: "center" }}>
      <CardMyTrips
        dataDirections={[item.address_user, item.address_end]}
        stars={user?.role_id === 4 ? item?.driver?.stars : item?.client?.stars}
        nameUser={
          user?.role_id === 4
            ? item?.driver?.full_name
            : item?.client?.full_name
        }
        date={item.created_at}
        price={item.price}
        styleCard={{   shadowColor: "transparent", }}
      />
    </View>
  );

  const handleLoadMoreTravels = () => {
    setPage((prevPage) => prevPage + limit);
    getTravels();
  };
  const renderFooter = () => {
    return (
      <>
        {count > limit && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleLoadMoreTravels}
            style={{ marginVertical: 30 }}
          >
            {loading ? (
              <ActivityIndicator color={"red"} size={30} />
            ) : (
              <Text
                style={{ fontSize: 15, alignSelf: "center", fontWeight: "800" }}
              >
                Mostrar más
              </Text>
            )}
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <>
      <View style={{ height: 60 }}>
        <BackButton />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[globalStyles.Title6, { marginBottom: 10, left: 22 }]}>
          Mis Viajess
        </Text>

        <FlatList
          data={travels}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id.toString()}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={() => (
            <View style={{ height: 500 }}>
              <EmptyList description="Cuando generes uno, lo encontrarás aquí." />
            </View>
          )}
        />
      </View>
    </>
  );
};

export default HistoryScreen;
