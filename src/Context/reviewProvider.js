import { reviewContext } from "./review-context";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

export default function ReviewProvider(props) {
    const [commentVisibility, setCommentVisibilty] = useState(false);
    const [reviews, setReviews] = useState([]);
    const { loggedInUser } = useLoaderData();

    useEffect(() => {
        (async () => {
            const reviewsResponse = await fetch(`http://localhost:3300${window.location.pathname}`, {
                method: 'GET',
            });

            const reviews = await reviewsResponse.json();
            setReviews(reviews);
        })();
    }, [reviews]);

    const reviewProvider = {
        reviews,
        loggedInUser,
        commentVisibility,
        setCommentVisibilty,
    }

    return (
        <reviewContext.Provider value={reviewProvider}>
            {props.children}
        </reviewContext.Provider>
    )
}