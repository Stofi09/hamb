import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#2D2D2D',
          },
          drawerLabelStyle: {
            color: '#F5F5F5',
          },
          drawerActiveTintColor: '#FFD700',
          headerStyle: { backgroundColor: '#2D2D2D' },
          headerTintColor: '#FFD700',
        }}
      >
        <Drawer.Screen
          name="index"
          options={{ drawerLabel: 'Flat / Minimal', title: 'Flat / Minimal' }}
        />
        <Drawer.Screen
          name="rounded"
          options={{ drawerLabel: 'Rounded / Soft', title: 'Rounded / Soft' }}
        />
        <Drawer.Screen
          name="neumorphic"
          options={{ drawerLabel: 'Neumorphic', title: 'Neumorphic' }}
        />
        <Drawer.Screen
          name="glassmorphism"
          options={{ drawerLabel: 'Glassmorphism', title: 'Glassmorphism' }}
        />
      </Drawer>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}