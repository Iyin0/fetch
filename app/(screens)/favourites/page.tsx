'use client'

import { useQuery } from "@tanstack/react-query";
import { getDogs } from "@/app/queries/api";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TbCake, TbHeart, TbHeartFilled, TbMapPin, TbPaw, TbTag } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { Dog } from "@/lib/types";
import { WobbleCard } from "@/components/ui/wobble-card";

export default function Favourites() {
  const [favouriteDogs, setFavouriteDogs] = useState<string[]>([]);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["favouriteDogs"],
    queryFn: () => getDogs(favouriteDogs),
    enabled: !!favouriteDogs.length,
  });

  useEffect(() => {
    const favourites = JSON.parse(window.localStorage.getItem("favourites") || "[]");
    setFavouriteDogs(favourites);
  }, []);

  const handleFavouriteClick = useCallback((dog: Dog) => {
    const isFavourite = favouriteDogs.includes(dog.id);
    if (isFavourite) {
      const newFavourites = favouriteDogs.filter((id) => id !== dog.id);
      setFavouriteDogs(newFavourites);
      window.localStorage.setItem("favourites", JSON.stringify(newFavourites));
    } else {
      setFavouriteDogs([...favouriteDogs, dog.id]);
      window.localStorage.setItem("favourites", JSON.stringify([...favouriteDogs, dog.id]));
    }
    refetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favouriteDogs]);

  if (isLoading) {
    return (
      <div className="flex grow justify-center items-center h-full">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching dogs</div>;
  }

  if (!isLoading && data && (data?.data?.length === 0 || favouriteDogs.length === 0)) {
    return (
      <div className="flex grow justify-center items-center h-full">
        <p className="text-2xl font-medium">You have no favourite dogs</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-medium my-4">Favourites</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {data?.data?.map((dog) => (
           <WobbleCard
           key={dog.id}
           containerClassName="bg-white"
           className="px-0 sm:px-0 py-0"
         >
            <Card className="p-0 pb-4"> 
              <CardContent className="p-0">
                <Image 
                  src={dog.img} 
                  alt={dog.name} 
                  width={200} 
                  height={200} 
                  className="w-full h-full object-cover aspect-square rounded-t-xl"
                />
              </CardContent>
              <CardHeader className="px-4">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <CardDescription className="text-xs text-primary/60 font-medium flex gap-1">
                      <TbPaw className="w-4 h-4" />
                      {dog.breed}
                    </CardDescription>
                    <CardTitle className="text font-medium flex gap-1">
                      <TbTag className="w-4 h-4" />
                      {dog.name}
                    </CardTitle>
                  </div>
                  <div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleFavouriteClick(dog)}
                    >
                      {favouriteDogs.includes(dog.id) ? <TbHeartFilled className="w-4 h-4 text-yellow-500" /> : <TbHeart className="w-4 h-4 text-primary/60" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex gap-4">
              <div className="flex gap-1">
                <TbCake className="w-4 h-4" />
                <p className="text-xs">{dog.age}</p>
              </div>
              <div className="flex gap-1">
                <TbMapPin className="w-4 h-4" />
                <p className="text-xs">{dog.zip_code}</p>
              </div>
              </CardFooter>
            </Card>
          </WobbleCard>
      ))}
      </div>
    </div>
  );
}