"use client"

import { Progress } from "@/components/ui/progress"

interface ScoreBreakdownProps {
  riskFactorsScore: number
  maxRiskFactorsScore: number
  symptomsScore: number
  maxSymptomsScore: number
}

export function ScoreBreakdown({
  riskFactorsScore,
  maxRiskFactorsScore,
  symptomsScore,
  maxSymptomsScore,
}: ScoreBreakdownProps) {
  const riskFactorsPercentage = Math.round((riskFactorsScore / maxRiskFactorsScore) * 100)
  const symptomsPercentage = Math.round((symptomsScore / maxSymptomsScore) * 100)

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-lg font-semibold text-foreground text-center">Score Breakdown</h3>
      
      <div className="flex flex-col gap-4">
        {/* Risk Factors Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Risk Factors</span>
            <span className="text-sm text-muted-foreground">{riskFactorsPercentage}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${riskFactorsPercentage}%` }}
            />
          </div>
        </div>

        {/* Symptoms Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Symptoms</span>
            <span className="text-sm text-muted-foreground">{symptomsPercentage}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${symptomsPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
