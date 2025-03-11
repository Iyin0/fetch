"use client"
 
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Combobox({
  list,
  placeholder,
  onChange,
  className,
  defaultValue,
}: {
  list: { value: string; label: string }[];
  placeholder: string;
  onChange: (value: string[]) => void;
  className?: string;
  defaultValue?: string[];
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string[]>(defaultValue || [])
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between overflow-hidden", className)}
        >
          <p className="overflow-hidden text-ellipsis">
            <span className="text-xs text-primary/60 font-medium mr-1">
              {value.length > 0 ? value.length : null}
            </span>
            {value.length > 0
              ? value.join(", ")
              : placeholder}
          </p>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[200px] p-0", className)}>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No value found.</CommandEmpty>
            <CommandGroup>
              {list.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue((prev) => {
                      let newValues = [...prev]
                      if (prev.includes(currentValue)) {
                        newValues = prev.filter((item) => item !== currentValue)
                      } else {
                        newValues.push(currentValue)
                      }
                      onChange(newValues)
                      setOpen(false)
                      return newValues
                    })
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(item.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}