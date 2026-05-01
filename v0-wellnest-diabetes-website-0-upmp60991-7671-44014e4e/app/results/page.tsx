"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Leaf, Download, RotateCcw, Save, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { calculateRiskLevel, getRecommendations, questions } from "@/lib/questions"
import { CircularProgress } from "@/components/circular-progress"
import { ScoreBreakdown } from "@/components/score-breakdown"

export default function ResultsPage() {
  const [score, setScore] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isAnimating, setIsAnimating] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("wellnest_results")
    if (stored) {
      const { score: storedScore, answers: storedAnswers } = JSON.parse(stored)
      setScore(storedScore)
      setAnswers(storedAnswers)
    }

    if (localStorage.getItem("wellnest_token")) {
      setIsLoggedIn(true)
    }

    // Stop animation after 2 seconds
    const timer = setTimeout(() => setIsAnimating(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (score === null) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border rounded-2xl shadow-xl">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">No Results Found</h1>
            <p className="text-muted-foreground mb-6">
              Please complete the diabetes risk assessment to see your results.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 rounded-xl">
              <Link href="/welcome">Take the Test</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  const riskLevel = calculateRiskLevel(score)
  const recommendations = getRecommendations(score, answers)

  // Calculate section scores
  const riskFactorsScore = Object.entries(answers)
    .filter(([id]) => {
      const q = questions.find((q) => q.id === parseInt(id))
      return q?.section === "risk-factors"
    })
    .reduce((sum, [, value]) => sum + value, 0)

  const symptomsScore = Object.entries(answers)
    .filter(([id]) => {
      const q = questions.find((q) => q.id === parseInt(id))
      return q?.section === "symptoms"
    })
    .reduce((sum, [, value]) => sum + value, 0)

  const maxRiskFactorsScore = 43 // Approximate max for section 1
  const maxSymptomsScore = 48 // Approximate max for section 2

  const handleDownloadPDF = () => {
    // For demo, create a simple text report
    const report = `
WELLNEST DIABETES RISK ASSESSMENT REPORT
==========================================

Date: ${new Date().toLocaleDateString()}

RISK SCORE: ${riskLevel.percentage}%
RISK LEVEL: ${riskLevel.level}

SECTION BREAKDOWN:
- Risk Factors: ${Math.round((riskFactorsScore / maxRiskFactorsScore) * 100)}%
- Symptoms: ${Math.round((symptomsScore / maxSymptomsScore) * 100)}%

PERSONALIZED RECOMMENDATIONS:
${recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

DISCLAIMER:
This assessment is for informational purposes only and does not constitute medical advice.
Please consult a healthcare professional for proper diagnosis and treatment.
    `.trim()

    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "wellnest-diabetes-risk-report.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold text-foreground">Wellnest</span>
        </div>

        {/* Results Card */}
        <Card className="bg-card border-border rounded-2xl shadow-xl mb-6">
          <CardContent className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
              Your Results
            </h1>

            {/* Circular Score Gauge */}
            <div className="flex justify-center mb-8">
              <CircularProgress
                percentage={riskLevel.percentage}
                color={riskLevel.color}
                isAnimating={isAnimating}
              />
            </div>

            {/* Risk Level Badge */}
            <div className="flex justify-center mb-8">
              <span
                className={`px-6 py-2 rounded-full text-lg font-semibold text-white ${riskLevel.bgColor}`}
              >
                {riskLevel.level}
              </span>
            </div>

            {/* Score Breakdown */}
            <ScoreBreakdown
              riskFactorsScore={riskFactorsScore}
              maxRiskFactorsScore={maxRiskFactorsScore}
              symptomsScore={symptomsScore}
              maxSymptomsScore={maxSymptomsScore}
            />
          </CardContent>
        </Card>

        {/* Recommendations Card */}
        <Card className="bg-card border-border rounded-2xl shadow-xl mb-6">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Personalized Recommendations
            </h2>
            <ul className="flex flex-col gap-4">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="flex-1 rounded-xl py-6 text-base"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </Button>
          <Button asChild className="flex-1 bg-primary hover:bg-primary/90 rounded-xl py-6 text-base">
            <Link href="/welcome">
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Test
            </Link>
          </Button>
        </div>

        {/* Save Results Button */}
        {!isLoggedIn && (
          <Card className="bg-secondary/30 border-primary/20 rounded-2xl">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">Want to save your results?</h3>
                <p className="text-sm text-muted-foreground">
                  Create an account to track your progress over time.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-xl whitespace-nowrap">
                <Link href="/register">
                  <Save className="w-4 h-4 mr-2" />
                  Save Results
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <p className="text-center text-sm text-muted-foreground mt-8 px-4">
          <strong>Disclaimer:</strong> This assessment is for informational purposes only and does
          not constitute medical advice. Please consult a healthcare professional for proper
          diagnosis and treatment.
        </p>
      </div>
    </main>
  )
}
