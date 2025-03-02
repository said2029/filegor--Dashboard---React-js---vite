import { useState } from "react";
import Icon from "../components/Icon";
import FromCategory from "../components/forms/FormCategory";
import useCategory from "../hooks/useCategory";
import moment from "moment";
import useSubCategory from "../hooks/useSubCategory";

function Category() {
  const [Filter, setFilter] = useState<{
    search?: string;
    subCategory?: string;
  }>({ search: undefined, subCategory: undefined });
  const {
    Categorys,
    DeleteCategory,
    CreateCategory,
    filter,
    UpdateCategory,
    LoadMore,
  } = useCategory();

  const { SubCategorys } = useSubCategory({ perPage: 10 });
  return (
    <main className="pl-60 pr-10 pt-10">
      <div>
        <h1 className="text-xl font-semibold text-black">Category</h1>
        <p className="opacity-60">
          Manage and organize your categories efficiently.
        </p>
      </div>

      <div className="mt-11">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold text-black/75">Filter</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFilter({ subCategory: undefined, search: undefined });
                filter(undefined, undefined);
              }}
            >
              <Icon size={20} name="refresh" />
            </button>
            <button
              onClick={() => {
                filter(Filter.search, Filter.subCategory);
              }}
            >
              <Icon size={20} name="filter" />
            </button>
            <FromCategory type="Create" create={CreateCategory}>
              <Icon size={20} name="add" />
            </FromCategory>
          </div>
        </div>
        <form className="mt-3 flex items-center gap-2">
          <input
            placeholder="Search..."
            className="h-12 flex-grow rounded-lg bg-gray-500/10 px-2"
            type="search"
            onChange={(event) => {
              setFilter((pre) => ({ ...pre, search: event.target.value }));
            }}
          />
          <select
            onChange={(event) => {
              setFilter((pre) => ({ ...pre, subCategory: event.target.value }));
            }}
            className="h-12 w-48 rounded-lg bg-gray-500/10 px-2"
          >
            <option value="">Sub Category</option>
            {SubCategorys.map((sub) => (
              <option key={sub?.id} value={sub.slug}>
                {sub.name}
              </option>
            ))}
          </select>
        </form>
      </div>

      <section className="mt-12">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-black">
              Categorys : {Categorys.length}
            </h2>
          </div>
        </div>
        <hr className="my-3" />
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {Categorys.map((cat) => (
            <div key={cat.id} className="flex items-start justify-between pe-2">
              <div className="flex">
                <div className="aspect-square size-16">
                  <img
                    src={
                      import.meta.env.VITE_BACKENDURL + `/upload/${cat.image}`
                    }
                    alt={cat.name}
                  />
                </div>
                <div className="ml-2 text-black/90">
                  <h3 className="text-lg">{cat.name}</h3>
                  <p className="text-xs font-bold">{cat?.slug}</p>
                  <strong className="text-xs text-black/90">
                    {cat.subCategory &&
                      cat.subCategory
                        .slice(0, 1)
                        .map((sub) => <span key={sub.id}>/{sub.name}</span>)}
                  </strong>
                  <p className="opacity-55">
                    {moment(cat.createAt).format("yy-MM-DD")}
                  </p>
                </div>
              </div>
              <div className="flex min-w-32 items-center gap-2">
                <FromCategory
                  defaultValues={{
                    ...cat,
                    file: [
                      import.meta.env.VITE_BACKENDURL + `/upload/${cat.image}`,
                    ],
                  }}
                  type="Update"
                  update={UpdateCategory}
                >
                  <Icon size={17} name="edit" />
                </FromCategory>
                <button onClick={() => DeleteCategory(cat.id!)}>
                  <Icon size={17} name="trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 grid h-9 w-full place-content-center opacity-70">
          <button onClick={LoadMore}>Load More</button>
        </div>
      </section>
    </main>
  );
}

export default Category;
