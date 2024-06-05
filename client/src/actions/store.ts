import { create } from 'zustand'

interface Store {
    user: User | null,
    setUser: (user: User) => void
}

interface User {
    _id: string,
    name: string,
    email: string,
    image: string,
    phone: string,
    address: string,
    bits: string,
    balance: number
}

const useStore = create<Store>((set) => ({

    user: null,
    setUser: (user) => set({ user })
}))

export default useStore

//TODO: get user from local storage