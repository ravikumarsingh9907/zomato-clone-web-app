import './Profile.scss'
import ProfileCard from '../Component/User/ProfileCard';
import Sidebar from '../Component/User/Sidebar';
import { Outlet, redirect } from 'react-router';
import Footer from '../Component/Footer';
import EditProfile from '../Component/User/EditProfile';

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

export default function Profile() {
    return (
        <>
            <div className='profile-page-wrapper'>
                <ProfileCard />
                <EditProfile />
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
    const getReviews = await fetch(`http://localhost:3333/users/${params.id}/reviews`, {
        method: 'GET',
    });

    const reviews = await getReviews.json();

    const profileResponse = await fetch('http://localhost:3333/users/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const profile = await profileResponse.json();
    if (profile.error) {
        return redirect(`/user/${params.id}/reviews`)
    }

    const profilePictureResponse = await fetch(`http://localhost:3333/users/${profile._id}/avatar`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    let profilePicture;

    if (profilePictureResponse.status !== 400) {
        profilePicture = profilePictureResponse.url;
    }

    return {
        reviews,
        profilePicture,
        profile
    };
}