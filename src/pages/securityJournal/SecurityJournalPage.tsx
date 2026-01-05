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

export interface Test {
  step1: Form1Data;
  step2: Form2Data;
  step3: Form3Data;
}

export const SecurityJournalPage = () => {
  return <Wizard<Test> steps={[Form1, Form2, Form3]} />;
};
