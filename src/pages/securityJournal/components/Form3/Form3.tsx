import { TextInput, Select, Stack, Button } from "@mantine/core";
import { useForm } from "react-hook-form";

export interface Form3Data {
  search: string;
  type: string;
  status: string;
}

export const Form3 = (props) => {
  const form = useForm<Form3Data>({
    defaultValues: { search: "", type: "", status: "" },
  });

  return (
    <Stack>
      <TextInput label="Поиск" {...form.register("search")} />
      <Select label="Тип" data={["post", "page", "product"]} />
      <Select label="Статус" data={["draft", "published", "archived"]} />
      <Button type="submit">Сохранить</Button>
    </Stack>
  );
};
