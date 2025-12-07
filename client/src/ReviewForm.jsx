import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import API_URL from './api'; // Import API_URL

async function sendReview(url, { arg }) {
    return axios.post(url, arg).then(res => res.data);
}

const ReviewForm = ({ movieId, movieTitle, user, onReviewAdded }) => {
    const { trigger, isMutating, error } = useSWRMutation(
        `${API_URL}/reviews`, // Use API_URL
        sendReview
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const content = formData.get('content');
        const rating = Number(formData.get('rating'));

        try {
            const result = await trigger({
                userId: user.uid,
                userEmail: user.email,
                movieId,
                movieTitle,
                content,
                rating
            });

            e.target.reset();
            if (onReviewAdded) onReviewAdded(result);
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return <p className="login-prompt">Please login to write a review.</p>;

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3>Write a Review</h3>
            {error && <div className="error-message">Failed to submit review.</div>}

            <div className="form-group">
                <label>Rating:</label>
                <select name="rating" defaultValue="5" className="rating-select">
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} ⭐</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
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