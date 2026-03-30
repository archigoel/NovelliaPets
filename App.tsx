
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from './src/store';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AddPetScreen, PetDetailsScreen, AddMedicalRecordScreen, HomeScreen, OnboardingScreen } from './src/screens';
import { RootStackParamList } from './src/types'
import { TouchableOpacity, Text } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  const userName = useAuthStore((state) => state.userName)
  const logout = useAuthStore((state => state.logout))

  return (
    <SafeAreaProvider>
      {!userName ? (
        <OnboardingScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen}
              options={{
                title: 'My Pets',
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => logout()}
                    style={{ marginRight: 15 }}
                  >
                    <Text style={{ color: '#6366f1', fontWeight: '600' }}>Logout</Text>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="AddPet"
              component={AddPetScreen}
              options={({ route }) => ({
                title: route.params?.petId ? 'Edit Pet' : 'Add New Pet',
              })}


            />
            <Stack.Screen name="PetDetails" component={PetDetailsScreen}
              options={() => ({
                title: 'Pet Profile'
              })}
            />
            <Stack.Screen name="AddMedicalRecord" component={AddMedicalRecordScreen}
              options={() => ({
                title: 'Medical History'
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}
