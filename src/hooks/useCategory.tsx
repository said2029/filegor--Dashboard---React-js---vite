import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { CategoryType } from "../utils/types";
import { CategoryClass } from "../utils/actions";
import { toast } from "react-toastify";

export default function useCategory() {
  const [Categorys, setCategorys] = useState<Array<CategoryType>>([]);
  const Cookies = useCookies(["authorization"]);
  const CategoryProvider = new CategoryClass(Cookies[0].authorization);

  const GetCategorys = async () => {
    setCategorys([]);
    const data = await CategoryProvider.Get_All();
    setCategorys(data);
  };

  const DeleteCategory = (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    CategoryProvider.Remove(id).then(() => {
      setCategorys((pre) => pre.filter((item) => item.id != id));
    });
  };

  const CreateCategory = async (body: FormData) => {
    await CategoryProvider.Crate(body)
      .then((res: CategoryType) => {
        const newOb = [...Categorys];
        newOb.unshift(res);
        setCategorys(newOb);
        return res;
      })
      .catch((error) => {
        toast.error(error.message)
        return error;
      });
  };

  const UpdateCategory = async (id: string, body: FormData) => {
    await CategoryProvider.Update(id, body)
      .then((res: CategoryType) => {
        const newOb = [...Categorys];
        const index = newOb.findIndex((item) => item.id === id);
        newOb.splice(index, 1, res);
        setCategorys(newOb);
      })
      .catch((error) => {
        toast.error(error.message);
        return error;
      });
  };

  const filter = async (search?: string, subCategory?: string) => {
    const data = await CategoryProvider.Get_All(search, subCategory);
    setCategorys(data);
  };

  const LoadMore = async () => {
    const page = Math.round(Categorys.length / 10) + 1;
    if (page < Categorys.length / 10 + 1) return;

    const data: Array<CategoryType> = await CategoryProvider.Get_All(
      undefined,
      undefined,
      page,
    );
    setCategorys((pre) => [...pre, ...data]);
  };
  useEffect(() => {
    GetCategorys();
  }, []);

  return {
    GetCategorys,
    Categorys,
    CategoryProvider,
    DeleteCategory,
    CreateCategory,
    UpdateCategory,
    filter,
    LoadMore,
  };
}
