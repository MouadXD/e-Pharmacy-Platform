import Navbar from "../../components/dashboard/Navbar";
import AnalyticsCard from "../../components/dashboard/AnalyticsCard";
import Container from "../../components/Container";

const Dashboard = () => {
  return (
    <div className="dashboard h-[100vh]">
      <Navbar />
      <div className="bg-[#F6F8FB] h-[100vh]">
        {/* Content */}
        <Container>
          <div className="grid grid-cols-4 gap-5 pt-[50px]">
            <AnalyticsCard title={"Total Sales"} statistiques={"945"} />
            <AnalyticsCard title={"Total Ordesrs"} statistiques={"55"} />
            <AnalyticsCard title={"Total Users"} statistiques={"35"} />
          </div>
        </Container>
      </div>
    </div>
    // <div className="dashboard h-[100vh]">
    //   <div
    //     className="grid h-[100%]"
    //     style={{
    //       gridTemplateColumns: "18% 1fr",
    //     }}
    //   >
    //     {/* Sidebar Start */}
    //     <Sidebar />
    //     {/* Sidebar End */}
    //     {/* Dashboard Content Start */}
    //     <div>statistiqyes</div>
    //     {/* Dashboard Content End */}
    //   </div>
    // </div>
  );
};

export default Dashboard;
