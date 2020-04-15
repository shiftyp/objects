export class Update<Data> {
  updating: boolean = false;
  error: Error | null = null;
  data: Data | null = null;

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
    this.updating = true;
    this.error = null;
    this.data = null;
  }

  protected finish() {
    this.updating = false;
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
