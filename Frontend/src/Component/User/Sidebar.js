import './sidebar.scss';
import { NavLink } from 'react-router-dom';

export default function ProfileSidebar({data}) {

    const renderList = data.item.map(list => {
        return <NavLink to={list.url} key={list.id} className={({isActive}) => isActive ? 'active' : undefined} end>{list.name}</NavLink>
    }) 

    return(
        <div className='profile-sidebar-wrapper'>
            <div className='heading-container'>
                <p className='heading'>{data.heading}</p>
            </div>
            <div className='list-container'>
                {renderList}
            </div>
        </div>
    )
}