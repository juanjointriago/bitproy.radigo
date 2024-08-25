import { View, Text, ViewStyle } from 'react-native';
import React, { useState } from 'react'
import StepIndicator from 'react-native-step-indicator'
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../theme/globalStyles'

interface Props {
  data: any
  num: any
  currentPosition: any
  style?: any
  statusTravelProgress?: any
}

const TimeLineTrips = ({
  data,
  num,
  currentPosition,
  style,
  statusTravelProgress,
}: Props) => {
  
  const customStyles = {
    stepStrokeCurrentColor: '#aaaaaa',
    stepIndicatorFinishedColor:PRIMARY_COLOR,
    separatorFinishedColor:PRIMARY_COLOR,
    stepStrokeFinishedColor:PRIMARY_COLOR,
    stepIndicatorLabelFinishedColor:PRIMARY_COLOR,
    separatorUnFinishedColor: '#aaaaaa',
    stepStrokeUnFinishedColor: '#aaaaaa',
    stepIndicatorLabelCurrentColor: 'white',
    stepIndicatorLabelUnFinishedColor: 'white',
    stepIndicatorUnFinishedColor: 'white',
    stepIndicatorCurrentColor: 'white',
    currentStepLabelColor: 'black',
    labelColor: 'black',
    labelSize: 15,
    stepIndicatorLabelFontSize: 10,
    currentStepIndicatorLabelFontSize: 20,
    currentStepStrokeWidth: 2,
    stepStrokeWidth: 2,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    stepIndicatorSize: 25,
  }
  return (
    <>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentPosition}
        labels={data}
        direction={'vertical'}
        stepCount={num}
        renderLabel={({
          position,
        }: any) => {
          return <Text style={style}>{data[position]} </Text>
        }}
      />
    </>
  )
}

export default TimeLineTrips
