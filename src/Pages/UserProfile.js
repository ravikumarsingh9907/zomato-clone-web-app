import './Profile.scss'
import ProfileCard from '../Component/User/ProfileCard';
import Sidebar from '../Component/User/Sidebar';
import { Outlet, redirect } from 'react-router';
import { useContext } from 'react';
import { formContext } from '../Context/formProvider';
import Footer from '../Component/Footer';
import {useNavigation} from 'react-router';
import UniversalLoader from '../Component/Layout/PreLoader';
import { fetchData, fetchDataMultipart, postData } from '../Utilities/api';

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
    const reviews = await fetchData(`/users/${params.id}/reviews`);

    const profile = await fetchData(`/users/${params.id}`);
    if (profile.error) {
        return redirect(`/user/${params.id}/reviews`)
    }

    const profilePictureResponse = await fetchDataMultipart(`/users/${params.id}/avatar`);

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
    await postData(`/users/${params.id}/follow`, '', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    return redirect(window.location.href);
}