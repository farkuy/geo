import { createContext } from "react";

export interface WizardContextProps<T> {
  wizardData: T;
  onNextStep: (value: object) => void;
  onPrevStep: () => void;
  onClear: () => void;
}

export const WizardContext = createContext<WizardContextProps<unknown>>({
  wizardData: {},
  onNextStep: ({}) => {},
  onPrevStep: () => {},
  onClear: () => {},
});
