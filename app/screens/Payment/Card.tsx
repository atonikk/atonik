import {
  CreditCardView,
  CreditCardInput,
  type CreditCardFormData,
  type CreditCardFormField,
  type ValidationState,
} from '@/components/card';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';
import { useEffect, useState } from 'react';

import {
  KeyboardAvoidingView,

  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from "@/constants/theme/useTheme";

const getStyles = (theme, width, height) => StyleSheet.create({
  container: {
    height: height,
    backgroundColor: theme.colors.background,
  },
  content: {
   
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  cardView: {
    alignSelf: 'center',
    marginTop: 20,
  },
  cardInput: {
    marginTop: 20,
  },
  button: {
    backgroundColor: theme.colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    marginTop: "auto",
    width: '100%',
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: "200",
  },
});

const toStatusIcon = (status?: ValidationState) =>
  status === 'valid' ? '✅' : status === 'invalid' ? '❌' : '❓';

export default function Example() {
  const { width, height } = useWindowDimensions();
  const theme = useAppTheme();
  const s = getStyles(theme, width, height);
  const [focusedField, setFocusedField] = useState<CreditCardFormField>();
  const [formData, setFormData] = useState<CreditCardFormData>();

  const handleNext = () => {
    // lógica del botón
  };
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const onKeyboardShow = (e: KeyboardEvent) => {
      setTimeout(() => {
        const height = Platform.OS === 'ios' ? e.endCoordinates.height : e.endCoordinates.screenY;
        setKeyboardHeight(height);
      }, 50);

    };
  
    const onKeyboardHide = () => {
      setKeyboardHeight(0);
    };
  
    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardHide);
  
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  
  return (
    <SafeAreaView edges={['top']} style={s.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.container}
      >
 
          <CreditCardView
            focusedField={focusedField}
            type={formData?.values.type}
            number={formData?.values.number}
            name={formData?.values.name}
            expiry={formData?.values.expiry}
            cvc={formData?.values.cvc}
            style={s.cardView}
            imageFront={require("@/assets/images/card-front.png")}
          />

          <CreditCardInput
            autoFocus
            style={s.cardInput}
            onChange={setFormData}
            onFocusField={setFocusedField}
          />
      

        <TouchableOpacity onPress={handleNext} style={[s.button, {marginBottom: keyboardHeight}]}>
          <Text style={s.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
