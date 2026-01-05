import { Button, Stack, TextInput } from "@mantine/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { WizardContextProps } from "@/features";
import { Form2DataScheme, Form2Schema } from "./scheme";
import { zodResolver } from "@hookform/resolvers/zod";

export interface Form2Data {
  step2: {
    title: string;
  };
}

export const Form2 = (props: WizardContextProps<Form2Data>) => {
  const { wizardData, onNextStep } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form2DataScheme>({
    resolver: zodResolver(Form2Schema),
    defaultValues: {
      title: wizardData?.step2?.title || "",
    },
  });

  const onSubmit: SubmitHandler<Form2DataScheme> = (data) => {
    onNextStep({ ...wizardData, step2: data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Заголовок"
          {...register("title")}
          error={errors["title"]?.message}
        />
        <Button type="submit">Далее</Button>
      </Stack>
    </form>
  );
};
