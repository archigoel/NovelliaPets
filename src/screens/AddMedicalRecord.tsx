import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp, MedicalRecord, AddMedicalRecordRouteProp } from '../types';
import { usePetStore } from '../store/usePetStore';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

// Define the reactions for the Allergy multi-select
const ALLERGY_REACTIONS = ['Hives', 'Rash', 'Swelling', 'Vomiting', 'Diarrhea', 'Itching'];

export const AddMedicalRecordScreen = () => {
    const route = useRoute<AddMedicalRecordRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { petId, recordId } = route.params;
    const addMedicalRecord = usePetStore((s => s.addMedicalRecord))
    const updateMedicalRecord = usePetStore((s => s.updateMedicalRecord))

    // 1. Get the data first
    const pet = usePetStore(state => state.getPetById(petId!));
    const existingRecord = pet?.medicalHistory?.find(r => r.id === recordId);

    // 2. Pass it directly into useState
    const [name, setName] = useState(existingRecord?.name || '');
    const [type, setType] = useState<'Vaccine' | 'Allergy' | 'Medication'>(existingRecord?.type || 'Vaccine');
    const [severity, setSeverity] = useState(existingRecord?.type == "Allergy" ? existingRecord.severity : 'mild');
    const [reactions, setReactions] = useState<string[]>(() => {
        if (existingRecord?.type === 'Allergy') {
            if (Array.isArray(existingRecord.reactions)) {
                return existingRecord.reactions;
            }

        }
        return [];
    });
    const [dosage, setDosage] = useState(existingRecord?.type == "Medication" ? existingRecord.dosage : '');
    const [instructions, setInstructions] = useState(existingRecord?.type == "Medication" ? existingRecord.instructions : '');
    const [date, setDate] = useState<Date>(
        existingRecord?.type === "Vaccine" && existingRecord.date
            ? new Date(existingRecord.date) // Convert "2024-05-20" -> Date Object
            : new Date()                    // Create a new Date Object for Today
    );
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        // Hide picker for Android immediately; iOS stays open in 'spinner' or 'inline'
        if (Platform.OS === 'android') setShowDatePicker(false);

        if (selectedDate) {
            setDate(selectedDate);
        }
    };
    const toggleReaction = (r: string) => {
        if (reactions.includes(r)) {
            setReactions(reactions.filter(item => item !== r)); // Remove if already there
        } else {
            setReactions([...reactions, r]); // Add if not there
        }
    };

    const handleSave = async () => {
        if (!name) return Alert.alert("Error", "Please enter a name/title");

        const newRecord = {
            id: recordId || Date.now().toString(),
            type,
            name,
            ...(type === 'Allergy' && { severity, reactions }),
            ...(type === 'Medication' && { dosage, instructions }),
            ...(type === 'Vaccine' && { date }),
        } as MedicalRecord;
        if (recordId != null) {
            await updateMedicalRecord(petId!, newRecord); //petId never be null
        } else {
            await addMedicalRecord(petId!, newRecord); //petId never be null
        }


        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.label}>Record Type</Text>
            <View style={styles.typeSelector}>
                {['Vaccine', 'Allergy', 'Medication'].map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.typeButton, type === t && styles.typeButtonActive]}
                        onPress={() => setType(t as any)}
                    >
                        <Text style={[styles.typeButtonText, type === t && styles.typeButtonTextActive]}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Name / Title</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Rabies, Peanuts, Advil"
                value={name}
                onChangeText={setName}
            />

            {/* --- CONDITIONAL FIELDS START --- */}

            {type === 'Vaccine' && (
                <View>
                    <Text style={styles.label}>Date Administered</Text>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text>{date.toLocaleDateString()}</Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onChangeDate}
                            maximumDate={new Date()} // Prevents future dates for history
                        />
                    )}
                </View>
            )}

            {type === 'Allergy' && (
                <View>
                    <Text style={styles.label}>Severity</Text>
                    <View style={styles.typeSelector}>
                        {['mild', 'severe'].map((s) => (
                            <TouchableOpacity
                                key={s}
                                style={[styles.typeButton, severity === s && styles.severityActive]}
                                onPress={() => setSeverity(s as any)}
                            >
                                <Text style={[styles.typeButtonText, severity === s && styles.typeButtonTextActive]}>{s.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Reactions (Select all that apply)</Text>
                    <View style={styles.chipContainer}>
                        {ALLERGY_REACTIONS.map(r => (
                            <TouchableOpacity
                                key={r}
                                style={[styles.chip, reactions.includes(r) && styles.chipActive]}
                                onPress={() => toggleReaction(r)}
                            >
                                <Text style={[styles.chipText, reactions.includes(r) && styles.chipTextActive]}>{r}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {type === 'Medication' && (
                <View>
                    <Text style={styles.label}>Dosage</Text>
                    <TextInput style={styles.input} placeholder="e.g. 5mg" value={dosage} onChangeText={setDosage} />
                    <Text style={styles.label}>Instructions</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        multiline
                        placeholder="Twice daily with food..."
                        value={instructions}
                        onChangeText={setInstructions}
                    />
                </View>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Record</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 20 },
    label: { fontSize: 14, fontWeight: '700', color: '#4B5563', marginBottom: 8, marginTop: 16 },
    input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, fontSize: 16 },
    textArea: { height: 100, textAlignVertical: 'top' },
    typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    typeButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8, backgroundColor: '#F3F4F6' },
    typeButtonActive: { backgroundColor: '#6366f1' },
    severityActive: { backgroundColor: '#EF4444' },
    typeButtonText: { color: '#6B7280', fontWeight: '600' },
    typeButtonTextActive: { color: '#fff' },
    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
    chipActive: { backgroundColor: '#EEF2FF', borderColor: '#6366f1' },
    chipText: { color: '#6B7280', fontSize: 13 },
    chipTextActive: { color: '#6366f1', fontWeight: '600' },
    saveButton: { backgroundColor: '#6366f1', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 30 },
    saveButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});