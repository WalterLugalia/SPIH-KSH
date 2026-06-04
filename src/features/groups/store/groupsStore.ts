import { create } from 'zustand';
import { storage } from '../../../services/storage';

export interface Member {
  id: string;
  name: string;
  phone: string;
  owes: number;
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
  total: number;
}

interface GroupsState {
  groups: Group[];
  isLoading: boolean;
  addGroup: (name: string) => Promise<void>;
  loadGroups: () => Promise<void>;
}

const DEFAULT_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Kilimani Apartment',
    total: 12000,
    members: [
      { id: '1', name: 'Constantine', phone: '0700000001', owes: 4000 },
      { id: '2', name: 'Brian', phone: '0700000002', owes: 4000 },
      { id: '3', name: 'Amina', phone: '0700000003', owes: 4000 },
    ],
  },
  {
    id: '2',
    name: 'Westlands House',
    total: 8500,
    members: [
      { id: '4', name: 'Constantine', phone: '0700000001', owes: 4250 },
      { id: '5', name: 'Kevin', phone: '0700000004', owes: 4250 },
    ],
  },
];

export const useGroupsStore = create<GroupsState>((set, get) => ({
  groups: [],
  isLoading: false,

  loadGroups: async () => {
    set({ isLoading: true });
    const saved = await storage.get<Group[]>('groups');
    set({ groups: saved ?? DEFAULT_GROUPS, isLoading: false });
  },

  addGroup: async (name) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      members: [],
      total: 0,
    };
    const updated = [...get().groups, newGroup];
    set({ groups: updated });
    await storage.set('groups', updated);
  },
}));