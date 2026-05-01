export type QuestionType = "multiple-choice" | "scale"

export interface Option {
  label: string
  value: string
  score: number
}

export interface Question {
  id: number
  section: "risk-factors" | "symptoms"
  type: QuestionType
  question: string
  options?: Option[]
  scaleLabels?: {
    left: string
    right: string
  }
  scaleRange?: number[]
}

export const questions: Question[] = [
  // Section 1 — Risk Factors (Q1-Q10)
  {
    id: 1,
    section: "risk-factors",
    type: "multiple-choice",
    question: "How old are you?",
    options: [
      { label: "Under 18 years old", value: "A", score: 0 },
      { label: "18–30 years", value: "B", score: 1 },
      { label: "31–45 years", value: "C", score: 2 },
      { label: "46–60 years", value: "D", score: 4 },
      { label: "Above 60 years", value: "E", score: 6 },
    ],
  },
  {
    id: 2,
    section: "risk-factors",
    type: "multiple-choice",
    question: "Does diabetes run in your family?",
    options: [
      { label: "No family history", value: "A", score: 0 },
      { label: "Distant relative (grandparent/uncle/aunt)", value: "B", score: 2 },
      { label: "One parent or one sibling", value: "C", score: 4 },
      { label: "Both parents or multiple siblings", value: "D", score: 7 },
      { label: "Not sure", value: "E", score: 2 },
    ],
  },
  {
    id: 3,
    section: "risk-factors",
    type: "multiple-choice",
    question: "How would you describe your body weight?",
    options: [
      { label: "Underweight (BMI below 18.5)", value: "A", score: 1 },
      { label: "Normal weight (BMI 18.5–24.9)", value: "B", score: 0 },
      { label: "Slightly overweight (BMI 25–29.9)", value: "C", score: 3 },
      { label: "Obese (BMI 30–39.9)", value: "D", score: 5 },
      { label: "Severely obese (BMI 40+)", value: "E", score: 6 },
    ],
  },
  {
    id: 4,
    section: "risk-factors",
    type: "multiple-choice",
    question: "How physically active are you?",
    options: [
      { label: "Very active — exercise daily or physical job", value: "A", score: 0 },
      { label: "Moderately active — 3 to 4 days/week", value: "B", score: 1 },
      { label: "Lightly active — 1 to 2 days/week", value: "C", score: 3 },
      { label: "Sedentary — mostly sitting, no regular exercise", value: "D", score: 5 },
    ],
  },
  {
    id: 5,
    section: "risk-factors",
    type: "multiple-choice",
    question: "How would you describe your typical daily diet?",
    options: [
      { label: "Mostly vegetables, whole grains, lean protein, low sugar", value: "A", score: 0 },
      { label: "Balanced with occasional treats", value: "B", score: 1 },
      { label: "Frequent fast food, white rice/bread, sugary snacks", value: "C", score: 3 },
      { label: "Daily soft drinks, sweets, heavily processed food", value: "D", score: 5 },
    ],
  },
  {
    id: 6,
    section: "risk-factors",
    type: "multiple-choice",
    question: "What is your blood pressure status?",
    options: [
      { label: "Normal (below 120/80 mmHg)", value: "A", score: 0 },
      { label: "Slightly elevated / borderline", value: "B", score: 2 },
      { label: "High blood pressure (diagnosed hypertension)", value: "C", score: 4 },
      { label: "On medication for blood pressure", value: "D", score: 3 },
      { label: "Never checked / not sure", value: "E", score: 1 },
    ],
  },
  {
    id: 7,
    section: "risk-factors",
    type: "scale",
    question: "How would you rate the size of your belly/waist area?",
    scaleLabels: {
      left: "Very slim",
      right: "Very large belly",
    },
    scaleRange: [0, 1, 2, 3],
  },
  {
    id: 8,
    section: "risk-factors",
    type: "multiple-choice",
    question: "Have you ever had a blood sugar test?",
    options: [
      { label: "Never tested", value: "A", score: 1 },
      { label: "Tested — result was normal", value: "B", score: 0 },
      { label: "Tested — was told it was borderline high", value: "C", score: 3 },
      { label: "Tested — was told it was high (pre-diabetic)", value: "D", score: 5 },
      { label: "Diagnosed diabetic before", value: "E", score: 5 },
    ],
  },
  {
    id: 9,
    section: "risk-factors",
    type: "multiple-choice",
    question: "For women: Did you ever have gestational diabetes or deliver a baby over 4 kg?",
    options: [
      { label: "Not applicable (male or never pregnant)", value: "A", score: 0 },
      { label: "Pregnant but no gestational diabetes", value: "B", score: 0 },
      { label: "Baby was over 4 kg (9 lbs)", value: "C", score: 2 },
      { label: "Diagnosed with gestational diabetes", value: "D", score: 4 },
      { label: "Both of the above", value: "E", score: 4 },
    ],
  },
  {
    id: 10,
    section: "risk-factors",
    type: "multiple-choice",
    question: "How would you describe your stress levels and sleep quality?",
    options: [
      { label: "Low stress, sleep 7–9 hrs comfortably", value: "A", score: 0 },
      { label: "Mild stress, sleep around 6–7 hrs", value: "B", score: 1 },
      { label: "Moderate stress, often sleep less than 6 hrs", value: "C", score: 2 },
      { label: "Chronic high stress, poor sleep almost daily", value: "D", score: 4 },
      { label: "Severely stressed, barely sleeping", value: "E", score: 4 },
    ],
  },
  // Section 2 — Symptoms (Q11-Q20)
  {
    id: 11,
    section: "symptoms",
    type: "scale",
    question: "How often do you feel extremely thirsty even after drinking water?",
    scaleLabels: {
      left: "Never",
      right: "Almost always",
    },
    scaleRange: [0, 1, 2, 3, 4],
  },
  {
    id: 12,
    section: "symptoms",
    type: "scale",
    question: "How often do you urinate more frequently than usual, especially at night?",
    scaleLabels: {
      left: "Never",
      right: "Almost always",
    },
    scaleRange: [0, 1, 2, 3, 4],
  },
  {
    id: 13,
    section: "symptoms",
    type: "multiple-choice",
    question: "How would you describe your energy levels throughout the day?",
    options: [
      { label: "Always energetic and fresh", value: "A", score: 0 },
      { label: "Occasionally tired after heavy work", value: "B", score: 1 },
      { label: "Frequently tired even without much effort", value: "C", score: 3 },
      { label: "Exhausted most of the day, even after rest", value: "D", score: 5 },
    ],
  },
  {
    id: 14,
    section: "symptoms",
    type: "multiple-choice",
    question: "Have you noticed any changes in your vision lately?",
    options: [
      { label: "No changes, vision is clear", value: "A", score: 0 },
      { label: "Mild blurriness occasionally", value: "B", score: 1 },
      { label: "Frequent blurry or fluctuating vision", value: "C", score: 3 },
      { label: "Persistent blurry vision, things look hazy often", value: "D", score: 4 },
    ],
  },
  {
    id: 15,
    section: "symptoms",
    type: "multiple-choice",
    question: "How does your body heal when you get a small cut or wound?",
    options: [
      { label: "Heals quickly within 2–3 days", value: "A", score: 0 },
      { label: "Takes about a week — slightly slow", value: "B", score: 1 },
      { label: "Takes 2+ weeks, noticeably slow", value: "C", score: 3 },
      { label: "Very slow healing, sometimes gets infected", value: "D", score: 4 },
    ],
  },
  {
    id: 16,
    section: "symptoms",
    type: "scale",
    question: "Do you experience tingling, numbness, or burning in hands or feet?",
    scaleLabels: {
      left: "Never",
      right: "Frequently",
    },
    scaleRange: [0, 1, 2, 3, 4],
  },
  {
    id: 17,
    section: "symptoms",
    type: "multiple-choice",
    question: "How often do you suffer from infections (skin, UTI, gum, thrush)?",
    options: [
      { label: "Rarely or never", value: "A", score: 0 },
      { label: "Once or twice a year", value: "B", score: 1 },
      { label: "Several times a year", value: "C", score: 3 },
      { label: "Very frequently, almost recurring", value: "D", score: 4 },
    ],
  },
  {
    id: 18,
    section: "symptoms",
    type: "multiple-choice",
    question: "Have you noticed any unexplained weight loss recently?",
    options: [
      { label: "No, my weight is stable", value: "A", score: 0 },
      { label: "Lost a little weight, not sure why", value: "B", score: 1 },
      { label: "Noticeable weight loss over past few months", value: "C", score: 2 },
      { label: "Significant rapid weight loss", value: "D", score: 3 },
    ],
  },
  {
    id: 19,
    section: "symptoms",
    type: "scale",
    question: "How often do you feel unusually hungry even shortly after a full meal?",
    scaleLabels: {
      left: "Never",
      right: "Almost always",
    },
    scaleRange: [0, 1, 2, 3, 4],
  },
  {
    id: 20,
    section: "symptoms",
    type: "multiple-choice",
    question: "Do you notice dark, velvety patches of skin on neck, armpits, groin, or knuckles?",
    options: [
      { label: "No, my skin looks normal", value: "A", score: 0 },
      { label: "Not sure, maybe slightly darker", value: "B", score: 1 },
      { label: "Yes, I've noticed darker patches", value: "C", score: 2 },
      { label: "Yes, confirmed by doctor as Acanthosis Nigricans", value: "D", score: 3 },
    ],
  },
]

