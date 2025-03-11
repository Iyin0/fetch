'use client'

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createQueryString } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Pagination({
  total,
  setQuery,
}: {
  total: number;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const from = Number(searchParams.get("from"));
  const size = Number(searchParams.get("size"));
  const sizeOptions = [24, 48, 72, 96];

  const totalPages = Math.ceil(total / size);
  const currentPage = Math.floor(from / size) + 1;

  const handleSizeChange = (value: string) => {
    const query = createQueryString("size", value, searchParams);
    setQuery(query);
    router.push(`${pathname}?${query}`);
  };

  const goToPage = (page: number) => {
    const newFrom = (page - 1) * size;
    const query = createQueryString("from", newFrom.toString(), searchParams);
    setQuery(query);
    router.push(`${pathname}?${query}`);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage < 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage > totalPages - 3) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages.map((page, index) =>
      typeof page === "number" ? (
        <Button
          key={index}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(page)}
        >
          {page}
        </Button>
      ) : (
        <span key={index} className="px-2">
          {page}
        </span>
      )
    );
  };

  return (
    <div className="flex justify-center items-center gap-2 my-10">
      <Button 
        variant="outline" 
        size="icon" 
        disabled={from === 0}
        onClick={() => {
          const query = createQueryString("from", (from - size).toString(), searchParams)
          setQuery(query);
          router.push(`${pathname}?${query}`);
        }}
      >
        <ChevronLeft />
      </Button>
      {renderPageNumbers()}
      <Button 
      variant="outline" 
      size="icon" 
      disabled={from + size >= total} 
      onClick={() => {
        const query = createQueryString("from", (from + size).toString(), searchParams)
        setQuery(query);
        router.push(`${pathname}?${query}`);
      }}
      >
        <ChevronRight />
      </Button>
      <Select onValueChange={handleSizeChange} value={size.toString()}>
        <SelectTrigger className="w-fit cursor-pointer">
          <SelectValue placeholder="View" />
        </SelectTrigger>
        <SelectContent>
          {sizeOptions.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}