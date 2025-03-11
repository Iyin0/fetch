"use client";

import { getDogIds } from "@/app/queries/api";
import { useQuery } from "@tanstack/react-query";
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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Filter from "@/components/layout/filter";
import { Loader2 } from "lucide-react";
import Pagination from "@/components/layout/pagination";
import { Button } from "@/components/ui/button";
import { Dog } from "@/lib/types";
import { createQueryString } from "@/lib/utils";
import { WobbleCard } from "@/components/ui/wobble-card";

export default function Home() {  
  const router = useRouter();
  const searchParams = useSearchParams ();
  const pathname = usePathname()
  
  const from = searchParams.get("from");
  const size = searchParams.get("size");
  const sort = searchParams.get("sort");
  const [query, setQuery] = useState(searchParams.toString());
  
  const [favouriteDogs, setFavouriteDogs] = useState<string[]>([]);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["dogs"],
    queryFn: () => getDogIds(query ? query : "size=24&from=0&sort=breed:asc"),
  });

  const handleFavouriteClick = (dog: Dog) => {
    const isFavourite = favouriteDogs.includes(dog.id);
    if (isFavourite) {
      const newFavourites = favouriteDogs.filter((id) => id !== dog.id);
      setFavouriteDogs(newFavourites);
      window.localStorage.setItem("favourites", JSON.stringify(newFavourites));
    } else {
      setFavouriteDogs([...favouriteDogs, dog.id]);
      window.localStorage.setItem("favourites", JSON.stringify([...favouriteDogs, dog.id]));
    }
  };

  useEffect(() => { 
    const queryString = [];
    if (!size) {
      queryString.push(createQueryString("size", "24", searchParams));
    }
    if (!from) {
      queryString.push(createQueryString("from", "0", searchParams));
    }
    if (!sort) {
      queryString.push(createQueryString("sort", "breed:asc", searchParams));
    }
    if (queryString.length > 0) {
      // setQuery(queryString.join("&"));
      router.push(`${pathname}?${queryString.join("&")}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const favourites = JSON.parse(window.localStorage.getItem("favourites") || "[]");
    setFavouriteDogs(favourites);
  }, []);

  useEffect(() => {
    if (query && !isLoading) {
      refetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  if (isLoading && !data) {
    return (
    <div className="flex grow justify-center items-center h-full">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
  }

  if (error) {
    return <div>Error fetching dogs</div>;
  }

  if (!isLoading && data && data?.data?.length === 0) {
    return (
      <div className="flex flex-col grow">
        <Filter 
          isDataLoading={isLoading} 
          onChange={(value) => {
            setQuery(value);
          }}
        />
        <div className="flex grow justify-center items-center h-full">
          <p className="text-2xl font-medium">No dogs found</p>
        </div>
      </div>
    )
  }

  return (
    <div>
     <Filter 
        isDataLoading={isLoading} 
        onChange={(value) => {
          setQuery(value);
        }}
      />
     <h1 className="text-2xl font-medium my-4">Dogs</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 min-h-[60dvh]">
        {data?.data?.map((dog) => (
          <WobbleCard
            key={dog.id}
            containerClassName="bg-white"
            className="px-0 sm:px-0 py-0"
          >
            <Card className="p-0 pb-4 h-fit"> 
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
      <Pagination 
        total={data?.total}
        setQuery={setQuery}
      />
    </div>
  );
}
