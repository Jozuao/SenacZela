import { View, Image, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, ImageStyle } from "react-native"
import AnimacaoImagem from "../services/servicoAnimacao";

const logo = require("../img/senac.jpg")

interface styles {
    viewload : ViewStyle;
    text : TextStyle;
    activityIndicator : ViewStyle;
    imagem : ImageStyle
}

const styles = StyleSheet.create<styles>({
  viewload: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    color: '#004A8D',
    marginTop: 20,
    fontSize: 18,
  },
  activityIndicator: {
    marginTop: 20,
  },
  imagem: {
    width: 150,
    height: 150,
  }
});

export default function Load () {
    return(
        <View style={styles.viewload}>
            <AnimacaoImagem
            source={logo}
            imageStyle={styles.imagem}/>
            <Text>Carregando... aguarde</Text>
        </View>
    )
}