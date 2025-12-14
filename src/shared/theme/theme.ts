import {
  Button,
  Checkbox,
  createTheme,
  Loader,
  Select,
  Switch,
  Tabs,
  TextInput,
} from "@mantine/core";

export const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  cursorType: "pointer",
  components: {
    Button: Button.extend({
      defaultProps: {
        color: "blue",
        size: "sm",
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        size: "sm",
      },
    }),
    Loader: Loader.extend({
      defaultProps: {
        size: "sm",
        color: "blue",
      },
    }),
    Select: Select.extend({
      defaultProps: {
        size: "sm",
        placeholder: "Выберите значение",
        clearable: true,
        searchable: false,
      },
    }),
    Checkbox: Checkbox.extend({
      defaultProps: {
        mt: "md",
      },
    }),
    Switch: Switch.extend({
      defaultProps: {
        radius: "lg",
        defaultChecked: false,
      },
    }),
    Tabs: Tabs.extend({
      defaultProps: { variant: "pills" },
    }),
  },
});
