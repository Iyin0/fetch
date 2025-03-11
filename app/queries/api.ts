"use server"

import { baseUrl } from "@/lib/constants";
import { initialiseCookie } from "@/lib/cookies";
import { Dog } from "@/lib/types";

export async function getDogIds(params: string) {
  const cookieHeader = await initialiseCookie()

  const response = await fetch(`${baseUrl}/dogs/search?${params}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!response.ok) {
    return { ok: response.ok, data: null, error: "Failed to fetch dogs" };
  }
  const responseData = await response.json()

  const dogsIds = responseData.resultIds
  const dogs = await getDogs(dogsIds)

  if (!dogs.ok) {
    return { ok: dogs.ok, data: null, error: "Failed to fetch dogs" };
  }

  return { ok: dogs.ok, data: dogs.data, error: null, total: responseData.total };
}

export async function getDogs(ids: string[]) {
  const cookieHeader = await initialiseCookie()

  const dogsResponse = await fetch(`${baseUrl}/dogs`, {
    method: "POST",
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify(ids),
  });

  if (!dogsResponse.ok) {
    return { ok: dogsResponse.ok, data: null, error: "Failed to fetch dogs" };
  }

  const dogs = await dogsResponse.json()

  return { ok: dogsResponse.ok, data: dogs as Dog[], error: null };
}

export async function getBreeds() {
  const cookieHeader = await initialiseCookie()
  const response = await fetch(`${baseUrl}/dogs/breeds`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!response.ok) {
    return { ok: response.ok, data: null, error: "Failed to fetch breeds" };
  }

  const breeds = await response.json()

  return { ok: response.ok, data: breeds as string[], error: null };
}

export async function getMatch(ids: string[]) {
  const cookieHeader = await initialiseCookie()
  const response = await fetch(`${baseUrl}/dogs/match`, {
    method: "POST",
    credentials: "include",
    headers: {
      Cookie: cookieHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ids),
  });

  if (!response.ok) {
    return { ok: response.ok, data: null, error: "Failed to fetch matches" };
  }

  const match = await response.json()
  const dogs = await getDogs([match.match as string])

  if (!dogs.ok) {
    return { ok: dogs.ok, data: null, error: "Failed to fetch matches" };
  }

  return { ok: response.ok, data: dogs.data, error: null };
}
