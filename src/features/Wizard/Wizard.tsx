import { HeaderProcess } from "./components";
import { ComponentType, useState } from "react";
import { WizardContext, WizardContextProps } from "./wizardContext.type";
import { Box } from "@mantine/core";

interface WizardProps<T extends object> {
  steps: ComponentType<WizardContextProps<T>>[];
}

export const Wizard = <T extends object>(props: WizardProps<T>) => {
  const { steps } = props;
  const [stepNow, setStepNow] = useState(0);
  const [wizardData, setWizardData] = useState<T>({} as T);

  const value = Math.ceil((stepNow / steps.length) * 100);

  const onNextStep = (value: object) => {
    setWizardData({ ...wizardData, ...value });
    setStepNow((prev) => prev + 1);
  };
  const onPrevStep = () => setStepNow((prev) => prev - 1);

  const StepNow = steps[stepNow];

  return (
    <WizardContext.Provider
      value={{
        wizardData,
        onNextStep,
        onPrevStep,
      }}
    >
      <Box>
        <HeaderProcess
          value={value}
          stepNumber={stepNow}
          maxStep={steps?.length || 1}
        />
        <StepNow
          wizardData={wizardData}
          onNextStep={onNextStep}
          onPrevStep={onPrevStep}
        />
      </Box>
    </WizardContext.Provider>
  );
};
