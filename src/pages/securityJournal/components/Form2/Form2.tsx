import { Button, Stack, TextInput } from "@mantine/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { WizardContextProps } from "@/features";
import { Form2DataScheme } from "@/pages/securityJournal/components/Form2/scheme";

export interface Form2Data {
  title: string;
}

export const Form2 = (props: WizardContextProps<Form2Data>) => {
  const { wizardData, changeData } = props;

  const { register, handleSubmit } = useForm<Form2DataScheme>({
    defaultValues: {
      title: wizardData.title || "",
    },
  });

  const onSubmit: SubmitHandler<Form2DataScheme> = (data) => {
    console.log(wizardData, data);
    changeData({ ...wizardData, step1: data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput label="Заголовок" {...register("title")} />
        <Button type="submit">Далее</Button>
      </Stack>
    </form>
  );
};
