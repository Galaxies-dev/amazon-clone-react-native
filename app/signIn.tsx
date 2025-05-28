import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

const signInSchema = z.object({
  identifier: z.string().min(3, 'Please enter a valid mobile number or email'),
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
    defaultValues: { identifier: '', password: '' },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'initial' | 'otp'>('initial');

  const onSubmit = (data: SignInForm) => {
    // Handle sign in logic here
  };

  const onPasskey = () => {
    // Handle passkey logic here
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
          name="identifier"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 text-base bg-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Mobile number or email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.identifier && (
          <Text className="text-red-500 mb-2">{errors.identifier.message}</Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 text-base bg-white"
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
        <Pressable
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
        </Pressable>
        <Pressable
          className="bg-yellow-400 rounded-full py-3 items-center mb-4"
          onPress={handleSubmit(onSubmit)}>
          <Text className="text-lg font-medium text-black">Sign in</Text>
        </Pressable>
        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-2 text-gray-500">Or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>
        <Pressable
          className="border border-gray-400 rounded-full py-3 items-center mb-6 bg-white"
          onPress={onPasskey}>
          <Text className="text-lg font-medium text-black">Sign in with a passkey</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Page;
