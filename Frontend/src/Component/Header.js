import './header.scss';
import scooter from '../Asset/scooter-zomato.avif';
import dineout from '../Asset/dineout.avif'

export default function Header() {
    return (
        <>
            <div className='header-divider'></div>
            <div className='header-container'>
                <div className='delivery-dineout-container'>
                    <div className='delivery-container'>
                        <div className='image-container'>
                            <img src={scooter} alt='delivery' className='image' />
                        </div>
                        <p className='delivery'>Delivery</p>
                    </div>
                    <div className='dineout-container'>
                        <div className='image-container'>
                            <img src={dineout} alt='dineout' className='image' />
                        </div>
                        <p className='dineout'>Dining Out</p>
                    </div>
                </div>
                <div className='filter-container'>
                    <div className='filters-list'>
                        <span className="material-symbols-outlined">page_info</span>
                        <span className='filter-name'>Filters</span>
                    </div>
                    <div className='filters-list'>
                        <span className='filter-name'>Rating </span>
                        <span className='rating'>4.0+</span>
                    </div>
                    <div className='filters-list'>
                        <span className='filter-name'>Cuisines</span>
                        <span className="material-symbols-outlined">expand_more</span>
                    </div>
                </div>
            </div>
        </>
    )
}