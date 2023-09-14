import './followingFollowers.scss';
import profileImg from '../../../Asset/user-profile.svg';
import { Form, Link, useNavigation } from 'react-router-dom';
import { formContext } from '../../../Context/form-context';
import { useContext, useEffect, useState } from 'react';
import UniversalLoader from '../../Layout/PreLoader';

export default function FollowingFollowersCard({ data, edit }) {
    console.log(data);
    const { loggedInUser } = useContext(formContext);
    const [redirectLink, setRedirectLink] = useState(`/user/${data._id}/reviews`);
    const navigation = useNavigation();
    const [profilePicture, setProfilePicture] = useState(profileImg);

    useEffect(() => {
        if (loggedInUser && loggedInUser.users && data.email === loggedInUser.users.email) {
            setRedirectLink(`/profile/${data._id}/reviews`)
        }

        (async () => {
            const picture = await fetch(`https://foodie-api-nine.vercel.app/users/${data._id}/avatar`, {
                method: "GET",
            });

            if(picture.status !== 400) {
                setProfilePicture(picture.url);
            }
        })();
    }, [loggedInUser, data]);

    return (
        <>
            {navigation.state === 'loading' && <UniversalLoader />}
            <div className='following-followers-container'>
                <Link to={redirectLink} className='image-container'>
                    <img src={profilePicture} alt='img' />
                </Link>
                <Link to={redirectLink} className='user-name-container'>
                    <div className='name'>
                        <h2>{data.fullname}</h2>
                    </div>
                    <div className='reviews-followers'>
                        <p className='reviews'>{data.reviews ? data.reviews.length : 0} reviews</p>
                        <p className='followers'>{data.followers.length} followers</p>
                    </div>
                </Link>
                {!edit && <Form method='delete' action={`/profile/${data._id}/followers`} className='remove-add-following-btn'>
                    <button><i className='bx bxs-user-check' ></i></button>
                </Form>}
            </div>
        </>
    );
}