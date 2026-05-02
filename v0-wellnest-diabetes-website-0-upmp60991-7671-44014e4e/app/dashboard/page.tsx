 "use client"

import { useAuth } from "@/components/auth-provider"
import { Activity, Zap, MessageCircle, Clock, CheckCircle, Lightbulb, Bot, Power, Leaf, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
        <div className="text-xl font-medium text-primary">Loading Dashboard...</div>
      </div>
    )
  }

  const dashboardCards = [
    {
      title: "Health Assessment",
      icon: <Leaf className="w-8 h-8 text-sky-500" />,
      description: "Complete a 20-question assessment to evaluate your diabetes risk level",
      color: "border-sky-200",
      link: "/welcome"
    },
    {
      title: "Your Results",
      icon: <Zap className="w-8 h-8 text-emerald-500" />,
      description: "View your risk score, personalized tips, and recommendations",
      color: "border-emerald-200",
      link: "/results"
    },
    {
      title: "AI Assistant",
      icon: <MessageCircle className="w-8 h-8 text-purple-500" />,
      description: "Chat with our AI medical assistant for personalized health guidance",
      color: "border-purple-200",
      link: "/dashboard/assistant"
    },
    {
      title: "History",
      icon: <Clock className="w-8 h-8 text-amber-500" />,
      description: "Track your assessment results and health progress over time",
      color: "border-amber-200",
      link: "/dashboard/history"
    }
  ]

  const gettingStartedSteps = [
    {
      title: "Complete Assessment",
      description: "Answer 20 carefully designed questions about your health, lifestyle, and symptoms to get your personalized risk assessment."
    },
    {
      title: "Get Insights",
      description: "Receive your risk level, personalized diet tips, lifestyle recommendations, and yoga guidance based on your results."
    },
    {
      title: "Chat & Learn",
      description: "Talk to our AI medical assistant for personalized health advice, tips, and answers to your diabetes-related questions."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50/30 pt-24 px-4 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between pb-8 mb-8 border-b border-gray-200 max-w-7xl mx-auto">
        <div className="flex flex-col gap-3">
           {/* Professional Back to Home Button added here */}
           <Link 
             href="/" 
             className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
           >
             <ChevronLeft className="w-4 h-4 mr-1" />
             Back to Home
           </Link>
           
           <h1 className="text-3xl font-bold text-slate-900">
             Welcome back, {user?.full_name?.split(' ')[0] || "User"}!
           </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-foreground">{user?.full_name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-12 pb-16">
        <div>
          <p className="text-lg text-slate-700">
            Take control of your diabetes wellness journey with personalized insights and guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <Link href={card.link} key={index}>
              <div className={`bg-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border ${card.color} h-full space-y-4`}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {card.title}
                  </h3>
                  <div className="flex-shrink-0 pt-1">{card.icon}</div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-sky-50 rounded-2xl p-8 border border-sky-100 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-950 mb-6">
            Getting Started
          </h2>
          <p className="text-slate-600 mb-8">Here's what you can do with WellNest</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gettingStartedSteps.map((step, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-slate-950">
                    {index + 1}. {step.title}
                  </h4>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}