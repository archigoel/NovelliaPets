import { create } from 'zustand'
import { MedicalRecord, Pet } from '../types'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface PetStore {
    fetchPets: (username: string) => Promise<void>
    addPet: (pet: Pet) => Promise<void>
    updatePet: (pet: Pet) => Promise<void>
    deletePet: (id: string) => Promise<void>
    isLoading: boolean,
    error: string | null,
    pets: Pet[]
    getPetById: (petId: string) => Pet | undefined
    addMedicalRecord: (id: string, record: MedicalRecord) => Promise<void>
    updateMedicalRecord: (id: string, record: MedicalRecord) => Promise<void>
    deleteMedicalRecord: (id: string, record: string) => Promise<void>
}

export const usePetStore = create<PetStore>()(persist((set, get) => ({

    pets: [],
    isLoading: false,
    error: null,

    fetchPets: async (username: string) => {
        set({ isLoading: true, error: null });
        try {
            // Use your local API endpoint here
            const response = await fetch(`http://10.0.0.249:3000/pets?owner=${username}`);

            const data = await response.json();
            set({ pets: data, isLoading: false });
        } catch (err) {
            console.log('response error')
            set({ error: 'Failed to load pets', isLoading: false });
        }


    },

    addPet: async (newPet: Pet) => {
        set({ isLoading: true });
        try {
            // Update Local State immediately (Optimistic Update)
            // set((state) => ({ pets: [...state.pets, newPet], isLoading: false }))

            const response = await fetch('http://10.0.0.249:3000/pets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPet),
            })
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const created = await response.json();

            set((state) => ({ pets: [...state.pets, created], isLoading: false }))

            console.log("Pet added successfully:", newPet.name);
        } catch (error) {
            console.error(" Failed to add pet:", error);
        }
    },

    updatePet: async (pet: Pet,) => {
        set({ isLoading: true });
        try {
            // Update Local State immediately (Optimistic Update)
            // set((state) => ({ pets: [...state.pets, newPet], isLoading: false }))

            const response = await fetch(`http://10.0.0.249:3000/pets/${pet.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pet),
            })
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();

            set((state) => ({
                pets: state.pets.map((p) => (p.id === pet.id ? data : p)),
                isLoading: false,
            }));
            console.log("Pet updated successfully:", pet.name);
        } catch (error) {
            console.error(" Failed to update pet info:", error);
        }
    },

    deletePet: async (id: string) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`http://10.0.0.249:3000/pets/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Delete failed');

            // Update local state: remove the pet from the array
            set((state) => ({
                pets: state.pets.filter((p) => p.id !== id),
                isLoading: false,
            }));

            console.log("Pet deleted from store");
        } catch (error) {
            console.error("Delete error:", error);
            set({ isLoading: false });
        }
    },

    addMedicalRecord: async (petId: string, newRecord: MedicalRecord) => {
        console.log("record ", newRecord)
        const { pets, updatePet } = get();
        const pet = pets.find(p => p.id === petId);

        if (pet) {
            const updatedPet = {
                ...pet,
                medicalHistory: [...(pet.medicalHistory || []), newRecord]
            };
            await updatePet(updatedPet);
        }
    },

    deleteMedicalRecord: async (petId: string, recordId: string) => {
        const { pets, updatePet } = get();
        const pet = pets.find(p => p.id === petId);

        if (pet) {
            const updatedPet = {
                ...pet,
                medicalHistory: pet?.medicalHistory?.filter(r => r.id !== recordId)
            };
            await updatePet(updatedPet);
        }
    },

    updateMedicalRecord: async (petId: string, updatedRecord: MedicalRecord) => {
        console.log("updated record", updatedRecord)
        const { pets, updatePet } = get();
        const pet = pets.find(p => p.id === petId);

        if (pet) {
            const updatedPet = {
                ...pet,
                medicalHistory: pet?.medicalHistory?.map((rec) =>
                    rec.id === updatedRecord.id ? updatedRecord : rec
                ),
            }
            console.log("updated pet ---------------", updatedPet)

            await updatePet(updatedPet);

        }
    },


    getPetById: (id: string) => {
        return get().pets.find((p) => String(p.id) === String(id));
    },
}),
    {
        name: 'pet-storage',
        storage: createJSONStorage(() => AsyncStorage),

    }
))