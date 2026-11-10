import { useParams, Link } from "react-router-dom";
import { useGetPostQuery } from "../app/apiCalls/postsCalls";
import Loader from "../components/Loader";
import Container from "../components/Container";
import isoToRedableDate from "../helpers/isoToRedableDate";

const BlogDetails = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetPostQuery(id);

  const postData = data?.data?.data;

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !postData) {
    return (
      <Container>
        <div className="my-16 text-center">
          <h1 className="text-2xl font-bold text-secondary">
            Post not found
          </h1>
          <p className="mt-2 text-gray-500">
            This article may have been removed.
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-block bg-primary px-4 py-2 text-sm text-white rounded"
          >
            Back to blog
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div className="my-10 w-full flex items-center justify-center">
      <Container>
        <div>
          <h2 className="text-xl uppercase">{postData.title}</h2>
          <p className="text-sm">{isoToRedableDate(postData.createdAt)}</p>
        </div>
        <div>
          <img
            src={postData.image?.url}
            alt=""
            className=" my-5 rounded-md border shadow-sm object-cover"
          />
        </div>
        <div className="mt-10">
          <p className="text-md">{postData.description}</p>
        </div>
      </Container>
    </div>
  );
};

export default BlogDetails;
