class ProvinciaRequest {
  latitudine;
  longitudine;
  raggio;

  constructor(builder) {
    this.latitudine = builder.latitudine;
    this.longitudine = builder.longitudine;
    this.raggio = builder.raggio;
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.latitudine = 0;
        this.longitudine = 0;
        this.raggio = 0;
      }

      setLatitudine(latitudine) {
        this.latitudine = latitudine;
        return this;
      }

      setLongitudine(longitudine) {
        this.longitudine = longitudine;
        return this;
      }

      setRaggio(raggio) {
        this.raggio = raggio;
        return this;
      }

      build() {
        return new ProvinciaRequest(this);
      }
    }
    return Builder;
  }
}

export default ProvinciaRequest;
