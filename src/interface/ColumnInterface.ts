import { MouseEventHandler } from "react";
import CardInterface from "./CardInterface";
import TermInterface from "./TermInterface";

export default interface ColumnInterface {
  id: number;
  label: string;
  cards: CardInterface[];
  terms: TermInterface[];
}

export interface ColumnInterfaceProps extends ColumnInterface {
  onShowAddModalCard: (id: number) => void;
  onShowEditModalCard: (card: CardInterface) => void;
  onShowRemoveModalCard: (card: CardInterface) => void;
  onMoveCard: (direction: string, card: CardInterface) => void;
}
