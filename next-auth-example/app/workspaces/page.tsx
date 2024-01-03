"use client"
import CustomLink from "@/components/custom-link"
import { useEffect, useState } from "react"

export default function Page() {
  const [data, setData] = useState()
  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/workspaces")
      const json = await res.json()
      setData(json)
    })()
  }, [])
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">Workspaces</h1>
      <h2 className="text-xl font-bold">Data from API Route:</h2>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  )
}
