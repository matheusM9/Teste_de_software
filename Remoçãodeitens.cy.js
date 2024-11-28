//Nicolas Ribeiro Soares

describe('Fluxo de adicionar e remover item do carrinho', () => {
  it('Deve permitir que o usuário adicione e remova um item do carrinho', () => {
    // 1. Acessar a página de produtos
    cy.visit('https://www.futfanatics.com.br/selecoes'); 

    // 2. Simula o hover no primeiro produto para exibir as opções de variantes
    cy.get('.product-item') // Seletor para o item do produto
      .first() // Seleciona o primeiro produto
      .trigger('mouseover'); // Simula o hover no produto

    // 3. Seleciona o tamanho do produto
    cy.get('button[data-variant="1997897"]') // botão de seleção do tamanho 
      .click(); // Clica para selecionar o tamanho

    // 4. Adiciona o item ao carrinho
    cy.get('.btn-add-to-cart') //  botão "Adicionar ao carrinho"
      .first() // Seleciona o primeiro botão de adicionar
      .click(); // Clica para adicionar ao carrinho

    // 5. Espera o carrinho ser atualizado
    cy.wait(1000); 

    // 6. Verifica se o item foi adicionado ao carrinho
    cy.get('span.cart-qty.has-items') // Seletor para o contador de itens no carrinho
      .should('have.text', '1'); // Verifica se o número de itens no carrinho é 1

    // 7. Clica no ícone do carrinho
    cy.get('i.icon-cart')
      .click();

    // 8. Espera até que o conteúdo do carrinho esteja presente
    cy.get('.cart-products') // Seletor que contém os produtos no carrinho
      .should('exist'); // Verifica se o conteúdo foi carregado

    // 9. Clicar no ícone da lixeira para remover o item
    cy.get('i.icon-trash') // ícone de lixeira
      .first() // remove o primeiro
      .click({ force: true }); // Clica para remover o item

    // 10. Verifica se o item foi removido do carrinho
    cy.get('ul.cart-items li') // lista de itens no carrinho
      .should('not.exist') // Verifica se nenhum item está mais presente no carrinho
      .then(() => {
        // 11. Encerrar o teste se o carrinho estiver vazio
        cy.log('O item foi removido do carrinho. Teste encerrado.');
        cy.end(); // Finaliza o teste 
      });
  });
});
