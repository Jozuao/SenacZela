import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
// Importado Ionicons para uso no status, se necessário
import { Ionicons } from '@expo/vector-icons';

// --- Variáveis de Estilo (reutilizadas de seu contexto) ---
export const colors = {
    sgray: '#555e67',
    sblue: '#004A8D',
    sorange: '#F7941D',
    sred: '#F31F00',
    sgreen: '#008000',
    syellow: '#fca510',
    tagColors: [
        '#007BFF', 
        '#32CD32', 
        '#FF8C00', 
        '#FF1493', 
        '#8A2BE2', 
        '#FFD700', 
        '#00CED1', 
    ]
}
export const fontFamily = {
    regular: 'Roboto', 
    bold: "Roboto_700Bold",
    medium: "Roboto_500Medium",
    arial: 'Arial'
}
// ---------------------------------------------------------


interface Sala {
    nome_numero: string;
    capacidade: number;
    localizacao: string;
    status_limpeza: 'Limpa' | 'Em Limpeza' | 'limpeza Pendente' | string;
    ultima_limpeza_data_hora: string | null;
    ultima_limpeza_funcionario?: string;
    // Adicione outros campos necessários aqui
}

interface SalaCardProps {
  sala: Sala;
}

const SalaCard: React.FC<SalaCardProps> = ({ sala }) => {
    
    // Lógica de Cores para o Status de Limpeza (mantida do componente Sala)
    const getStatusStyles = (status: string | undefined) => {
        let statusTextColor;
        let statusBackgroundColor;

        switch(status) {
            case 'Limpa':
                statusTextColor = colors.sgreen;
                statusBackgroundColor = 'rgba(0, 128, 0, 0.1)'; 
                break;
            case 'Em Limpeza':
                statusTextColor = 'white';
                statusBackgroundColor = colors.sblue;
                break;
            default: // limpeza Pendente e outros
                statusTextColor = colors.sred;
                statusBackgroundColor = 'rgba(243, 31, 0, 0.1)'; 
                break;
        }
        return { color: statusTextColor, backgroundColor: statusBackgroundColor };
    }


  const displayLastCleanedTime = (utcDateTimeString: string | null): string => {
    if (!utcDateTimeString) {
      return "N/A";
    }

    try {
      const dateObjectUTC = parseISO(utcDateTimeString);

      return format(dateObjectUTC, "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR });

    } catch (error) {
      console.error("Erro ao processar data/hora:", error);
      return "Data Inválida";
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{sala.nome_numero}</Text>
        
        {/* Detalhes da Sala */}
      <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Capacidade:</Text> {sala.capacidade}
        </Text>
      <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Localização:</Text> {sala.localizacao}
        </Text>

        {/* Status de Limpeza */}
        <View style={styles.statusRow}>
          <Text style={styles.detailLabel}>Status:</Text> 
            <Text style={[styles.statusBadge, getStatusStyles(sala.status_limpeza)]}>
                {sala.status_limpeza}
            </Text>
        </View>
        
        {/* Detalhes da Última Limpeza */}
      <Text style={styles.detailText}>
        <Text style={styles.detailLabel}>Última Limpeza:</Text> {displayLastCleanedTime(sala.ultima_limpeza_data_hora)}
      </Text>
      {sala.ultima_limpeza_funcionario && (
        <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Por:</Text> {sala.ultima_limpeza_funcionario}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20, // Aumentado o padding
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    // Estilo de sombra usando a cor tema
    shadowColor: colors.sgray, 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontFamily: fontFamily.bold, // Aplicado a fonte bold
    color: colors.sblue, // Aplicado a cor primária
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  detailText: {
    fontSize: 16,
    fontFamily: fontFamily.regular, // Fonte regular para o valor
    color: colors.sgray,
    marginBottom: 5,
  },
  detailLabel: {
    fontFamily: fontFamily.medium, // Fonte medium para o label
    color: colors.sgray, // Cor mais escura para o label
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal : 10,
    paddingVertical : 5, 
    marginLeft : 8, 
    borderRadius : 5,
    fontFamily: fontFamily.medium,
    fontSize: 15,
    overflow: 'hidden',
  }
});

export default SalaCard;