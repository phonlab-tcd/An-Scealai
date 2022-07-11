import { GramadoirRuleId } from './gramadoir-rule-id';
export type Messages = {
  en: string;
  ga: string;
};
export type QuillHighlightTag = {
  start: number;
  length: number;
  type: GramadoirRuleId;
  tooltip: any;
  messages: Messages;
};
