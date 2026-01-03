import { HeaderProcess } from "./components/index";
import { ComponentType, useState } from "react";
import { WizardContext } from "./wizardContext";
import { Box } from "@mantine/core";

interface WizardProps<T extends object> {
  steps: ComponentType<WizardContext<T>>[];
}

export const Wizard = <T extends object>(props: WizardProps<T>) => {
  const { steps } = props;
  const [stepNow, setStepNow] = useState(0);
  const [data, setData] = useState<T>({});

  const value = Math.ceil((stepNow / steps.length) * 100);

  const changeData = (value: unknown) => {
    setData({ ...data, value });
    if (stepNow < steps.length) {
      setStepNow((prev) => prev + 1);
    }
  };

  const StepNow = steps[stepNow];

  return (
    <Box>
      <HeaderProcess
        value={value}
        stepNumber={stepNow}
        maxStep={steps.length}
      />
      <StepNow data={data} changeData={changeData} />
    </Box>
  );
};
