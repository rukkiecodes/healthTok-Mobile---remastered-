import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { ThemedText } from './ThemedText';

export default function Privacy () {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type='subtitle' font='Poppins-Bold'>HealthTok – Privacy Policy</ThemedText>

      <Section heading="1. Introduction">
        At HealthTok, we prioritize the confidentiality, integrity, and security of your personal and medical information. This Privacy Policy outlines how we protect your data under Nigerian law, including the NDPR and the National Health Act.
      </Section>

      <Section heading="2. Scope">
        This Privacy Policy applies to all users of the HealthTok platform—patients, healthcare providers, and authorized personnel.
      </Section>

      <Section heading="3. Information We Collect">
        <Bullet text="Personally identifiable information (e.g., name, email, phone number)" />
        <Bullet text="Medical data (e.g., history, symptoms, diagnoses, treatment plans)" />
        <Bullet text="Payment details (for paid services)" />
        <Bullet text="Device and usage data (e.g., IP address, browser type)" />
      </Section>

      <Section heading="4. Purpose of Data Collection">
        <Bullet text="To deliver telemedicine services" />
        <Bullet text="To improve the app’s functionality and user experience" />
        <Bullet text="To respond to user inquiries and requests" />
        <Bullet text="To comply with Nigerian legal and regulatory requirements" />
      </Section>

      <Section heading="5. Disclosure of Your Information">
        <Bullet text="With authorized healthcare providers for consultations" />
        <Bullet text="With third-party providers for payments, maintenance, and analytics" />
        <Bullet text="With regulatory or law enforcement agencies when legally required" />
      </Section>

      <Section heading="6. Data Protection Measures">
        <Bullet text="Encryption of sensitive data" />
        <Bullet text="Secure servers and protected databases" />
        <Bullet text="Strict access controls and authentication" />
        <Bullet text="Regular security audits and updates" />
      </Section>

      <Section heading="7. Your Rights">
        <Bullet text="Access and update your personal or medical data" />
        <Bullet text="Request deletion of your data, subject to legal obligations" />
        <Bullet text="Opt out of marketing communications" />
        <Bullet text="Lodge a complaint with the Nigeria Data Protection Bureau" />
      </Section>

      <Section heading="8. Data Retention">
        We retain your data only as long as necessary to provide services, fulfill legal obligations, or resolve disputes.
      </Section>

      <Section heading="9. Policy Updates">
        We may update this Privacy Policy at any time. Changes are effective immediately and users will be notified of any major updates.
      </Section>

      <Section heading="10. Contact Us">
        For any questions or concerns, email us at:
        📧 healthtokclinic2024@gmail.com
      </Section>

      <Section heading="11. Governing Law">
        This Privacy Policy is governed by Nigerian law, including the NDPR and the National Health Act.
      </Section>

      <ThemedText type='body' font='Poppins-Medium' opacity={0.6}>
        By using HealthTok, you confirm that you’ve read, understood, and agree to this Privacy Policy.
      </ThemedText>
    </ScrollView>
  )
}

const Section = ({ heading, children }: { heading: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <ThemedText type='default' font='Poppins-Bold' style={styles.heading}>{heading}</ThemedText>
    <ThemedText type='body' style={styles.body}>{children}</ThemedText>
  </View>
);

const Bullet = ({ text }: { text: string }) => (
  <ThemedText type='body' style={styles.bullet}>{'\u2022'} {text}</ThemedText>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    marginBottom: 6,
  },
  body: {
    lineHeight: 20,
  },
  bullet: {
    lineHeight: 20,
    marginLeft: 10,
  },
});