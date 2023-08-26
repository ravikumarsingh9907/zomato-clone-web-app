import { formContext } from "./form-context";
import { useEffect, useState } from "react";

export default function FormProvider(props) {
    const [isLogin, setIsLogin] = useState(true);
    const [formVisibility, setFormVisibility] = useState('form-container hidden');
    const [loggedInUser, setLoggedInUser] = useState({});

    useEffect(() => {
        setLoggedInUser(JSON.parse(localStorage.getItem('data')));
        if(formVisibility === 'form-container hidden') {
            window.onscroll = function() {};
        }
    }, [formVisibility]);

    const handleFormVisibility = (value) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        document.body.style.overflow = 'hidden';
        setFormVisibility(value);
    }

    const handleLoginForm = () => {
        setIsLogin(!isLogin)
    }

    const formPorvider = {
        formVisibility,
        handleFormVisibility,
        handleLoginForm,
        isLogin,
        setLoggedInUser,
        loggedInUser
    }

    return(
        <formContext.Provider value={formPorvider}>
            {props.children}
        </formContext.Provider>
    )
}