import { HeaderProcess } from "./components";
import { ComponentType, Ref, useImperativeHandle, useState } from "react";
import { WizardContext, WizardContextProps } from "./wizardContext.type";
import { Box } from "@mantine/core";

export interface WizardHandle {
  prev: () => void;
  clear: () => void;
}

interface WizardProps<T extends object> {
  steps: ComponentType<WizardContextProps<T>>[];
  initialData?: T;
  isVisibleHeader?: boolean;
  ref?: Ref<WizardHandle>;
}

export const Wizard = <T extends object>(props: WizardProps<T>) => {
  const { steps, initialData, isVisibleHeader = true, ref } = props;
  const [stepNow, setStepNow] = useState(0);
  const [wizardData, setWizardData] = useState<T>(initialData || ({} as T));

  const value = Math.ceil(((stepNow + 1) / steps.length) * 100);

  const onNextStep = (value: Partial<T>) => {
    if (stepNow < steps.length - 1) {
      setWizardData({ ...wizardData, ...value });
      setStepNow((prev) => prev + 1);
    }
  };
  const onPrevStep = () => {
    if (stepNow > 0) {
      setStepNow((prev) => prev - 1);
    }
  };
  const onClear = () => setWizardData({} as T);

  useImperativeHandle(ref, () => ({
    prev: onPrevStep,
    clear: onClear,
  }));

  const StepNow = steps[stepNow];

  return (
    <WizardContext.Provider
      value={{
        wizardData,
        onNextStep,
        onPrevStep,
        onClear,
      }}
    >
      <Box>
        {isVisibleHeader && (
          <HeaderProcess
            value={value}
            stepNumber={stepNow + 1}
            maxStep={steps?.length || 1}
          />
        )}
        <StepNow
          wizardData={wizardData}
          onNextStep={onNextStep}
          onPrevStep={onPrevStep}
          onClear={onClear}
        />
      </Box>
    </WizardContext.Provider>
  );
};
