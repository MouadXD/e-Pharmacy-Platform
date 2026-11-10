import Container from "../../components/Container";
import LocationRight from "../../components/LocationRight";
import { useState } from "react";
import { GoPlus } from "react-icons/go";
import InputRounded from "../../components/InputRounded";
import Modal from "../../components/Modal";
import Pagination from "../../components/Pagination";

const Managers = () => {
  const managers = [
    {
      id: "dfdsf4334",
      fullName: "Mouad Boufas",
      email: "kjhkh@Kjh.com",
      createdAt: "afdsf",
      isBlocked: "true",
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className="bg-[#F6F8FB] relative"
      style={{ height: "calc(100vh - 130px)" }}
    >
      {isModalOpen ? (
        <Modal>
          <div className="text-lg font-semibold">Add New Manager</div>
          <div className="text-sm">
            {" "}
            <span className="text-red-500">*</span> fields are required
          </div>
          <div>
            <form>
              <div className="my-8">
                <InputRounded
                  label={"First Name"}
                  name={"coupon_code"}
                  type={"text"}
                />
              </div>
              <div className="my-8">
                <InputRounded
                  label={"Last Name*"}
                  name={"email"}
                  type={"text"}
                />
              </div>
              <div className="my-8">
                <InputRounded
                  label={"Gender*"}
                  name={"phoneNumber"}
                  type={"text"}
                />
              </div>
              <div className="my-8">
                <InputRounded
                  label={"Adresse*"}
                  name={"phoneNumber"}
                  type={"text"}
                />
              </div>
              <div className="my-8">
                <InputRounded
                  label={"Email*"}
                  name={"phoneNumber"}
                  type={"text"}
                />
              </div>
              <div className="my-8">
                <InputRounded
                  label={"Password*"}
                  name={"phoneNumber"}
                  type={"text"}
                />
              </div>
            </form>
          </div>
          <div className="mt-9 flex items-center justify-between gap-5">
            <button className="flex-1 bg-secondary text-white p-2 rounded">
              Save
            </button>
            <button
              className="flex-1 border border-black p-2 rounded"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      ) : null}
      <Container>
        <div className="py-[30px] flex items-center justify-between">
          <div>
            <LocationRight list={["Managers"]} />
            <div className="text-sm">Explore all Managers.</div>
          </div>
          <div className="bg-secondary text-white p-3 rounded cursor-pointer">
            <button
              className="flex items-center gap-2"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <GoPlus className="font-bold text-sm" />
              <div className="text-sm">Add New Manager</div>
            </button>
          </div>
        </div>
        <div className="py-4">
          <table
            className="table-auto w-[100%] bg-white rounded-sm text-center"
            style={{
              boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
              border: "1px solid rgba(101,109,119,.16)",
            }}
          >
            <thead className="border text-md">
              <tr>
                <th className="p-4">Full Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Created At</th>
                <th className="p-4">Is Blocked</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {managers.map((manager) => {
                const { id, fullName, email, createdAt, isBlocked } = manager;
                return (
                  <tr
                    style={{ borderBottom: "1px solid rgba(101,109,119,.16)" }}
                    key={id}
                  >
                    <td className="p-4 font font-normal">{fullName}</td>
                    <td className="p-4 font font-normal">{email}</td>
                    <td className="p-4 font-normal">{createdAt}</td>
                    <td className="p-4 font-normal">{isBlocked}</td>
                    {/* <td className="p-4 font-normal flex items-center justify-center">
        <button className="bg-secondary -500 p-2 rounded cursor-pointer flex items-center gap-1 justify-center">
          <IoIosSend className="text-white" />
          <span className="text-white">Send</span>
        </button>
      </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          next={true}
          previous={true}
          totalPages={50}
          currentPage={2}
          limit={10}
        />
      </Container>
    </div>
  );
};

export default Managers;
