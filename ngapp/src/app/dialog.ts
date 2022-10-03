export interface Dialog {
  type:string;
  title:string;
  message?:string;
  data?:any;
  confirmText:string;
  cancelText?:string;
};