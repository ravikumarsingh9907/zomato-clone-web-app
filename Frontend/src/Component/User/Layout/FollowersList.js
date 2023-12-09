import './followingFollowers.scss';
import noFollowerFoundImg from '../../../Asset/followers-no-followers-yet.avif';
import NotFound from './NotFound';
import FollowersFollowingCard from './FollowersFollowingCard';

export default function FollowersFollowingList({ data, edit }) {
    const renderFollowersOrFollowing = data.map(follow => {
        return (
            <>
                <FollowersFollowingCard data={follow} edit={edit} key={data._id}/>
            </>
        );
    });

    return (
        <>
            {renderFollowersOrFollowing.length > 0 ? renderFollowersOrFollowing : <NotFound image={noFollowerFoundImg} description='You are not following any user yet.' />}
        </>
    )
}