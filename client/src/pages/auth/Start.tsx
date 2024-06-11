import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useStore from '@/actions/store'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
function Start() {

  const user = useStore(state => state.user)
  const vendor = useStore(state => state.vendor)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/user/home')
    } else if (vendor) {
      navigate('/vendor/home')
    } else {
      navigate('/login')
    }
  }, [user, vendor, navigate])

  return (
    <>
      <Toaster />
      <Outlet />
    </>
  )
}

export default Start
