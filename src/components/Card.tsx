import { Button } from "react-bootstrap";
import { CardInterfaceProps } from "../interface/CardInterface";

const Card = (props: CardInterfaceProps): React.JSX.Element => {
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <Button
          disabled={props.column === 1}
          variant="primary"
          onClick={() => {
            props.onMoveCard("left", props.card);
          }}
        >
          ◀️
        </Button>
        <Button
          variant="warning"
          onClick={() => {
            props.onShowEditModalCard(props.card);
          }}
        >
          🖊️
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            props.onShowRemoveModalCard(props.card);
          }}
        >
          ❌
        </Button>
        <Button
          disabled={props.column === 4}
          variant="primary"
          onClick={() => {
            props.onMoveCard("right", props.card);
          }}
        >
          ▶️
        </Button>
      </div>
      <div className="card-body">
        <h5 className="card-title">{props.question}</h5>
        <p className="card-text">{props.answer}</p>
      </div>
    </div>
  );
};

export default Card;
