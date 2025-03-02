import { AnimatePresence } from "motion/react";
import Icon from "../Icon";
import { motion } from "motion/react";
import { ApplicationType } from "../../utils/types";
import moment from "moment";
import FormApplication from "../forms/FormApplication";

const animateConfig = {
  variants: {
    init: { y: "100px", opacity: 0 },
    show: { y: "0", opacity: 1 },
  },
  initial: "init",
  animate: "show",
  transition: { duration: 0.4 },
};

export default function ApplicationCard({
  type = "list",
  item,
  DeleteApp,
  update,
}: {
  type?: "grid" | "list";
  item: ApplicationType;
  DeleteApp?: (id: string) => void;
  update?: (id: string, data: FormData) => Promise<void>;
}) {
  return (
    <>
      <AnimatePresence>
        {type == "list" && (
          <motion.div
            {...animateConfig}
            className="flex items-start justify-between gap-3"
          >
            <div className="flex">
              <div className="aspect-square size-20">
                <img
                  className="size-full"
                  src={item?.images?.[0]}
                  alt={item?.title}
                />
              </div>
              <div className="ml-2 text-black/90">
                <h3 className="text-lg">{item?.title}</h3>
                <strong className="text-sm text-black/90">
                  {item?.category?.name}
                </strong>
                <p className="opacity-55">
                  {moment(item?.createAt).format("YY-MM-DD")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-14">
              {update && (
                <FormApplication
                  update={update}
                  defaultValues={item}
                  type="Update"
                >
                  <Icon size={25} name="edit" />
                </FormApplication>
              )}
              {DeleteApp && (
                <button onClick={() => DeleteApp(item.id!)}>
                  <Icon size={25} name="trash" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {type == "grid" && (
          <motion.div {...animateConfig} className="overflow-hidden rounded-lg">
            <div className="h-[200px] w-full bg-primary">
              <img
                className="size-full object-cover"
                src={item?.images?.[0]}
                alt={item?.title}
              />
            </div>
            <div className="mt-3 flex items-start justify-between">
              <div>
                <h2 className="text-2xl text-black/90">{item.title}</h2>
                <strong className="text-black/90">
                  {item?.category?.name}
                </strong>
                <p className="opacity-55">
                  {moment(item?.createAt).format("YY-MM-DD")}
                </p>
              </div>
              <div className="flex gap-2 min-w-10">
                <FormApplication
                  update={update}
                  defaultValues={item}
                  type="Update"
                >
                  <Icon size={19} name="edit" />
                </FormApplication>
                <button onClick={() => DeleteApp?.(item.id!)}>
                  <Icon size={19} name="trash" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
