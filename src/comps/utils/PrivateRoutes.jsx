import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const PrivateRoutes = () => {
    const {getUsername} = useAuth()

    return getUsername() ? <Outlet/> : <Navigate to="/"/>
}

export default PrivateRoutes