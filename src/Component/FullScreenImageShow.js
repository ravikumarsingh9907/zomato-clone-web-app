import './fullScreenImageShow.scss';
import { imageMagnifier } from '../Context/imageMagnifierProvider';
import { useContext } from 'react';

export default function FullScreenImageShow() {
    const { isOpen, handleIsOpen, elementRef } = useContext(imageMagnifier);

    const handleOnClick = () => { 
        handleIsOpen(false);
        window.scrollTo({
            top: 520,
            behavior: 'smooth',
        });
        document.body.style.overflow = 'auto';
    }

    return (
        <>
            {isOpen && <div className='full-screen-image-show-wrapper'>
                <div className='full-screen-image-show-container'>
                    <div className='image-container'>
                        {elementRef !== null ? <img src={elementRef.current.attributes[0].textContent} alt='img' /> : ''}
                    </div>
                    <div className='close-image'>
                        <button className='btn' onClick={handleOnClick}>
                            <i className='bx bx-x'></i>
                        </button>
                    </div>
                </div>
                <div className='overlay'></div>
            </div>}
        </>
    )
}