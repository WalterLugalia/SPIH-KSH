import { create } from 'zustand';
import { storage } from '../../../services/storage';

export interface HistoryItem {
  id: string;
  name: string;
  person: string;
  amount: number;
  date: string;
  status: 'settled' | 'pending';
  transactionId: string;
}

interface HistoryState {
  items: HistoryItem[];
  addItem: (item: Omit<HistoryItem, 'id' | 'transactionId' | 'date'>) => Promise<void>;
  loadHistory: () => Promise<void>;
}

const DEFAULT_HISTORY: HistoryItem[] = [
  { id: '1', name: 'Rent - Kilimani Apt', person: 'Brian', amount: 4000, date: 'Jun 1', status: 'settled', transactionId: 'QHJ123456' },
  { id: '2', name: 'KPLC Bill', person: 'You', amount: 800, date: 'May 28', status: 'settled', transactionId: 'QHJ234567' },
  { id: '3', name: 'WiFi - Safaricom', person: 'Amina', amount: 500, date: 'May 25', status: 'pending', transactionId: 'QHJ345678' },
];

export const useHistoryStore = create<HistoryState>((set, get) => ({
  items: [],

  loadHistory: async () => {
    const saved = await storage.get<HistoryItem[]>('history');
    set({ items: saved ?? DEFAULT_HISTORY });
  },

  addItem: async (item) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      transactionId: 'QHJ' + Math.floor(Math.random() * 900000 + 100000),
      date: new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }),
    };
    const updated = [newItem, ...get().items];
    set({ items: updated });
    await storage.set('history', updated);
  },
}));