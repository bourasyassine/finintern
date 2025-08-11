"use client"

// Inspired by react-hot-toast library
import * as React from "react"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const addToRemoveQueue = (toastId: string) => {
  const timeout = setTimeout(() => {
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  return timeout
}

type Action =
  | {
      type: "ADD_TOAST"
      toast: Toast
    }
  | {
      type: "REMOVE_TOAST"
      toastId?: Toast["id"]
    }

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function dispatch(action: Action) {
  if (action.type === "ADD_TOAST") {
    toastTimeouts.set(action.toast.id, addToRemoveQueue(action.toast.id))
  } else if (action.type === "REMOVE_TOAST") {
    if (action.toastId) {
      toastTimeouts.delete(action.toastId)
    }
  }
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback(({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = genId()
    const newToast = { id, title, description, variant }

    setToasts((prev) => [...prev, newToast])
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    dispatch({ type: "REMOVE_TOAST", toastId: id })
  }, [])

  React.useEffect(() => {
    return () => {
      toastTimeouts.forEach((timeout) => clearTimeout(timeout))
      toastTimeouts.clear()
    }
  }, [])

  return { toast, toasts, dismiss }
}
