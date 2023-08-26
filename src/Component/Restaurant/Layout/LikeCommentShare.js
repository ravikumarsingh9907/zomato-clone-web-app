import { useContext, useEffect, useRef, useState } from 'react';
import './likeCommentShare.scss';
import CommentProfile from '../../User/Layout/FollowingFollowersCard';
import { useLoaderData } from 'react-router';
import { formContext } from '../../../Context/form-context';

export default function LikeCommentShare({ data, reviewLikes, comments }) {
    const { loggedInUser } = useLoaderData();
    const [isLoading, setIsLoading] = useState(false);
    const [commentSubmissionProcess, setCommentSubmissionProcess] = useState(false);
    const [isLiked, setIsLiked] = useState(true);
    const [commentVisibility, setCommentVisibilty] = useState(false);
    const [commentValue, setCommentValue] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const EditedCommentRef = useRef(null);
    const [editedComment, setEditedComment] = useState('');
    const { handleFormVisibility, handleLoginForm } = useContext(formContext);

    useEffect(() => {
        if (!loggedInUser.error) {
            reviewLikes.likes.forEach((like) => {
                if (like._id !== loggedInUser._id) {
                    setIsLiked(true);
                } else {
                    setIsLiked(false);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedInUser]);

    const handleCommentVisibilty = () => {
        setCommentVisibilty(!commentVisibility);
    }

    const handleLikeEvent = async (e) => {
        e.preventDefault();
        let method;

        if (!e.target.method) {
            method = e.target.parentElement.method
        } else {
            method = e.target.method
        }

        if (method === 'post') {
            setIsLoading(true);
            const likeEventResponse = await fetch(`http://localhost:3300/restaurants/${data.brand._id}/reviews/${data._id}/like`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await likeEventResponse.json();
            if (result._id) {
                setIsLiked(!isLiked);
            }

            setIsLoading(false);
        } else {
            setIsLoading(true);
            const likeEventResponse = await fetch(`http://localhost:3300/restaurants/${data.brand._id}/reviews/${data._id}/like`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await likeEventResponse.json();
            if (result._id) {
                setIsLiked(!isLiked);
            }

            setIsLoading(false);
        }
    }

    const handleOnChangeValue = (e) => {
        setCommentValue(e.target.value)
    }

    const handleCommentSubmission = async (e) => {
        e.preventDefault();
        if(loggedInUser.error) {
            handleFormVisibility('form-container');
            handleLoginForm();
            return;
        }

        setCommentSubmissionProcess(true);
        const submitComment = await fetch(`http://localhost:3300/restaurants/${data.brand._id}/reviews/${data._id}/comment`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ comment: commentValue })
        });

        const commentResponse = await submitComment.json();

        if (commentResponse._id) {
            setCommentSubmissionProcess(false);
            setCommentValue('');
        }
    }

    const handleEditCommentToggle = (e) => {
       setIsEditable(true);
       setEditedComment(EditedCommentRef.current.textContent);
    }

    const handleEditCommentChange = (e) => {
        setEditedComment(e.target.value);
    }

    const handleEditCommentEvent = (commentId) => {
        return async () => {
            const editResponse = await fetch(`http://localhost:3300/restaurants/${data.brand._id}/reviews/${data._id}/comment/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({comment: editedComment})
            });

            const editComment = await editResponse.json();
            console.log(editComment);
            setIsEditable(false);
        }
    }

    const handleDeleteCommentEvent = (commentId) => {
        return async () => {
            const deleteCommment = await fetch(`http://localhost:3300/restaurants/${data.brand._id}/reviews/${data._id}/comment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            await deleteCommment.json();
        }
    }

    const renderComments = comments.comments.map((comment) => {
        return (
            <div className='comment-list'>
                <CommentProfile data={comment.user} edit='false' />
                <div className='comment-details'>
                    {isEditable ? <input className='edit-comment' cols='139' rows='2' placeholder='Write your comment' value={editedComment} onChange={handleEditCommentChange} /> : <p className='comment' ref={EditedCommentRef}>{comment.comment}</p>}
                    {comment.user._id === loggedInUser._id && <p className='edit-delete'>
                        {!isEditable ? <span onClick={handleEditCommentToggle}>edit</span> : <span onClick={handleEditCommentEvent(comment._id)}>save</span>}
                        <span onClick={handleDeleteCommentEvent(comment._id)}>delete</span>
                    </p>}
                </div>
            </div>
        )
    })

    return (
        <div className='like-comment-share-container'>
            <div className='like-comment-share-detail'>
                {isLiked || <form method='delete' className='like-container liked' onClick={handleLikeEvent}>
                    {isLoading ? <i class='bx bx-loader-alt loader'></i> : <i class='bx bx-like'></i>}
                    <span className='like'>Helpful</span>
                </form>}
                {!isLiked || <form method='post' className='like-container' onClick={handleLikeEvent}>
                    <i class='bx bx-like'></i>
                    <span className='like'>Helpful</span>
                </form>}
                {!commentVisibility ? <div className='comment-container' onClick={handleCommentVisibilty}>
                    <i class='bx bx-message-square-dots'></i>
                    <span className='comment'>Comment</span>
                </div> : <div className='comment-container active' onClick={handleCommentVisibilty}>
                    <i class='bx bx-message-square-dots'></i>
                    <span className='comment'>Comment</span>
                </div>}
                <div className='share-container'>
                    <i class='bx bx-share bx-flip-horizontal' ></i>
                    <span className='share'>Share</span>
                </div>
            </div>
            {commentVisibility && <div className='comment-wrapper'>
                <form onSubmit={handleCommentSubmission} className='comment-box-container'>
                    <input name='textarea' cols='139' rows='2' placeholder='Write your comment' value={commentValue} onChange={handleOnChangeValue} />
                    {commentSubmissionProcess && <i class='bx bx-loader-alt loader'></i>}
                </form>
                <div className='comment-list-container'>
                    {renderComments}
                </div>
            </div>}
        </div>
    )
}