import React, { useLayoutEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert
} from 'react-native';
import { usePetStore, useAuthStore } from '../store';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { AddPetRouteProp, NavigationProp, AnimalType } from '../types'


export const AddPetScreen = () => {

    const route = useRoute<AddPetRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    //const { addPet, deletePet, updatePet } = usePetStore();
    const addPet = usePetStore((s) => s.addPet);
    const deletePet = usePetStore((s) => s.deletePet);
    const updatePet = usePetStore((s) => s.updatePet);
    const petId = route?.params?.petId
    const userName = useAuthStore((s) => s.userName)
    //const action = route?.params?.action
    // This runs when the screen loads
    useLayoutEffect(() => {
        if (petId) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={handleDelete} style={{ marginRight: 15 }}>
                        <Text style={{ color: '#ef4444', fontWeight: '600', fontSize: 16 }}>Delete</Text>
                    </TouchableOpacity>
                ),
            });
        }
    }, [navigation, petId]);


    const selectedPet = usePetStore((state) =>
        petId ? state.pets.find(p => String(p.id) === String(petId)) : null
    );
    const [form, setForm] = useState({
        name: selectedPet?.name || "",
        type: selectedPet?.type || "Dog",
        breed: selectedPet?.breed || "",
        age: selectedPet?.age || "",
    });


    const handleSave = async () => {
        if (!form.name || !form.breed || !form.age) {
            Alert.alert('Missing Info', 'Please fill out all fields.');
            return;
        }
        if (petId != null) {
            await updatePet({
                id: petId,
                owner: userName,
                name: form.name,
                type: form.type,
                breed: form.breed,
                age: form.age,
            });


        } else {
            await addPet({
                id: Date.now().toString(),
                owner: userName,
                name: form.name,
                type: form.type,
                breed: form.breed,
                age: form.age,
            });
        }


        navigation.goBack(); // Return to Home after saving
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Pet",
            "Are you sure you want to remove this pet profile? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        if (petId) {
                            await deletePet(petId);
                            navigation.popToTop(); // Go back to the Home list
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.label}>Pet Name</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Buddy"
                value={form.name}
                onChangeText={(t) => setForm({ ...form, name: t })}
            />

            <Text style={styles.label}>Species</Text>
            <View style={styles.row}>
                {['Dog', 'Cat', 'Rabbit'].map((s) => (
                    <TouchableOpacity
                        key={s}
                        style={[styles.chip, form.type === s && styles.chipActive]}
                        onPress={() => setForm({ ...form, type: s as AnimalType })}
                    >
                        <Text style={form.type === s ? styles.chipTextActive : styles.chipText}>{s}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Breed</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Golden Retriever"
                value={form.breed}
                onChangeText={(t) => setForm({ ...form, breed: t })}
            />

            <Text style={styles.label}>Age (Years)</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 3"
                keyboardType="numeric"
                value={form.age}
                onChangeText={(t) => setForm({ ...form, age: t })}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}> {petId ? 'Edit Pet' : 'Add Pet'}</Text>

            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 20 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    row: { flexDirection: 'row', marginBottom: 20, gap: 10 },
    chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F3F4F6' },
    chipActive: { backgroundColor: '#6366f1' },
    chipText: { color: '#4B5563' },
    chipTextActive: { color: '#fff', fontWeight: '600' },
    saveButton: { backgroundColor: '#6366f1', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});