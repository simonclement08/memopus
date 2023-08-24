export interface CardInterfacePost {
  question: string;
  answer: string;
  column: number;
  selected: boolean;
  tid: number;
}

export default interface CardInterface extends CardInterfacePost {
  id: number;
  uid: string;
}

export interface CardInterfaceProps extends CardInterface {
  card: CardInterface;
  onShowEditModalCard: (card: CardInterface) => void;
  onShowRemoveModalCard: (card: CardInterface) => void;
  onMoveCard: (direction: string, card: CardInterface) => void;
}
