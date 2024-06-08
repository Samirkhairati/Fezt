import useStore from '@/actions/store'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

function User() {

    //TODO: Toast Redirect messages

    const vendor = useStore(state => state.vendor)
    const navigate = useNavigate()
    useEffect(() => {
        if (!vendor) {
            navigate('/')
        } else {
            navigate('/vendor/home')
        }
    }, [navigate, vendor])

    return (
        <Outlet />
    )
}

export default User