// app/(app)/terms.tsx or wherever you want the screen
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

export default function TermsAndConditionsScreen () {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type='subtitle' font='Poppins-Bold'>HealthTok – Terms & Conditions</ThemedText>

      <Section heading="1. Introduction">
        By using the HealthTok app, you agree to these Terms and Conditions. HealthTok is operated by HealthTok Clinic, a registered company in Nigeria.
      </Section>

      <Section heading="2. Definitions">
        <Bullet text="App: The HealthTok mobile application or website." />
        <Bullet text="Patient: A user seeking medical consultation or services." />
        <Bullet text="Healthcare Provider: A licensed medical professional on the App." />
        <Bullet text="Services: Telemedicine services provided through the App." />
      </Section>

      <Section heading="3. App Usage">
        <Bullet text="Users must be 18 years or older." />
        <Bullet text="Account creation is required to access services." />
        <Bullet text="You are responsible for keeping your login details secure." />
      </Section>

      <Section heading="4. Services">
        <Bullet text="HealthTok enables remote consultations with healthcare providers." />
        <Bullet text="It does not replace in-person medical care." />
        <Bullet text="Providers are independent contractors, not HealthTok employees." />
      </Section>

      <Section heading="5. Patient Responsibilities">
        <Bullet text="Provide accurate, complete medical info." />
        <Bullet text="Follow provider instructions." />
        <Bullet text="Keep your health records updated." />
      </Section>

      <Section heading="6. Healthcare Provider Responsibilities">
        <Bullet text="Deliver professional and competent care." />
        <Bullet text="Maintain patient confidentiality." />
        <Bullet text="Comply with Nigerian medical laws." />
      </Section>

      <Section heading="7. Privacy & Data Protection">
        <Bullet text="Your medical and personal data is protected." />
        <Bullet text="HealthTok complies with Nigeria's data protection laws." />
      </Section>

      <Section heading="8. Payments & Refunds">
        <Bullet text="Payment terms are disclosed during consultations." />
        <Bullet text="Refunds follow our official refund policy." />
      </Section>

      <Section heading="9. Limitation of Liability">
        <Bullet text="HealthTok is not responsible for damages from app use." />
        <Bullet text="The app is not a replacement for emergency or in-person care." />
      </Section>

      <Section heading="10. Governing Law">
        <Bullet text="These Terms are governed by Nigerian law." />
        <Bullet text="Disputes are handled through arbitration." />
      </Section>

      <Section heading="11. Updates to Terms">
        <Bullet text="Terms may change without prior notice." />
        <Bullet text="Updates take effect immediately upon publication." />
      </Section>

      <Section heading="12. Contact">
        For support or questions:
        📧 healthtokclinic2024@gmail.com
      </Section>
    </ScrollView>
  );
}

const Section = ({ heading, children }: { heading: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <ThemedText type='default' font='Poppins-Bold' style={styles.heading}>{heading}</ThemedText>
    <ThemedText type='body' style={styles.body}>{children}</ThemedText>
  </View>
);

const Bullet = ({ text }: { text: string }) => (
  <ThemedText type='body' style={styles.bullet}>{`\u2022`} {text}</ThemedText>
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
