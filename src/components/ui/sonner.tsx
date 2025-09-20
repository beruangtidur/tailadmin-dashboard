"use client"

import { useTheme } from "@/context/ThemeContext"
// import { useTheme } from "next-themes"

import { Toaster as Sonner, ToasterProps } from "sonner"
// import { useTheme } from "@/context/ThemeContext"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()
  const toastTheme = (theme === "light") ? "dark" : "light"
  return (
    <Sonner
      theme={toastTheme as ToasterProps["theme"]}
      className="toaster group"
      // style=
      // {
      //   {
      //     "--normal-bg": "var(--popover)",
      //     "--normal-text": "var(--popover-foreground)",
      //     "--normal-border": "var(--border)",
      //   } as React.CSSProperties
      // }
      {...props}
    />
  )
}

export { Toaster }
