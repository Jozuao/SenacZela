import React, { useRef, useEffect } from 'react';
import { Animated, Easing, StyleSheet, Image, View, ViewStyle, ImageStyle } from 'react-native';


interface AnimatedShineImageProps {
  source: any; 
  imageStyle?: ImageStyle; 
}

const AnimacaoImagem: React.FC<AnimatedShineImageProps> = ({
  source,
  imageStyle,
}) => {
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 2500, 
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ).start();
  }, [shineAnim]);

  const translateX = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300], 
  });

  return (
    <View style={[styles.container, imageStyle, {overflow : 'hidden'}]}>
      <Image source={source} style={[imageStyle, {resizeMode : 'contain'}]} />
      <Animated.View
        style={[
          styles.shine,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  shine: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [
      { rotate: '15deg' },
      { skewX: '-15deg' },
    ],
  },
});

export default AnimacaoImagem;