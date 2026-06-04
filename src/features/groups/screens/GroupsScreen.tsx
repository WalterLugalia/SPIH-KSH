import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Modal, ActivityIndicator,
} from 'react-native';
import { Colors } from '../../../shared/constants/colors';
import { useGroupsStore } from '../store/groupsStore';

export default function GroupsScreen() {
  const { groups, isLoading, loadGroups, addGroup } = useGroupsStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => { loadGroups(); }, []);

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    await addGroup(groupName.trim());
    setGroupName('');
    setModalVisible(false);
  };

  if (isLoading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Groups</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {groups.map((group) => (
          <View key={group.id} style={styles.card}>
            <View style={styles.cardIcon}>
              <Text style={{ fontSize: 24 }}>🏠</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{group.name}</Text>
              <Text style={styles.cardMembers}>{group.members.length} members</Text>
            </View>
            <Text style={styles.cardAmount}>KES {group.total.toLocaleString()}</Text>
          </View>
        ))}
      </ScrollView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Create Group</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Kilimani Apartment"
              placeholderTextColor={Colors.textMuted}
              value={groupName}
              onChangeText={setGroupName}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreate}>
              <Text style={styles.buttonText}>Create Group</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  addBtn: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: Colors.white, fontWeight: '600' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, marginHorizontal: 24, marginBottom: 12, padding: 16, borderRadius: 12 },
  cardIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '600', color: Colors.text },
  cardMembers: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  cardAmount: { fontSize: 15, fontWeight: '600', color: Colors.primary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 16 },
  input: { backgroundColor: Colors.background, borderRadius: 12, padding: 16, fontSize: 16, color: Colors.text, marginBottom: 16 },
  button: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  cancel: { color: Colors.textMuted, textAlign: 'center', fontSize: 15 },
});