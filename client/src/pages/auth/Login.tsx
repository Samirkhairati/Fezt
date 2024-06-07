import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function Start() {

    // const handleGoogleLogout = async () => {
    //   const auth = getAuth(firebase)
    //   const result = await signOut(auth)
    //   console.log(result)
    //   await axios.post('/api/users/logout')
    // }
    //TODO: Better home page

    return (
        <>
            <div className="relative flex min-h-screen pb-10 w-full items-center justify-center bg-[url('/splash.png')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div className="flex flex-col items-center gap-8 relative z-10">
                    <div className="flex items-center gap-2 mt-8">
                        <span className="text-4xl font-bold text-white">Acme Learning</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Link
                            to={'/login/user'}
                        >
                            <Button variant="outline" className="w-full">
                                Student Login
                            </Button>
                        </Link>
                        <Link
                            to={'/login/vendor'}
                        >
                            <Button variant="outline" className="w-full">
                                Vendor Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Start
