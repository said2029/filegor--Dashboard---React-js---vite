import { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthClass } from "../utils/actions";
import { toast } from "react-toastify";

export default function Reset_password() {
  const { id, token } = useParams();
  const auth = new AuthClass();
  const navigat = useNavigate();

  const submit = async (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    const formdata = new FormData(form.currentTarget);
    formdata.append("id", id!);
    formdata.append("token", token!);
    const body = Object.fromEntries(formdata);
    await auth
      .restartPassword(body)
      .then((res) => {
        if (res.error) {
          toast.error(res.message);
          if (res.message.includes("invalid")) navigat("/");
          return;
        }
        if (res.message) {
          toast.info(res.message);
          navigat("/");
          return;
        }

        navigat("/");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div>
      <div className="flex h-screen w-screen items-center justify-center overflow-hidden px-2">
        {/* Login */}
        <div className="relative flex w-96 flex-col space-y-5 rounded-lg border bg-white px-5 py-10 shadow-xl sm:mx-auto">
          <div className="absolute left-1/2 top-4 -z-10 h-full w-5/6 -translate-x-1/2 rounded-lg bg-teal-600 sm:-right-10 sm:left-auto sm:top-auto sm:w-full sm:translate-x-0" />
          <div className="mx-auto mb-2 space-y-3">
            <h1 className="text-center text-3xl font-bold text-gray-700">
              Restart Password
            </h1>
            <p className="text-center text-gray-500">Enter your password</p>
          </div>

          <form onSubmit={submit} action="" className="space-y-5">
            <div>
              <div className="relative mt-2 w-full">
                <input
                  type="password"
                  id="password"
                  required
                  minLength={8}
                  maxLength={30}
                  name="newPassword"
                  placeholder=""
                  className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-0"
                />
                <label
                  htmlFor="fullName"
                  className="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-teal-600"
                >
                  {" "}
                  Enter Your Passwrod{" "}
                </label>
              </div>
            </div>
            <div className="flex w-full items-center">
              <button
                type="submit"
                className="inline-block w-36 shrink-0 rounded-lg bg-teal-600 py-3 font-bold text-white transition duration-300 ease-in-out hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-opacity-50"
              >
                Restart Password
              </button>
            </div>
          </form>

          <p className="text-center text-gray-600">
            have an account?
            <Link
              to={"/"}
              className="whitespace-nowrap font-semibold text-gray-900 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
        {/* /Login */}
      </div>
    </div>
  );
}
