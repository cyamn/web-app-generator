export class AuthRequiredError extends Error {
  public constructor(message = "Auth is required to access this page.") {
    super(message);
    this.name = "AuthRequiredError";
  }
}
