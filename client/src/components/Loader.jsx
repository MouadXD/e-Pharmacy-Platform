// const Loader = () => {
//   return (
//     <div
//       className="flex items-center justify-center w-full"
//       style={{ height: "calc(100vh - 130px)" }}
//     >
//       <div>
//         <img
//           // className="animate-spin"
//           src="https://res.cloudinary.com/dk3yapeaq/image/upload/v1707594482/rmjg7wgnwavxmtejffno.gif"
//           // src="https://res.cloudinary.com/dk3yapeaq/image/upload/v1707595165/iik0k3isyqkn3zrhoojl.png"
//           alt="logo"
//           width={"50"}
//           height={"50"}
//         />
//       </div>
//     </div>
//   );
// };

const Loader = () => {
  return (
    <div
      className="flex items-center justify-center w-full"
      style={{ height: "calc(100vh - 130px)" }}
    >
      <div className="w-[50px] h-[50px] border-[6px] border-primary border-opacity-[0.3] rounded-full relative after:content-[''] after:absolute after:w-[50px] after:h-[50px] after:border-[6px] after:border-t-primary after:border-b-transparent after:border-r-primary after:border-l-transparent after:rounded-full after:animate-spin after:top-[-6px] after:left-[-6px]"></div>
    </div>
  );
};

export default Loader;
