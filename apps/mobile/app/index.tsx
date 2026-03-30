import { Link, router } from 'expo-router';
import { useEffect } from 'react';
import { Button, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '../src/store/auth-store';
import { useTaskStore } from '../src/store/task-store';

export default function HomeScreen() {
  const { token, logout, init } = useAuthStore();
  const { tasks, fetchTasks, updateTask, deleteTask, loading } = useTaskStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }

    fetchTasks();
  }, [token, fetchTasks]);

  if (!token) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/add-task">+ Add Task</Link>
        <Button title="Logout" onPress={logout} />
      </View>

      {loading ? <Text>Loading tasks...</Text> : null}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No tasks yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable onPress={() => updateTask(item.id, { completed: !item.completed })}>
              <Text style={item.completed ? styles.completed : undefined}>
                {item.completed ? '✅ ' : '⬜ '} {item.title}
              </Text>
            </Pressable>
            <Button title="Delete" onPress={() => deleteTask(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completed: { textDecorationLine: 'line-through', color: '#888' },
});
