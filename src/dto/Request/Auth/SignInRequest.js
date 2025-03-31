
export const LOGIN_DATA_STRUCTURE = {
    username: '',
    password: ''
  };


  export class LoginData {
    constructor(data = {}) {
      this.username = data.username || '';
      this.password = data.password || '';
    }
  
    isValid() {
      return this.username.length > 0 && this.password.length > 0;
    }
  }