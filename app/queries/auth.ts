"use server"

import { baseUrl } from "@/lib/constants";
import { cookies } from "next/headers";
import { initialiseCookie } from "@/lib/cookies";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const name = formData.get("name");

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name }),
  });

  if (!response.ok) {
    return { ok: false, error: "Failed to login" };
  }
  const setCookieHeader = response.headers.get('set-cookie');
  
  if (setCookieHeader) {
    const match = setCookieHeader.match(/^([^=]+)=([^;]+);(.+)$/);
    if (match) {
      const [, name, value, options] = match;
      
      const cookieStore = await cookies()
      cookieStore.set(name, value, {
        httpOnly: options.includes('httponly'),
        secure: options.includes('secure'),
        sameSite: options.includes('samesite=none') ? 'none' : 
                 options.includes('samesite=lax') ? 'lax' : 'strict',
        path: '/',
      });
    }
  }
  return { ok: true };
}

export async function logout() {
  const cookieHeader = await initialiseCookie()

  await fetch(`${baseUrl}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
  });

  const cookieStore = await cookies()
  cookieStore.delete('fetch-access-token')
  return { ok: true };
}
