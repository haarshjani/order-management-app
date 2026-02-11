"use client"

import { useState } from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"
import { Label } from "./label"



export function Editable({
  value,
  onChange,
  handleKeyDownProp,
  className,
  inputClassName,
  previewClassName,
}) {
  const [editing, setEditing] = useState(false)

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      setEditing(false)
      handleKeyDownProp(e);
    }
  }
  return (
    <div className={ className}>
      {editing ? (
        <Input
          value={value}
          onChange={onChange}
          onBlur={() => setEditing(false)}
          onKeyDown = {handleKeyDown}
          autoFocus
          className={cn(
            "font-bold text-blue-900 bg-blue-200/40",
            inputClassName
          )}
        />
      ) : (
        <div onClick={() => setEditing(true)}  className={cn(
            "flex py-2 rounded cursor-pointer font-bold text-blue-900 bg-blue-200/40",
            previewClassName
          )}>
        <div>
          {value}
        </div>
        <Label className="cursor-pointer ml-auto flex items-center">edit</Label>
        </div>
      )}
    </div>
  )
}
