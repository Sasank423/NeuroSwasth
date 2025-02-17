import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from '../styles/spinner';

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
        const navigate = useNavigate();
        const [loading, setLoading] = useState(true);
        const [username, setUsername] = useState(null);
        const [email, setEmail] = useState(null);
        const [profilePic, setProfilePic] = useState(null);

        useEffect(() => {
            checkUserStatus()
            // eslint-disable-next-line
         }, [])

         const loginUser = async (userInfo) => {
            setLoading(true)
            setUsername(userInfo.username);
            setEmail(userInfo.email);
            setProfilePic(userInfo.profilePic);
            navigate(`/home`, { replace: true });

            setLoading(false)
            
         }

         const logoutUser = async () => {
            try{
                const res = await fetch('http://127.0.0.1:5000/logout',{
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({})
                })
                if (!res.ok) {
                  throw new Error('Network response was not ok');
                }
            } catch(e){
                console.error(e);
            }
            setUsername(null);
            setEmail(null);
         }

         const checkUserStatus = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/status', {
                  method: 'GET',
                });
                if(!response.ok){
                    console.error('Network Issue');
                }
                const userInfo = await response.json();
                setUsername(userInfo.username);
                setEmail(userInfo.email);
                setProfilePic(userInfo.profilePic);
                navigate(`/home`, { replace :true })
            } catch(e) {
                console.error(e);
            }
            
            setLoading(false)
         }

         const getUsername = () => {
            return username;
         }

         const getEmail = () => {
            return email;
         }

         const getProfilePic = () => {
            return profilePic;
         }

        const contextData = {
            getUsername,
            getEmail,
            loginUser,
            logoutUser,
            getProfilePic
        }

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? <Spinner />: children}
        </AuthContext.Provider>
    )
}

//Custom Hook
export const useAuth = ()=> {return useContext(AuthContext)}

export default AuthContext;