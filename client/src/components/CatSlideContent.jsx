import { Link } from "react-router-dom";
import { useGetAllCategoriesQuery } from "../app/apiCalls/categoryCalls";
import Loader from "./Loader";

const CategoriesSlideContent = () => {
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useGetAllCategoriesQuery();

  if (isCategoriesLoading) {
    return <Loader />;
  }

  if (isCategoriesError) {
    return <h1>{categoriesError.message}</h1>;
  }

  // console.log(categoriesData);

  return (
    <div>
      <ul>
        {categoriesData.data.total == 0 ? (
          <div className="w-full h-[100vh] flex items-center justify-center">
            <h4 className="text-sm text-gray-500 font-light">
              No Categories Yet!
            </h4>
          </div>
        ) : (
          categoriesData.data.data.map((category) => {
            const { _id, title } = category;
            return (
              <Link to={`/categories/${_id}`} key={_id}>
                <li className="p-2 pl-5 hover:bg-primary hover:text-white hover:transition transition text-sm">
                  {title}
                </li>
              </Link>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default CategoriesSlideContent;
