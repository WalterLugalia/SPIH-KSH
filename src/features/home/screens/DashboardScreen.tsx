import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuthStore } from '../../auth/store/authStore';
import { Colors } from '../../../shared/constants/colors';

export default function DashboardScreen() {
  const { user, logout } = useAuthStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey, {user?.name} 👋</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>You are owed</Text>
        <Text style={styles.balanceAmount}>KES 3,200</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.summaryCard, { backgroundColor: '#FEF3C7' }]}>
          <Text style={styles.summaryLabel}>You owe</Text>
          <Text style={[styles.summaryAmount, { color: Colors.warning }]}>KES 800</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#D1FAE5' }]}>
          <Text style={styles.summaryLabel}>Settled</Text>
          <Text style={[styles.summaryAmount, { color: Colors.success }]}>KES 5,000</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {['Rent - Kilimani Apt', 'KPLC Bill', 'WiFi - Safaricom'].map((item, i) => (
        <View key={i} style={styles.activityItem}>
          <Text style={styles.activityName}>{item}</Text>
          <Text style={styles.activityAmount}>KES {(i + 1) * 500}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  logout: { color: Colors.error, fontSize: 14 },
  balanceCard: { margin: 24, backgroundColor: Colors.primary, borderRadius: 16, padding: 24 },
  balanceLabel: { color: Colors.white, fontSize: 14, opacity: 0.85 },
  balanceAmount: { color: Colors.white, fontSize: 36, fontWeight: 'bold', marginTop: 4 },
  row: { flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 24 },
  summaryCard: { flex: 1, borderRadius: 12, padding: 16 },
  summaryLabel: { fontSize: 13, color: Colors.textMuted },
  summaryAmount: { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.text, paddingHorizontal: 24, marginBottom: 12 },
  activityItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.surface, marginHorizontal: 24, marginBottom: 8, padding: 16, borderRadius: 12 },
  activityName: { fontSize: 15, color: Colors.text },
  activityAmount: { fontSize: 15, fontWeight: '600', color: Colors.primary },
});