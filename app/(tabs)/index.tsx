import { useAuth } from '@clerk/clerk-expo';
import { Button, Text, View } from 'react-native';

export default function Index() {
  const { getToken } = useAuth();

  const createJWT = async () => {
    const token = await getToken();
    console.log('🚀 ~ createJWT ~ token:', token);
  };

  const fetchOrders = async () => {
    const token = await getToken();
    console.log('fetch...');

    // console.log('🚀 ~ fetchOrders ~ token:', token);
    const response = await fetch('http://localhost:3000/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('response...');

    const data = await response.json();
    console.log('🚀 ~ fetchOrders ~ data:', data);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button title="Create JWT" onPress={createJWT} />
      <Button title="Fetch orders" onPress={fetchOrders} />
    </View>
  );
}
