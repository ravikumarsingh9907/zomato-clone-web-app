import { reviewContext } from "./review-context";
import { useState } from "react";

export default function ReviewProvider(props) {
    const [isFormVisibile, setIsFormVisible] = useState('write-review-wrapper hidden');

    const handleReviewFormVisibility = (value) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        document.body.style.overflow = 'hidden';
        setIsFormVisible(value);
    }

    const reviewProvider = {
        isFormVisibile,
        handleReviewFormVisibility,
    }

    return (
        <reviewContext.Provider value={reviewProvider}>
            {props.children}
        </reviewContext.Provider>
    )
}