import useSWRMutation from 'swr/mutation';
import axios from 'axios';

// 1. Define the fetcher for the mutation (POST request)
// SWR passes the URL and the 'arg' (our review data) to this function
async function sendReview(url, { arg }) {
    return axios.post(url, arg).then(res => res.data);
}

const ReviewForm = ({ movieId, movieTitle, user, onReviewAdded }) => {
    // 2. useSWRMutation manages the submission state for us
    // 'trigger' is the function we call to send the request
    // 'isMutating' replaces the local 'isSubmitting' state
    // 'error' replaces the local 'error' state
    const { trigger, isMutating, error } = useSWRMutation(
        'http://localhost:5000/reviews',
        sendReview
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 3. Use FormData to get values from inputs (Replaces 'content' & 'rating' state)
        const formData = new FormData(e.target);
        const content = formData.get('content');
        const rating = Number(formData.get('rating'));

        try {
            // Trigger the API call via SWR
            const result = await trigger({
                userId: user.uid,
                userEmail: user.email,
                movieId,
                movieTitle,
                content,
                rating
            });

            // Reset the HTML form visually
            e.target.reset();

            // Notify parent component to update the list
            if (onReviewAdded) onReviewAdded(result);
        } catch (err) {
            // Error is handled automatically by SWR's 'error' object
            console.error(err);
        }
    };

    if (!user) return <p className="login-prompt">Please login to write a review.</p>;

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3>Write a Review</h3>

            {/* SWR automatically provides the error object if the request fails */}
            {error && <div className="error-message">Failed to submit review.</div>}

            <div className="form-group">
                <label>Rating:</label>
                {/* Uncontrolled Input: Use 'name' for FormData and 'defaultValue' */}
                <select name="rating" defaultValue="5" className="rating-select">
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} ⭐</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                {/* Uncontrolled Input: Use 'name' for FormData */}
                <textarea
                    name="content"
                    placeholder="What did you think of the movie?"
                    required
                    rows="4"
                />
            </div>

            <button type="submit" disabled={isMutating} className="btn-submit">
                {isMutating ? 'Posting...' : 'Post Review'}
            </button>
        </form>
    );
};

export default ReviewForm;