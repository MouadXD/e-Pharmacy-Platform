import Container from "../../components/Container";
import LocationRight from "../../components/LocationRight";
import { GoPlus } from "react-icons/go";
import Pagination from "../../components/Pagination";
import { useState } from "react";
import Modal from "../../components/Modal";
import InputRounded from "../../components/InputRounded";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorInputMessage from "../../components/ErrorInputMessage";
import { IoIosSend } from "react-icons/io";

const supplierSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  phoneNumber: yup.string().required().min(10),
  adresse: yup.string().required(),
  company: yup.string().required(),
});

const Suppliers = () => {
  const suppliers = [
    {
      id: "dfsdf23423",
      name: "Moad",
      email: "mouad1234@gmail.com",
      phoneNumber: "8979878798",
      adresse: "dfsdfsf",
      company: "GSK",
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(supplierSchema),
  });

  const onSubmit = (requestBody) => {
    /**
     * ! SEND REQUEST TO SERVER
     */
    console.log(requestBody);
  };

  return (
    <>
      <div
        className="bg-[#F6F8FB] relative"
        style={{ height: "calc(100vh - 130px)" }}
      >
        {isModalOpen ? (
          <Modal>
            <div className="text-lg font-semibold">Add New Supplier</div>
            <div className="text-sm">
              {" "}
              <span className="text-red-500">*</span> fields are required
            </div>
            <div>
              <form>
                <div className="my-8">
                  <InputRounded
                    label={"Name*"}
                    register={register("name")}
                    error={errors.name?.message}
                  />
                  <ErrorInputMessage message={errors.name?.message} />
                </div>
                <div className="my-8">
                  <InputRounded
                    label={"Email*"}
                    register={register("email")}
                    error={errors.email?.message}
                  />
                  <ErrorInputMessage message={errors.email?.message} />
                </div>
                <div className="my-8">
                  <InputRounded
                    label={"Phone Number*"}
                    register={register("phoneNumber")}
                    error={errors.phoneNumber?.message}
                  />
                  <ErrorInputMessage message={errors.phoneNumber?.message} />
                </div>
                <div className="my-8">
                  <InputRounded
                    label={"Adresse*"}
                    register={register("adresse")}
                    error={errors.adresse?.message}
                  />
                  <ErrorInputMessage message={errors.adresse?.message} />
                </div>
                <div className="my-8">
                  <InputRounded
                    label={"Company*"}
                    register={register("company")}
                    error={errors.company?.message}
                  />
                  <ErrorInputMessage message={errors.company?.message} />
                </div>

                {/* <div
                className="bg-secondary bg-opacity-[0.1] border border-secondary my-3 rounded"
                style={{ boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)" }}
              >
                <input
                  type="text"
                  placeholder="Email"
                  className="focus:outline-none bg-transparent text-black w-full p-3 placeholder:text-secondary"
                />
              </div>
              <div
                className="bg-secondary bg-opacity-[0.1] border border-secondary my-3 rounded"
                style={{ boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)" }}
              >
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="focus:outline-none bg-transparent text-black w-full p-3 placeholder:text-secondary"
                />
              </div>
              <div
                className="bg-secondary bg-opacity-[0.1] border border-secondary my-3 rounded"
                style={{ boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)" }}
              >
                <input
                  type="text"
                  placeholder="Adresse"
                  className="focus:outline-none bg-transparent text-black w-full p-3 placeholder:text-secondary"
                />
              </div>
              <div
                className="bg-secondary bg-opacity-[0.1] border border-secondary my-3 rounded"
                style={{ boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)" }}
              >
                <input
                  type="text"
                  placeholder="Company"
                  className="focus:outline-none bg-transparent text-black w-full p-3 placeholder:text-secondary"
                />
              </div> */}
              </form>
            </div>
            <div className="mt-9 flex items-center justify-between gap-5">
              <button
                className="flex-1 bg-secondary text-white p-2 rounded"
                onClick={handleSubmit(onSubmit)}
              >
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
              <LocationRight list={["Suppliers"]} />
              <div className="text-sm">Explore all categories.</div>
            </div>
            <div className="bg-secondary text-white p-3 rounded cursor-pointer">
              <button
                className="flex items-center gap-2"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <GoPlus className="font-bold text-sm" />
                <div className="text-sm">Add New Supplier</div>
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
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Adresse</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Stock Request</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {suppliers.map((element) => {
                  const { id, name, email, phoneNumber, adresse, company } =
                    element;
                  return (
                    <tr
                      style={{
                        borderBottom: "1px solid rgba(101,109,119,.16)",
                      }}
                      key={id}
                    >
                      <td className="p-4 font font-normal">{name}</td>
                      <td className="p-4 font-normal">{email}</td>
                      <td className="p-4 font-normal">{phoneNumber}</td>
                      <td className="p-4 font-normal">{adresse}</td>
                      <td className="p-4 font-normal">{company}</td>
                      <td className="p-4 font-normal flex items-center justify-center">
                        <button className="bg-secondary -500 p-2 rounded cursor-pointer flex items-center gap-1 justify-center">
                          <IoIosSend className="text-white" />
                          <span className="text-white">Send</span>
                        </button>
                      </td>
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
      <DevTool control={control} />
    </>
  );
};

export default Suppliers;
