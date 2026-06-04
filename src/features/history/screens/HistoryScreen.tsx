import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '../../../shared/constants/colors';
import { useHistoryStore } from '../store/HistoryStore';

export default function HistoryScreen() {
  const { items, loadHistory } = useHistoryStore();

  useEffect(() => { loadHistory(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>{items.length} transactions</Text>
      </View>
      <ScrollView>
        {items.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>{item.person} · {item.date}</Text>
              <Text style={styles.txId}>{item.transactionId}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.itemAmount}>KES {item.amount.toLocaleString()}</Text>
              <View style={[styles.badge, item.status === 'settled' ? styles.badgeSettled : styles.badgePending]}>
                <Text style={[styles.badgeText, item.status === 'settled' ? styles.badgeSettledText : styles.badgePendingText]}>
                  {item.status === 'settled' ? '✓ Settled' : '⏳ Pending'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surface, marginHorizontal: 24, marginBottom: 12, padding: 16, borderRadius: 12 },
  cardLeft: { flex: 1 },
  cardRight: { alignItems: 'flex-end' },
  itemName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  itemMeta: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  txId: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  itemAmount: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeSettled: { backgroundColor: '#D1FAE5' },
  badgePending: { backgroundColor: '#FEF3C7' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  badgeSettledText: { color: Colors.success },
  badgePendingText: { color: Colors.warning },
});