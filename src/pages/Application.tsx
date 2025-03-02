import Icon from "../components/Icon";
import ApplicationList from "../components/ApplicationList";
import FormApplication from "../components/forms/FormApplication";
import useApplication from "../hooks/useApplication";
import useSubCategory from "../hooks/useSubCategory";
import useCategory from "../hooks/useCategory";

function Application() {
  const {
    Applications,
    LoadMore,
    DeleteApp,
    create,
    update,
    setFilter,
    filter,
    restartFilter,
  } = useApplication(false);

  const { SubCategorys } = useSubCategory({ perPage: 10 });
  const { Categorys } = useCategory();
  return (
    <main className="pl-60 pr-10 pt-10">
      <div>
        <h1 className="text-xl font-semibold text-black">Application</h1>
        <p className="opacity-60">
          Manage your applications efficiently and effectively with our tools.
        </p>
      </div>

      <div className="mt-11">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold text-black/75">Filter</h2>
          <div className="flex gap-2">
            <button onClick={restartFilter}>
              <Icon size={20} name="refresh" />
            </button>
            <button onClick={filter}>
              <Icon size={20} name="filter" />
            </button>
            <FormApplication create={create} type="Create">
              <Icon size={20} name="add" />
            </FormApplication>
          </div>
        </div>
        <form className="mt-3 flex items-center gap-2" action="" method="get">
          <input
            placeholder="Search..."
            className="h-12 flex-grow rounded-lg bg-gray-500/10 px-2"
            type="search"
            name="search"
            onChange={(event) => {
              setFilter((pre) => ({ ...pre, search: event.target.value }));
            }}
          />
          <select
            className="h-12 w-48 rounded-lg bg-gray-500/10 px-2"
            defaultValue={"category"}
            name="category"
            onChange={(event) => {
              setFilter((pre) => ({ ...pre, category: event.target.value }));
            }}
          >
            <option value="">Category</option>
            {Categorys?.map((cat) => (
              <option key={cat?.id} value={cat?.slug}>
                {cat?.name}
              </option>
            ))}
          </select>
          <select
            className="h-12 w-48 rounded-lg bg-gray-500/10 px-2"
            defaultValue={"category"}
            name="category"
            onChange={(event) => {
              setFilter((pre) => ({ ...pre, subCategory: event.target.value }));
            }}
          >
            <option value="">subCategory</option>
            {SubCategorys?.map((cat) => (
              <option key={cat?.id} value={cat?.slug}>
                {cat?.name}
              </option>
            ))}
          </select>
        </form>
      </div>

      <ApplicationList
        update={update}
        DeleteApp={DeleteApp}
        data={Applications}
        showOpenPage={false}
      />

      <div className="mt-8 grid h-9 w-full place-content-center opacity-70">
        <button onClick={LoadMore}>Load More</button>
      </div>
    </main>
  );
}

export default Application;
