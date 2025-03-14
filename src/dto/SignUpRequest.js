class SignUpRequest {
    username;
    email;
    nomeVisualizzato;
    password;

    constructor(builder) {
        this.username = builder.username;
        this.email = builder.email;
        this.nomeVisualizzato = builder.nomeVisualizzato;
        this.password = builder.password;
    }

    static get Builder() {
        class Builder {
            constructor() {
                this.username = '';
                this.email = '';
                this.nomeVisualizzato = '';
                this.password = '';
            }

            setUsername(username) {
                this.username = username;
                return this;
            }

            setEmail(email) {
                this.email = email;
                return this;
            }

            setNomeVisualizzato(nomeVisualizzato) {
                this.nomeVisualizzato = nomeVisualizzato;
                return this;
            }

            setPassword(password) {
                this.password = password;
                return this;
            }

            build() {
                return new SignUpRequest(this);
            }
        }
        return Builder;
    }
}

export default SignUpRequest;
