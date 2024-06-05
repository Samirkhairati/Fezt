import ReactDOM from 'react-dom/client'
import './index.css'

import Start from './pages/auth/Start'
import UserLogin from './pages/auth/UserLogin'
import VendorLogin from './pages/auth/VendorLogin'
import Login from './pages/auth/Login'
import VendorRegister from './pages/auth/VendorRegister'


import {
  Route,
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
const router = createBrowserRouter(

  createRoutesFromElements(
    <Route path="/" element={<Start />}>

      <Route path="login" element={<Login />} />
      <Route path="login/user" element={<UserLogin />} />
      <Route path="login/vendor" element={<VendorLogin />} />
      <Route path="register" element={<VendorRegister />} />
    </Route>

  )
)
ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);