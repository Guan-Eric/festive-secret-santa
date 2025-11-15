import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type SnowflakeProps = {
  delay?: number;
  duration?: number;
  left?: number;
};

export default function Snowflake({
  delay = 0,
  duration = 5,
  left = 50,
}: SnowflakeProps) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);

  useEffect(() => {
    const driftX = Math.random() * 60 - 30; // random drift between -30 and +30

    translateY.value = withRepeat(
      withDelay(
        delay * 1000,
        withTiming(900, {
          duration: duration * 1000,
        })
      ),
      -1, // infinite repeat
      false // no reverse
    );

    translateX.value = withRepeat(
      withDelay(
        delay * 1000,
        withTiming(driftX, {
          duration: duration * 1000,
        })
      ),
      -1,
      true // oscillate horizontally
    );
  }, [delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
    left: `${left}%`,
  }));

  return (
    <Animated.Text style={[styles.snowflake, animatedStyle]}>
      ❄️
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  snowflake: {
    position: "absolute",
    top: -20,
    fontSize: 12,
  },
});
