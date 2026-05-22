import React from "react";
import { TextStyle } from "react-native";
import { Text } from "react-native-ui-lib";

// Komponen kustom untuk animasi angka
type AnimatedCounterProps = {
  targetValue: number;
  duration?: number;
  style?: TextStyle;
};
const AnimatedCounter = ({
  targetValue,
  duration = 1500,
  style,
}: AnimatedCounterProps) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Rumus Easing (easeOutExpo) agar angka berputar cepat lalu melambat halus di akhir
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(easeProgress * targetValue));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [targetValue, duration]);

  // .toLocaleString('id-ID') akan otomatis menambahkan titik, misal: 50025 -> 50.025
  return <Text style={style}>{count.toLocaleString("id-ID")}</Text>;
};

export default AnimatedCounter;
