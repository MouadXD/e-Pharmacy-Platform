import Container from "../components/Container";
import { useGetAllPostsQuery } from "../app/apiCalls/postsCalls";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import isoToRedableDate from "../helpers/isoToRedableDate";

const Blog = () => {
  const { data, isLoading, isError, error } = useGetAllPostsQuery(5);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <Container>
        <div className="my-16 text-center">
          <h1 className="text-2xl font-bold text-secondary">
            Could not load posts
          </h1>
          <p className="mt-2 text-gray-500">
            {error?.response?.data?.message || "Please try again later."}
          </p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <div className="bg-[url('http://localhost:5173/src/static/banner.png')] bg-no-repeat bg-cover">
        <Container>
          <div className="py-10">
            <div className="flex items-center gap-3">
              <h1 className="font-semibold text-white text-4xl tracking-tight">
                Blog
              </h1>
            </div>
            <p className="text-white font-light">Explore latest blogs.</p>
          </div>
        </Container>
      </div>
      <div className="my-10">
        <Container>
          <section className="pb-6">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-3 gap-5">
                {data?.data?.data?.length > 0 ? (
                  data?.data?.data?.map((post) => {
                    const { _id, title, description, createdAt, image } = post;
                    return (
                      <div
                        className="group w-full  border border-gray-300 rounded-2xl cursor-pointer"
                        key={_id}
                      >
                        <Link to={`/blog/${_id}`}>
                          <div className="flex items-center">
                            <img
                              src={image?.url}
                              alt="blogs tailwind section"
                              className="rounded-t-2xl w-full h-52 object-cover"
                            />
                          </div>
                          <div className="p-4 lg:p-6 transition-all duration-300 rounded-b-2xl group-hover:bg-gray-50">
                            <span className="text-primary font-medium mb-3 block">
                              {isoToRedableDate(createdAt).substring(0, 14)}
                            </span>
                            <h4 className="text-xl text-gray-900 font-medium leading-1 mb-5">
                              {title?.substring(0, 50)}
                            </h4>
                            <p className="text-gray-500">
                              {description?.substring(0, 50)}...
                            </p>
                            {/* <Link
                            to={`/blog/${_id}`}
                            className="before:ease relative h-10 w-40 p-4 rounded-full overflow-hidden border border-green-500 bg-green-500 text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:before:-translate-x-40"
                          >
                            Read more..
                          </Link> */}
                          </div>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <h4>No posts yet!</h4>
                )}
              </div>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
};

export default Blog;
