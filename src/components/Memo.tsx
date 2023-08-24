import React, { useEffect, useState } from "react";
import ColumnInterface from "../interface/ColumnInterface";
import Data from "../services/Data";
import Column from "./Column";
import TermInterface, { TermInterfacePost } from "../interface/TermInterface";
import CardInterface, { CardInterfacePost } from "../interface/CardInterface";
import { Button, Form, Modal } from "react-bootstrap";
import { TermInterfaceProps } from "./../interface/TermInterface";

const Memo = () => {
  const [columns, setColumns] = useState<ColumnInterface[]>([]);
  const [terms, setTerms] = useState<TermInterface[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<TermInterface | null>(null);
  const [cards, setCards] = useState<CardInterface[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [showModalCard, setShowModalCard] = useState(false);
  const [showModalRemoveCard, setShowModalRemoveCard] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalTermName, setModalTermName] = useState("");
  const [editingTerm, setEditingTerm] = useState<TermInterface | null>(null);
  const [modalColumn, setModalColumn] = useState<number>();
  const [modalQuestion, setModalQuestion] = useState("");
  const [modalAnswer, setModalAnswer] = useState("");
  const [editingCard, setEditingCard] = useState<CardInterface | null>(null);

  const data = Data.getInstance();

  useEffect(() => {
    (async () => {
      const loadedColumns: ColumnInterface[] = await data.loadColumns();
      setColumns(loadedColumns);
      const loadedTerms: TermInterface[] = await data.loadTerms();
      setTerms(loadedTerms);
    })();
  }, []);

  const handleTermClick = (term: TermInterface) => {
    (async () => {
      if (selectedTerm) selectedTerm.selected = false;
      term.selected = true;
      setSelectedTerm(term);
      setCards(await data.loadCardsByTerm(term.id));
    })();
  };

  const handleCloseModalTerm = () => {
    setShowModal(false);
    setShowModalRemove(false);
    setModalTitle("");
    setModalTermName("");
    setEditingTerm(null);
  };

  const handleCloseModalCard = () => {
    setShowModalCard(false);
    setShowModalRemoveCard(false);
    setModalTitle("");
    setModalQuestion("");
    setModalAnswer("");
    setEditingCard(null);
  };

  const handleShowAddModalTerm = () => {
    setModalTitle("Ajouter une thématique");
    setShowModal(true);
  };

  const handleShowEditModalTerm = (term: TermInterface) => {
    setModalTitle("Modifier la thématique");
    setModalTermName(term.name);
    setEditingTerm(term);
    setShowModal(true);
  };

  const handleShowRemoveModalTerm = (term: TermInterface) => {
    setModalTitle("Supprimer la thématique");
    setEditingTerm(term);
    setShowModalRemove(true);
  };

  const handleShowAddModalCard = (column_id: number) => {
    setModalTitle("Ajouter une carte");
    setModalColumn(column_id);
    setShowModalCard(true);
  };

  const handleShowEditModalCard = (card: CardInterface) => {
    setModalTitle("Modifier la carte");
    setModalQuestion(card.question);
    setModalAnswer(card.answer);
    setEditingCard(card);
    setShowModalCard(true);
  };

  const handleShowRemoveModalCard = (card: CardInterface) => {
    setModalTitle("Supprimer la carte");
    setEditingCard(card);
    setShowModalRemoveCard(true);
  };

  const handleSaveTerm = async () => {
    if (modalTitle === "Ajouter une thématique") {
      const new_term: TermInterfacePost = {
        name: modalTermName,
        open: false,
        selected: false,
      };
      await data.addTerm(new_term);
      const loadedTerms: TermInterface[] = await data.loadTerms();
      setTerms(loadedTerms);
    } else if (modalTitle === "Modifier la thématique" && editingTerm) {
      const editTerm: TermInterface = await data.editTerm(
        editingTerm.id,
        modalTermName
      );
      const copy_terms = terms.map((term) => {
        if (editingTerm.id === term.id) {
          return editTerm;
        }
        return term;
      });
      setTerms(copy_terms);
    }

    handleCloseModalTerm();
  };

  const handleSaveCard = async () => {
    if (selectedTerm && modalColumn && modalTitle === "Ajouter une carte") {
      const new_card: CardInterfacePost = {
        question: modalQuestion,
        answer: modalAnswer,
        column: modalColumn,
        selected: false,
        tid: selectedTerm.id,
      };
      await data.addCard(new_card);
      const loadedCards: CardInterface[] = await data.loadCardsByTerm(
        selectedTerm.id
      );
      setCards(loadedCards);
    } else if (modalTitle === "Modifier la carte" && editingCard) {
      const copy_cards = cards.map((card) => {
        if (editingCard.id === card.id) {
          editingCard.question = modalQuestion;
          editingCard.answer = modalAnswer;
          return editingCard;
        }
        return card;
      });
      await data.editCard(editingCard);
      setCards(copy_cards);
    }

    handleCloseModalCard();
  };

  const handleRemoveTerm = async () => {
    if (editingTerm) {
      const card_term: CardInterface[] = await data.loadCardsByTerm(
        editingTerm.id
      );
      for (const card of card_term) {
        await data.deleteCard(card.id);
      }
      if (selectedTerm && selectedTerm.id === editingTerm.id) {
        setCards([]);
        setSelectedTerm(null);
      }

      await data.deleteTerm(editingTerm.id);
      const copy_terms = terms.filter((term) => term.id !== editingTerm.id);
      setTerms(copy_terms);
    }
    handleCloseModalTerm();
  };

  const handleRemoveCard = async () => {
    if (editingCard) {
      await data.deleteCard(editingCard.id);
      const copy_cards = cards.filter((card) => card.id !== editingCard.id);
      setCards(copy_cards);
    }
    handleCloseModalCard();
  };

  const renderCardsByCategory = () => {
    if (!selectedTerm) {
      return null;
    }
    return (
      <div className="row">
        {columns.map((column) => (
          <Column
            key={column.id}
            onShowAddModalCard={handleShowAddModalCard}
            onShowEditModalCard={handleShowEditModalCard}
            onShowRemoveModalCard={handleShowRemoveModalCard}
            onMoveCard={handleMoveCard}
            {...column}
            cards={cards}
          />
        ))}
      </div>
    );
  };

  const handleMoveCard = async (
    direction: string,
    mouve_card: CardInterface
  ) => {
    let column: number = mouve_card.column;
    if (direction === "left" && column > 1) column--;
    if (direction === "right" && column < 4) column++;
    mouve_card.column = column;
    const edit_card: CardInterface = await data.editCard(mouve_card);
    const copy_cards = cards.map((card) => {
      if (mouve_card.id === card.id) {
        return edit_card;
      }
      return card;
    });
    setCards(copy_cards);
  };

  return (
    <>
      <h2>Choisissez une catégorie :</h2>
      <div className="btn-group">
        {terms.map((term) => (
          <div key={term.id}>
            <button
              type="button"
              className={`btn  ${
                term.selected ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => handleTermClick(term)}
            >
              {term.name}
            </button>
            <Button
              variant="warning"
              onClick={() => handleShowEditModalTerm(term)}
            >
              🖊️
            </Button>
            <Button
              variant="danger"
              onClick={() => handleShowRemoveModalTerm(term)}
            >
              ❌
            </Button>
          </div>
        ))}
        <Button variant="success" onClick={handleShowAddModalTerm}>
          +
        </Button>
      </div>
      {renderCardsByCategory()}

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModalTerm}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nom du terme</Form.Label>
            <Form.Control
              type="text"
              value={modalTermName}
              onChange={(e) => setModalTermName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalTerm}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveTerm}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalRemove} onHide={handleCloseModalTerm}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalTerm}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleRemoveTerm}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalCard} onHide={handleCloseModalCard}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Question</Form.Label>
            <Form.Control
              type="text"
              value={modalQuestion}
              onChange={(e) => setModalQuestion(e.target.value)}
            />
            <Form.Label>Réponse</Form.Label>
            <Form.Control
              type="text"
              value={modalAnswer}
              onChange={(e) => setModalAnswer(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalCard}>
            Annuler
          </Button>
          <Button variant="primary" onClick={() => handleSaveCard()}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalRemoveCard} onHide={handleCloseModalCard}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalCard}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleRemoveCard}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Memo;
