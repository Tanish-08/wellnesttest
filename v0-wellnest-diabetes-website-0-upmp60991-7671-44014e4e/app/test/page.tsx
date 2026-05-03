"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { questions, calculateRiskLevel } from "@/lib/questions"
import { ChevronLeft, ChevronRight, CheckCircle2, Leaf } from "lucide-react"

export default function TestPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleOptionSelect = (score: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: score }))
    
    // Automatically move to next question if it's multiple choice
    if (currentQuestion.type === "multiple-choice" && currentQuestionIndex < questions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 300)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    
    // Calculate final score
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
    
    // Calculate section scores
    const riskFactorsScore = Object.entries(answers)
      .filter(([id]) => questions.find(q => q.id === parseInt(id))?.section === "risk-factors")
      .reduce((sum, [, score]) => sum + score, 0)
    
    const symptomsScore = Object.entries(answers)
      .filter(([id]) => questions.find(q => q.id === parseInt(id))?.section === "symptoms")
      .reduce((sum, [, score]) => sum + score, 0)

    const results = {
      score: totalScore,
      riskFactorsScore,
      symptomsScore,
      answers
    }

    localStorage.setItem("wellnest_results", JSON.stringify(results))
    
    // In a real app, you would also save this to the backend if logged in
    // For now, redirect to results
    router.push("/results")
  }

  const isAnswered = answers[currentQuestion.id] !== undefined

  return (
    <main className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <Leaf className="w-5 h-5 text-white" />
             </div>
             <span className="font-bold text-slate-900">WellNest Assessment</span>
          </div>
          <div className="text-sm font-medium text-slate-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <Progress value={progress} className="h-2 rounded-full" />
        </div>

        {/* Question Card */}
        <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardContent className="p-8 sm:p-10">
            <div className="mb-2">
               <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                 {currentQuestion.section.replace('-', ' ')}
               </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8 leading-tight">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === "multiple-choice" ? (
              <div className="grid gap-4">
                {currentQuestion.options?.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option.score)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all duration-200 group ${
                      answers[currentQuestion.id] === option.score
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`font-semibold ${
                      answers[currentQuestion.id] === option.score ? "text-primary" : "text-slate-700"
                    }`}>
                      {option.label}
                    </span>
                    {answers[currentQuestion.id] === option.score && (
                      <CheckCircle2 className="w-6 h-6 text-primary fill-primary/10" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-10 py-4">
                <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-wider">
                  <span>{currentQuestion.scaleLabels?.left}</span>
                  <span>{currentQuestion.scaleLabels?.right}</span>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {currentQuestion.scaleRange?.map((val) => (
                    <button
                      key={val}
                      onClick={() => handleOptionSelect(val)}
                      className={`h-14 sm:h-16 rounded-2xl border-2 font-bold text-lg transition-all ${
                        answers[currentQuestion.id] === val
                          ? "border-primary bg-primary text-white shadow-lg shadow-primary/25"
                          : "border-slate-100 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="rounded-xl px-6 h-12 font-bold text-slate-600"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isAnswered || isSubmitting}
            className="rounded-xl px-8 h-12 font-bold bg-slate-900 hover:bg-slate-800 text-white"
          >
            {currentQuestionIndex === questions.length - 1 ? (
              isSubmitting ? "Calculating..." : "Finish Test"
            ) : (
              <>
                Next Question
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}
