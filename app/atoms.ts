import { User } from '@/lib/types'
import { atom } from 'jotai'

export const userAtom = atom<User | null>(null)