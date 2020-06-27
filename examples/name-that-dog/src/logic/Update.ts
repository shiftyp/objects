export class Update<Data = any> {
  protected _updating: boolean = false;
  error: Error | null = null;
  data: Data | null = null;

  get updating() {
    return this._updating;
  }

  protected async update(promise: Promise<Data>) {
    this.begin();

    try {
      this.success(await promise);
    } catch (error) {
      this.failure(error);
    }

    this.finish();
  }

  protected begin() {
    this._updating = true;
    this.error = null;
    this.data = null;
  }

  protected finish() {
    this._updating = false;
  }

  protected failure(error: Error) {
    this.error = error;
    this.data = null;
  }

  protected success(data: Data) {
    this.data = data;
    this.error = null;
  }
}
