import InputRounded from "../components/InputRounded";

const LabelInput = ({ label = "", type = "text", placeholder = "" }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="uppercase text-secondary text-sm font-extrabold">
        {label}
      </span>
      <input
        type={type}
        className="bg-secondary px-5 py-3 rounded-sm border-secondary border border-opacity-5 bg-opacity-5 focus:outline-none placeholder:text-secondary"
        placeholder={placeholder}
      />
    </div>
  );
};

const PersonalDetails = () => {
  return (
    <div className=" p-5">
      {/* // <div className="bg-gray-500 bg-opacity-5 border-secondary border border-opacity-5 rounded-md p-5"> */}
      <div>
        {/* <h2 className="font-extrabold text-lg text-secondary">
          personal data
        </h2> */}
        <div className="grid grid-cols-2 gap-5">
          <LabelInput label={"First Name"} placeholder={"Mouad"} />
          <LabelInput label={"Last Name"} placeholder={"Boufas"} />
        </div>
        <div className="grid grid-cols-2 gap-5 my-5">
          <LabelInput label={"date"} type={"date"} placeholder={"2022-01-01"} />
          <LabelInput label={"phone number"} placeholder={"+212 720627253"} />
        </div>
        <div className="my-5">
          <LabelInput
            label={"Email"}
            type={"email"}
            placeholder={"mouadboufas1090@gmail.com"}
          />
        </div>
        <div className="my-5">
          <LabelInput
            label={"password"}
            type={"password"}
            // placeholder={"slkk4j345345klj"}
          />
        </div>
        {/* <div className="grid grid-cols-2 gap-5">
          <InputRounded label={"First Name"} />
          <InputRounded label={"Last Name"} />
        </div>
        <div className="my-10 grid grid-cols-2 gap-5">
          <InputRounded label={"Email Adresse"} type="email" />
          <InputRounded label={"Birth Date"} type="date" />
        </div>
        <div
          className="my-10 grid gap-5"
          style={{ gridTemplateColumns: "1fr auto" }}
        >
          <InputRounded label={"Password"} type="password" />
          <button className="bg-secondary text-white px-10 rounded-sm">
            Change
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PersonalDetails;
