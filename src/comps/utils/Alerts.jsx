import { toast,Bounce } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default function show_msg(notif) {
    if (notif.success) {
        return show_success;
    }
    else if (notif.error) {
        return show_error;
    }
    else if (notif.notif) {
        return show_info;
    }
}

export function show_error(text){
    toast.error(text, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
}

export function show_success(text){
    toast.success(text, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
}

export function show_info(text){ 
    toast.info(text, {position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
}