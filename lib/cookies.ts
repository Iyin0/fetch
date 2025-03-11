"use server"

import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

export async function verifyCookie() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('fetch-access-token')

  if (!authCookie) return {name: null, email: null, expired: true};

  const { value } = authCookie

  try {
    const decoded = jwt.decode(value) as { exp?: number, name?: string, email?: string } | null

    if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
      return {name: decoded?.name, email: decoded?.email, expired: true};
    }

    return {name: decoded?.name, email: decoded?.email, expired: false};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {name: null, email: null, expired: true};
  }

}

export async function initialiseCookie() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('fetch-access-token')
  const cookieHeader = authCookie ? `${authCookie.name}=${authCookie.value}` : ''

  return cookieHeader
}