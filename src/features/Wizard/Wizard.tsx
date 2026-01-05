import { HeaderProcess } from "./components";
import { ComponentType, useState } from "react";
import { WizardContextProps } from "./wizardContext.type";
import { Box } from "@mantine/core";

interface WizardProps<T extends object> {
  steps: ComponentType<WizardContextProps<T>>[];
}

export const Wizard = <T extends object>(props: WizardProps<T>) => {
  const { steps } = props;
  const [stepNow, setStepNow] = useState(0);
  const [data, setData] = useState<T>({} as T);

  const value = Math.ceil((stepNow / steps.length) * 100);

  const onNextStep = (value: object) => {
    setData({ ...data, ...value });
    setStepNow((prev) => prev + 1);
  };

  const StepNow = steps[stepNow];

  return (
    <Box>
      <HeaderProcess
        value={value}
        stepNumber={stepNow}
        maxStep={steps.length}
      />
      <StepNow wizardData={data} changeData={onNextStep} />
    </Box>
  );
};
