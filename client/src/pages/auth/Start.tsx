import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useStore from '@/actions/store'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
function Start() {

  const user = useStore(state => state.user)
  const vendor = useStore(state => state.vendor)
  const navigate = useNavigate()
  // const handleGoogleLogout = async () => {
  //   const auth = getAuth(firebase)
  //   const result = await signOut(auth)
  //   console.log(result)
  //   await axios.post('/api/users/logout')
  // }

  useEffect(() => {
    console.log('user', user)
    console.log('vendor', vendor)
    if (user) {
      navigate('/user')
    } else if (vendor) {
      navigate('/vendor')
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
