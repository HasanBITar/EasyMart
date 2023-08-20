import { StarIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function ReviewBox({ product }) {
  const router = useRouter();
  const reviews = product.reviews;
  const { data: session } = useSession();
  const submitReview = async (event) => {
    event.preventDefault();
    const review = {
      review: event.target.review.value,
      rating: event.target.rating.value,
      product_id: product.id,
      userName: session.user.name,
    };

    await axios
      .post(`${process.env.host}/api/db/addReview`, review)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
        }
      });

    router.reload();
  };
  return (
    <div className="flex  flex-col w-full items-center">
      <h1 className="text-xl">What People Have Said About This</h1>
      <div className="flex  flex-col bg-gray-200 w-full justify-center items-center px-1 rounded">
        <div className="rounded-lg  flex w-full flex-col items-start mx-2 my-4 pb-4">
          {reviews
            ? reviews.map((review) => (
                <div className="flex flex-col items-start w-full mx-2 mt-2 pr-4 ">
                  <div className="flex mb-1 items-center">
                    <p className=" italic ml-1">{review.user.name}</p>
                    <div className="flex ml-2">
                      {Array(review.rating)
                        .fill()
                        .map((_, i) => (
                          <StarIcon key={i} className="h-4 text-purple-500" />
                        ))}
                    </div>
                  </div>
                  <div className="w-full bg-white rounded mb-2 px-2 text-lg">
                    <p>{review.review}</p>
                  </div>
                </div>
              ))
            : ""}
        </div>
        {session ? (
          <form className="w-full" onSubmit={submitReview}>
            <div className="flex flex-col items-center flex-auto mb-2">
              <label>Add Review</label>
              <textarea
                name="review"
                cols="30"
                rows="3"
                placeholder="What do you think about this product?"
                className="bg-white text-black mb-1 w-full text-center rounded-3xl"
              ></textarea>

              <div className="flex space-x-5 w-full items-center justify-center">
                <input
                  required
                  name="rating"
                  type="number"
                  max={5}
                  min={1}
                  placeholder="Rate out of 5"
                  className=" w-1/3 text-center"
                />
                <button
                  className="bg-gray-100 mt-1  w-1/3 rounded"
                  type="submit"
                >
                  Post
                </button>
              </div>
            </div>
          </form>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default ReviewBox;
