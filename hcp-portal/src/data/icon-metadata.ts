/**
 * Medical Icon Pack Metadata
 * 
 * Comprehensive metadata for all medical icons including:
 * - Accessibility information
 * - Usage recommendations
 * - Color tokens
 * - Size recommendations
 */

export const iconMetadata = {
  name: "carecrew-medical-icons",
  version: "1.0.0",
  author: "Care Crew Team",
  license: "MIT",
  description: "Comprehensive medical icon pack for healthcare applications",
  colors: {
    primary: "#0A84FF",
    secondary: "#34C759",
    accent: "#5E5CE6",
    error: "#FF3B30",
    base: "#E8F4FF",
    accentNeon: "#00D9FF"
  },
  icons: [
    {
      id: "hospital",
      filename: "hospital.svg",
      title: "Hospital",
      alt_text: "Hospital building icon",
      short_description: "Medical facility building",
      categories: ["ui", "hero", "facilities"],
      recommended_sizes: ["16", "24", "32", "48"],
      tags: ["hospital", "building", "facility", "medical", "care"],
      aria_label: "Hospital building",
      description: "Hospital building icon representing medical facility"
    },
    {
      id: "doctor",
      filename: "doctor.svg",
      title: "Doctor",
      alt_text: "Doctor profile icon",
      short_description: "Healthcare professional profile",
      categories: ["ui", "hero", "feature"],
      recommended_sizes: ["16", "24", "32", "48"],
      tags: ["doctor", "physician", "profile", "professional", "medical"],
      aria_label: "Doctor profile",
      description: "Doctor profile icon representing healthcare professional"
    },
    {
      id: "stethoscope",
      filename: "stethoscope.svg",
      title: "Stethoscope",
      alt_text: "Stethoscope medical tool icon",
      short_description: "Medical examination instrument",
      categories: ["ui", "hero", "feature"],
      recommended_sizes: ["16", "24", "32", "48"],
      tags: ["stethoscope", "examination", "diagnosis", "medical", "tool"],
      aria_label: "Stethoscope medical tool",
      description: "Stethoscope icon for medical consultations"
    },
    {
      id: "appointment",
      filename: "appointment.svg",
      title: "Appointment",
      alt_text: "Appointment calendar icon",
      short_description: "Schedule medical visit",
      categories: ["ui", "hero", "feature"],
      recommended_sizes: ["16", "24", "32", "48"],
      tags: ["appointment", "calendar", "schedule", "booking", "visit"],
      aria_label: "Schedule appointment",
      description: "Appointment calendar icon for scheduling"
    },
    {
      id: "pill",
      filename: "pill.svg",
      title: "Pill",
      alt_text: "Pill medication icon",
      short_description: "Prescription medicine capsule",
      categories: ["ui", "feature"],
      recommended_sizes: ["16", "24", "32"],
      tags: ["pill", "medication", "prescription", "medicine", "drug"],
      aria_label: "Pill medication",
      description: "Pill capsule icon for medications"
    },
    {
      id: "syringe",
      filename: "syringe.svg",
      title: "Syringe",
      alt_text: "Syringe injection icon",
      short_description: "Medical injection device",
      categories: ["ui", "feature", "emergency"],
      recommended_sizes: ["16", "24", "32"],
      tags: ["syringe", "injection", "vaccine", "medical", "needle"],
      aria_label: "Syringe injection",
      description: "Syringe icon for vaccinations and injections"
    },
    {
      id: "ambulance",
      filename: "ambulance.svg",
      title: "Ambulance",
      alt_text: "Ambulance vehicle icon",
      short_description: "Emergency medical transport",
      categories: ["ui", "hero", "emergency"],
      recommended_sizes: ["24", "32", "48"],
      tags: ["ambulance", "emergency", "transport", "medical", "urgent"],
      aria_label: "Ambulance emergency transport",
      description: "Ambulance icon for emergency services"
    },
    {
      id: "wheelchair",
      filename: "wheelchair.svg",
      title: "Wheelchair",
      alt_text: "Wheelchair accessibility icon",
      short_description: "Accessibility and mobility aid",
      categories: ["ui", "feature"],
      recommended_sizes: ["16", "24", "32"],
      tags: ["wheelchair", "accessibility", "mobility", "disabled", "aid"],
      aria_label: "Wheelchair accessibility",
      description: "Wheelchair icon for accessibility services"
    },
    {
      id: "bed",
      filename: "bed.svg",
      title: "Hospital Bed",
      alt_text: "Hospital bed icon",
      short_description: "Inpatient care facility",
      categories: ["ui", "feature"],
      recommended_sizes: ["16", "24", "32"],
      tags: ["bed", "hospital", "admission", "inpatient", "care"],
      aria_label: "Hospital bed",
      description: "Hospital bed icon for inpatient care"
    },
    {
      id: "surgery",
      filename: "surgery.svg",
      title: "Surgery",
      alt_text: "Surgery scalpel icon",
      short_description: "Surgical procedure",
      categories: ["ui", "feature"],
      recommended_sizes: ["24", "32"],
      tags: ["surgery", "scalpel", "operation", "surgical", "procedure"],
      aria_label: "Surgery procedure",
      description: "Surgery scalpel icon for surgical procedures"
    },
    {
      id: "ecg",
      filename: "ecg.svg",
      title: "ECG",
      alt_text: "ECG heartbeat icon",
      short_description: "Heart rate monitoring",
      categories: ["ui", "hero", "feature"],
      recommended_sizes: ["16", "24", "32", "48"],
      tags: ["ecg", "heartbeat", "cardiac", "monitoring", "vitals"],
      aria_label: "ECG heart rate monitoring",
      description: "ECG waveform icon for heart monitoring"
    },
    {
      id: "lab",
      filename: "lab.svg",
      title: "Lab",
      alt_text: "Laboratory microscope icon",
      short_description: "Medical testing facility",
      categories: ["ui", "feature"],
      recommended_sizes: ["16", "24", "32"],
      tags: ["lab", "laboratory", "microscope", "testing", "diagnosis"],
      aria_label: "Laboratory testing",
      description: "Laboratory microscope icon for testing"
    },
    {
      id: "telehealth",
      filename: "telehealth.svg",
      title: "Telehealth",
      alt_text: "Telehealth video call icon",
      short_description: "Remote medical consultation",
      categories: ["ui", "hero", "feature"],
      recommended_sizes: ["24", "32", "48"],
      tags: ["telehealth", "video", "remote", "consultation", "telemedicine"],
      aria_label: "Telehealth video consultation",
      description: "Telehealth icon for remote consultations"
    },
    {
      id: "chat",
      filename: "chat.svg",
      title: "Chat",
      alt_text: "Chat message icon",
      short_description: "Medical support communication",
      categories: ["ui", "feature"],
      recommended_sizes: ["16", "24", "32"],
      tags: ["chat", "message", "support", "communication", "help"],
      aria_label: "Medical support chat",
      description: "Chat icon for medical support"
    },
    {
      id: "insurance",
      filename: "insurance.svg",
      title: "Insurance",
      alt_text: "Insurance shield icon",
      short_description: "Health coverage protection",
      categories: ["ui", "hero", "feature"],
      recommended_sizes: ["16", "24", "32", "48"],
      tags: ["insurance", "shield", "protection", "coverage", "health"],
      aria_label: "Health insurance protection",
      description: "Insurance shield icon for coverage"
    },
    {
      id: "blood",
      filename: "blood.svg",
      title: "Blood",
      alt_text: "Blood drop icon",
      short_description: "Blood test and donation",
      categories: ["ui", "feature"],
      recommended_sizes: ["16", "24", "32"],
      tags: ["blood", "test", "donation", "lab", "medical"],
      aria_label: "Blood test",
      description: "Blood drop icon for blood tests"
    },
    {
      id: "oxygen",
      filename: "oxygen.svg",
      title: "Oxygen",
      alt_text: "Oxygen mask icon",
      short_description: "Respiratory therapy",
      categories: ["ui", "feature", "emergency"],
      recommended_sizes: ["16", "24", "32"],
      tags: ["oxygen", "mask", "respiratory", "therapy", "breathing"],
      aria_label: "Oxygen therapy",
      description: "Oxygen mask icon for respiratory care"
    },
    {
      id: "iv",
      filename: "iv.svg",
      title: "IV",
      alt_text: "IV drip icon",
      short_description: "Intravenous infusion therapy",
      categories: ["ui", "feature"],
      recommended_sizes: ["16", "24", "32"],
      tags: ["iv", "drip", "infusion", "therapy", "medical"],
      aria_label: "IV infusion therapy",
      description: "IV drip icon for infusion therapy"
    },
    {
      id: "pharmacy",
      filename: "pharmacy.svg",
      title: "Pharmacy",
      alt_text: "Pharmacy mortar and pestle icon",
      short_description: "Medication dispensing",
      categories: ["ui", "feature"],
      recommended_sizes: ["16", "24", "32"],
      tags: ["pharmacy", "medication", "dispensing", "prescription", "drug"],
      aria_label: "Pharmacy medication",
      description: "Pharmacy icon for medication dispensing"
    },
    {
      id: "ar-scan",
      filename: "ar-scan.svg",
      title: "AR Scan",
      alt_text: "AR scan icon",
      short_description: "Augmented reality body scanning",
      categories: ["ui", "hero", "feature"],
      recommended_sizes: ["24", "32", "48"],
      tags: ["ar", "scan", "augmented", "reality", "body"],
      aria_label: "AR body scan",
      description: "AR scan icon for body scanning"
    }
  ],
  categories: {
    ui: "User interface icons for navigation and controls",
    hero: "Large format icons for hero sections",
    feature: "Feature card icons",
    emergency: "Emergency and urgent care icons",
    facilities: "Hospital and facility icons"
  },
  usage: {
    sizes: {
      small: "16px - Navigation, inline text",
      medium: "24px - Default UI icons",
      large: "32px - Feature cards, buttons",
      xlarge: "48px - Hero sections, badges"
    },
    colors: {
      primary: "Use for primary actions and brand elements",
      secondary: "Use for secondary actions and health-related features",
      accent: "Use for highlighting and special features",
      error: "Use for emergency and urgent items",
      currentColor: "Use with Tailwind text-* classes for flexibility"
    }
  }
}

export default iconMetadata

