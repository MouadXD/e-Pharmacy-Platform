const DashboardHeader = ({ title, description }) => {
  return (
    <div className="pt-[30px]">
      <div className="font-bold text-[1.5rem] text-secondary tracking-tighter">
        {title}
      </div>
      <div className="text-sm">{description}</div>
    </div>
  );
};

export default DashboardHeader;
