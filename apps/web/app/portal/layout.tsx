import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portal do Cliente - MULTIVUS OS",
  description: "Acompanhe suas ordens de serviço em tempo real",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
