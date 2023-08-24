export interface TermInterfacePost {
  name: string;
  open: boolean;
  selected: boolean;
}

export default interface TermInterface extends TermInterfacePost {
  id: number;
  uid: string;
}

export interface TermInterfaceProps extends TermInterface {}
