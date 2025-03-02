import { useCookies } from "react-cookie";
import { VersionClass } from "../utils/actions";

export default function useVersion() {
  const Cookies = useCookies(["authorization"]);
  const VersionProvider = new VersionClass(Cookies[0].authorization);

  return { VersionProvider };
}
