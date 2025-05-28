import { useAuth, useSignIn } from '@clerk/clerk-expo';
import { Button, Text, View } from 'react-native';

export default function Index() {
  const { signIn } = useSignIn();
  const { getToken } = useAuth();
  const signInWithEmail = async () => {
    try {
      const signInAttempt = await signIn?.create({
        identifier: 'simon@galaxies.dev',
        password: 'dXHXY_xhTLEfC.v_q.N8',
      });
      console.log('🚀 ~ signInWithEmail ~ signInAttempt:', signInAttempt);
    } catch (err) {
      console.error(err);
    }
  };

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
      <Button title="Sign in with email" onPress={signInWithEmail} />
      <Button title="Create JWT" onPress={createJWT} />
      <Button title="Fetch orders" onPress={fetchOrders} />
    </View>
  );
}
