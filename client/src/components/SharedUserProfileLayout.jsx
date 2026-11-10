import { Outlet, Link } from "react-router-dom";
import Container from "./Container";
import { FaUser } from "react-icons/fa";
import { BiSolidPackage } from "react-icons/bi";
import { MdLocationPin } from "react-icons/md";

const SharedUserProfileLayout = () => {
  return (
    <div>
      <Container>
        <div className="my-10">
          <div>
            <div>
              <h1 className="text-3xl font-extrabold text-secondary">
                Manage Account
              </h1>
              <p className="text-sm mt-1 text-secondary font-light">
                Add or update personal data, managing orders and adresses
              </p>
            </div>
            <div
              className="grid gap-20 mt-20"
              style={{ gridTemplateColumns: "20% 60% 20%" }}
            >
              <div className="mt-10mb-5">
                <div>
                  <Link to={"/myAccount"}>
                    <button className="flex items-center gap-4 p-2 border-ms">
                      <div className="bg-secondary p-2 rounded-full">
                        <FaUser className="text-white text-sm" />
                      </div>
                      <span className="text-lg font-extrabold text-secondary">
                        Personal Details
                      </span>
                    </button>
                  </Link>
                </div>
                <div className="mt-3">
                  <Link to={"myAccount"}>
                    <button className="flex items-center gap-4 p-2 border-ms">
                      <div className="bg-secondary p-2 rounded-full">
                        <BiSolidPackage className="text-white text-sm" />
                      </div>
                      <span className="text-lg text-secondary">
                        Orders & Returns
                      </span>
                    </button>
                  </Link>
                </div>
                <div className="mt-3">
                  <Link to={"myAccount"}>
                    <button className="flex items-center gap-4 p-2 border-ms">
                      <div className="bg-secondary p-2 rounded-full">
                        <MdLocationPin className="text-white text-sm" />
                      </div>
                      <span className="text-lg text-secondary">
                        Adresse Book
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
              <div>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SharedUserProfileLayout;
