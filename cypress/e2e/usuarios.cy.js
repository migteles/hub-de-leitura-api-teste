/// <reference types="cypress"/>

import { faker } from "@faker-js/faker";

let token
  beforeEach(() => {
    cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
      token = tkn
    })
  });

describe("Teste de API GET - Gestão de Usuários", () => {
  
  it("Deve listar usuários com sucesso", () => {
    cy.api({
      method: "GET",
      url: "users",
      headers: { Authorization: token },
    }).should((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.users).to.be.an("array");
    });
  });

  it("Deve validar propriedades de um usuário", () => {
    cy.api({
      method: "GET",
      url: "users",
      headers: { Authorization: token },
    }).should((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.users[0]).to.have.property("id");
      expect(response.body.users[0]).to.have.property("name");
      expect(response.body.users[0]).to.have.property("email");
    });
  });

  it("Deve validar um usuário com ID", () => {
    cy.api({
      method: "GET",
      url: "users/2",
      headers: { Authorization: token },
    }).should((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("id");
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("email");
    });
  });

  it("Deve validar um usuário com filtros", () => {
    cy.api({
      method: "GET",
      url: "users",
      headers: { Authorization: token },
      qs: {
        page: 1,
        limit: 20,
        search: "Usuário",
      },
    }).should((response) => {
      expect(response.status).to.equal(200);
    });
  });
});

describe("Teste de API POST - Gestão de Usuários", () => {
  
  it("Criar um usuário novo com sucesso", () => {
    let name = `${faker.person.fullName()}`
    let email = `${faker.internet.email()}`
    let password = `${faker.internet.password()}`
    
    cy.api({
      method: "POST",
      url: "users",
      body: {
        name: name,
        email: email,
        password: password,
      },
    }).should((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal("Usuário criado com sucesso.")
    })
  });

  it("Falhar ao cadastrar com email inválido", () => {
    cy.api({
      method: "POST",
      url: "users",
      body: {
        name: "Maria Santos",
        email: "mariaemailcom",
        password: "senha123"
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal("Formato de email inválido.");
    });
  });
});

describe("Teste de API PUT - Gestão de Usuários", () => {
  
  it('Deve modificar o perfil de um usuário com sucesso', () => {
    let name = `${faker.person.fullName()}`
    let email = `${faker.internet.email()}`
    let password = `${faker.internet.password({ length: 10 })}`
    
    cy.api({
      method: 'PUT',
      url: 'users/9',
      headers: { Authorization: token },
      body: {
        name: name,
        email: email,
        password: password
      },
    }).should((response) => {
      expect(response.status).to.equal(200)
      expect(response.body.message).to.equal("Usuário atualizado com sucesso.");
    });
  });

  it('Cadastro + Atualização de usuário dinâmica', () => {
    let name = `${faker.person.fullName()}`
    let email = `${faker.internet.email()}`
    let password = `${faker.internet.password({ length: 10 })}`
    
    cy.cadastroUser(name, email, password).then(userId => {
      cy.api({
        method: 'PUT',
        url: 'users/' + userId,
        headers: { 'Authorization': token },
        body: {
          name: "Socrates Brasileiro",
          email: "doutorsocratessccp@email.com",
          password: "Corinthians1910"
        }
      }).should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Usuário atualizado com sucesso.')
      })
    });
  });
});

describe("Teste de API DELETE - Gestão de Usuários", () => {

  it.only('Deve excluir um usuário com sucesso', () => {
    let name = `${faker.person.fullName()}`
    let email = `${faker.internet.email()}`
    let password = `${faker.internet.password({ length: 10 })}`
    
    cy.cadastroUser(name, email, password).then(userId => {
      cy.api({
        method: 'DELETE',
        url: `users/${userId}`,
        headers: { Authorization: token }
      }).should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Usuário removido com sucesso.')
      })
    })
  });

})