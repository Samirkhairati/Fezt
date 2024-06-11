import { create } from 'zustand'

interface Store {
    user: User | null,
    setUser: (user: User | null) => void

    vendor: Vendor | null,
    setVendor: (vendor: Vendor | null) => void

    cart: Item[],
    setCart: (cart: Item[]) => void
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

interface Vendor {
    _id: string,
    name: string,
    email: string,
    image: string,
    phone: string,
    address: string,
}

interface Item {
    _id: string,
    quantity: number,
    vendorId: string,
    itemName: string,
    itemPrice: number,
}

const useStore = create<Store>((set) => ({

    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    setUser: (user) => set({ user }),

    vendor: null,
    setVendor: (vendor) => set({ vendor }),

    cart: [],
    setCart: (cart) => set({ cart }),
}))

export default useStore

//TODO: get user/vendor from local storage