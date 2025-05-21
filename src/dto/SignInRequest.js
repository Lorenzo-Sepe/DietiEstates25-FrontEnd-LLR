class SignInRequest {
  usernameOrEmail;
  password;

  constructor(builder) {
    this.usernameOrEmail = builder.usernameOrEmail;
    this.password = builder.password;
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.usernameOrEmail = "";
        this.password = "";
      }

      setUsernameOrEmail(usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
        return this;
      }

      setEmail(email) {
        this.email = email;
        return this;
      }

      build() {
        return new SignInRequest(this);
      }
    }
    return Builder;
  }
}

export default SignInRequest;
