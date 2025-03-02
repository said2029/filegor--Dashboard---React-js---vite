import moment from "moment";
import Icon from "../components/Icon";
import FromSubCategory from "../components/forms/FormSubCategory";
import useCategory from "../hooks/useCategory";
import useSubCategory from "../hooks/useSubCategory";
import { CategoryType } from "../utils/types";
import { useState } from "react";

function SubCategory() {
  const [Filter, setFilter] = useState<{
    search?: string;
    subCategory?: string;
  }>({ search: undefined, subCategory: undefined });
  const { Categorys } = useCategory();
  const {
    SubCategorys,
    DeleteSubCategory,
    CreateSubCategory,
    UpdateSubCategory,
    filter,
    LoadMore,
  } = useSubCategory({ perPage: 10 });
  return (
    <main className="pl-60 pr-10 pt-10">
      <div>
        <h1 className="text-xl font-semibold text-black">SubCategory</h1>
        <p className="opacity-60">
          Manage and organize your subcategories efficiently. Add, edit
        </p>
      </div>

      <div className="mt-11">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold text-black/75">Filter</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
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
            <FromSubCategory
              create={CreateSubCategory}
              type="Create"
              categotyOptions={Categorys}
            >
              <Icon size={20} name="add" />
            </FromSubCategory>
          </div>
        </div>
        <form className="mt-3 flex items-center gap-2" method="get">
          <input
            placeholder="Search..."
            className="h-12 flex-grow rounded-lg bg-gray-500/10 px-2"
            type="search"
            name="search"
            onChange={(event) => {
              setFilter((pre) => ({
                ...pre,
                search: event?.currentTarget?.value,
              }));
            }}
          />
          <select
            className="h-12 w-48 rounded-lg bg-gray-500/10 px-2"
            onChange={(event) => {
              setFilter((pre) => ({
                ...pre,
                subCategory: event?.currentTarget?.value,
              }));
            }}
          >
            <option value="">Category</option>
            {Categorys.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </form>
      </div>

      <section className="mt-12">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-black">
              SubCategorys : {SubCategorys.length}
            </h2>
          </div>
        </div>
        <hr className="my-3" />
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {SubCategorys.map((subCat) => (
            <div
              key={subCat.id}
              className="flex items-start justify-between pe-2"
            >
              <div className="flex">
                <div className="aspect-square size-16">
                  <img
                    src={subCat.image}
                    alt={subCat.name}
                  />
                </div>
                <div className="ml-2 text-black/90">
                  <h3 className="text-lg">{subCat.name}</h3>
                  <p className="text-xs font-bold">{subCat?.slug}</p>
                  <strong className="text-sm text-black/90">
                    {subCat.category &&
                      subCat?.category.map((cat: CategoryType) => (
                        <p key={cat.id}>{cat.name}</p>
                      ))}
                  </strong>
                  <p className="opacity-55">
                    {moment(subCat?.createAt).format("yy-MM-DD")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 aspect-auto min-w-10">
                <FromSubCategory
                  defaultValues={subCat}
                  update={UpdateSubCategory}
                  type="Update"
                  categotyOptions={Categorys}
                >
                  <Icon size={17} name="edit" />
                </FromSubCategory>
                <button
                  onClick={() => {
                    DeleteSubCategory(subCat.id!);
                  }}
                >
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

export default SubCategory;
