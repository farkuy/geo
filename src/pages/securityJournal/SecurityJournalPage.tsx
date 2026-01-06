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
import { Button, Modal } from "@mantine/core";
import { WizardHandle } from "@/features/Wizard/Wizard";
import { useRef } from "react";

export interface Test extends Form1Data, Form2Data {
  step3: Form3Data;
}

export const SecurityJournalPage = () => {
  const wizardRef = useRef<WizardHandle | null>(null);

  return (
    <Modal
      opened={true}
      onClose={close}
      title={
        <Button variant="subtle" onClick={wizardRef.current?.prev}>
          Назад
        </Button>
      }
    >
      <Wizard<Test> ref={wizardRef} steps={[Form1, Form2, Form3]} />
    </Modal>
  );
};
