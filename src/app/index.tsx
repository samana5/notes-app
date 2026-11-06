import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function Page() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const { data, error } = await supabase.from('notes').select('*');
    if (error) console.error(error);
    else setNotes(data || []);
  }

  async function addNote() {
    if (!title.trim()) return;
    const { error } = await supabase.from('notes').insert([{ title, content }]);
    if (error) {
      console.error(error);
    } else {
      setTitle('');
      setContent('');
      fetchNotes();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Moje Bilješke</Text>
      <TextInput
        style={styles.input}
        placeholder="Naslov bilješke"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Sadržaj bilješke"
        placeholderTextColor="#888"
        value={content}
        onChangeText={setContent}
      />
      <TouchableOpacity style={styles.button} onPress={addNote}>
        <Text style={styles.buttonText}>Dodaj bilješku</Text>
      </TouchableOpacity>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', marginTop: 30 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 5, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  noteItem: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: '#eee' },
  noteTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 }
});