import { Api, ApiAgent, ApiPublic } from "../api/axiosConfig";

import { setUser } from "./UserService";
export default {
  register(credentials) {
    console.log("service register");
    return ApiPublic()
      .post("pb/auth/signup", credentials)
      .then((response) => {
        return setUser(response.data);
      });
  },

  login(credentials) {
    return ApiPublic()
      .post("pb/auth/signin", credentials)
      .then((response) => {
        return setUser(response.data);
      });
  },
  loginIdProvvider(credentials) {
    return ApiPublic()
      .post("pb/auth/signinIdProv", credentials)
      .then((response) => {
        console.log("Id provvider success,", response);
        return setUser(response.data);
      });
  },
  logout() {
    return Api()
      .post("auth/logout")
      .then((response) => response.data);
  },
  changePassword(
    oldPassword,
    newPassword,
    newPasswordConfirm,
    isEmployee = false,
  ) {
    const newCredentials = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: newPasswordConfirm,
    };
    console.log("New Credentials: ", newCredentials);
    if (isEmployee) {
      return Api()
        .put("auth/change_password_employee", newCredentials)
        .then((response) => response.data);
    } else {
      return ApiAgent()
        .put("auth/change_password", newCredentials)
        .then((response) => response.data);
    }
  },
};
