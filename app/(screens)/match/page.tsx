'use client'

import { getMatch } from "@/app/queries/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { TbCake, TbMapPin, TbPaw, TbTag } from "react-icons/tb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import confetti from "canvas-confetti"

export default function Match() {
  const [favouriteDogs, setFavouriteDogs] = useState<string[]>([]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["match"],
    queryFn: () => getMatch(favouriteDogs),
    enabled: !!favouriteDogs.length,
  });

  const dog = data?.data?.[0]

  useEffect(() => {
    const favourites = JSON.parse(window.localStorage.getItem("favourites") || "[]");
    setFavouriteDogs(favourites);
  }, [])

  useEffect(() => {
    if (data) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          y: 0.7,
          x: 0.5
        }
      })
    }
  }, [data])
  
  if (isLoading) {
    return (
      <div className="flex grow justify-center items-center h-full">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching matches</div>;
  }

  if (!isLoading && !data) {
    return (
      <div className="flex grow justify-center items-center h-full">
        <p className="text-2xl font-medium">No match found</p>
      </div>
    )
  }

  return (
    <div className="flex grow">
      <h1 className="text-2xl font-medium my-4 text-center">Your Match</h1>
      <div className="flex grow justify-center items-center">
        <Card key={dog?.id} className="p-0 pb-4"> 
          <CardContent className="p-0">
            <Image 
              src={dog?.img || ""} 
              alt={dog?.name || ""} 
              width={400} 
              height={400} 
              className="w-full h-full object-cover aspect-square rounded-t-xl min-w-[400px] min-h-[400px]"
            />
          </CardContent>
          <CardHeader className="px-4">
            <CardDescription className="text-xs text-primary/60 font-medium flex gap-1">
              <TbPaw className="w-4 h-4" />
              {dog?.breed || ""}
            </CardDescription>
            <CardTitle className="text font-medium flex gap-1">
              <TbTag className="w-4 h-4" />
              {dog?.name || ""}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex gap-4">
            <div className="flex gap-1">
            <TbCake className="w-4 h-4" />
            <p className="text-xs">{dog?.age || ""}</p>
            </div>
            <div className="flex gap-1">
            <TbMapPin className="w-4 h-4" />
            <p className="text-xs">{dog?.zip_code || ""}</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}