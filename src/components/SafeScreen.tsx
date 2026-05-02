import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/design/theme";

type SafeScreenProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  footer?: string;
}>;

export function SafeScreen({ title, subtitle, footer, children }: SafeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.stack}>{children}</View>
        {footer ? <Text style={styles.footer}>{footer}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    padding: theme.spacing.xl,
    gap: theme.spacing.xl
  },
  header: {
    gap: theme.spacing.sm
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
    fontWeight: "800"
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.subtitle,
    lineHeight: 22
  },
  stack: {
    gap: theme.spacing.lg
  },
  footer: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18
  }
});
