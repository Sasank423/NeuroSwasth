import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from '../styles/spinner';

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
        const navigate = useNavigate();
        const [loading, setLoading] = useState(true);
        const [username, setUsername] = useState('sas'); //change
        const [email, setEmail] = useState(null);
        const [profilePic, setProfilePic] = useState(null);
        const [mobile, setMobile] = useState(null);

        const [notif, setNotif] = useState({'success': false, 'error': false, 'notif': false, 'msg': ''});

        useEffect(() => {
            checkUserStatus()
            // eslint-disable-next-line
         }, [])

         const loginUser = async (userInfo) => {
            setLoading(true)
            setUsername(userInfo.username);
            setEmail(userInfo.email);
            setProfilePic(userInfo.profilePic);
            setMobile(userInfo.mobile);
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
            setProfilePic(null);
            setMobile(null);
         }

         const checkUserStatus = async () => {
            setLoading(true);
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
                setMobile(userInfo.mobile);
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

         const getMobile = () => {
            return mobile;
         }

         const refresh = async (notif) => {
            setLoading(true);
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
                setMobile(userInfo.mobile);
                setNotif(notif);
            } catch(e) {
                console.error(e);
            }
            
            setLoading(false)
         }

         const getNotif = () => {
                return notif;
         }


        const contextData = {
            getUsername,
            getEmail,
            loginUser,
            logoutUser,
            getProfilePic,
            getMobile,
            getNotif,
            setNotif,
            refresh
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