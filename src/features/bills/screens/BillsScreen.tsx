import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Modal, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../shared/constants/colors';
import { useBillsStore } from '../store/billsStore';

const billTypes = ['🏠 Rent', '⚡ KPLC', '💧 Water', '📶 WiFi', '🛒 Groceries'];

export default function BillsScreen() {
  const navigation = useNavigation<any>();
  const { bills, isLoading, loadBills, addBill } = useBillsStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => { loadBills(); }, []);

  const handleAddBill = async () => {
    if (!selectedType || !amount) return;
    await addBill({
      name: selectedType,
      amount: parseInt(amount),
      due: 'Jul 1',
      status: 'pending',
    });
    setSelectedType('');
    setAmount('');
    setModalVisible(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bills</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {bills.map((bill) => (
          <TouchableOpacity
            key={bill.id}
            style={styles.card}
            onPress={() => bill.status === 'pending' && navigation.navigate('Pay', {
              billId: bill.id,
              billName: bill.name,
              amount: bill.amount,
              recipient: bill.groupName ?? 'SplitKash Group',
            })}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.billName}>{bill.name}</Text>
              <Text style={styles.billDue}>Due: {bill.due}</Text>
              {bill.groupName && (
                <Text style={styles.billGroup}>{bill.groupName}</Text>
              )}
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.billAmount}>KES {bill.amount.toLocaleString()}</Text>
              <View style={[styles.badge, bill.status === 'paid' ? styles.badgePaid : styles.badgePending]}>
                <Text style={[styles.badgeText, bill.status === 'paid' ? styles.badgePaidText : styles.badgePendingText]}>
                  {bill.status === 'paid' ? '✓ Paid' : 'Tap to Pay'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Bill</Text>
            <Text style={styles.label}>Bill Type</Text>
            <View style={styles.typeRow}>
              {billTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeBtn, selectedType === type && styles.typeBtnActive]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[styles.typeBtnText, selectedType === type && styles.typeBtnTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Amount (KES)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 12000"
              placeholderTextColor={Colors.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={handleAddBill}>
              <Text style={styles.buttonText}>Add Bill</Text>
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
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surface, marginHorizontal: 24, marginBottom: 12, padding: 16, borderRadius: 12 },
  cardLeft: { flex: 1 },
  cardRight: { alignItems: 'flex-end' },
  billName: { fontSize: 16, fontWeight: '600', color: Colors.text },
  billDue: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  billGroup: { fontSize: 12, color: Colors.primary, marginTop: 2 },
  billAmount: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgePaid: { backgroundColor: '#D1FAE5' },
  badgePending: { backgroundColor: '#E0F2FE' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  badgePaidText: { color: Colors.success },
  badgePendingText: { color: '#0369A1' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 16 },
  label: { fontSize: 14, color: Colors.textMuted, marginBottom: 8 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border },
  typeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeBtnText: { fontSize: 13, color: Colors.textMuted },
  typeBtnTextActive: { color: Colors.white },
  input: { backgroundColor: Colors.background, borderRadius: 12, padding: 16, fontSize: 16, color: Colors.text, marginBottom: 16 },
  button: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  cancel: { color: Colors.textMuted, textAlign: 'center', fontSize: 15 },
});