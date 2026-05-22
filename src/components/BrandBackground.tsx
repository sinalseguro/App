import { useEffect, useMemo, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import {
  resolveBrandBackgroundPresentation,
  type BrandBackgroundInterpolation,
  type BrandBackgroundTraceConfig
} from "@/components/brandBackgroundPresentationPolicy";
import { theme } from "@/design/theme";

const brandSymbol = require("../../assets/brand/sinalseguro-symbol.png");

function AnimatedBrandParticle({
  config,
  motion,
  value
}: {
  config: BrandBackgroundTraceConfig;
  motion: {
    opacity: BrandBackgroundInterpolation;
    scale: BrandBackgroundInterpolation;
    translationInputRange: number[];
  };
  value: Animated.Value;
}) {
  const opacity = value.interpolate({
    inputRange: motion.opacity.inputRange,
    outputRange: motion.opacity.outputRange
  });
  const scale = value.interpolate({
    inputRange: motion.scale.inputRange,
    outputRange: motion.scale.outputRange
  });
  const translateX = value.interpolate({
    inputRange: motion.translationInputRange,
    outputRange: [0, config.driftX]
  });
  const translateY = value.interpolate({
    inputRange: motion.translationInputRange,
    outputRange: [0, config.driftY]
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.trace,
        {
          height: config.size,
          left: `${config.left}%`,
          opacity,
          top: `${config.top}%`,
          transform: [{ translateX }, { translateY }, { scale }],
          width: config.size
        }
      ]}
    />
  );
}

type BrandBackgroundProps = {
  active?: boolean;
};

export function BrandBackground({ active = false }: BrandBackgroundProps) {
  const presentation = resolveBrandBackgroundPresentation(active);
  const values = useMemo(() => presentation.particleConfigs.map(() => new Animated.Value(0)), [presentation.particleConfigs]);
  const watermarkPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const watermarkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(watermarkPulse, {
          duration: presentation.watermarkPulse.duration,
          toValue: presentation.watermarkPulse.endValue,
          useNativeDriver: true
        }),
        Animated.timing(watermarkPulse, {
          duration: presentation.watermarkPulse.duration,
          toValue: presentation.watermarkPulse.startValue,
          useNativeDriver: true
        })
      ])
    );
    watermarkLoop.start();

    const loops = values.map((value, index) => {
      const config = presentation.particleConfigs[index];
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(config.delay),
          Animated.timing(value, {
            duration: config.duration,
            toValue: 1,
            useNativeDriver: true
          }),
          Animated.timing(value, {
            duration: presentation.particleResetDuration,
            toValue: presentation.watermarkPulse.startValue,
            useNativeDriver: true
          })
        ])
      );
      loop.start();
      return loop;
    });

    return () => {
      watermarkLoop.stop();
      loops.forEach((loop) => loop.stop());
    };
  }, [
    presentation.particleConfigs,
    presentation.particleResetDuration,
    presentation.watermarkPulse.duration,
    presentation.watermarkPulse.endValue,
    presentation.watermarkPulse.startValue,
    values,
    watermarkPulse
  ]);

  const watermarkOpacity = watermarkPulse.interpolate({
    inputRange: presentation.watermarkOpacity.inputRange,
    outputRange: presentation.watermarkOpacity.outputRange
  });
  const watermarkScale = watermarkPulse.interpolate({
    inputRange: presentation.watermarkScale.inputRange,
    outputRange: presentation.watermarkScale.outputRange
  });
  const activeHaloOpacity = watermarkPulse.interpolate({
    inputRange: presentation.activeHaloOpacity.inputRange,
    outputRange: presentation.activeHaloOpacity.outputRange
  });
  const activeHaloScale = watermarkPulse.interpolate({
    inputRange: presentation.activeHaloScale.inputRange,
    outputRange: presentation.activeHaloScale.outputRange
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {active ? (
        <Animated.View
          style={[
            styles.activeHalo,
            {
              opacity: activeHaloOpacity,
              transform: [{ scale: activeHaloScale }]
            }
          ]}
        />
      ) : null}
      <Animated.View
        style={[
          styles.watermark,
          {
            opacity: watermarkOpacity,
            transform: [{ scale: watermarkScale }]
          }
        ]}
      >
        <Image accessibilityIgnoresInvertColors source={brandSymbol} style={styles.watermarkImage} />
      </Animated.View>
      {values.map((value, index) => (
        <AnimatedBrandParticle
          key={index}
          config={presentation.particleConfigs[index]}
          motion={{
            opacity: presentation.particleOpacity,
            scale: presentation.particleScale,
            translationInputRange: presentation.particleTranslation.inputRange
          }}
          value={value}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  trace: {
    backgroundColor: "rgba(236, 64, 122, 0.56)",
    borderColor: "rgba(122, 31, 162, 0.22)",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    position: "absolute"
  },
  activeHalo: {
    backgroundColor: "rgba(236, 64, 122, 0.2)",
    borderRadius: theme.radius.pill,
    bottom: "18%",
    left: "10%",
    position: "absolute",
    right: "10%",
    top: "18%"
  },
  watermark: {
    height: "106%",
    left: "-20%",
    position: "absolute",
    top: "-6%",
    width: "140%"
  },
  watermarkImage: {
    height: "100%",
    resizeMode: "contain",
    width: "100%"
  }
});
