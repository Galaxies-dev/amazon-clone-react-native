import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().min(3, 'Please enter a valid mobile number or email'),
  password: z.string().min(1, 'Please enter your password'),
});
type SignInForm = z.infer<typeof signInSchema>;

const Page = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: 'simon@galaxies.dev', password: '' },
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: isLoadedSignUp } = useSignUp();

  const onSubmit = async (data: SignInForm) => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.dismissTo('/(tabs)');
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        const errors = err.errors;
        console.log(errors);
        if (errors[0].code === 'form_identifier_not_found') {
          createAccount(data);
        } else {
          Alert.alert('Error', 'An error occurred while signing in');
        }
      }
    }
  };

  const createAccount = async (data: SignInForm) => {
    console.log('createAccount');

    if (!isLoadedSignUp) return;
    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      // Send user an email with verification code
      // await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      router.dismissTo('/(tabs)');
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
  const signInWithPasskey = async () => {
    // 'discoverable' lets the user choose a passkey
    // without auto-filling any of the options
    try {
      const signInAttempt = await signIn?.authenticateWithPasskey({
        flow: 'discoverable',
      });

      if (signInAttempt?.status === 'complete') {
        if (setActive !== undefined) {
          await setActive({ session: signInAttempt.createdSessionId });
          router.dismissTo('/(tabs)');
        }
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white">
      <View className="p-4">
        <Stack.Screen
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.dismiss()}>
                <Text className="text-white text-lg">Cancel</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Text className="text-2xl font-bold mb-2">Sign in or create an account</Text>
        <Text className="text-base font-medium mb-2">Enter mobile number or email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Mobile number or email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && <Text className="text-red-500 mb-2">{errors.email.message}</Text>}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Amazon password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              accessibilityLabel="Amazon password"
              testID="password-input"
            />
          )}
        />
        {errors.password && <Text className="text-red-500 mb-2">{errors.password.message}</Text>}
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => setShowPassword((prev) => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: showPassword }}
          testID="show-password-checkbox">
          <View
            className={`w-5 h-5 rounded border border-gray-400 mr-2 items-center justify-center ${
              showPassword ? 'bg-green-100 border-green-600' : 'bg-white'
            }`}>
            {showPassword && <View className="w-3 h-3 bg-green-600 rounded" />}
          </View>
          <Text className="text-base">Show password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-yellow-400 rounded-full py-3 items-center mb-4"
          onPress={handleSubmit(onSubmit)}>
          <Text className="text-lg font-medium text-black">Sign in</Text>
        </TouchableOpacity>
        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-2 text-gray-500">Or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>
        <TouchableOpacity
          className="border border-gray-400 rounded-full py-3 items-center mb-6 bg-white"
          onPress={signInWithPasskey}>
          <Text className="text-lg font-medium text-black">Sign in with a passkey</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Page;
