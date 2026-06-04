import { create } from 'zustand';
import { storage } from '../../../services/storage';

export interface Bill {
  id: string;
  name: string;
  amount: number;
  due: string;
  status: 'pending' | 'paid';
  groupName?: string;
}

interface BillsState {
  bills: Bill[];
  isLoading: boolean;
  addBill: (bill: Omit<Bill, 'id'>) => Promise<void>;
  markAsPaid: (id: string) => Promise<void>;
  loadBills: () => Promise<void>;
}

const DEFAULT_BILLS: Bill[] = [
  { id: '1', name: '🏠 Rent', amount: 12000, due: 'Jun 30', status: 'pending', groupName: 'Kilimani Apt' },
  { id: '2', name: '⚡ KPLC', amount: 2400, due: 'Jun 20', status: 'paid', groupName: 'Kilimani Apt' },
  { id: '3', name: '💧 Water', amount: 800, due: 'Jun 25', status: 'pending', groupName: 'Westlands House' },
];

export const useBillsStore = create<BillsState>((set, get) => ({
  bills: [],
  isLoading: false,

  loadBills: async () => {
    set({ isLoading: true });
    const saved = await storage.get<Bill[]>('bills');
    set({ bills: saved ?? DEFAULT_BILLS, isLoading: false });
  },

  addBill: async (bill) => {
    const newBill: Bill = { ...bill, id: Date.now().toString() };
    const updated = [...get().bills, newBill];
    set({ bills: updated });
    await storage.set('bills', updated);
  },

  markAsPaid: async (id) => {
    const updated = get().bills.map((b) =>
      b.id === id ? { ...b, status: 'paid' as const } : b
    );
    set({ bills: updated });
    await storage.set('bills', updated);
  },
}));