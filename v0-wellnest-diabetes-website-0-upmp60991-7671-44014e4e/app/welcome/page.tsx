 "use client"

import Link from "next/link"
import { Leaf, ClipboardList, Gift, UserX, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export default function WelcomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/50 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-lg relative bg-card border-border rounded-2xl shadow-xl">
        <CardContent className="p-8 sm:p-10">
          
          {/* Dashboard Button (if logged in) */}
          {user && (
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
            >
              <Link href="/dashboard">
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Dashboard
              </Link>
            </Button>
          )}

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold text-foreground">Wellnest</span>
          </div>

          {/* Greeting */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {user ? `Hello, ${user.full_name.split(' ')[0]}!` : "Hello! Let's check your diabetes risk."}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              This test takes about 3 minutes. {"We'll"} ask you 20 personalized questions about your 
              lifestyle, health history, and symptoms.
            </p>
          </div>

          {/* Info Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
              <ClipboardList className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-secondary-foreground">20 Questions</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-secondary-foreground">100% Free</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
              <UserX className={`w-4 h-4 ${user ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium text-secondary-foreground">
                {user ? "Logged In" : "Login Recommended"}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 rounded-xl py-6 text-lg font-semibold">
              <Link href="/test-intro">Start the Test</Link>
            </Button>
            
            {user && (
              <Button asChild variant="outline" className="w-full rounded-xl py-6 text-lg font-semibold">
                <Link href="/dashboard/history">View Past Results</Link>
              </Button>
            )}
          </div>

          {!user && (
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Login to save your results
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}