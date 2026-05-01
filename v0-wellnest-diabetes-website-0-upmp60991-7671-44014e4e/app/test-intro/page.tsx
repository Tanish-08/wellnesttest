import Link from "next/link"
import { Leaf, Activity, Stethoscope, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TestIntroPage() {
  return (
    <main className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-lg relative bg-card border-border rounded-2xl shadow-xl">
        <CardContent className="p-8 sm:p-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold text-foreground">Wellnest</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Starting your Diabetes Risk Test
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              You will be asked 20 questions across 2 sections — Risk Factors and Symptoms. 
              Answer honestly for the most accurate result.
            </p>
          </div>

          {/* Section Preview Cards */}
          <div className="flex flex-col gap-4 mb-8">
            <Card className="bg-secondary/50 border-primary/20 rounded-xl">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">Section 1: Risk Factors</h3>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                      Q1-10
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lifestyle, age, family history, and health conditions
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/50 border-purple-500/20 rounded-xl">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">Section 2: Symptoms</h3>
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 text-xs rounded-full font-medium">
                      Q11-20
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Physical signs and symptoms you may experience
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estimated Time */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
            <Clock className="w-5 h-5" />
            <span>Estimated time: 2-3 minutes</span>
          </div>

          {/* CTA Button */}
          <Button asChild className="w-full bg-primary hover:bg-primary/90 rounded-xl py-6 text-lg font-semibold">
            <Link href="/test">Begin Test</Link>
          </Button>

          {/* Back Link */}
          <p className="text-center mt-6">
            <Link href="/welcome" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Go back
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
