import { GoHome } from "react-icons/go";
import { PiCodesandboxLogoLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import { BsGrid1X2 } from "react-icons/bs";

const config = {
  asidImage: "/assets/images/logo.png",
};
const sidnatOptions = [
  {
    name: "Dashboard",
    link: "/",
    icon: GoHome,
    size: 25,
  },
  {
    name: "Applications",
    link: "/applications",
    icon: PiCodesandboxLogoLight,
    size: 27,
  },
  {
    name: "Category",
    link: "/category",
    icon: IoGridOutline,
    size: 25,
  },
  {
    name: "subCategory",
    link: "/subcategory",
    icon: BsGrid1X2,
    size: 21,
  },
];

export { sidnatOptions, config };
