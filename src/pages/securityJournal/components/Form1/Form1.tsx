import { Button, Stack, TextInput } from "@mantine/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { WizardContextProps } from "@/features";
import { Form1DataScheme } from "@/pages/securityJournal/components/Form1/scheme";

export interface Form1Data {
  name: string;
  email: string;
}

export const Form1 = (props: WizardContextProps<Form1Data>) => {
  const { wizardData, changeData } = props;

  console.log("wizardData", wizardData);

  const { register, handleSubmit } = useForm<Form1DataScheme>({
    defaultValues: {
      name: wizardData?.step1?.name || "",
      email: wizardData?.step1?.email || "",
    },
  });

  const onSubmit: SubmitHandler<Form1DataScheme> = (data) => {
    console.log(wizardData, data);
    changeData({ ...wizardData, step1: data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput label="Имя" {...register("name")} />
        <TextInput label="Email" {...register("email")} />
        <Button type="submit">Далее</Button>
      </Stack>
    </form>
  );
};
