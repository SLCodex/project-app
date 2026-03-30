import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../src/store/auth-store';

export default function RegisterScreen() {
  const { register, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onRegister = async () => {
    setError(null);

    try {
      await register(email.trim(), password);
      router.replace('/');
    } catch {
      setError('Registration failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        secureTextEntry
        placeholder="Password (min 6 chars)"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Creating account...' : 'Register'} onPress={onRegister} disabled={loading} />
      <Link href="/login" style={styles.link}>
        Already have an account? Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', gap: 12, padding: 16 },
  heading: { fontSize: 24, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  error: { color: 'red' },
  link: { marginTop: 8 },
});
