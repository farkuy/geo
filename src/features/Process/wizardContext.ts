//TODO: подумать над clearData
export interface WizardContext<T> {
  data: T;
  changeData: (value: unknown) => void;
}
