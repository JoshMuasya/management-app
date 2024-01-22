import * as React from "react"

import { buttonVariants } from "@/components/ui/button"



import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CardType } from "@/interface"
import Link from "next/link"

export function CardHome({ title, desc, button1, button2, link1, link2 }: CardType) {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link
          href={link1}
          className={`${buttonVariants({ variant: "default" })} px-5 text-xl font-bold`}
        >
          {button1}
        </Link>
        <Link
          href={link2}
          className={`${buttonVariants({ variant: "default" })} px-5 text-xl font-bold`}
        >
          {button2}
        </Link>
      </CardFooter>
    </Card>
  )
}



