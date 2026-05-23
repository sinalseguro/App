import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandLockup } from "@/components/BrandLockup";
import { AppTopBar } from "@/components/AppTopBar";
import { theme } from "@/design/theme";
import { resolveSafeScreenPresentation } from "@/components/safeScreenPresentationPolicy";

type SafeScreenProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  footer?: string;
  showBrand?: boolean;
  showBack?: boolean;
}>;

export function SafeScreen({ title, subtitle, footer, showBrand = false, showBack = true, children }: SafeScreenProps) {
  const presentation = resolveSafeScreenPresentation({ footer, showBack, showBrand, subtitle });

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppTopBar contextLabel={title} showBack={presentation.showBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          {presentation.shouldRenderBrand ? <BrandLockup /> : null}
          <Text {...presentation.titleTextFit} style={styles.title}>
            {title}
          </Text>
          {presentation.shouldRenderSubtitle ? (
            <Text {...presentation.subtitleTextFit} style={styles.subtitle}>{subtitle}</Text>
          ) : null}
        </View>
        <View style={styles.stack}>{children}</View>
        {presentation.shouldRenderFooter ? (
          <Text {...presentation.footerTextFit} style={styles.footer}>
            {footer}
          </Text>
        ) : null}
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
    gap: theme.spacing.md
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
    fontWeight: "800",
    lineHeight: 36
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.subtitle,
    lineHeight: 26
  },
  stack: {
    gap: theme.spacing.lg
  },
  footer: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 22
  }
});
