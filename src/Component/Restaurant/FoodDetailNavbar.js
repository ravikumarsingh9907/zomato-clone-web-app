import { useEffect, useRef } from 'react';
import './foodDetailNavbar.scss';
import { NavLink, useLoaderData, useNavigation } from 'react-router-dom';

export default function FoodDertailNavbar() {
    const scrollRef = useRef(null);
    const { brand } = useLoaderData();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.state === 'idle' && window.scrollTo(0, 520);
    }, [navigation]);


    const handleScrollOnClick = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }

    return (
        <div className='food-detail-nav-container'>
            <ul className='options' ref={scrollRef}>
                <li className='list' onClick={handleScrollOnClick}>
                    <NavLink to={`/restaurants/${brand._id}/online-order`} className={({ isActive }) => isActive ? 'active' : undefined} end>Order Online</NavLink>
                </li>
                <li className='list' id='reviews' onClick={handleScrollOnClick}>
                    <NavLink to={`/restaurants/${brand._id}/reviews`} className={({ isActive }) => isActive ? 'active' : undefined} end>Reviews</NavLink>
                </li>
                <li className='list' onClick={handleScrollOnClick}>
                    <NavLink to={`/restaurants/${brand._id}/gallery`} className={({ isActive }) => isActive ? 'active' : undefined} end>Photos</NavLink>
                </li>
                <li className='list'>
                    <NavLink to='/' className={({ isActive }) => isActive ? 'active' : undefined}>Menu</NavLink>
                </li>
            </ul>
            <div className='divider'></div>
        </div>
    )
}