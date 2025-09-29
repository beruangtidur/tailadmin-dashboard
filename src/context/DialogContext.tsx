import { createContext, useContext } from "react"

type DialogContextType = {
  setIsDialogOpen: (open: boolean) => void
}

export const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function useDialog() {
  const ctx = useContext(DialogContext)
  if (!ctx) {
    throw new Error("useDialog must be used inside GlobalDialog")
  }
  return ctx
}
