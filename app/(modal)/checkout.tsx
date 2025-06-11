import { Article, createOrder, createPaymentIntent } from '@/utils/api';
import { useCartStore } from '@/utils/cartStore';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useStripe } from '@stripe/stripe-react-native';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const Page = () => {
  const { articles, total, clearCart } = useCartStore();
  const { user } = useUser();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { getToken } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const router = useRouter();

  const { isPending: isOrderPending, mutate: orderMutation } = useMutation({
    mutationFn: ({
      articles,
      token,
    }: {
      articles: (Article & { quantity: number })[];
      token: string;
    }) => createOrder(articles, token),
    onSuccess: (data) => {
      paymentMutation();
    },
    onError: (error) => {
      console.log('Error creating order', error);
    },
    onSettled: () => {
      setCheckoutLoading(false);
    },
  });

  const { isPending: isPaymentPending, mutate: paymentMutation } = useMutation({
    mutationFn: () => createPaymentIntent(total, user?.emailAddresses[0].emailAddress ?? ''),
    onSuccess: (data) => {
      const { paymentIntent, ephemeralKey, customer } = data;

      showPaymentSheet(paymentIntent, ephemeralKey, customer);
    },
    onError: (error) => {
      console.log('Error creating payment intent', error);
    },
  });

  const handleCheckout = async () => {
    const token = await getToken();
    setCheckoutLoading(true);
    if (!token) {
      Alert.alert('Error', 'Please login to continue');
      return;
    }
    orderMutation({ articles, token });
  };

  const showPaymentSheet = async (
    paymentIntent: string,
    ephemeralKey: string,
    customer: string
  ) => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Galaxies.dev',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: user?.fullName ?? '',
      },
    });

    if (error) {
      console.log('Error initializing payment sheet', error);
    } else {
      const { error } = await presentPaymentSheet();
      if (error) {
        console.log('Error presenting payment sheet (or canceled)', error);
        // Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        clearCart();
        Alert.alert('Success', 'Your order is confirmed!', [
          {
            text: 'OK',
            onPress: () => {
              router.dismissAll();
            },
          },
        ]);
      }
    }
  };

  return (
    <ScrollView contentContainerClassName="flex-1 p-5 bg-white">
      {(isOrderPending || isPaymentPending || checkoutLoading) && (
        <View className="flex-1 absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/20 z-20">
          <ActivityIndicator size="large" className="text-dark" />
        </View>
      )}
      <View className="mb-4">
        <Text className="text-sm mb-2 text-gray-900">
          By placing your order you agree to Amazon's Conditions of Use & Sale. Please see our
          Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
        </Text>
      </View>
      <TouchableOpacity
        className="bg-yellow-300 rounded-full py-4 items-center mb-5 mt-1"
        onPress={handleCheckout}>
        <Text className="text-2xl font-bold text-gray-900">Buy now</Text>
      </TouchableOpacity>
      <View className="bg-gray-100 rounded-xl p-4 mb-4">
        <Text className="text-lg font-semibold mb-1">Order Total:</Text>
        <Text className="text-2xl font-bold text-gray-900 mb-1">${total.toFixed(2)}</Text>
        <Text className="text-xs text-gray-500">Order totals include VAT.</Text>
      </View>
    </ScrollView>
  );
};

export default Page;
