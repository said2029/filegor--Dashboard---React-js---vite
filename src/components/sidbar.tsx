import { config, sidnatOptions } from "../utils/contants";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import moment from "moment";

export default function Sidbar() {
  const location = useLocation();
  const { User, HandleLogout } = useContext(AuthContext);

  return (
    <>
      {!location.pathname.includes("verificatin-email") &&
        !location.pathname.includes("reset-password") && (
          <aside className="fixed top-0 h-dvh w-56 shadow-xl">
            <div className="bg-primary p-6">
              <div className="h-16 w-full">
                <img src={config.asidImage} />
              </div>
            </div>
            <hr />
            <ul className="mt-10 space-y-3">
              {sidnatOptions.map((item) => (
                <li key={item.name}>
                  <Link
                    className={clsx(
                      "flex items-center gap-2 py-3 ps-5 transition-all duration-300",
                      {
                        "bg-primary text-white/100":
                          location.pathname === item.link,
                        "text-black/80": location.pathname !== item.link,
                      },
                    )}
                    to={item.link}
                  >
                    <item.icon size={item.size} />
                    <p className="text-base font-medium leading-none">
                      {item.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <hr />
            <div className="absolute bottom-9 flex w-full items-center justify-between gap-2 pe-3 ps-1">
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-full">
                  {/* <img src={import.meta.env + `/${User?.imageProfile}`} /> */}
                  <img
                    className="h-full w-full"
                    src="/assets/images/avater.png"
                  />
                </div>
                <div>
                  <h3 className="text-base font-medium">{User?.fullName}</h3>
                  <p className="text-xs opacity-75">
                    {moment(User?.createAt).format("yy / MMM / DD")}
                  </p>
                </div>
              </div>
              <CiLogout
                onClick={HandleLogout}
                className="rotate-180 cursor-pointer text-red-500"
                size={20}
              />
            </div>
          </aside>
        )}
    </>
  );
}
