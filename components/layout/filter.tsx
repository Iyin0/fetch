import { getBreeds } from "@/app/queries/api";
import { removeQueryString } from "@/lib/utils";

import { createQueryString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export default function Filter({
  isDataLoading,
  onChange,
}: {
  isDataLoading: boolean,
  onChange: (value: string) => void
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isAgeFilter, setIsAgeFilter] = useState(false);
  const [ageMin, setAgeMin] = useState(0);
  const [ageMax, setAgeMax] = useState(100);
  const [value, setValue] = useState<string[]>(breeds || [])

  const breeds = searchParams.getAll("breeds[]");
  const sort = searchParams.get("sort");
  const [query, setQuery] = useState(searchParams.toString());
  const defaultQuery = 'size=24&from=0&sort=breed%3Aasc'

  const { data: dogBreeds, isLoading: isBreedsLoading } = useQuery({
    queryKey: ["breeds"],
    queryFn: () => getBreeds(),
  });

  useEffect(() => {
    if (!isDataLoading && !isBreedsLoading) {
      router.push(`${pathname}?${query}`);
      onChange(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    if (!isAgeFilter) {
      const queryStringAgeMin = removeQueryString(["ageMin", "ageMax"], searchParams)
      setQuery(queryStringAgeMin);
    } else {
      const queryStringAgeMin = createQueryString(["ageMin", "ageMax"], [ageMin.toString(), ageMax.toString()], searchParams)
      setQuery(queryStringAgeMin);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAgeFilter])

  const handleBreedChange = (value: string[]) => {
    if (value.length === 0) {
      const queryString = removeQueryString("breeds", searchParams)
      setQuery(queryString);
    } else {
      const queryString = createQueryString("breeds", value, searchParams)
      setQuery(queryString);
    }
  };

  const handleSortChange = (value: string) => {
    const queryString = createQueryString("sort", `breed:${value}`, searchParams)
    setQuery(queryString);
  };
  
  return (
    <div className="flex flex-wrap gap-2 sticky top-16 bg-white px-4 py-2 shadow mb-10 z-50">
      <Combobox
        list={dogBreeds?.data?.map((breed) => ({ value: breed, label: breed })) || []}
        placeholder="Select breed"
        onChange={handleBreedChange}
      />
      <Select onValueChange={handleSortChange} value={sort?.split(":")[1]}>
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Asc</SelectItem>
          <SelectItem value="desc">Desc</SelectItem>
        </SelectContent>
      </Select>
      <div>
        <Input 
          type="text"
          inputMode="numeric"
          pattern="\d*"
          placeholder="Search by zip code"
          minLength={5}
          maxLength={5}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""); // Remove non-numeric characters
          }}
          onChange={(e) => {
            if (e.target.value.length === 5) {
              const queryString = createQueryString("zipCodes", e.target.value, searchParams)
              setQuery(queryString);
            } else if (e.target.value.length < 5 || e.target.value.length > 5) {
              const queryString = removeQueryString("zipCodes", searchParams)
              setQuery(queryString);
            }
          }}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="age-filter">Age Filter</Label>
        <Switch id="age-filter" checked={isAgeFilter} onCheckedChange={setIsAgeFilter} />
        {isAgeFilter && (
          <div className="flex gap-1 items-center">
            <Slider
              min={0}
              max={100}
              step={1}
              minStepsBetweenThumbs={1}
              value={[ageMin, ageMax]}
              className="w-60" 
              onValueChange={(value) => {
                setAgeMin(value[0]);
                setAgeMax(value[1]);
              }}
              onValueCommit={(value) => {
                const queryStringAgeMin = createQueryString(["ageMin", "ageMax"], [value[0].toString(), value[1].toString()], searchParams)
                setQuery(queryStringAgeMin);
              }}
            />
            <p className="text-xs">{ageMin} - {ageMax}</p>
          </div>
        )}
      </div>
      {query !== defaultQuery && <Button onClick={() => setQuery(defaultQuery)}>Reset</Button>}
    </div>
  )
}