/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { AuthClass } from "../utils/actions";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { Usertype } from "../utils/types";
import { useLocation } from "react-router-dom";

interface AuthProviderProp {
  children: ReactNode;
}
const AuthContext = createContext<any>(null);
export { AuthContext };
export default function AuthProvider({ children }: AuthProviderProp) {
  const [User, setUser] = useState<Usertype>();
  const [type, setType] = useState<"singIn" | "singUp" | "forget">("singIn");
  const [cookie, setCookie, removeCookie] = useCookies(["authorization"]);
  const auth = new AuthClass(cookie.authorization);
  const Location = useLocation();

  const HandleLogout = () => {
    removeCookie("authorization");
  };
  useEffect(() => {
    auth.currentUser().then((res) => {
      setUser(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookie]);

  return (
    <div>
      <AuthContext.Provider value={{ User, HandleLogout }}>
        {(cookie && User?.id && User.userType === "admin") ||
        Location.pathname.includes("verificatin-email") ||
        Location.pathname.includes("reset-password") ? (
          children
        ) : (
          <div>
            {type == "singIn" ? (
              <LogIn
                setCookie={setCookie}
                setUser={setUser}
                setType={setType}
              />
            ) : type == "singUp" ? (
              <SingUp setType={setType} />
            ) : (
              <ForgetPassword setType={setType} />
            )}
          </div>
        )}
      </AuthContext.Provider>
    </div>
  );
}

const LogIn = ({
  setType,
  setUser,
  setCookie,
}: {
  setType: React.Dispatch<React.SetStateAction<"singIn" | "singUp" | "forget">>;
  setUser: React.Dispatch<React.SetStateAction<Usertype | undefined>>;
  setCookie: any;
}) => {
  const auth = new AuthClass();
  const submit = async (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    const formdata = new FormData(form.currentTarget);
    const body = Object.fromEntries(formdata);
    await auth
      .signIn(body)
      .then((res) => {
        if (res.error) {
          toast.error(res.message);
          return;
        }
        if (res.message) {
          toast.info(res.message);
        }

        setCookie("authorization", res.token);
        setUser(res.user);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden px-2">
      {/* Login */}
      <div className="relative flex w-96 flex-col space-y-5 rounded-lg border bg-white px-5 py-10 shadow-xl sm:mx-auto">
        <div className="absolute left-1/2 top-4 -z-10 h-full w-5/6 -translate-x-1/2 rounded-lg bg-teal-600 sm:-right-10 sm:left-auto sm:top-auto sm:w-full sm:translate-x-0" />
        <div className="mx-auto mb-2 space-y-3">
          <h1 className="text-center text-3xl font-bold text-gray-700">
            Sign in
          </h1>
          <p className="text-gray-500">Sign in to access your account</p>
        </div>

        <form onSubmit={submit} action="" className="space-y-5">
          <div>
            <div className="relative mt-2 w-full">
              <input
                type="text"
                id="email"
                name="email"
                required
                minLength={10}
                maxLength={30}
                defaultValue="admin@gmail.com"
                className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-0"
              />
              <label
                htmlFor="email"
                className="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-teal-600"
              >
                {" "}
                Enter Your Email{" "}
              </label>
            </div>
          </div>
          <div>
            <div className="relative mt-2 w-full">
              <input
                type="password"
                id="password"
                required
                minLength={8}
                maxLength={30}
                name="password"
                className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-0"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-teal-600"
              >
                {" "}
                Enter Your Password
              </label>
            </div>
          </div>
          <div className="flex w-full items-center">
            <button
              type="submit"
              className="inline-block w-36 shrink-0 rounded-lg bg-teal-600 py-3 font-bold text-white"
            >
              Login
            </button>
            <button
              onClick={() => {
                setType("forget");
              }}
              className="w-full text-center text-sm font-medium text-gray-600 hover:underline"
            >
              Forgot your password?
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600">
          Don't have an account?
          <button
            onClick={() => setType("singUp")}
            className="whitespace-nowrap font-semibold text-gray-900 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
      {/* /Login */}
    </div>
  );
};

const SingUp = ({
  setType,
}: {
  setType: React.Dispatch<React.SetStateAction<"singIn" | "singUp" | "forget">>;
}) => {
  const auth = new AuthClass();
  const submit = async (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    const formdata = new FormData(form.currentTarget);
    const body = Object.fromEntries(formdata);
    await auth
      .signUp(body)
      .then((res) => {
        if (res.error) {
          toast.error(res.message);
          return;
        }
        if (res.message) {
          toast.info(res.message);
          setType("singIn");
          return;
        }
        setType("singIn");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden px-2">
      {/* Login */}
      <div className="relative flex w-96 flex-col space-y-5 rounded-lg border bg-white px-5 py-10 shadow-xl sm:mx-auto">
        <div className="absolute left-1/2 top-4 -z-10 h-full w-5/6 -translate-x-1/2 rounded-lg bg-teal-600 sm:-right-10 sm:left-auto sm:top-auto sm:w-full sm:translate-x-0" />
        <div className="mx-auto mb-2 space-y-3">
          <h1 className="text-center text-3xl font-bold text-gray-700">
            Sign up
          </h1>
          <p className="text-gray-500">Sign up to access your account</p>
        </div>

        <form onSubmit={submit} action="" className="space-y-5">
          <div>
            <div className="relative mt-2 w-full">
              <input
                type="text"
                id="fullName"
                name="fullName"
                minLength={3}
                maxLength={30}
                placeholder=""
                className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-0"
              />
              <label
                htmlFor="fullName"
                className="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-teal-600"
              >
                {" "}
                Enter Your Full Name{" "}
              </label>
            </div>
          </div>
          <div>
            <div className="relative mt-2 w-full">
              <input
                type="text"
                id="email"
                name="email"
                required
                minLength={10}
                maxLength={30}
                defaultValue=""
                className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-0"
              />
              <label
                htmlFor="email"
                className="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-teal-600"
              >
                {" "}
                Enter Your Email{" "}
              </label>
            </div>
          </div>
          <div>
            <div className="relative mt-2 w-full">
              <input
                type="password"
                id="password"
                required
                minLength={8}
                maxLength={30}
                name="password"
                className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-0"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-teal-600"
              >
                {" "}
                Enter Your Password
              </label>
            </div>
          </div>
          <div className="flex w-full items-center">
            <button
              type="submit"
              className="inline-block w-36 shrink-0 rounded-lg bg-teal-600 py-3 font-bold text-white transition duration-300 ease-in-out hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-opacity-50"
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600">
          have an account?
          <button
            onClick={() => setType("singIn")}
            className="whitespace-nowrap font-semibold text-gray-900 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
      {/* /Login */}
    </div>
  );
};
const ForgetPassword = ({
  setType,
}: {
  setType: React.Dispatch<React.SetStateAction<"singIn" | "singUp" | "forget">>;
}) => {
  const auth = new AuthClass();
  const submit = async (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    const formdata = new FormData(form.currentTarget);
    const body = Object.fromEntries(formdata);
    if (!body["email"]) return;
    const email = body["email"] as string;
    await auth
      .forget(email)
      .then((res) => {
        if (res.error) {
          toast.error(res.message);
          return;
        }
        if (res.message) {
          toast.info(res.message);
          setType("singIn");
          return;
        }
        setType("singIn");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden px-2">
      {/* Login */}
      <div className="relative flex w-96 flex-col space-y-5 rounded-lg border bg-white px-5 py-10 shadow-xl sm:mx-auto">
        <div className="absolute left-1/2 top-4 -z-10 h-full w-5/6 -translate-x-1/2 rounded-lg bg-teal-600 sm:-right-10 sm:left-auto sm:top-auto sm:w-full sm:translate-x-0" />
        <div className="mx-auto mb-2 space-y-3">
          <h1 className="text-center text-3xl font-bold text-gray-700">
            Forget Password
          </h1>
          <p className="text-gray-500">Enter email to reset your password</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <div className="relative mt-2 w-full">
              <input
                type="email"
                name="email"
                minLength={3}
                maxLength={30}
                placeholder=" "
                required
                className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-0"
              />
              <label
                htmlFor="fullName"
                className="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-teal-600"
              >
                {" "}
                Enter Your Email{" "}
              </label>
            </div>
          </div>
          <div className="flex w-full items-center">
            <button
              type="submit"
              className="inline-block w-36 shrink-0 rounded-lg bg-teal-600 py-3 font-bold text-white transition duration-300 ease-in-out hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-opacity-50"
            >
              Send Email
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600">
          have an account?
          <button
            onClick={() => setType("singIn")}
            className="whitespace-nowrap font-semibold text-gray-900 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
      {/* /Login */}
    </div>
  );
};
