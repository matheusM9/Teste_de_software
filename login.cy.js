
//Matheus Silva Santana

describe('Teste de Login - Aceitação', () => {
  const baseUrl = 'https://www.futfanatics.com.br/my-account/login'; // URL da página de login
  const validEmail = 'matheusrh94@gmail.com'; // e-mail válido
  const validPassword = 'K8-iJxz#%2jh8Ks'; // senha válida
  const invalidEmail = 'email.invalido@example.com';// e-mail inválido
  const invalidPassword = 'senhaInvalida123';// senha inválida

  beforeEach(() => {
    // Acessa a página de login 
    cy.visit(baseUrl);
  });

  Cypress.on('uncaught:exception', (err, runnable) => {
    // false para impedir que erros afetem o teste foi necessario
    return false;
  });
  

  it('CT1.1: Deve realizar login com credenciais válidas', () => {
    cy.get('button[id="login-button"]').click(); // Botão de login
    cy.get('input[id="input-email"]').type(validEmail); // Campo de e-mail 
    cy.get('button[id="tray-login-identify"]').click(); // Botão de login
    cy.get('input[id="input-password"]').type(validPassword); // Campo de senha
    cy.get('button[id="password-submit"]').click(); // Botão de continue

    // Verificar se o login foi bem-sucedido
    cy.url().should('include', 'https://www.futfanatics.com.br/my-account/'); // URL após login bem-sucedido
    cy.get('span.app__customer-greetings__greeting-item', { timeout: 10000 }).should('be.visible')
    .and('contain.text', 'Olá, MATHEUS'); // conteúdo do texto  
  });

  it('CT1.2: Deve exibir mensagem de erro ao inserir credenciais inválidas', () => {
    cy.get('button[id="login-button"]').click(); // Botão de login
    cy.get('input[id="input-email"]').type(invalidEmail); // Campo de e-mail 
    cy.get('button[id="tray-login-identify"]').click(); // Botão de login
    cy.get('input[id="input-password"]').type(invalidPassword); // Campo de senha
    cy.get('button[id="password-submit"]').click(); // Botão de continue

    // Verificar a mensagem de erro
    cy.get('span.tray-error-message')
    .should('be.visible')  
    .and('contain', 'Autenticação incorreta'); // texto da mensagem
});

  it('CT1.3: Deve bloquear após múltiplas tentativas inválidas', () => {
    let attemptCount = 0;
const maxAttempts = 20;

const clickUntilBlocked = () => {
  attemptCount++;

  // Clica no botão de login e preenche as informações de login
  cy.get('button[id="login-button"]').click(); // Botão de login
  cy.get('input[id="input-email"]').type(invalidEmail); // Campo de e-mail
  cy.get('button[id="tray-login-identify"]').click(); // Botão de login
  cy.get('input[id="input-password"]').type(invalidPassword); // Campo de senha

  // Clica repetidamente no botão "password-submit" até que a conta seja bloqueada
  cy.get('button[id="password-submit"]').click(); // Primeira tentativa de login incorreta 

  // Loop de tentativas
  const tryLogin = () => {
    cy.get('button[id="password-submit"]', { timeout: 10000 }) // Aumenta o timeout 
      .should('be.visible') // Verifica se o botão está visível antes de clicar
      .click({ force: true }); // Força o clique no botão

    // Verifica se a conta foi bloqueada
    cy.get('body').then(($body) => {
      if ($body.text().includes('Por motivos de segurança bloqueamos o acesso por e-mail e senha durante 60 minutos.')) {
        cy.log('Conta bloqueada após ' + attemptCount + ' tentativas.');
        cy.contains('Por motivos de segurança bloqueamos o acesso por e-mail e senha durante 60 minutos.').should('be.visible');
        return; // Interrompe o loop assim que o bloqueio for detectado
      } else if (attemptCount < maxAttempts) {
        // Se não bloqueou, tenta novamente
        tryLogin();
      } else {
        throw new Error('Limite de tentativas alcançado sem bloqueio.');
      }
    });
  };

  // Inicia loop de tentativas
  tryLogin();
};

// processo de tentativa
clickUntilBlocked();



  });
});
