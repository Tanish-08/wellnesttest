 "use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Heart, Home, Plus, Send, User, Sparkles, Loader2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

type Message = {
  role: "user" | "model"
  content: string
}

// TODO: Yahan apni Google AI Studio wali API Key daal
const GEMINI_API_KEY = "AIzaSyDqy73yhq5Xv3gaOm8nkknFgZWG-gPWz18" 

export default function AssistantPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Hello there!\n\nI am the WellNest AI Assistant. To help me provide you with personalized health guidance on diabetes wellness and prevention, could you please tell me a bit more about yourself?\n\nFor example:\n• Your age\n• Your lifestyle habits (diet, exercise)\n• Any specific concerns you have about diabetes\n\nI'm here to help!"
    }
  ])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messages, isTyping])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    setInput("")
    
    // Add user message to UI
    const newMessages = [...messages, { role: "user" as const, content: userMessage }]
    setMessages(newMessages)
    setIsTyping(true)

    try {
      // API Call to Google Gemini
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "You are a professional, empathetic health and diabetes wellness assistant for a platform called WellNest. Give concise, accurate, and helpful advice. Always remind users to consult a real doctor for medical emergencies." }]
          },
          contents: newMessages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
          }))
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      const aiResponse = data.candidates[0].content.parts[0].text

      setMessages(prev => [...prev, { role: "model", content: aiResponse }])
    } catch (error) {
      console.error("API Error:", error)
      setMessages(prev => [...prev, { 
        role: "model", 
        content: "Sorry, I am having trouble connecting right now. Please check if you added the API Key correctly in the code!" 
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-6 py-4 bg-white border-b border-border shadow-sm z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
             <Heart className="w-5 h-5 text-primary fill-primary" />
          </div>
          <span className="text-xl font-bold text-slate-900">WellNest AI</span>
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors bg-slate-100 px-4 py-2 rounded-full">
          <Home className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </header>

      {/* Main Layout: Sidebar + Chat */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-border flex flex-col p-4 hidden lg:flex z-0">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-start gap-2 shadow-sm rounded-xl h-12 font-semibold">
            <Plus className="w-5 h-5" />
            New Health Chat
          </Button>
          
          <div className="flex-1 overflow-y-auto space-y-2 mt-8 pr-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Recent</p>
            <button className="w-full flex items-center gap-3 p-3 bg-primary/10 text-primary rounded-xl text-left border border-primary/20">
              <MessageSquare className="w-5 h-5 shrink-0" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">Current Session</span>
              </div>
            </button>
          </div>
        </aside>

        {/* Chat Area - FIXED LAYOUT */}
        <main className="flex-1 flex flex-col bg-slate-50/50">
          
          {/* Scrollable Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="max-w-3xl mx-auto space-y-8">
              {messages.map((message, index) => (
                <div key={index} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  
                  {message.role === "model" && (
                    <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-1">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-sm shadow-md" 
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                  }`}>
                    <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                      {message.content}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <div className="w-10 h-10 shrink-0 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center mt-1">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-4 justify-start">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-sm text-slate-500 font-medium">Analyzing...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area - FIXED TO BOTTOM */}
          <div className="flex-none p-4 bg-white border-t border-slate-200">
            <div className="max-w-3xl mx-auto relative">
              <form 
                onSubmit={handleSendMessage}
                className="relative flex items-end gap-2 bg-slate-50 border border-slate-300 rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all p-2"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your health or diabetes risk..."
                  className="w-full max-h-32 min-h-[44px] bg-transparent border-0 focus:ring-0 resize-none py-3 px-4 text-[15px] outline-none text-slate-800 placeholder:text-slate-400"
                  rows={1}
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isTyping}
                  className="shrink-0 h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 transition-all mb-0.5 mr-0.5"
                  size="icon"
                >
                  <Send className="w-5 h-5 ml-1" />
                </Button>
              </form>
              <p className="text-center text-xs text-slate-400 mt-2 font-medium">
                AI Assistant can make mistakes. Consider verifying critical health information with a doctor.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}