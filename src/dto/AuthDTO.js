export class LoginData {
  constructor(data = {}) {
    this.username = data.username || "";
    this.password = data.password || "";
  }

  isValid() {
    return this.username.length > 0 && this.password.length > 0;
  }
}

// AuthDTO.js
export class SignInRequest {
  constructor(data = {}) {
    this.usernameOrEmail = data.usernameOrEmail || "";
    this.password = data.password || "";
  }

  isValid() {
    return this.usernameOrEmail.length > 0 && this.password.length > 0;
  }
}
