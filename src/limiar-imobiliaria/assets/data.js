'use strict';
(() => {
  const properties = [
    {id:'luz-na-estrela', title:'A luz mora aqui', location:'Lisboa', neighborhood:'Estrela', type:'T2', price:585000, area:112, baths:2, energy:'B', photo:'1600607687920-4e2a09cf159d', tag:'EXCLUSIVO', description:'Um apartamento de linhas depuradas no coração da Estrela. A sala abre-se à luz do poente, enquanto a madeira natural e os tons claros criam um ambiente sereno. Inclui varanda e um lugar de estacionamento.'},
    {id:'jardim-foz', title:'Entre o jardim e o mar', location:'Porto', neighborhood:'Foz do Douro', type:'T3', price:795000, area:168, baths:3, energy:'A', photo:'1600210492486-724fe5c67fb0', tag:'COM JARDIM', description:'Uma casa para viver devagar, a poucos minutos a pé do mar. Sala com ligação ao jardim privativo, cozinha equipada e três quartos generosos. Garagem para dois carros.'},
    {id:'casa-cascais', title:'O lado tranquilo da vida', location:'Cascais', neighborhood:'Birre', type:'T4', price:1250000, area:245, baths:4, energy:'A+', photo:'1600047509807-ba8f99d2cdde', tag:'MORADIA', description:'Arquitetura contemporânea em diálogo com o exterior. Quatro quartos, pátio abrigado e piscina privada. Um refúgio com espaço para toda a família, perto das praias de Cascais.'},
    {id:'cedofeita', title:'Um novo olhar sobre o Porto', location:'Porto', neighborhood:'Cedofeita', type:'T1', price:295000, area:68, baths:1, energy:'B', photo:'1600566753086-00f18fb6b3ea', tag:'NOVIDADE', description:'Pé-direito alto e detalhes de época num edifício reabilitado. Uma casa acolhedora, com cozinha aberta e varanda, num bairro de galerias, cafés e comércio de proximidade.'}
  ];
  function filterProperties({location='', type='', price='', favorites=null, sort='selection'} = {}) {
    const result = properties.filter(p => (!location || p.location === location) && (!type || p.type === type) && (!price || p.price <= Number(price)) && (!favorites || favorites.includes(p.id)));
    if (sort === 'asc') result.sort((a,b) => a.price-b.price);
    if (sort === 'desc') result.sort((a,b) => b.price-a.price);
    return result;
  }
  globalThis.Limiar = {properties, filterProperties};
})();
