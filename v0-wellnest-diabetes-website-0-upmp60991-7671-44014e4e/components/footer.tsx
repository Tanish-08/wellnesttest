import Link from "next/link"
import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Wellnest</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-background/70">
            <Link href="/" className="hover:text-background transition-colors">
              Home
            </Link>
            <Link href="#about" className="hover:text-background transition-colors">
              About
            </Link>
            <Link href="/welcome" className="hover:text-background transition-colors">
              Take Test
            </Link>
          </div>

          <p className="text-sm text-background/50">
            &copy; {new Date().getFullYear()} Wellnest. All rights reserved.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-background/10 text-center text-sm text-background/50">
          <p>
            Disclaimer: This assessment is for informational purposes only and does not constitute medical advice. 
            Please consult a healthcare professional for proper diagnosis.
          </p>
        </div>
      </div>
    </footer>
  )
}
