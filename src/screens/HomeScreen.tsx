import { View, Text, Button, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";

import { usePetStore, useAuthStore } from "../store"
import { useCallback, useEffect, useState } from "react";
import { PetCard } from "../components/PetCard";
import { Ionicons } from '@expo/vector-icons'; // Built into 
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from '@react-navigation/native';
import { PetDetailsRouteProp, NavigationProp, AddPetRouteProp } from "../types";

export const HomeScreen = () => {
    const route = useRoute<AddPetRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const userName = useAuthStore((s) => s.userName);
    //const deleteUserName = useUserStore((s) => s.deleteUserName)
    const fetchPets = usePetStore((s) => s.fetchPets)
    const pets = usePetStore((s) => s.pets)
    const isLoading = usePetStore((s) => s.isLoading)
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchPets(userName);
        } finally {
            setRefreshing(false);
        }
    }, [fetchPets]);

    useEffect(() => {
        if (userName) {
            fetchPets(userName);
        }

    }, [fetchPets]);

    const showInitialLoader = isLoading && pets.length === 0 && !refreshing;

    return (
        <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ flex: 1, fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', justifyContent: 'center' }}> Hello </Text>
            {showInitialLoader ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    data={pets}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <PetCard
                        pet={item}
                        onPress={() => navigation.navigate('PetDetails', { petId: item.id })}
                    />
                    }
                    numColumns={2}
                    columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    ListEmptyComponent={<Text style={{ color: '#666' }}>No pets yet! Tap + to add one.</Text>}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />

            )}

            {/* contentContainerStyle={{ padding: 20, paddingBottom: 100 }} */}

            <TouchableOpacity
                style={[
                    styles.fab,
                    { bottom: insets.bottom + 20 } // Adjusts for the home indicator
                ]}
                onPress={() => navigation.navigate('AddPet', { petId: undefined })}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>


            {/* <View style={{ alignSelf: 'flex-end' }}>
                <Button
                    title="Reset App (Dev Only)"
                    onPress={
                        deleteUserName
                    }
                />
            </View> */}
        </View>
    );


};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 2, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    petName: { fontSize: 18, fontWeight: 'bold' },
    fab: {
        position: 'absolute',
        right: 20,
        backgroundColor: '#6366f1',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    loader: { position: 'absolute', top: '50%', left: '50%', marginLeft: -20 },
    empty: { textAlign: 'center', marginTop: 50, color: '#666' }
});