
// AUTH ========================================================
import Start from './pages/auth/Start'
import UserLogin from './pages/auth/UserLogin'
import VendorLogin from './pages/auth/VendorLogin'
import Login from './pages/auth/Login'
import VendorRegister from './pages/auth/VendorRegister'
// USER ========================================================
import User from './pages/user/User'
import Events from './pages/user/Events'
import Home from './pages/user/Home'
import Dashboard from './pages/user/Dashboard'
import ClubsDashboard from './pages/user/ClubsDashboard'
import EventsDashboard from './pages/user/EventsDashboard'
import Shop from './pages/user/Shop'
// VENDOR ========================================================
import Vendor from './pages/vendor/Vendor'
import VendorHome from './pages/vendor/VendorHome'
import Items from './pages/vendor/Items'
// PACKAGES ========================================================

import {
  Route,
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import './index.css'

// SETUP =======================================================
const queryClient = new QueryClient()
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Start />}>

      <Route path="login" element={<Login />} />
      <Route path="login/user" element={<UserLogin />} />
      <Route path="login/vendor" element={<VendorLogin />} />
      <Route path="register" element={<VendorRegister />} />

      <Route path="user" element={<User />} >
        <Route path="home" element={<Home />} />
        <Route path="events" element={<Events />} />
        {/* <Route path="wallet" element={<Wallet />} />
        <Route path="orders" element={<Orders />} /> */}
        <Route path="shop" element={<Shop />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/clubs" element={<ClubsDashboard />} />
        <Route path="dashboard/events" element={<EventsDashboard />} />
      </Route>

      <Route path="vendor" element={<Vendor />} >
        <Route path="home" element={<VendorHome />} />
        <Route path="items" element={<Items />} />
        <Route path="orders" element={<Events />} />
      </Route>

    </Route>
  )
)
ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);