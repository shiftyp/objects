export class Mode {
  constructor(public value: boolean) {}

  toggle = () => {
    this.value = !this.value;
  };
}
