/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { SubCategoryType } from "../utils/types";
import { SubCategoryClass } from "../utils/actions";
import { toast } from "react-toastify";

interface SubCategoryProps {
  perPage?: number;
}
export default function useSubCategory({ perPage = 10 }: SubCategoryProps) {
  const [SubCategorys, setSubCategorys] = useState<Array<SubCategoryType>>([]);
  const Cookies = useCookies(["authorization"]);
  const SubCategoryProvider = new SubCategoryClass(Cookies[0].authorization);

  const GetSubCategorys = async (search?: string, subCategory?: string) => {
    setSubCategorys([]);
    const data: Array<SubCategoryType> = await SubCategoryProvider.Get_All(
      search,
      subCategory,
      1,
      perPage,
    );
    setSubCategorys(data);
  };

  const DeleteSubCategory = (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    SubCategoryProvider.Remove(id).then(() => {
      setSubCategorys((pre) => pre.filter((item) => item.id != id));
    });
  };

  const CreateSubCategory = async (body: FormData) => {
    await SubCategoryProvider.Crate(body)
      .then((res: SubCategoryType | any) => {
        if (res.error) {
          toast.error(res.message);
          throw new Error(res.message);
        }
        const newOb = [...SubCategorys];
        newOb.unshift(res);
        setSubCategorys(newOb);
        return res;
      })
      .catch((error) => {
        throw error;
      });
  };

  const UpdateSubCategory = async (id: string, body: FormData) => {
    await SubCategoryProvider.Update(id, body)
      .then((res: SubCategoryType | any) => {
        if (res.error) {
          toast.error(res.message);
          throw new Error(res.message);
        }
        const newOb = [...SubCategorys];
        const index = newOb.findIndex((item) => item.id === id);
        newOb.splice(index, 1, res);
        setSubCategorys(newOb);
      })
      .catch((error) => {
        throw error;
      });
  };

  const filter = async (search?: string, subCategory?: string) => {
    await GetSubCategorys(search, subCategory);
  };

  const LoadMore = async () => {
    const SubCats: Array<SubCategoryType> = [];
    const page = Math.round(SubCategorys.length / 10) + 1;
    if (page < SubCategorys.length / 10 + 1) return;
    const data: Array<SubCategoryType> = await SubCategoryProvider.Get_All(
      undefined,
      undefined,
      page,
    );
    data.map((sub) => {
      sub.file = [import.meta.env.VITE_BACKENDURL + "/upload/" + sub.image];
      sub.categoryIds = sub?.category?.map((item) => item.id) ?? [];
      SubCats.push(sub);
    });
    setSubCategorys((pre) => [...pre, ...SubCats]);
  };

  useEffect(() => {
    GetSubCategorys();
  }, []);

  return {
    GetSubCategorys,
    SubCategorys,
    SubCategoryProvider,
    DeleteSubCategory,
    CreateSubCategory,
    UpdateSubCategory,
    filter,
    LoadMore,
  };
}
