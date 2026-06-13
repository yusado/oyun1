import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { GameButton } from '@/components/GameButton';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.errorCode}>404</Text>
        <Text style={styles.title}>Sayfa Bulunamadı</Text>
        <Text style={styles.message}>Bu sayfa mevcut değil.</Text>
        <View style={styles.buttonContainer}>
          <Link href="/" asChild>
            <GameButton title="Ana Menü" onPress={() => {}} />
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorCode: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  buttonContainer: {
    minWidth: 180,
  },
});
