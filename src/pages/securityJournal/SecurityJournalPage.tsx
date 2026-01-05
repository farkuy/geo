import { Wizard } from "@/features";
import {
  Form1,
  Form1Data,
} from "@/pages/securityJournal/components/Form1/Form1";
import {
  Form2,
  Form2Data,
} from "@/pages/securityJournal/components/Form2/Form2";
import {
  Form3,
  Form3Data,
} from "@/pages/securityJournal/components/Form3/Form3";
import { useContext } from "react";
import { WizardContext } from "@/features/Wizard/wizardContext.type";
import { Button, Modal } from "@mantine/core";

export interface Test extends Form1Data, Form2Data {
  step3: Form3Data;
}

export const SecurityJournalPage = () => {
  const { onPrevStep } = useContext(WizardContext);

  return (
    <Modal
      opened={true}
      onClose={() => 3}
      title={<Button onClick={onPrevStep}> назад ебана рот</Button>}
    >
      <Wizard<Test> steps={[Form1, Form2, Form3]} />
    </Modal>
  );
};
