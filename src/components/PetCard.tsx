import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Pet } from '../types';

type PetCardProps = {
    pet: Pick<Pet, 'id' | 'name' | 'photoUri'>
    onPress: (petId: string) => void;

};

export const PetCard = ({ pet, onPress }: PetCardProps) => {
    const hasPhoto = !!pet.photoUri;

    return (
        <TouchableOpacity onPress={() => onPress(pet.id)}>

            <View style={styles.card}>
                {hasPhoto ? (
                    <Image source={{ uri: pet.photoUri }} style={styles.photo} />
                ) : (
                    <View style={[styles.photo, styles.placeholder]}>
                        <Text style={styles.placeholderText}>No Photo</Text>
                    </View>
                )}

                <Text style={styles.name} numberOfLines={1}>
                    {pet.name}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 140,
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    photo: {
        width: 84,
        height: 84,
        borderRadius: 42,
        marginBottom: 10,
    },
    placeholder: {
        backgroundColor: '#E8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#666',
        fontSize: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
});