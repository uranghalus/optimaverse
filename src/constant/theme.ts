import { Dimensions } from "react-native";
import { Colors, Spacings, Typography } from "react-native-ui-lib";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 375;

export const setupTheme = () => {
  Colors.loadColors({
    primary: "#009DDC",
    secondary: "#FFD700",
    danger: "#A71D31",
    white: "#FFFFFF",
    black: "#000000",
    gray: "#95A5A6",
  });

  Typography.loadTypographies({
    h1: { fontSize: 58, fontWeight: "300", lineHeight: 80 },
    h2: { fontSize: 46, fontWeight: "300", lineHeight: 64 },
  });

  Spacings.loadSpacings({
    page: isSmallScreen ? 16 : 20,
  });
};
