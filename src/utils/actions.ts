/* eslint-disable @typescript-eslint/no-explicit-any */
// Categoty logic

import { toast } from "react-toastify";
import { ApplicationType, CategoryType, SubCategoryType } from "./types";

const BASE_URL = import.meta.env.VITE_BACKENDURL;

export class CategoryClass {
  token = "";
  constructor(token: string) {
    this.token = token;
  }
  Get_All = async (
    search?: string,
    subCategory?: string,
    page?: number,
    perPage: number = 10,
  ) => {
    const filter = `${search ? `&search=${search}` : ""}${subCategory ? `&subCategory=${subCategory}` : ""}`;
    return await fetch(
      BASE_URL + `/api/category?perPage=${perPage}&page=${page ?? 1}${filter}`,
    )
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => {
        throw new Error(err.message);
      });
  };
  Get_By_id = async (id: string) => {
    const categorys = await fetch(BASE_URL + `/api/category/${id}`);
    const res = await categorys.json();
    return res;
  };

  Crate = async (formData: FormData) => {
    return await fetch(BASE_URL + `/api/category`, {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${this.token}` },
    })
      .then((res) => res.json())
      .then((res: CategoryType) => {
        toast.success("Category created successfully!");
        return res;
      })
      .catch((error) => error);
  };
  Update = async (id: string, formData: FormData) => {
    checkDemoModeValidity();
    return await fetch(BASE_URL + `/api/category/${id}`, {
      method: "PATCH",
      body: formData,
      headers: { Authorization: `Bearer ${this.token}` },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((error) => {
        throw new Error(error.message);
      });
  };
  Remove = async (id: string) => {
    checkDemoModeValidity();
    return await fetch(BASE_URL + `/api/category/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success(res.message);
      })
      .catch((error) => {
        toast.error(error.message);
        throw error;
      });
  };
}
export class SubCategoryClass {
  token = "";
  constructor(token: string) {
    this.token = token;
  }
  Get_All = async (
    search?: string,
    category?: string,
    page?: number,
    perPage: number = 10,
  ) => {
    const filter = `${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`;
    return await fetch(
      BASE_URL +
        `/api/sub-category?perPage=${perPage}&page=${page ?? 1}${filter}`,
    )
      .then((res) => res.json())
      .then((res) => {
        res.map((sub: SubCategoryType) => {
          sub.file = [import.meta.env.VITE_BACKENDURL + "/upload/" + sub.image];
          sub.image = import.meta.env.VITE_BACKENDURL + "/upload/" + sub.image;
          sub.categoryIds = sub?.category?.map((item: any) => item.id) ?? [];
        });
        return res;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };
  Get_By_id = async (id: string) => {
    const categorys = await fetch(BASE_URL + `/api/sub-category/${id}`);
    const res = await categorys.json();
    return res;
  };

  Crate = async (formData: FormData) => {
    return await fetch(BASE_URL + `/api/sub-category`, {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${this.token}` },
    })
      .then((res) => res.json())
      .then((res: SubCategoryType) => {
        res.image = import.meta.env.VITE_BACKENDURL + "/upload/" + res.image;
        return res;
      })
      .catch((error) => {
        throw error;
      });
  };
  Update = async (id: string, formData: FormData) => {
    checkDemoModeValidity();
    return await fetch(BASE_URL + `/api/sub-category/${id}`, {
      method: "PATCH",
      body: formData,
      headers: { Authorization: `Bearer ${this.token}` },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((error) => {
        throw new Error(error.message);
      });
  };
  Remove = async (id: string) => {
    checkDemoModeValidity();
    return await fetch(BASE_URL + `/api/sub-category/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success(res.message);
      })
      .catch((error) => {
        toast.error(error.message);
        throw error;
      });
  };
}

export class ApplicationClass {
  token = "";
  constructor(token: string) {
    this.token = token;
  }

  async Get_all({
    search,
    category,
    subCategory,
    topDownloads = false,
    perPage = 10,
    page = 1,
  }: {
    search?: string;
    category?: string;
    subCategory?: string;
    perPage?: number;
    page?: number;
    topDownloads?: boolean;
  }) {
    const filter = `${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}${subCategory ? `&subCategory=${subCategory}` : ""}`;
    return await fetch(
      BASE_URL +
        `/api/program?perPage=${perPage}&page=${page}&topDownloads=${topDownloads}${filter}`,
    )
      .then((res) => res.json())
      .then((res: Array<ApplicationType>) => res)
      .catch((error) => {
        throw error;
      });
  }

  async create(data: FormData) {
    return await fetch(BASE_URL + `/api/program/create`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}` },
      body: data,
    })
      .then((res) => res.json())
      .then((res: ApplicationType) => res)
      .catch((error) => error);
  }
  async update(id: string, data: FormData) {
    checkDemoModeValidity();
    return await fetch(BASE_URL + `/api/program/update/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${this.token}` },
      body: data,
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((error) => {
        throw error;
      });
  }
  Remove = async (id: string) => {
    checkDemoModeValidity();
    return await fetch(BASE_URL + `/api/program/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success(res.message);
      })
      .catch((error) => {
        toast.error(error.message);
        throw error;
      });
  };

