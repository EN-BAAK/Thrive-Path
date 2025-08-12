import { ThemeColors } from "../types/variables";

class ThemeVariables {
  private colors: ThemeColors;

  constructor() {
    this.colors = {
      mainColor: "#65046aff",
      lightMain: "#e600ff4d",
      secondColor: "#bebebeff",
      backgroundColor: "#fcfcfcff",
      textColor: "#000",
      reversedTextColor: "#fff"
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
  get lightMain() {
    return this.colors.lightMain;
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
  set lightMain(value: string) {
    this.colors.lightMain = value;
  }

  updateColors(newColors: Partial<ThemeColors>) {
    this.colors = { ...this.colors, ...newColors };
  }
}

const Variables = new ThemeVariables();
export default Variables;
