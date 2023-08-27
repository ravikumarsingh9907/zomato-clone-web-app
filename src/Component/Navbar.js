import './navbar.scss';
import zomatoLogo from '../Asset/zomato-svgrepo-com.png';
import useProfile from '../Asset/user-profile.svg';
import { useEffect, useContext, useState } from 'react';
import { locationContext } from '../Context/location-context';
import { formContext } from '../Context/form-context';
import { Outlet, Link, useLoaderData, Form, redirect } from 'react-router-dom';
import SearchCard from './Layout/SearchCard';
import { searchContext } from '../Context/search-context';

export default function Navbar() {
    const { user, profilePicture } = useLoaderData();
    const { handleFormVisibility, handleLoginForm } = useContext(formContext);
    const [searchSuggestion, setSearchSuggestion] = useState([]);
    const [isProfileOptions, setIsProfileOptions] = useState(false);
    const { handleLocation, location } = useContext(locationContext);
    const { isOpen, handleIsOpen } = useContext(searchContext);

    const handleSignUpClick = () => {
        handleFormVisibility('form-container')
    }

    const handleLoginClick = () => {
        handleFormVisibility('form-container')
        handleLoginForm();
    }

    const handleProfileOptions = () => {
        setIsProfileOptions(!isProfileOptions);
    }

    const userGet = async function (e) {
        if (e.target.value) {
            const response = await fetch(`http://localhost:3300/restaurants?query=${e.target.value}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const { brands } = await response.json();
            setSearchSuggestion(brands);
            handleIsOpen(true);
        } else {
            setSearchSuggestion([]);
            handleIsOpen(false);
        }
    }

    const callApi = function (fn, d) {
        let timer;
        return function () {
            let context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(context, args);
            }, d)
        }
    }

    const handleApiCall = callApi(userGet, 1000);

    useEffect(() => {
        handleLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderSuggestions = searchSuggestion.map(suggestion => {
        return <SearchCard data={suggestion} />
    });

    return (
        <>
            <div className='navbar-container'>
                <div className='logo-container'>
                    <Link to='/'><img src={zomatoLogo} alt='zomato' /></Link>
                </div>
                <div className='location-search-box-container'>
                    <div className='location-container'>
                        <span className="material-symbols-outlined">location_on</span>
                        <p className='location'>{location}</p>
                    </div>
                    <div className='divider-container'>
                        <p className='divider'>|</p>
                    </div>
                    <div className='search-box-container'>
                        <span className="material-symbols-outlined">search</span>
                        <input className='search' placeholder='Search for restaurant, cuisine or a dish' onKeyUp={handleApiCall} />

                        {isOpen && <div className='toggle-suggestions-wrapper'>
                            <div className='suggestions'>
                                {searchSuggestion.length > 0 ? renderSuggestions : <SearchCard />}
                            </div>
                        </div>}
                    </div>
                </div>
                {user.error && <div className='login-signup-container'>
                    <p className='login-btn btn' onClick={handleLoginClick}>Log in</p>
                    <p className='signup-btn btn' onClick={handleSignUpClick}>Sign up</p>
                </div>
                }
                {!user.error && <div className='profile-container'>
                    <div className='image-container'>
                        <img src={profilePicture || useProfile} alt='profile' />
                    </div>
                    <p className='name'>{user.fullname.slice(0, 4)}</p>
                    {isProfileOptions && <i className='bx bx-chevron-up' onClick={handleProfileOptions}></i>}
                    {!isProfileOptions && <i className='bx bx-chevron-down' onClick={handleProfileOptions}></i>}
                    {isProfileOptions && <div className='toggle-profile-options'>
                        <ul className='options'>
                            <li className='list' onClick={handleProfileOptions}><Link to={`/profile/${user._id}/reviews`}>Profile</Link></li>
                            <li className='list'><Link to={`/profile/${user._id}/bookmarks`}>Bookmarks</Link></li>
                            <li className='list'><Link to={`/profile/${user._id}/reviews`}>Reviews</Link></li>
                            <li className='list'><Link to={`/profile/${user._id}/followers`}>Network</Link></li>
                            <li className='list'><Link to={`/profile/${user._id}/followers`}>Find Friends</Link></li>
                            <li className='list'><Link to={`/profile/${user._id}/settings`}>Settings</Link></li>
                            <Form action='/logout' method='post' className='list'>
                                <button>Log out</button>
                            </Form>
                        </ul>
                    </div>}
                </div>
                }
            </div>
            <>
                <Outlet />
            </>
        </>
    )
};

export async function loader() {
    const response = await fetch('http://localhost:3300/users/me', {
        method: 'GET',
        headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const user = await response.json();

    const responseProfilePicture = await fetch(`http://localhost:3300/users/${user._id}/avatar`, {
        method: 'GET',
    });

    let profilePicture;

    if (responseProfilePicture.status !== 400) {
        profilePicture = responseProfilePicture.url;
    }


    return {
        user,
        profilePicture
    };
}

export async function action() {
    const logoutResponse = await fetch('http://localhost:3300/users/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const logout = await logoutResponse.json();
    if (logout) {
        return redirect(window.location.pathname);
    } else {
        return logout;
    }
}