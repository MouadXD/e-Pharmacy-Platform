import { AiOutlineHome } from "react-icons/ai";
import { BiPackage, BiCategory } from "react-icons/bi";
import { FaTruck, FaRegUser } from "react-icons/fa6";
import { FiGift } from "react-icons/fi";
import { MdOutlineSettings } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { TbGiftCardFilled } from "react-icons/tb";
import { FaBloggerB } from "react-icons/fa";
import { BiSolidDiscount } from "react-icons/bi";
import { MdDiscount } from "react-icons/md";
import { FaBullhorn } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

const navbarItems = [
  {
    id: "a91f8",
    name: "Overview",
    path: "/",
    icon: AiOutlineHome,
  },
  {
    id: "9g61b",
    name: "Products",
    path: "/products",
    icon: FaBoxOpen,
  },
  {
    id: "ncs897",
    name: "Orders",
    path: "/orders",
    icon: BiPackage,
  },
  {
    id: "kj3847",
    name: "Categories",
    path: "/categories",
    icon: BiCategory,
  },
  // {
  //   id: "87sfhkj",
  //   name: "Suppliers",
  //   path: "/suppliers",
  //   icon: FaTruck,
  // },
  // {
  //   id: "098fsf",
  //   name: "Managers",
  //   path: "/managers",
  //   icon: FaRegUser,
  // },
  {
    id: "kj34345",
    name: "Coupons",
    path: "/coupons",
    icon: MdDiscount,
  },
  {
    id: "kjas879",
    name: "Discounts",
    path: "/discounts",
    icon: FiGift,
  },
  {
    id: "kjas879",
    name: "Advertise",
    path: "/ads",
    icon: FaBullhorn,
  },
];

export default navbarItems;
