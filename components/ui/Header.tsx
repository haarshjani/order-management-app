"use client"

import { FC, useState } from "react"
import Link from "next/link"
import {
  Menu,
  Package,
  ShoppingCart,
  Utensils,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useAppState } from "@/store/useAppState"
import { useRouter } from "next/navigation"
import _ from "lodash"

interface HeaderPropsType {
  storeName?: string
}

export const Header: FC<HeaderPropsType> = ({ storeName }) => {
  const [open, setOpen] = useState(false)
  const router = useRouter();

  const {state } = useAppState()

  const navItems = [
    { label: "Menu", href: "/", icon: Utensils },
    {label: "My Orders", href: "/myorder", icon: Package}
  ]

  return (
    <header className="sticky top-0 flex bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-lg"

            onClick={() => setOpen(!open)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="text-lg font-bold">
            {storeName || "AnnaPurna Restaurant"}
          </Link>
        </div>

        <Button variant="ghost" size="icon" className="relative absolute right-0 mr-5"
        onClick={()=> router.push("/cart")}
        >
          <ShoppingCart className="h-10 w-10"/>
          {state?.cart?.length > 0 && <Badge className="bg-blue-200 text-black absolute -right-2 -top-2 px-1.5 py-0 text-xs">
            {_.uniqBy(state?.cart, "id").length}
          </Badge>}
        </Button>
      </div>

      <Sheet open={open}  modal={false} >
        <SheetContent
          side="left"
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="
            fixed
            top-16
            h-[calc(100vh-4rem)]
            w-64
            p-0
            border-none
            shadow-none
          "
        >
          <nav className="flex flex-col px-2 py-3">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="
                  flex items-center gap-4
                  rounded-lg px-4 py-2.5
                  text-sm font-medium
                  hover:bg-accent
                  transition-colors
                "
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
