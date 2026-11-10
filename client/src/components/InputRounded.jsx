const InputRounded = ({
  label,
  placeholder = "",
  register,
  error,
  type = "text",
}) => {
  return (
    <div
      className={`bg-white bg-opacity-[0.1] border ${
        error ? "border-red-500" : "border-secondary"
      } rounded relative`}
      style={{ boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)" }}
    >
      <label
        htmlFor=""
        className="absolute top-[-13px] left-[10px] bg-white px-2 text-secondary"
      >
        {label}
      </label>
      <input
        type={type}
        className="focus:outline-none bg-transparent text-black w-full p-3 placeholder:text-gray-400 placeholder:font-light"
        {...register}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputRounded;
