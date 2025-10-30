import React, { useRef, useEffect } from 'react';
import { Animated, Easing, StyleSheet, Image, View, ViewStyle, ImageStyle } from 'react-native';

// --- Variáveis de Estilo (reutilizadas de seu contexto) ---
export const colors = {
    sgray: '#555e67',
    sblue: '#004A8D',
    sorange: '#F7941D',
    sred: '#F31F00',
    sgreen: '#008000',
    syellow: '#fca510',
    tagColors: [
        '#007BFF', // Azul Elétrico
        '#32CD32', // Verde Limão
        '#FF8C00', // Laranja Vibrante
        '#FF1493', // Rosa Choque
        '#8A2BE2', // Roxo Escuro
        '#FFD700', // Amarelo Ouro
        '#00CED1', // Ciano
    ]
}
export const fontFamily = {
    regular: 'Roboto', 
    bold: "Roboto_700Bold",
    medium: "Roboto_500Medium",
    arial: 'Arial'
}
// ---------------------------------------------------------


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
    // Definindo o fundo do contêiner como cinza para criar contraste com o brilho
    backgroundColor: 'transparent', // Mantido transparente, mas pode ser ajustado se o contêiner precisar de cor de fundo
    position: 'relative', // Garantir que o Animated.View fique posicionado corretamente
  },
  shine: {
    ...StyleSheet.absoluteFillObject,
    // Mantendo o branco com opacidade para o efeito de brilho
    backgroundColor: 'rgba(255, 255, 255, 0.4)', 
    transform: [
      { rotate: '15deg' },
      { skewX: '-15deg' },
    ],
    // Definindo a largura do brilho (ajustado de 50 para 100 para ser mais visível)
    width: 100, 
  },
});

export default AnimacaoImagem;