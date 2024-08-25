import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface Props{
    calification: (rating: number) => void;
}

const StarsCalifications = ({calification}:Props) => {
  const [rating, setRating] = useState(5);

  const handleRating = (value:any) => {
    if (value === rating) {
      setRating(1);
      calification(1);
    } else {
      setRating(value);
      calification(value);
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => handleRating(1)}>
        <AntDesign name="star" size={50} color={rating >= 1 ? '#F3B304' : '#F1F1F1'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleRating(2)}>
        <AntDesign name="star" size={50} color={rating >= 2 ? '#F3B304' : '#F1F1F1'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleRating(3)}>
        <AntDesign name="star" size={50} color={rating >= 3 ? '#F3B304' : '#F1F1F1'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleRating(4)}>
        <AntDesign name="star" size={50} color={rating >= 4 ? '#F3B304' : '#F1F1F1'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleRating(5)}>
        <AntDesign name="star" size={50} color={rating >= 5 ? '#F3B304' : '#F1F1F1'} />
      </TouchableOpacity>
    </View>
  );
};

export default StarsCalifications;