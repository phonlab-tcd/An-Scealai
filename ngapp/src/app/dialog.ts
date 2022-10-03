export interface Dialog {
  title:string;
  message:string;
  changeUsername?:boolean;
  changePassword?:boolean;
  confirmText:string;
  cancelText:string;
};