  removeImage = async (id: string, image: string) => {
    checkDemoModeValidity();
    return await fetch(`${BASE_URL}/api/program/removeProgramImage/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ image }),
    }).catch((err) => {
      throw new Error(err.message);
    });
  };
}

export class VersionClass {
  token = "";
  constructor(token: string) {
    this.token = token;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async CreateVersion(body: any) {
    checkDemoModeValidity();
    return await fetch(BASE_URL + `/api/version/create`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    }).catch((err) => err);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async UpdateVersion(id: string, body: any) {
    checkDemoModeValidity();
    return await fetch(BASE_URL + `/api/version/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    }).catch((err) => err);
  }

  async Delete(id: string) {
    checkDemoModeValidity();
    return await fetch(BASE_URL + `/api/version/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }
}

export class DashController {
  token = "";
  constructor(token: string) {
    this.token = token;
  }
  async totalApplication() {
    const data = await fetch(BASE_URL + "/api/dash/totalApplication", {
      headers: { Authorization: `Bearer ${this.token}` },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => err);
    return data;
  }
  async totalGames() {
    const data = await fetch(BASE_URL + "/api/dash/weekly-games-total", {
      headers: { Authorization: `Bearer ${this.token}` },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => err);
    return data;
  }
  async TotalDownloads() {
    const data = await fetch(BASE_URL + "/api/dash/weekly-download", {
      headers: { Authorization: `Bearer ${this.token}` },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => err);
    return data;
  }
  async weekly_Downloads() {
    const data = await fetch(BASE_URL + "/api/dash/weekly-downloads", {
      headers: { Authorization: `Bearer ${this.token}` },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => err);
    return data;
  }
}

export class AuthClass {
  token = "";
  constructor(token?: string) {
    if (token) this.token = token;
  }
  async signIn(body: object) {
    return await fetch(BASE_URL + "/api/user/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => err);
  }
  async signUp(body: object) {
    return await fetch(BASE_URL + "/api/user/register", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => err);
  }
  async verificatin_email(id: string, token: string) {
    return await fetch(BASE_URL + `/api/user/verificatin-email/${id}/${token}`)
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => err);
  }

  async currentUser() {
    if (!this.token) return;
    return await fetch(BASE_URL + "/api/user/current-user", {
      headers: { Authorization: `Bearer ${this.token}` },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => err);
  }

  async forget(email: string) {
    return await fetch(BASE_URL + "/api/user/forget-pass", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => err);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async restartPassword(body: any) {
    return await fetch(BASE_URL + "/api/user/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => err);
  }
}

const checkDemoModeValidity = () => {
  if (import.meta.env.VITE_APP_MODE == "DEMO") {
    toast.error("Action not allowed in demo mode");
    throw new Error("Action not allowed in demo mode");
  }
};
