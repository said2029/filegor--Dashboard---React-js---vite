import { useCookies } from "react-cookie";
import { ApplicationClass } from "../utils/actions";
import { useEffect, useState } from "react";
import { ApplicationType } from "../utils/types";
import { toast } from "react-toastify";

type FilterType = {
  search?: string;
  category?: string;
  subCategory?: string;
  topDownloads?: boolean;
  perPage?: number;
  page?: number;
};
export default function useApplication(topDownloads?: boolean) {
  const [Filter, setFilter] = useState<FilterType>({
    search: "",
    category: "",
    subCategory: "",
    topDownloads: topDownloads,
  });
  const [Applications, setApplications] = useState<Array<ApplicationType>>([]);
  const Cookies = useCookies(["authorization"]);
  const ApplicationProvider = new ApplicationClass(Cookies[0].authorization);

  const get_All = async (Filter: FilterType) => {
    const data: Array<ApplicationType> =
      await ApplicationProvider.Get_all(Filter);
    data.map((item) => {
      if (item.images != null) {
        item.images = item.images?.map((img: string) =>
          img.includes("http")
            ? img
            : `${import.meta.env.VITE_BACKENDURL}/upload${img}`,
        );
      }
      if (item.icon) {
        item.images?.unshift(
          item.icon.includes("http")
            ? item.icon
            : `${import.meta.env.VITE_BACKENDURL}/upload${item.icon}`,
        );
      }
      item.files = item.images ?? [];
    });
    setApplications(data);
  };

  const create = async (body: FormData) => {
    return await ApplicationProvider.create(body).then((res) => {
      if (res.error) {
        toast.error(res.message);
        return res;
      }
      if (res.images != null) {
        res.images = res.images?.map((img: string) =>
          img.startsWith("http")
            ? img
            : `${import.meta.env.VITE_BACKENDURL}/upload${img}`,
        );
      }
      setApplications((pre) => [res, ...pre]);
      return res;
    });
  };

  const update = async (id: string, body: FormData) => {
    return await ApplicationProvider.update(id, body).then((res) => {
      if (res.images != null) {
        res.images = res.images?.map((img: string) =>
          img.startsWith("http")
            ? img
            : `${import.meta.env.VITE_BACKENDURL}/upload${img}`,
        );
        if (res.icon) {
          res.images?.unshift(
            res.icon.startsWith("http")
              ? res.icon
              : `${import.meta.env.VITE_BACKENDURL}/upload${res.icon}`,
          );
        }
      }

      const newArray = [...Applications];
      const index = newArray.findIndex((item) => item.id == id);
      newArray[index] = res;
      setApplications(newArray);
    });
  };
  const LoadMore = async () => {
    const page = Math.round(Applications.length / 10) + 1;
    if (page < Applications.length / 10 + 1) return;

    const data: Array<ApplicationType> = await ApplicationProvider.Get_all({
      page: page,
    });
    setApplications((pre) => [...pre, ...data]);
  };
  const DeleteApp = (id: string) => {
    if (!confirm("Are you sure you want to remove this application?")) return;
    ApplicationProvider.Remove(id).then(() => {
      setApplications((pre) => pre.filter((item) => item.id != id));
    });
  };

  const filter = () => {
    get_All(Filter);
  };
  const restartFilter = () => {
    get_All({
      search: "",
      category: "",
      subCategory: "",
    });
  };

  const removeImage = async (id: string, image: string) => {
    await ApplicationProvider.removeImage(id, image);
  };

  useEffect(() => {
    get_All(Filter);
  }, []);

  return {
    Applications,
    get_All,
    create,
    LoadMore,
    DeleteApp,
    update,
    removeImage,
    setFilter,
    filter,
    restartFilter,
  };
}
