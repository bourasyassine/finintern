"use client"

import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface MobileCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  interactive?: boolean
}

export default function MobileCard({ children, className = "", onClick, interactive = false }: MobileCardProps) {
  return (
    <Card
      className={`
        ${className} 
        ${interactive ? "active:scale-95 transition-transform cursor-pointer" : ""}
        ${onClick ? "hover:shadow-md transition-shadow" : ""}
        touch-manipulation
      `}
      onClick={onClick}
    >
      {children}
    </Card>
  )
}
