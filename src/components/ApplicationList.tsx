import { useState } from "react";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import Icon from "./Icon";
import ApplicationCard from "./Cards/ApplicationCard";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { ApplicationType } from "../utils/types";

export default function ApplicationList({
  showOpenPage = true,
  data,
  DeleteApp,
  update,
}: {
  showOpenPage?: boolean;
  data: Array<ApplicationType>;
  DeleteApp?: (id: string) => void;
  update?: (id: string, data: FormData) => Promise<void>;
}) {
  const [ListType, setListType] = useState<"grid" | "list">("list");
  return (
    <section className="mt-12">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-black">Application</h2>
          {showOpenPage && (
            <Link to={"/applications"}>
              <LuSquareArrowOutUpRight className="opacity-80" />
            </Link>
          )}
        </div>
        <div className="flex gap-5">
          <button
            className={clsx("rounded-2xl p-3", {
              "border border-primary": ListType == "list",
            })}
            onClick={() => {
              setListType("list");
            }}
          >
            <Icon size={23} name="list" />
          </button>
          <button
            className={clsx("rounded-2xl p-3", {
              "border border-primary": ListType == "grid",
            })}
            onClick={() => {
              setListType("grid");
            }}
          >
            <Icon size={23} name="grid" />
          </button>
        </div>
      </div>
      <hr className="my-3" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data &&
          data.length >= 1 &&
          data?.map((app) => (
            <ApplicationCard
              update={update}
              DeleteApp={DeleteApp}
              item={app}
              key={app.id}
              type={ListType}
            />
          ))}
      </div>
    </section>
  );
}
