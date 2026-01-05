//TODO: подумать над clearData
export interface WizardContextProps<T> {
  wizardData: T;
  changeData: (value: object) => void;
}
