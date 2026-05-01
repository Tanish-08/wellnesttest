import { ClipboardList, Zap, UserCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: ClipboardList,
    title: "20 Smart Questions",
    description: "Carefully designed questions covering lifestyle, family history, and symptoms to assess your risk accurately.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get your personalized risk assessment immediately after completing the test. No waiting, no delays.",
  },
  {
    icon: UserCheck,
    title: "Personalized Advice",
    description: "Receive tailored recommendations based on your specific risk factors and health profile.",
  },
]

export function FeaturesSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our assessment is designed by health professionals to give you accurate insights about your diabetes risk.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-background border-border hover:shadow-lg transition-shadow duration-300 rounded-2xl"
            >
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
