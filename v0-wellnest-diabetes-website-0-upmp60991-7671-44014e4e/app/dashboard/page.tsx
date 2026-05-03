 "use client"

import { useAuth } from "@/components/auth-provider"
import { Activity, Zap, MessageCircle, Clock, CheckCircle, Lightbulb, Bot, Power, Leaf, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// NAYA FEATURE: Daily Health Tips Database
const DAILY_TIPS = [
  "Drinking a glass of water before meals can help manage your appetite and blood sugar levels.",
  "A 15-minute brisk walk after dinner significantly reduces blood glucose spikes.",
  "Include more fiber-rich foods like oats, beans, and vegetables to keep your sugar levels stable.",
  "Stress can increase blood sugar. Try 5 minutes of deep breathing today.",
  "Getting 7-8 hours of quality sleep is crucial for insulin sensitivity."
]

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  
  // UI States for Dynamic Greeting and Random Tip
  const [greeting, setGreeting] = useState("Welcome back")
  const [dailyTip, setDailyTip] = useState("")

  useEffect(() => {
    // 1. Authentication Check (Purana Logic - Safe)
    if (!isLoading && !user) {
      router.push("/login")
    }

    // 2. Set Dynamic Greeting based on time
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    // 3. Set Random Daily Tip
    const randomTip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)]
    setDailyTip(randomTip)
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl font-medium text-slate-600 animate-pulse">Loading your dashboard...</div>
      </div>
    )
  }

  // Purane Cards ka Data (Links and logic are untouched)
  const dashboardCards = [
    {
      title: "Health Assessment",
      icon: <Leaf className="w-8 h-8 text-emerald-600" />,
      description: "Complete a 20-question assessment to evaluate your diabetes risk level.",
      bgClass: "bg-gradient-to-br from-emerald-50 to-teal-100/50 border-emerald-200",
      link: "/welcome"
    },
    {
      title: "Your Results",
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      description: "View your risk score, personalized tips, and recommendations.",
      bgClass: "bg-gradient-to-br from-amber-50 to-orange-100/50 border-amber-200",
      link: "/results"
    },
    {
      title: "AI Assistant",
      icon: <MessageCircle className="w-8 h-8 text-indigo-500" />,
      description: "Chat with our AI medical assistant for personalized health guidance.",
      bgClass: "bg-gradient-to-br from-indigo-50 to-blue-100/50 border-indigo-200",
      link: "/dashboard/assistant"
    },
    {
      title: "Health History",
      icon: <Clock className="w-8 h-8 text-rose-500" />,
      description: "Track your assessment results and health progress over time.",
      bgClass: "bg-gradient-to-br from-rose-50 to-pink-100/50 border-rose-200",
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
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans selection:bg-primary/20">
      
      {/* Top Professional Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              WellNest
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user?.full_name}</p>
              <p className="text-xs font-medium text-slate-500">{user?.email}</p>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <Power className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* Welcome Section & NAYA FEATURE (Daily Tip) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          <div className="lg:col-span-2 flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
              {greeting}, <span className="text-primary">{user?.full_name?.split(' ')[0] || "User"}!</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl font-medium leading-relaxed">
              Take control of your diabetes wellness journey today. Track your progress, chat with AI, and stay healthy.
            </p>
          </div>

          {/* NEW FEATURE WIDGET: Daily Wellness Insight */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Daily Wellness Insight</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              "{dailyTip}"
            </p>
          </div>
          
        </div>

        {/* 4 Main Action Cards - Beautiful Hover Effects & Gradients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <Link href={card.link} key={index} className="block group">
              <div className={`p-6 rounded-3xl border ${card.bgClass} h-full space-y-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50 relative overflow-hidden`}>
                
                {/* Decorative background circle */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/40 rounded-full blur-2xl group-hover:bg-white/60 transition-colors"></div>

                <div className="flex items-start justify-between">
                  <div className="p-3 bg-white/80 rounded-2xl shadow-sm backdrop-blur-sm">
                    {card.icon}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrendingUp className="w-4 h-4 text-slate-700" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* Getting Started Section - Modernized */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden mt-8">
          {/* Abstract Background shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-10 text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                How It Works
              </h2>
              <p className="text-slate-400 text-lg font-medium">Your journey to better health in three simple steps.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {gettingStartedSteps.map((step, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-xl">{index + 1}</span>
                    </div>
                    <h4 className="text-xl font-bold text-white">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed pl-16 md:pl-0 font-medium">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}