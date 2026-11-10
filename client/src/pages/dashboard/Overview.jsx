import Container from "../../components/Container";
import AnalyticsCard from "../../components/dashboard/AnalyticsCard";
import RecentOrders from "../../components/dashboard/RecentOrders";
import RecentExpiryProducts from "../../components/dashboard/RecentExpiryProducts";
import { GiMiracleMedecine } from "react-icons/gi";
import { GiMoneyStack } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import Loader from "../../components/Loader";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
// import { useGetOverviewDataQuery } from "../../app/features/api/apiSlice";
import { GiHealthCapsule } from "react-icons/gi";
import { useGetOverviewQuery } from "../../app/apiCalls/overviewCalls";
import { useSelector } from "react-redux";
import { FaKitMedical } from "react-icons/fa6";
import SalesTrendChart from "../../components/dashboard/charts/SalesTrens";
import TopProductsChart from "../../components/dashboard/charts/TopProducts";
import CustomerInsightsChart from "../../components/dashboard/charts/CustomInsight";
import OrderStatus from "../../components/dashboard/charts/OrdersStatus";
import { BsCapsule } from "react-icons/bs";
import Table from "../../components/Table";
import { useGetOrders } from "../../app/apiCalls/ordersCalls";
import isoToRedableDate from "../../helpers/isoToRedableDate";

const Overview = () => {
  const token = useSelector((state) => state.user.userInfo.accessToken);

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    error: overviewError,
  } = useGetOverviewQuery(token);

  const {
    data: ordersdata,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
  } = useGetOrders(token, "", 6);

  if (isOverviewLoading) {
    return <Loader />;
  }

  console.log("ordersdata", ordersdata);

  if (isOverviewError) {
    return <h1>{overviewError.message}</h1>;
  }

  // Just an example
  const salesData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Sales",
        data: [3000, 2000, 5000, 4000, 6000, 7000, 8000],
        borderColor: "#34B34C",
        backgroundColor: "rgba(52, 179, 76, 0.2)",
        pointBackgroundColor: "#0B4A2D",
        pointBorderColor: "#0B4A2D",
      },
    ],
  };

  const topProducts = {
    labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
    datasets: [
      {
        label: "Units Sold",
        data: [500, 300, 400, 700, 200],
        backgroundColor: "rgba(52, 179, 76, 0.2)",
        borderColor: "#34B34C",
        borderWidth: 1,
      },
    ],
  };

  const customerInsight = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        data: [55, 40, 5],
        backgroundColor: [
          "rgba(52, 179, 76, 0.2)",
          "rgba(11, 74, 45, 0.2)",
          "rgba(52, 179, 76, 0.4)",
        ],
        borderColor: ["#34B34C", "#0B4A2D", "#34B34C"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-[#F6F8FB] w-full min-h-screen">
      <Container>
        <DashboardHeader
          title={"Overview"}
          description={"A quick data overview of the inventory."}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 py-[30px] justify-between grid-flow-row">
          <AnalyticsCard
            title={"Medecines Available"}
            // statistiques={data?.data.statistics.productsTotal}
            statistiques={overviewData?.data.statistics.productsTotal}
            Icon={BsCapsule}
          />
          <AnalyticsCard
            title={"Expired Products"}
            statistiques={overviewData?.data.statistics.expiredProducts.total}
            Icon={FaKitMedical}
          />
          <AnalyticsCard
            title={"Revenue"}
            statistiques={overviewData?.data.statistics.revenue?.toFixed(2)}
            Icon={GiMoneyStack}
            months={true}
          />
          <AnalyticsCard
            title={"Total Users"}
            statistiques={overviewData?.data.statistics.usersTotal}
            Icon={FaUsers}
          />
        </div>
        {ordersdata?.data?.data?.length > 0 ? (
          <div
            className="grid gap-5 my-5"
            style={{ gridTemplateColumns: "1fr" }}
          >
            <div className="w-full">
              <div className="font-bold text-[1.5rem] text-secondary tracking-tighter">
                Recent Orders
              </div>
              <Table
                fields={[
                  "ID",
                  "Customer",
                  "TotalPrice (DHs)",
                  // "Date",
                  "Payment Status",
                  "Delivery Status",
                ]}
              >
                {ordersdata?.data?.data?.length > 0 &&
                  ordersdata?.data?.data?.map((order, i) => {
                    const {
                      _id,
                      userInfo,
                      createdAt,
                      paymentStatus,
                      deliveryStatus,
                      totalPrice,
                    } = order;
                    return (
                      <div
                        className={`flex items-center justify-between border-b border-r border-l text-sm bg-white py-4 px-5`}
                        key={_id}
                      >
                        <div className="flex-1 text-center">
                          #{_id.toString().substring(0, 8)}
                        </div>
                        <div className="flex-1 text-center">
                          {userInfo?.email}
                        </div>
                        <div className="flex-1 text-center">
                          {totalPrice?.toFixed(2)}
                        </div>
                        {/* <div className="flex-1 text-center">
                      {isoToRedableDate(createdAt)}
                    </div> */}
                        <div className="flex-1 text-center text-[0.9rem] flex items-center gap-2 justify-center">
                          <span
                            className={`${
                              paymentStatus === "PAID"
                                ? "bg-yellow-500 text-yellow-500"
                                : "bg-primary text-primary"
                            } bg-opacity-5 text-xs px-4 py-2 rounded-full`}
                          >
                            {paymentStatus === "PAID" ? "Paid" : "Not Paid"}
                          </span>
                        </div>
                        <div className="flex-1 text-center text-[0.9rem] flex items-center gap-2 justify-center">
                          <span
                            className={`${
                              deliveryStatus === "PENDING"
                                ? "bg-yellow-500 text-yellow-500"
                                : "bg-primary text-primary"
                            } bg-opacity-5 text-xs px-4 py-2 rounded-full`}
                          >
                            {deliveryStatus === "PENDING"
                              ? "Pending"
                              : "Delivered"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </Table>
            </div>
            {/* <div className="w-full">
            <TopProductsChart data={topProducts} />
          </div> */}
          </div>
        ) : (
          <h4>No Orders Found!</h4>
        )}
        {/* <div className="grid grid-cols-2 gap-5 my-10">
          <div className="w-full">
            <CustomerInsightsChart data={customerInsight} />
          </div>
          <div className="w-full">
            <TopProductsChart data={topProducts} />
          </div>
        </div> */}
      </Container>
    </div>
  );
};

export default Overview;
