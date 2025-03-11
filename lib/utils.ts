import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("");
}


export const createQueryString = (
  name: string | string[],
  value: string | string[],
  searchParams: URLSearchParams
) => {
  const params = new URLSearchParams(searchParams.toString());

  if (Array.isArray(name) && Array.isArray(value)) {
    if (name.length !== value.length) {
      throw new Error("Names and values arrays must have the same length.");
    }

    name.forEach((nameItem, index) => {
      const valueItem = value[index];

      // Remove existing parameters with the same name
      Array.from(params.keys()).forEach((key) => {
        if (key === nameItem || key.startsWith(`${nameItem}[`)) {
          params.delete(key);
        }
      });

      // Add new values
      if (Array.isArray(valueItem)) {
        valueItem.forEach((val) => params.append(`${nameItem}[]`, val));
      } else {
        params.set(nameItem, valueItem);
      }
    });
  } else if (typeof name === "string") {
    // Existing logic for when name is a string
    Array.from(params.keys()).forEach((key) => {
      if (key === name || key.startsWith(`${name}[`)) {
        params.delete(key);
      }
    });

    if (Array.isArray(value)) {
      value.forEach((val) => params.append(`${name}[]`, val));
    } else {
      params.set(name, value);
    }
  }

  return params.toString();
};

export const removeQueryString = (name: string | string[], searchParams: URLSearchParams) => {
  const params = new URLSearchParams(searchParams.toString());

  const names = Array.isArray(name) ? name : [name];

  names.forEach((nameItem) => {
    Array.from(params.keys()).forEach((key) => {
      if (key === nameItem || key.startsWith(`${nameItem}[`)) {
        params.delete(key);
      }
    });
  });

  return params.toString();
};