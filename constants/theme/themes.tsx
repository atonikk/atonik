import { Theme } from "./types";

export const LightTheme: Theme = {
  colors: {
    background: "#ffffff", // ¡ojo! tenías "#fffff", falta una 'f'
    text: "#000000",
    primary: "#6438D7",
    secondary: "#ad7cfc",
    card: "#ffffff",
    separator: "#d1cece",
    input:"#ffffff",
    placeholder:"#f0f0f0",
    state:false,
    placeholdertext:"#737373",
  },
};

export const DarkTheme: Theme = {
  colors: {
    background: "#130E1E",
    text: "#ffffff",
    primary: "#6438D7",
    secondary: "#ad7cfc",
    card: "#1f1f1f",
    separator: "#333333",
    input:"#292d3f",
    placeholder:"#38324F",
    state:true,
    placeholdertext:"#A096B2",
  },
};
