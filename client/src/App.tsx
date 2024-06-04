
import './App.css'
import firebase from './utils/firebase'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import axios from 'axios'

interface User {
  _id: string,
  name: string,
  email: string,
  image: string
}

function App() {

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(firebase)
      const result = await signInWithPopup(auth, provider)
      console.log(result)

      const user: User = await axios.post('/api/users/login', {
        name: result.user.displayName,
        email: result.user.email,
        image: result.user.photoURL
      })
      console.log(JSON.stringify(user))
    } catch (error) {
      console.log("Could not sign in with google: ", error)
    }
  }

  const handleGoogleLogout = async () => {
    const auth = getAuth(firebase)
    const result = await signOut(auth)
    console.log(result)
    await axios.post('/api/users/logout')
  }


  return (
    <>
      <button onClick={handleGoogleLogin} className='bg-blue-500 text-white p-2'>Continue with Google</button>
      <button onClick={handleGoogleLogout} className='bg-red-500 text-white p-2'>Signout from Google</button>

    </>
  )
}

export default App
