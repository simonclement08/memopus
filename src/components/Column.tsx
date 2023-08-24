import { Button } from "react-bootstrap";
import { ColumnInterfaceProps } from "../interface/ColumnInterface";
import Card from "./Card";

const Column = (props: ColumnInterfaceProps): React.JSX.Element => {
  const filteredCards = props.cards.filter((card) => card.column === props.id);

  return (
    <div className="col-md">
      <h3>
        <Button
          variant="success"
          onClick={() => {
            props.onShowAddModalCard(props.id);
          }}
        >
          +
        </Button>
        {props.label}
      </h3>

      {filteredCards.map((card) => (
        <Card
          key={card.id}
          {...card}
          card={card}
          onShowEditModalCard={props.onShowEditModalCard}
          onShowRemoveModalCard={props.onShowRemoveModalCard}
          onMoveCard={props.onMoveCard}
        />
      ))}
    </div>
  );
};

export default Column;
