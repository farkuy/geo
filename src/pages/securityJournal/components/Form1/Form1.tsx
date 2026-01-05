import { Button, Stack, TextInput } from "@mantine/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { WizardContextProps } from "@/features";
import { Form1DataScheme, Form1Schema } from "./scheme";
import { zodResolver } from "@hookform/resolvers/zod";

export interface Form1Data {
  step1: { name: string; email: string };
}

export const Form1 = (props: WizardContextProps<Form1Data>) => {
  const { wizardData, onNextStep } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form1DataScheme>({
    resolver: zodResolver(Form1Schema),
    defaultValues: {
      name: wizardData?.step1?.name || "",
      email: wizardData?.step1?.email || "",
    },
  });

  const onSubmit: SubmitHandler<Form1DataScheme> = (data) => {
    onNextStep({ ...wizardData, step1: data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Имя"
          {...register("name")}
          error={errors["name"]?.message}
        />
        <TextInput
          label="Email"
          {...register("email")}
          error={errors["email"]?.message}
        />
        <Button type="submit">Далее</Button>
      </Stack>
    </form>
  );
};
