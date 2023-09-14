import './Profile.scss'
import ProfileCard from '../Component/User/ProfileCard';
import Sidebar from '../Component/User/Sidebar';
import { Outlet, redirect } from 'react-router';
import { useContext } from 'react';
import { formContext } from '../Context/form-context';
import Footer from '../Component/Footer';
import {useNavigation} from 'react-router';
import UniversalLoader from '../Component/Layout/PreLoader';

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
    const navigation = useNavigation();
    return (
        <>
            {navigation.state === 'loading' && <UniversalLoader />}
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
    const getReviews = await fetch(`https://foodie-api-nine.vercel.app/users/${params.id}/reviews`, {
        method: 'GET',
    });

    const reviews = await getReviews.json();

    const profileResponse = await fetch(`https://foodie-api-nine.vercel.app/users/${params.id}`, {
        method: 'GET',
    });

    const profile = await profileResponse.json();
    if (profile.error) {
        return redirect(`/user/${params.id}/reviews`)
    }

    const profilePictureResponse = await fetch(`https://foodie-api-nine.vercel.app/users/${params.id}/avatar`, {
        method: 'GET',
    });

    let profilePicture;

    if (profilePictureResponse.status !== 400) {
        profilePicture = profilePictureResponse.url;
    }

    return {
        reviews,
        profile,
        profilePicture,
    };
}

export async function action({ request, params }) {
    const followResponse = await fetch(`https://foodie-api-nine.vercel.app/users/${params.id}/follow`, {
        method: request.method,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    await followResponse.json();
    return redirect(window.location.href);
}