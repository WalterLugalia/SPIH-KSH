import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../../../shared/constants/colors';
import { useBillsStore } from '../store/billsStore';
import { useHistoryStore } from '../../history/store/HistoryStore';

type PaymentStep = 'confirm' | 'processing' | 'success' | 'failed';

export default function PayScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { markAsPaid } = useBillsStore();
  const { addItem } = useHistoryStore();

  const {
    billId,
    billName = '🏠 Rent',
    amount = 4000,
    recipient = 'SplitKash Group',
  } = route.params ?? {};

  const [step, setStep] = useState<PaymentStep>('confirm');
  const [showReceipt, setShowReceipt] = useState(false);
  const transactionId = 'QHJ' + Math.floor(Math.random() * 900000 + 100000);
  const date = new Date().toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const handlePay = async () => {
    setStep('processing');
    await new Promise((res) => setTimeout(res, 2500));
    if (billId) await markAsPaid(billId);
    await addItem({ name: billName, person: 'You', amount, status: 'settled' });
    setStep('success');
  };

  const handleFail = async () => {
    setStep('processing');
    await new Promise((res) => setTimeout(res, 2500));
    setStep('failed');
  };

  if (step === 'processing') {
    return (
      <View style={styles.centerScreen}>
        <View style={styles.processingCard}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.processingTitle}>Processing Payment</Text>
          <Text style={styles.processingSubtitle}>Please wait while we confirm{'\n'}your M-Pesa payment...</Text>
          <View style={styles.processingDetails}>
            <Text style={styles.processingAmount}>KES {amount.toLocaleString()}</Text>
            <Text style={styles.processingName}>{billName}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (step === 'success') {
    return (
      <View style={styles.centerScreen}>
        <View style={styles.resultCard}>
          <View style={styles.successIcon}>
            <Text style={{ fontSize: 48 }}>✅</Text>
          </View>
          <Text style={styles.resultTitle}>Payment Successful!</Text>
          <Text style={styles.resultSubtitle}>Your payment has been confirmed</Text>
          <View style={styles.receiptBox}>
            <Row label="Amount" value={`KES ${amount.toLocaleString()}`} bold />
            <Row label="To" value={recipient} />
            <Row label="For" value={billName} />
            <Row label="Transaction ID" value={transactionId} />
            <Row label="Date" value={date} />
            <Row label="Method" value="M-Pesa" />
            <Row label="Status" value="✓ Confirmed" green />
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setShowReceipt(true)}>
            <Text style={styles.primaryButtonText}>Share Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Back to Bills</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={showReceipt} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Receipt Shared! 🎉</Text>
              <Text style={styles.modalBody}>
                Transaction {transactionId} receipt has been shared with your group members.
              </Text>
              <TouchableOpacity style={styles.primaryButton} onPress={() => { setShowReceipt(false); navigation.goBack(); }}>
                <Text style={styles.primaryButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  if (step === 'failed') {
    return (
      <View style={styles.centerScreen}>
        <View style={styles.resultCard}>
          <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>❌</Text>
          <Text style={styles.resultTitle}>Payment Failed</Text>
          <Text style={styles.resultSubtitle}>Your M-Pesa payment could not be processed.</Text>
          <View style={[styles.receiptBox, { backgroundColor: '#FEF2F2' }]}>
            <Row label="Amount" value={`KES ${amount.toLocaleString()}`} bold />
            <Row label="Reason" value="Insufficient funds" red />
            <Row label="Transaction ID" value={transactionId} />
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('confirm')}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Back to Bills</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pay Bill</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.mpesaBanner}>
        <Text style={styles.mpesaLogo}>M-PESA</Text>
        <Text style={styles.mpesaTagline}>Lipa Na M-Pesa</Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>You are paying</Text>
        <Text style={styles.summaryAmount}>KES {amount.toLocaleString()}</Text>
        <Text style={styles.summaryTo}>to {recipient}</Text>
      </View>
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Payment Details</Text>
        <Row label="Bill" value={billName} />
        <Row label="Your share" value={`KES ${amount.toLocaleString()}`} bold />
        <Row label="Payment method" value="M-Pesa" />
        <Row label="Phone number" value="07XX XXX XXX" />
        <Row label="Processing fee" value="KES 0" />
        <View style={styles.divider} />
        <Row label="Total" value={`KES ${amount.toLocaleString()}`} bold />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          📱 An M-Pesa prompt will be sent to your phone. Enter your PIN to confirm the payment.
        </Text>
      </View>
      <TouchableOpacity style={styles.payButton} onPress={handlePay}>
        <Text style={styles.payButtonText}>Pay KES {amount.toLocaleString()} via M-Pesa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.failButton} onPress={handleFail}>
        <Text style={styles.failButtonText}>Simulate Failed Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({ label, value, bold, green, red }: {
  label: string; value: string; bold?: boolean; green?: boolean; red?: boolean;
}) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={[rowStyles.value, bold && rowStyles.bold, green && rowStyles.green, red && rowStyles.red]}>
        {value}
      </Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  label: { fontSize: 14, color: Colors.textMuted },
  value: { fontSize: 14, color: Colors.text },
  bold: { fontWeight: '700', color: Colors.text },
  green: { color: Colors.success, fontWeight: '600' },
  red: { color: Colors.error, fontWeight: '600' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centerScreen: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60 },
  back: { fontSize: 16, color: Colors.primary },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  mpesaBanner: { backgroundColor: '#4CAF50', marginHorizontal: 24, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16 },
  mpesaLogo: { fontSize: 28, fontWeight: '900', color: Colors.white, letterSpacing: 2 },
  mpesaTagline: { color: Colors.white, fontSize: 13, opacity: 0.9, marginTop: 4 },
  summaryCard: { backgroundColor: Colors.primary, marginHorizontal: 24, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
  summaryLabel: { color: Colors.white, fontSize: 14, opacity: 0.85 },
  summaryAmount: { color: Colors.white, fontSize: 40, fontWeight: 'bold', marginVertical: 4 },
  summaryTo: { color: Colors.white, fontSize: 14, opacity: 0.85 },
  detailsCard: { backgroundColor: Colors.surface, marginHorizontal: 24, borderRadius: 16, padding: 20, marginBottom: 16 },
  detailsTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },
  infoBox: { backgroundColor: '#EFF6FF', marginHorizontal: 24, borderRadius: 12, padding: 16, marginBottom: 24 },
  infoText: { fontSize: 14, color: '#1D4ED8', lineHeight: 20 },
  payButton: { backgroundColor: '#4CAF50', marginHorizontal: 24, borderRadius: 14, padding: 18, alignItems: 'center', marginBottom: 12 },
  payButtonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  failButton: { marginHorizontal: 24, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 40, borderWidth: 1, borderColor: Colors.error },
  failButtonText: { color: Colors.error, fontSize: 14 },
  processingCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 32, alignItems: 'center' },
  processingTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginTop: 20, marginBottom: 8 },
  processingSubtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 22 },
  processingDetails: { marginTop: 24, alignItems: 'center' },
  processingAmount: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },
  processingName: { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
  resultCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 24 },
  successIcon: { alignItems: 'center', marginBottom: 16 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.text, textAlign: 'center', marginBottom: 8 },
  resultSubtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginBottom: 24 },
  receiptBox: { backgroundColor: Colors.background, borderRadius: 12, padding: 16, marginBottom: 24 },
  primaryButton: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  secondaryButton: { borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  secondaryButtonText: { color: Colors.textMuted, fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: Colors.surface, borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  modalBody: { fontSize: 14, color: Colors.textMuted, lineHeight: 22, marginBottom: 24 },
});