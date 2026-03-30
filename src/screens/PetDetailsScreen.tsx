import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePetStore } from '../store/usePetStore';
import { StyleSheet, Alert, Image } from 'react-native';
import { PetDetailsRouteProp, NavigationProp, MedicalRecord } from '../types';
import { useLayoutEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
const { width } = Dimensions.get('window');

export const PetDetailsScreen = () => {
    const route = useRoute<PetDetailsRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { petId } = route.params

    const deleteMedicalRecord = usePetStore((s) => s.deleteMedicalRecord)
    // re-render me if the pet with this ID changes"
    const pet = usePetStore((state) =>
        state.pets.find((p) => String(p.id) === String(petId))
    );

    useLayoutEffect(() => {
        if (petId) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('AddPet', { petId: route.params.petId })}
                        style={{ marginRight: 15 }}>
                        <Text style={{ color: '#ef4444', fontWeight: '600', fontSize: 16 }}>Edit</Text>
                    </TouchableOpacity>
                ),
            });
        }
    }, [navigation, petId]);

    if (!pet) return <Text>Pet not found</Text>;


    //  Helper to get Icon/Color based on type
    const getRecordStyle = (type: string) => {
        switch (type) {
            case 'Vaccine': return { icon: 'medical', color: '#10B981', bg: '#ECFDF5' }; // Green
            case 'Allergy': return { icon: 'warning', color: '#EF4444', bg: '#FEF2F2' }; // Red
            case 'Medication': return { icon: 'pill', color: '#6366f1', bg: '#EEF2FF' }; // Blue 
            default: return { icon: 'document-text', color: '#6B7280', bg: '#F3F4F6' };
        }
    };

    const handleDeleteRecord = async (recordId: string) => {
        await deleteMedicalRecord(petId, recordId)

    }

    const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            <Image
                source={{ uri: pet.photoUri || PLACEHOLDER_IMAGE }}
                style={styles.heroImage}
                resizeMode="cover"
            />
            {/* Profile Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{pet.name}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{pet.type}</Text>
                </View>
            </View>

            <Text style={styles.subtitle}>{pet.breed} • {pet.age} years old</Text>

            <View style={styles.divider} />


            {/* Medical Records Section Header */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Medical History</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddMedicalRecord', { petId })}
                >
                    <Ionicons name="add-circle" size={24} color="#6366f1" />
                    <Text style={styles.addButtonText}>Add Record</Text>
                </TouchableOpacity>
            </View>


            {/* Records List */}
            {pet.medicalHistory && pet.medicalHistory.length > 0 ? (
                pet.medicalHistory.map((record, index) => {
                    const style = getRecordStyle(record.type);

                    return (
                        <TouchableOpacity
                            key={record.id}
                            style={styles.recordCard}
                            onPress={() => navigation.navigate('AddMedicalRecord', { petId, recordId: record.id })}
                            onLongPress={() => {
                                Alert.alert("Manage Record", "What would you like to do?", [
                                    { text: "Cancel", style: "cancel" },
                                    { text: "Delete", style: "destructive", onPress: () => handleDeleteRecord(record.id) }
                                ])
                            }}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: style.bg }]}>
                                <Ionicons name={style.icon as any} size={20} color={style.color} />
                            </View>

                            <View style={styles.recordContent}>
                                <View style={styles.recordTopRow}>
                                    <Text style={styles.recordType}>{record.type}</Text>
                                </View>
                                <Text style={styles.recordTitle}>{record.name}</Text>

                                {/* Conditional Info */}
                                {record.type == 'Medication' &&
                                    <View style={styles.recordTopRow}>
                                        <Text style={styles.recordSubInfo}>Dosage: {record.dosage}</Text>

                                    </View>
                                }
                                {record.type == 'Allergy' &&
                                    <View style={styles.recordTopRow}>
                                        <Text style={[styles.recordSubInfo, { color: '#6B7280' }]}>Severity: {record.severity}</Text>

                                    </View>
                                }
                            </View>
                        </TouchableOpacity>
                    );
                })
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="folder-open-outline" size={40} color="#D1D5DB" />
                    <Text style={styles.emptyText}>No medical records found.</Text>
                </View>
            )}

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Light gray background
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    headerContainer: {
        //  padding: 20,

        //  backgroundColor: '#eee',
    },
    heroImage: {
        width: '100%',
        height: 350,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
    },
    badge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#6366f1',
    },
    badgeText: {
        color: '#6366f1',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 24,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    addButtonText: {
        marginLeft: 4,
        color: '#6366f1',
        fontWeight: '700',
        fontSize: 14,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    recordCount: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    recordCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        // Shadow for Android (Pixel)
        elevation: 3,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    recordIndicator: {
        width: 4,
        backgroundColor: '#6366f1',
        borderRadius: 2,
        marginRight: 12,
    },
    recordContent: {
        flex: 1,
    },
    recordDate: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        marginBottom: 2,
    },
    recordType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    recordNotes: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
        lineHeight: 20,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 16,
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    recordTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    recordTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginTop: 2,
    },
    recordSubInfo: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});