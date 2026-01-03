import { Box, Progress, Text } from "@mantine/core";

interface HeaderProcessProps {
  value: number;
  stepNumber: number;
  maxStep: number;
}

export const HeaderProcess = (props: HeaderProcessProps) => {
  const { value, stepNumber, maxStep } = props;

  return (
    <Box>
      <Progress value={value} />
      <Text>
        Шаг {stepNumber}/{maxStep}
      </Text>
    </Box>
  );
};
