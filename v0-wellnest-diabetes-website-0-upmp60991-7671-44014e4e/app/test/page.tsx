"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Leaf, X, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { questions } from "@/lib/questions"

const motivationalMessages = [
  { at: 5, message: "Great progress! Keep going!" },
  { at: 10, message: "Halfway there! You are doing great!" },
  { at: 15, message: "Almost done! Just 5 more questions!" },
]

interface Answer {
  score: number
  selectedValue: string | number
}

export default function TestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, Answer>>({})
  const [showMotivation, setShowMotivation] = useState<string | null>(null)

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isAnswered = answers[question.id] !== undefined

  useEffect(() => {
    const msg = motivationalMessages.find((m) => m.at === currentQuestion + 1)
    if (msg && currentQuestion > 0) {
      setShowMotivation(msg.message)
      const timer = setTimeout(() => setShowMotivation(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [currentQuestion])

  const handleMultipleChoiceAnswer = (value: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: { score, selectedValue: value } }))
  }

  const handleScaleAnswer = (value: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: { score: value, selectedValue: value } }))
  }

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      const totalScore = Object.values(answers).reduce((sum, answer) => sum + answer.score, 0)
      const answerScores = Object.fromEntries(
        Object.entries(answers).map(([key, val]) => [key, val.score])
      )
      
      const token = localStorage.getItem("wellnest_token")
      if (token) {
        // Calculate section scores
        const riskFactorsScore = Object.entries(answerScores)
          .filter(([id]) => questions.find((q) => q.id === parseInt(id))?.section === "risk-factors")
          .reduce((sum, [, value]) => sum + value, 0)
          
        const symptomsScore = Object.entries(answerScores)
          .filter(([id]) => questions.find((q) => q.id === parseInt(id))?.section === "symptoms")
          .reduce((sum, [, value]) => sum + value, 0)

        try {
          await fetch(apiUrl("/assessments/"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              total_score: totalScore,
              risk_factors_score: riskFactorsScore,
              symptoms_score: symptomsScore,
              answers: answerScores
            })
          })
        } catch (error) {
          console.error("Failed to save assessment to backend", error)
        }
      }

      localStorage.setItem("wellnest_results", JSON.stringify({ score: totalScore, answers: answerScores }))
      router.push("/results")
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col overflow-y-auto">
      {/* Top Bar */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground hidden sm:inline">Wellnest</span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-destructive"
          >
            <Link href="/">
              <X className="w-4 h-4 mr-1" />
              Exit
            </Link>
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card px-4 py-2 border-b border-border">
        <div className="max-w-3xl mx-auto">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {Math.round(progress)}% complete
          </p>
        </div>
      </div>

      {/* Motivational Message */}
      {showMotivation && (
        <div className="bg-primary/10 text-primary px-4 py-2 text-center text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          {showMotivation}
        </div>
      )}

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card border-border rounded-2xl shadow-lg">
          <CardContent className="p-5 sm:p-6">
            {/* Section Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  question.section === "risk-factors"
                    ? "bg-primary/10 text-primary"
                    : "bg-purple-500/10 text-purple-600"
                }`}
              >
                {question.section === "risk-factors" ? "Risk Factors" : "Symptoms"}
              </span>
              <span className="text-xs text-muted-foreground">
                Q{question.id} of {questions.length}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-6 leading-relaxed">
              {question.question}
            </h2>

            {/* Multiple Choice Options */}
            {question.type === "multiple-choice" && question.options && (
              <div className="flex flex-col gap-2">
                {question.options.map((option) => {
                  const isSelected = answers[question.id]?.selectedValue === option.value
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleMultipleChoiceAnswer(option.value, option.score)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 bg-card"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-semibold ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : option.value}
                      </div>
                      <span className="text-sm text-foreground">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Scale Options */}
            {question.type === "scale" && question.scaleRange && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-2 sm:gap-3">
                  {question.scaleRange.map((value) => {
                    const isSelected = answers[question.id]?.selectedValue === value
                    return (
                      <button
                        key={value}
                        onClick={() => handleScaleAnswer(value)}
                        className={`flex-1 aspect-square max-w-14 rounded-xl border-2 flex items-center justify-center text-lg font-semibold transition-all duration-200 ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground scale-110"
                            : "border-border hover:border-primary/50 bg-card text-foreground"
                        }`}
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>{question.scaleLabels?.left}</span>
                  <span>{question.scaleLabels?.right}</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 gap-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className="rounded-xl px-5"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isAnswered}
                className="bg-primary hover:bg-primary/90 rounded-xl px-5"
              >
                {currentQuestion === questions.length - 1 ? "Results" : "Next"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
