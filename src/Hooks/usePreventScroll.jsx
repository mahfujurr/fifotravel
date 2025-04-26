"use client"

import { useEffect } from "react"

const usePreventScroll = (ref) => {
  useEffect(() => {
    const handleWheel = (event) => {
      if (document.activeElement === ref.current) {
        event.preventDefault()
      }
    }

    const inputElement = ref.current
    if (inputElement) {
      inputElement.addEventListener("wheel", handleWheel)
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("wheel", handleWheel)
      }
    }
  }, [ref])
}

export default usePreventScroll
