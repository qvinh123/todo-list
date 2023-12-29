export class UserInfo {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private _tokenExpireDate: Date
  ) {}

  get token() {
    if (!this._tokenExpireDate || new Date() > this._tokenExpireDate) {
      return null;
    }

    return this._token;
  }
}
