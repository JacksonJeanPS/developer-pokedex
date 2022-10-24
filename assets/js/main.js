const pokemonList = document.querySelector('#pokemonList');
const loadMoreButton = document.querySelector('#loadMoreButton');
const modal = document.querySelector('#modal');
let listPokemons = [];
let offset = 0;
const limit = 20;
const maxPokemons = 251;

function convertPokemonTypesToLi(pokemonTypes) {
  return pokemonTypes
    .map((type) => `<li class="type ${type}-icon">${type}</li>`)
    .join('');
}

function convertPokemonStatsToLi(pokemonStats) {
  return Object.keys(pokemonStats)
    .map(
      (stat) =>
        `<li class="stat">
          <span class="stat-name">${stat.replace('_', ' ').toUpperCase()}: ${pokemonStats[stat]}</span>
        </li>`
    )
    .join('');
}

function convertPokemonToLi(pokemon) {
  return ` <li class="pokemon ${pokemon?.type}">
                <span class="number">#${pokemon?.number}</span>
                <span class="name">${pokemon?.name}</span>
                <div class="detail">
                <ol class="types">
                    ${convertPokemonTypesToLi(pokemon?.types)}
                </ol>
                  <img src="${pokemon?.photo}" alt="${pokemon?.name}"/>
                </div>
            </li>`;
}

async function loadPokemonItens(offset, limit) {
  await pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    listPokemons = [...listPokemons, ...pokemons];
    pokemonList.innerHTML += pokemons.map(convertPokemonToLi).join('');
  });

  let pokemonLi = document.querySelectorAll('.pokemon');
  pokemonLi.forEach((elemento) => {
    elemento.addEventListener('click', (element) => {
      const pokemonId = element.target
        .closest('.pokemon')
        .firstElementChild.textContent.replace('#', '');

      let pokemonDetails = listPokemons.find(
        (pokemon) => pokemon.number == pokemonId
      );

      convertPokemonToModal(pokemonDetails);
    });
  });
}

function convertPokemonToModal(pokemon) {
  const modalContent = ` 
  <div class="modal-dialog modal-dialog-centered pokemon ">
    <div class="modal-content pe-none"> 
      <div id="div-title" class="modal-header border-0 d-flex">
        <h1 class="modal-title fs-5 text-capitalize text-light " id="title ">${pokemon.name}  #${pokemon.number}</h1>
      </div>
      <div class="modal-body m-0 p-0">
        <div class="container d-flex justify-content-center">
          <img id="img-detail" height="120" src="${pokemon?.photo}" alt="${pokemon?.name}">
        </div>
        <div class="container">
          <div class="text-center mt-2">
            <div class="d-flex justify-content-center detail">
              <h5 id="type1" class="m-2 types">${convertPokemonTypesToLi(pokemon?.types)}</h5>
            </div>

            <div class="row mb-4 mb-2 p-4 d-flex flex-column">
              <ol class="stats list-unstyled mb-2 bg-light text-dark">
                ${convertPokemonStatsToLi(pokemon?.stats)}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  if (modal.children[0].children.length > 1) {
    modal.children[0].children[1].remove();
  }
  modal.children[0].innerHTML += modalContent;
  document.getElementById('abreModal').click();
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
  offset += limit;
  const qtdRecords = offset + limit;
  if (qtdRecords >= maxPokemons) {
    const newLimit = maxPokemons - offset;
    loadPokemonItens(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

document.querySelector('.fechar').click();
