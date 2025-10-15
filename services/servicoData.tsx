// Exemplo de como consumir e exibir 'ultima_limpeza_data_hora' no React Native

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
interface SalaCardProps {
  sala: Sala;
}

const SalaCard: React.FC<SalaCardProps> = ({ sala }) => {
  const displayLastCleanedTime = (utcDateTimeString: string | null): string => {
    if (!utcDateTimeString) {
      return "N/A";
    }

    try {
      // 1. Parsing: Converte a string ISO 8601 (UTC) para um objeto Date
      // `parseISO` de date-fns é ótimo para isso, pois entende o formato 'Z'.
      const dateObjectUTC = parseISO(utcDateTimeString);

      // 2. Conversão de Fuso Horário e 3. Formatação:
      // `format` de date-fns, por padrão, formata para o fuso horário local do dispositivo
      // onde o código está sendo executado.
      return format(dateObjectUTC, "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR });

    } catch (error) {
      console.error("Erro ao processar data/hora:", error);
      return "Data Inválida";
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{sala.nome_numero}</Text>
      <Text>Capacidade: {sala.capacidade}</Text>
      <Text>Localização: {sala.localizacao}</Text>
      <Text>Status: {sala.status_limpeza}</Text>
      <Text>
        Última Limpeza: {displayLastCleanedTime(sala.ultima_limpeza_data_hora)}
      </Text>
      {sala.ultima_limpeza_funcionario && (
        <Text>Por: {sala.ultima_limpeza_funcionario}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default SalaCard;