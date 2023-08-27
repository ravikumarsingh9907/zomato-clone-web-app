import './searchCard.scss';
import { Link } from 'react-router-dom';
import { searchContext } from '../../Context/search-context';
import { useContext } from 'react';

export default function SearchCard({ data }) {
    const { handleIsOpen } = useContext(searchContext);

    const handleCardVisibilty = () => {
        handleIsOpen(false);
    }
    return (
        <>
            {data ? <Link to={`/restaurants/${data._id}/online-order`} className='search-card-container' onClick={handleCardVisibilty}>
                <div className='image-container'>
                    <div className='image'>
                        <img src={data.image} alt='img' />
                    </div>
                </div>
                <div className='about-search-container'>
                    <div className='search-name'>
                        <h3 className='name'>{data.name}</h3>
                    </div>
                </div>
            </Link> :
                <div className='not-found-data'>
                    <h2 className='heading'>Oops!</h2>
                    <p className='message'>We could not understand what you mean, try rephrasing the query.</p>
                </div>}
        </>
    )
}