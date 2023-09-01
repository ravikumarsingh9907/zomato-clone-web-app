import './Profile.scss'
import ProfileCard from '../Component/User/ProfileCard';
import Sidebar from '../Component/User/Sidebar';
import { Outlet, redirect } from 'react-router';
import { useContext } from 'react';
import { formContext } from '../Context/form-context';
import Footer from '../Component/Footer';

const activity = {
    heading: 'Activity',
    item: [
        {
            id: 'act1',
            name: 'Reviews',
            url: 'reviews',
        },
        {
            id: 'act2',
            name: 'Photos',
            url: 'photos',
        },
        {
            id: 'act3',
            name: 'Followers',
            url: 'followers',
        },
        {
            id: 'act4',
            name: 'Bookmarks',
            url: 'bookmarks',
        }
    ]
}

export default function UserProfile() {
    const { loggedInUser } = useContext(formContext);
    return (
        <>
            <div className='profile-page-wrapper'>
                <ProfileCard edit='false' data={loggedInUser} />
                <div className='profile-content-container'>
                    <div className='sidebar'>
                        <Sidebar data={activity} />
                    </div>
                    <div className='show-activity'>
                        <Outlet />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export async function loader({ params }) {
    const profileResponse = await fetch('http://localhost:3300/users/' + params.id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const profile = await profileResponse.json();

    const profilePictureResponse = await fetch(`http://localhost:3300/users/${params.id}/avatar`, {
        method: 'GET',
    });

    let profilePicture;

    if (profilePictureResponse.status !== 400) {
        profilePicture = profilePictureResponse.url;
    }

    const getReviews = await fetch(`http://localhost:3300/users/${params.id}/reviews`, {
        method: 'GET',
    });

    const reviews = await getReviews.json();

    return {
        profile,
        profilePicture,
        reviews,
    };
}

export async function action({ request, params }) {
    const followResponse = await fetch(`http://localhost:3300/users/${params.id}/follow`, {
        method: request.method,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    await followResponse.json();
    return redirect(window.location.href);
}