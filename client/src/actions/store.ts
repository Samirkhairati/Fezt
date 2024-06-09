import { create } from 'zustand'

interface Store {
    user: User | null,
    setUser: (user: User) => void

    vendor: Vendor | null,
    setVendor: (vendor: Vendor) => void

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

    user: null,
    setUser: (user) => set({ user }),

    vendor: null,
    setVendor: (vendor) => set({ vendor }),

    cart: [],
    setCart: (cart) => set({ cart }),
}))

export default useStore

//TODO: get user/vendor from local storage