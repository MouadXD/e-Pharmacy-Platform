import { IoIosArrowDown } from "react-icons/io";

const AnalyticsCard = ({ title, statistiques, Icon, months }) => {
  return (
    <div
      className="bg-white flex items-center gap-3 relative rounded-sm"
      style={{
        boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
        border: "1px solid rgba(101,109,119,.16)",
      }}
    >
      <div className="text-[4rem] bg-primary h-full text-white w-[20%] p-4 flex items-center justify-center">
        <Icon className="w-[50%] md:w-[100%] lg:w-[100%] h-[100%]" />
      </div>
      <div className="p-[1rem]">
        <div className="text-md font-normal mb-5">{title}</div>
        <div className="font-md text-[1.5rem] md:text-[2rem] mt-[-1.4rem] text-secondary">
          {title == "Revenue" ? (
            <span>
              {statistiques}
              <span className="text-xl md:text-2xl ml-2">DHs</span>
            </span>
          ) : (
            statistiques
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
