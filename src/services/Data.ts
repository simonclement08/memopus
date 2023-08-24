import CardInterface, { CardInterfacePost } from "../interface/CardInterface";
import ColumnInterface from "../interface/ColumnInterface";
import TermInterface, { TermInterfacePost } from "../interface/TermInterface";
import { UserInterface } from "../interface/UserInterface";

export default class Data {
  private static instance: Data;
  base_url: string;

  private constructor() {
    this.base_url = "http://localhost:3001/";
  }

  public static getInstance(): Data {
    if (!Data.instance) {
      Data.instance = new Data();
    }
    return Data.instance;
  }

  async loadUsers(): Promise<UserInterface[]> {
    return fetch(this.base_url + "users")
      .then((response) => {
        return response.json();
      })
      .then((users) => {
        return users;
      })
      .catch((error) => {
        console.error("Erreur attrapée dans loadUsers " + error);
      });
  }

  async loadColumns(): Promise<ColumnInterface[]> {
    return fetch(this.base_url + "columns")
      .then((response) => {
        return response.json();
      })
      .then((colums) => {
        return colums;
      })
      .catch((error) => {
        console.error("Erreur attrapée dans loadColumns " + error);
      });
  }

  async loadTerms(): Promise<TermInterface[]> {
    return fetch(this.base_url + "terms")
      .then((response) => {
        return response.json();
      })
      .then((terms) => {
        return terms;
      })
      .catch((error) => {
        console.error("Erreur attrapée dans loadTerms " + error);
      });
  }

  async addTerm(term: TermInterfacePost): Promise<TermInterface[]> {
    return fetch(this.base_url + "terms", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(term),
    })
      .then((response) => {
        return response.json();
      })
      .then((term) => {
        return term;
      })
      .catch((error) => {
        console.error("Erreur attrapée dans addTerm " + error);
      });
  }

  async editTerm(term_id: number, name: string): Promise<TermInterface> {
    return fetch(this.base_url + "terms" + "/" + term_id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({ name }),
    })
      .then((response) => {
        return response.json();
      })
      .then((term) => {
        return term;
      })
      .catch((error) => {
        console.error("Erreur attrapée dans editTerm", error);
      });
  }

  async deleteTerm(term_id: number): Promise<any> {
    return fetch(this.base_url + "terms" + "/" + term_id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .then((term) => {
        return term;
      })
      .catch((error) => {
        console.error("Erreur attrapée dans deleteTerm", error);
      });
  }

  async loadCardsByTerm(term_id: number): Promise<CardInterface[]> {
    return fetch(this.base_url + "cards?tid=" + term_id)
      .then((response) => {
        return response.json();
      })
      .then((cards) => {
        return cards;
      })
      .catch((error) => {
        console.error("Erreur attrapée dans loadCardsByTerm " + error);
      });
  }

  async addCard(card: CardInterfacePost): Promise<CardInterface[]> {
    return fetch(this.base_url + "cards", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(card),
    })
      .then((response) => {
        return response.json();
      })
      .then((card) => {
        return card;
      })
      .catch((error) => {
        console.error("Erreur attrapée dans addCard " + error);
      });
  }

  async editCard(card: CardInterface): Promise<CardInterface> {
    return fetch(this.base_url + "cards/" + card.id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(card),
    })
      .then((response) => {
        return response.json();
      })
      .then((card) => {
        return card;
      })
      .catch((error) => {
        console.error("Erreur attrapée dans editCard", error);
      });
  }

  async deleteCard(card_id: number): Promise<any> {
    return fetch(this.base_url + "cards/" + card_id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .then((card) => {
        return card;
      })
      .catch((error) => {
        console.error("Erreur attrapée dans deleteCard", error);
      });
  }
}
