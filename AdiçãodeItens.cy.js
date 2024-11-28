
//mateus Vitor da Silva

describe('Teste de Performance - Adição de Itens ao Carrinho', () => {
  beforeEach(() => {
    
    cy.visit('https://www.futfanatics.com.br/selecoes');
    cy.get('h1').should('contain', 'Seleções'); // Confirmação da página carregada
  });

  it('CT3.1: Medir o tempo de resposta ao adicionar itens ao carrinho', () => {
    const start = new Date().getTime(); // Marca o tempo inicial

    // Simula o hover no primeiro produto
    cy.get('.product-item')
      .first()
      .trigger('mouseover');

    // Seleciona o tamanho e adiciona ao carrinho
    cy.get('button[data-variant="1997897"]').click();
    cy.get('.btn-add-to-cart').first().click();

    // Verifica a resposta
    cy.get('.cart-note').should('not.have.class', 'd-none').then(() => {
      const end = new Date().getTime(); // Marca o tempo final
      const elapsedTime = end - start;
      cy.log(`Tempo de resposta: ${elapsedTime}ms`);
      expect(elapsedTime).to.be.lessThan(7000); // Exemplo: Resposta aceitável em menos de 7 segundos 
    });
  });

  it('CT3.2: Avaliar o desempenho em cenários de alta carga', () => {
    const iterations = 20; // Número de interações
    let start, end;

    cy.visit('https://www.futfanatics.com.br/selecoes', {
      onBeforeLoad(win) {
        win.eval(`
          const style = document.createElement('style');
          style.innerHTML = '* { transition: none !important; animation: none !important; }';
          document.head.appendChild(style);
        `);
      },
    });

    start = new Date().getTime();

    for (let i = 0; i < iterations; i++) {
      cy.get('.product-item').first().trigger('mouseover', { waitForAnimations: false });
      cy.get('.btn-add-to-cart').first().click({ force: true });

    }

    // Seleciona o tamanho e adiciona ao carrinho
    cy.get('button[data-variant="1997897"]').click();
    cy.get('.btn-add-to-cart').first().click();

    // Aguarde até que o cart-note apareça
    cy.get('.cart-note', { timeout: 5000 }).should('not.have.class', 'd-none');

    end = new Date().getTime();

    const elapsedTime = end - start;
    cy.log(`Tempo total para ${iterations} adições: ${elapsedTime}ms`);
    expect(elapsedTime).to.be.lessThan(2000); 
  });
});
