import { ThemeColors } from "../types/variables";

class ThemeVariables {
  private colors: ThemeColors;

  constructor() {
    this.colors = {
      mainColor: "#ffff00ff",
      secondColor: "#6C757D",
      backgroundColor: "#FFFFFF",
      textColor: "#1E1E1E",
      reversedTextColor: "#FFFFFF"
    };
  }

  get mainColor() {
    return this.colors.mainColor;
  }
  get secondaryColor() {
    return this.colors.secondColor;
  }
  get backgroundColor() {
    return this.colors.backgroundColor;
  }
  get textColor() {
    return this.colors.textColor;
  }

  get reversedTextColor() {
    return this.colors.reversedTextColor;
  }

  set mainColor(value: string) {
    this.colors.mainColor = value;
  }
  set secondaryColor(value: string) {
    this.colors.secondColor = value;
  }
  set backgroundColor(value: string) {
    this.colors.backgroundColor = value;
  }
  set textColor(value: string) {
    this.colors.textColor = value;
  }

  set reversedTextColor(value: string) {
    this.colors.reversedTextColor = value;
  }

  updateColors(newColors: Partial<ThemeColors>) {
    this.colors = { ...this.colors, ...newColors };
  }
}

const Variables = new ThemeVariables();
export default Variables;
