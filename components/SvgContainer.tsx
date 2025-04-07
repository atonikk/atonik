import React, { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
const SvgContainer = ({ children }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        position: "absolute",
        top: keyboardVisible ? "20%" : "35%",
        width: "80%",
        height: keyboardVisible ? height * 0.4 : height * 0.45,
        alignItems: "center",
      }}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 339 324"
        preserveAspectRatio="none"
        fill="none"
      >
        <Path
          d="M0 20C0 8.95431 8.95431 0 20 0H319C330.046 0 339 8.9543 339 20V260.746C339 269.731 333.009 277.612 324.352 280.017L171.465 322.482C167.892 323.474 164.114 323.454 160.552 322.423L14.4389 280.128C5.88614 277.652 0 269.821 0 260.917V20Z"
          fill="#2D0A42"
        />
      </Svg>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          marginTop: '7%',
          //backgroundColor: "blue",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export default SvgContainer;