export const MAX_SCORE = 91

export function calculateRiskLevel(score: number): {
  percentage: number
  level: string
  color: string
  bgColor: string
} {
  const percentage = Math.round((score / MAX_SCORE) * 100)

  if (percentage <= 20) {
    return { percentage, level: "Low Risk", color: "#22C55E", bgColor: "bg-green-500" }
  } else if (percentage <= 45) {
    return { percentage, level: "Moderate Risk", color: "#F59E0B", bgColor: "bg-amber-500" }
  } else if (percentage <= 65) {
    return { percentage, level: "High Risk", color: "#F97316", bgColor: "bg-orange-500" }
  } else {
    return { percentage, level: "Very High Risk", color: "#EF4444", bgColor: "bg-red-500" }
  }
}

export function getRecommendations(score: number, answers: Record<number, number>): string[] {
  const recommendations: string[] = []
  const riskLevel = calculateRiskLevel(score)

  // General recommendations based on risk level
  if (riskLevel.percentage <= 20) {
    recommendations.push("Great job! Continue maintaining your healthy lifestyle.")
    recommendations.push("Keep up regular physical activity and balanced diet.")
    recommendations.push("Schedule routine health check-ups annually.")
  } else if (riskLevel.percentage <= 45) {
    recommendations.push("Consider increasing your physical activity to at least 150 minutes per week.")
    recommendations.push("Focus on reducing processed foods and sugary drinks.")
    recommendations.push("Monitor your blood sugar levels periodically.")
    recommendations.push("Consult a healthcare provider for personalized advice.")
  } else if (riskLevel.percentage <= 65) {
    recommendations.push("Schedule an appointment with your doctor for a comprehensive evaluation.")
    recommendations.push("Consider consulting a nutritionist for a personalized diet plan.")
    recommendations.push("Aim for at least 30 minutes of moderate exercise daily.")
    recommendations.push("Monitor your blood pressure and blood sugar regularly.")
    recommendations.push("Reduce stress through meditation or relaxation techniques.")
  } else {
    recommendations.push("Please consult a healthcare professional immediately.")
    recommendations.push("Get a comprehensive blood test including HbA1c and fasting glucose.")
    recommendations.push("Work with a dietitian to create a diabetes-prevention meal plan.")
    recommendations.push("Start a supervised exercise program if not already active.")
    recommendations.push("Monitor your health indicators closely and regularly.")
    recommendations.push("Consider joining a diabetes prevention program.")
  }

  return recommendations
}
