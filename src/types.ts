import { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

export type AnimalType = 'Dog' | 'Cat' | 'Bird' | 'Rabbit';

export interface Vaccine {
  id: string,
  type: 'Vaccine'
  name: string,
  date: Date
}

export interface Allergy {
  id: string,
  type: 'Allergy'
  name: string,
  reactions: string[],
  severity: 'mild' | 'severe'

}

export interface Medication {
  id: string,
  type: 'Medication'
  name: string,
  dosage: string,
  instructions: string

}

export type MedicalRecord = Vaccine | Allergy | Medication & { id: string }

export interface Pet {
  id: string;
  owner: string,
  name: string;
  type?: AnimalType;
  breed: string;
  age: string;
  photoUri?: string;
  medicalHistory?: MedicalRecord[];
}
// 2. NAVIGATION MAP
export type RootStackParamList = {
  Home: undefined;
  Onboarding: undefined;
  PetDetails: { petId: string };
  AddPet: { petId?: string };
  AddMedicalRecord: { petId?: string, recordId?: string }
};

// 3. HELPER TYPES (The "Autocomplete" shortcuts)
export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


// Specific route types for screens that need to read params
export type PetDetailsRouteProp = RouteProp<RootStackParamList, 'PetDetails'>;
export type AddPetRouteProp = RouteProp<RootStackParamList, 'AddPet'>;
export type AddMedicalRecordRouteProp = RouteProp<RootStackParamList, 'AddMedicalRecord'>;