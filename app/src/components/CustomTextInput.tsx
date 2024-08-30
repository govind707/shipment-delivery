import React from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardTypeOptions } from 'react-native';

export const CustomTextInput = ({
  label,
  placeholder,
  value,
  onChangeText = (text) => {},
  keyboardType = 'default' as KeyboardTypeOptions,
  style = {},
  onTouch = () => {},
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        onTouchStart={onTouch} // Use onTouchStart directly
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    color: '#FFFFFF',
    fontFamily: 'ProximaNova',
    fontSize: 14,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#333333',
    color: '#FFFFFF',
  },
});
