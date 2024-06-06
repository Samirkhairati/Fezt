import useStore from '@/actions/store'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

function User() {

    //TODO: Toast Redirect messages

    const user = useStore(state => state.user)
    const navigate = useNavigate()
    useEffect(() => {
        if (!user) {
            navigate('/')
        } else {
            navigate('/user/home')
        }
    }, [navigate, user])

    return (
        <Outlet />
    )
}

export default User