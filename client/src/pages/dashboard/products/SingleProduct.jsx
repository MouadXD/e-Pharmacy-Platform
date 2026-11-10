import { useParams, Link } from "react-router-dom";
import Container from "../../../components/Container";
import { FaPen, FaAngleRight } from "react-icons/fa";
import LocationRight from "../../../components/LocationRight";

const SingleProduct = () => {
  const { id: productId } = useParams();
  return (
    <div className="bg-[#F6F8FB]" style={{ height: "calc(100vh - 130px)" }}>
      <Container>
        <div className="flex items-center justify-between py-[30px]">
          <LocationRight
            list={["Inventory", "List of Medecines", "Dolyprane"]}
          />
          <Link
            to={"/dashboard/products/edit"}
            className="bg-secondary text-white p-3 rounded"
          >
            <button className="flex items-center gap-2">
              <FaPen className="font-bold text-sm" />
              <div className="text-sm">Edit Details</div>
            </button>
          </Link>
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: "30% 70%" }}>
          <div
            className="rounded bg-white"
            style={{
              border: "1px solid rgba(101,109,119,.16)",
              boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
            }}
          >
            <div
              className="text-lg font-bold p-4"
              style={{ borderBottom: "1px solid rgba(101,109,119,.16)" }}
            >
              Medecine
            </div>
            <div className="p-4 flex items-center gap-[8rem]">
              <div>
                <div className="font-bold text-[1.5rem]">289</div>
                <div className="text-md">Medecine ID</div>
              </div>
              <div className="flex-1">
                <div className="font-bold text-[1.5rem]">24</div>
                <div className="text-md">Medecine Group</div>
              </div>
            </div>
          </div>
          <div
            className="rounded bg-white"
            style={{
              border: "1px solid rgba(101,109,119,.16)",
              boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
            }}
          >
            <div
              className="p-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(101,109,119,.16)" }}
            >
              <div className="text-lg font-bold">Inventory in Qty</div>
              <div className="underline text-sm">Send Stock Request</div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
  //   return <h1>{productId}</h1>;
};

export default SingleProduct;
