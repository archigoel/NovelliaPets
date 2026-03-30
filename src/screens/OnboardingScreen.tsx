import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuthStore } from '../store/useAuthStore';


export const OnboardingScreen = () => {

  const [name, setName] = useState('');
  const { setUserName } = useAuthStore();

  const handleContinue = async () => {
    if (name.trim().length < 2) return;


    try {
      setUserName(name);
    } catch (e) {
      console.error('Failed to save name', e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Welcome to Novellia Pets 🐾</Text>
        <Text style={styles.subtitle}>Manage your furry friend's medical records in one place.</Text>

        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
          autoFocus
          returnKeyType="done"
        />

        <TouchableOpacity
          style={[styles.button, name.length < 2 && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={name.length < 2}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 32 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#6366f1', // Novellia-style Indigo
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#a5a6f6' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
