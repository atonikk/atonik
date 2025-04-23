import { create } from "zustand";

type profilePhotoStore = {
    profilePhoto: string;
    setProfilePhoto: (photo: string) => void;
};

export const useProfilePhotoStore = create<profilePhotoStore>((set) => ({
    profilePhoto: "",
    setProfilePhoto: (photo: string) => set({ profilePhoto: photo }),
}));