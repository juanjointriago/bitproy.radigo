import React, { useEffect, useState } from "react";
import { ScrollView, Text, useWindowDimensions } from "react-native";
import { View } from "react-native";
import { BackButton } from "../../components/buttons/BackButton";
import { globalStyles } from "../../theme/globalStyles";
import { useTerms } from "../../service/hooks/useTerms";
import HTML from "react-native-render-html";


export const TermsScreen = () => {
  const { getTerms } = useTerms();
  const { width } = useWindowDimensions();

  const [terms, setTerms] = useState("");

  useEffect(() => {
    getTermsApp();
  }, []);

  const getTermsApp = () => {
    getTerms().then((response) => {
      setTerms(response.data.terms);
    });
  };

  return (
    <>
      <View style={{ height: 60 }}>
        <BackButton />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[globalStyles.Title6, { marginBottom: 10, left: 22 }]}>
          Términos y Condiciones
        </Text>
        <ScrollView style={{ marginBottom: 50,  }}>
          <View style={{ marginHorizontal: 20}}>
            <HTML
              source={{ html: terms}}
              contentWidth={width}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
};
