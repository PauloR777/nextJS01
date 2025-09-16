import { create } from "zustand";

export type UserMember = {
  id: string;
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;
  school?: string;
  gpa: number;
  skills?: string;
  reason?: string;
  major?: string;
  university?: string;
  profilePhoto?: string;
  activities?: string[]; // image URLs
  awards?: string[]; // image URLs
  works?: string[]; // image URLs or links
};

type State = {
  members: UserMember[];
  addMember: (m: UserMember) => void;
};

export const useUserMembers = create<State>((set) => ({
  members: [],
  addMember: (m: UserMember) => set((state) => ({ members: [...state.members, m] })),
}));

export default useUserMembers;
