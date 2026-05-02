 "use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Leaf, Clock, Activity, AlertCircle, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { apiUrl } from "@/lib/api"
import { calculateRiskLevel } from "@/lib/questions"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

interface Assessment {
  id: string
  user_id: string
  total_score: number
  risk_factors_score: number
  symptoms_score: number
  created_at: string
}

export default function HistoryInsideDashboardPage() {
  const { user, token, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (token) {
      fetchHistory()
    }
  }, [user, token, authLoading, router])

  const fetchHistory = async () => {
    try {
      const res = await fetch(apiUrl("/assessments/"), {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (!res.ok) {
        throw new Error("Failed to fetch assessment history")
      }
      const data = await res.json()
      setAssessments(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header - Changed Back link to go to /dashboard */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold text-foreground hidden sm:inline">Wellnest</span>
          </div>
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/dashboard">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Assessment History</h1>
          <p className="text-muted-foreground">Track your diabetes risk over time to stay on top of your health.</p>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-destructive bg-destructive/10 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {assessments.length === 0 && !error ? (
          <Card className="bg-card border-border rounded-2xl shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No history yet</h2>
              <p className="text-muted-foreground mb-6">You haven't taken any diabetes risk assessments yet.</p>
              <Button asChild className="bg-primary hover:bg-primary/90 rounded-xl">
                <Link href="/welcome">Take your first test</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => {
              const riskLevel = calculateRiskLevel(assessment.total_score)
              const date = new Date(assessment.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })

              return (
                <Card key={assessment.id} className="bg-card border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${riskLevel.bgColor} text-white`}>
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {riskLevel.level} Risk
                          <span className={`text-xs px-2 py-0.5 rounded-full ${riskLevel.bgColor} bg-opacity-20 text-${riskLevel.color.replace('text-', '')}`}>
                            {assessment.total_score} pts
                          </span>
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          {date}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}