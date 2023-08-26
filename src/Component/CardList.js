import { useState } from 'react';
import './cardList.scss';
import RoundCard from './Layout/RoundCard';

export default function CardList({ data, heading, css }) {
    const [shiftBtnVisibility, setShiftBtnVisibility] = useState({ right: true, left: false});
    const [shift, setShift] = useState(0);
    const backgroundColor = css && css.backgroundColor ? css.backgroundColor : null;

    const renderCards = data.map((item) => {
        return <RoundCard data={item} key={item._id} css={css} shift={shift} />
    });

    const handleCardShifting = (e) => {
        if(shift < 190*(data.length - 6) && e.target.textContent === 'chevron_right') {
            setShift(shift + 190);
            setShiftBtnVisibility({...shiftBtnVisibility, left: true});
        } else if (shift > 0 && e.target.textContent === 'chevron_left') {
            setShift(shift - 190);
            setShiftBtnVisibility({...shiftBtnVisibility, right: true});
        }

        if(shift === 190*(data.length - 7)) {
            setShiftBtnVisibility({...shiftBtnVisibility, right: false});
        }

        if(shift === 190) {
            setShiftBtnVisibility({...shiftBtnVisibility, left: false});
        }
    }

    return (
        <div className='wrapper' style={{backgroundColor:backgroundColor}}>
            <div className='container'>
                <div className='heading'>
                    <h2>{heading}</h2>
                </div>
                { shiftBtnVisibility.left && <div className='prev btn'>
                    <span className="material-symbols-outlined" onClick={handleCardShifting}>chevron_left</span>
                </div> }
                { shiftBtnVisibility.right && <div className='next btn'>
                    <span className="material-symbols-outlined" onClick={handleCardShifting}>chevron_right</span>
                </div> }
                <div className='list-container'>
                    {renderCards}
                </div>
            </div>
        </div>
    )
}