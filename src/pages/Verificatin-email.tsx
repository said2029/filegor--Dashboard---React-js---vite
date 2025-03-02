import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthClass } from "../utils/actions";
import { toast } from "react-toastify";

export default function Verificatin_email() {
  const { id, token } = useParams();
  const navigat = useNavigate();
  const auth = new AuthClass();
  useEffect(() => {
    if (id && token)
      auth.verificatin_email(id, token).then((res) => {
        if (res.error) {
          toast.error(res.message);
          if (res.message.includes("alreay")) {
            navigat("/");
          }
          return;
        }
        if (res.message) {
          toast.success(res.message);
          navigat("/");
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  return <div className="grid place-content-center h-dvh w-dvw">
    <button className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-700 transition duration-300" onClick={() => window.location.reload()}>
        Reload Page
    </button>
  </div>;
}
