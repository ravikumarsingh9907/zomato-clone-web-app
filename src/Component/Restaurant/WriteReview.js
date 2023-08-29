import { useContext, useState } from 'react';
import './writeReview.scss';
import { reviewContext } from '../../Context/review-context';

export default function WriteComment() {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [file, setFile] = useState(null);
    const { isFormVisibile, handleReviewFormVisibility } = useContext(reviewContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleFormVisibility = () => {
        setRating(0);
        setFeedback('');
        setFile('');
        handleReviewFormVisibility('write-review-wrapper hidden');
        document.body.style.overflow = 'auto';
    }

    const handleFeedbackOnChange = (e) => {
        setFeedback(e.target.value)
    }

    const handleFileUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFile(selectedFiles);
    }

    const handleFormData = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('rating', rating);
        formData.append('review', feedback);

        if (file && file.length) {
            file.forEach((file) => {
                formData.append(`images`, file);
            });
        }

        setIsLoading(true);
        const uploadResponse = await fetch(`http://localhost:3300${window.location.pathname}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        })

        const result = await uploadResponse.json();
        if (result._id) {
            setIsLoading(false);
            handleReviewFormVisibility('write-review-wrapper hidden');
            document.body.style.overflow = 'auto';
            setRating(0);
            setFeedback('');
            setFile('');
        }
    }

    return (
        <div className={isFormVisibile}>
            <div className='overlay'></div>
            <form className='write-review-container'>
                <i className='bx bx-x close-btn' onClick={handleFormVisibility}></i>
                <div className='heading-container'>
                    <h2 className='heading'>Feedback</h2>
                </div>
                <div className='rating-container'>
                    <ul className='start-container'>
                        {[1, 2, 3, 4, 5].map((star, index) => {
                            return (
                                <li className='start' key={star}><i className='bx bx-star'
                                    onClick={() => handleStarClick(star)}
                                    style={{
                                        cursor: 'pointer',
                                        color: star <= rating ? 'rgb(255, 126, 139)' : 'gray',
                                    }}>
                                </i></li>
                            )
                        })
                        }
                    </ul>
                </div>
                <div className='comment-container'>
                    <label htmlFor='comment'>Write your feedback</label>
                    <textarea id='comment' className='comment' cols='50' rows='10' onChange={handleFeedbackOnChange}></textarea>
                </div>
                <div className='upload-photos-container'>
                    <label htmlFor='file-upload'>Upload photos</label>
                    <input type='file' id='file-upload' className='upload-photos' multiple onChange={handleFileUpload} />
                </div>
                <button type='submit' className='submit-btn' onClick={handleFormData}>{isLoading ? <i className='bx bx-loader-alt loader' ></i> : 'Submit'}</button>
            </form>
        </div>
    )
}