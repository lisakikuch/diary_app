// Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import AddScreen from '../screens/AddScreen';

// Create Stack
const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: true }}>
                <Stack.Screen component={HomeScreen} name='Home' />
                <Stack.Screen component={DetailsScreen} name='Details' />
                <Stack.Screen component={AddScreen} name='Add' />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;