let pokedex = [];

const baseUrl = "https://pokeapi.co/api/v2";
const buttonSearch = document.querySelector(".abs");
const buttonClose = document.querySelector(".close-icon");
const buttonClosePokedex = document.querySelector(".close-icon-2");
const buttonAddToPokedex = document.querySelector(".add");
const buttonShowPokedex = document.querySelector(".btn-show-pokdx");
const buttonDeletePokemon = document.querySelector(".delete-pokemon");
const input = document.querySelector("input");
const pokemonName = document.querySelector(".name-pkm");
const pokemonImage = document.getElementById("pokemonImage");
const modal = document.getElementById("modal");
const modalInfo = document.querySelector("#modalInfo > div");
const modalPokedex = document.querySelector("#modalPokedex");
const modalDeletePokemon = document.querySelector("#modal-delete-pokemon");
const containerModalPokedex = document.querySelector("#modalPokedex > div");

const about = document.querySelector(".about");
const charac = document.querySelector(".charac");
const height = document.querySelector(".height");
const weight = document.querySelector(".weight");

window.addEventListener('offline', () => {
  console.error("Sem conexão com a internet.");
  document.getElementById("modalOffline").style.opacity = "1";
  document.getElementById("modalOffline").style.visibility = "visible";
})

window.addEventListener('online', () => {
  document.getElementById("modalOffline").style.opacity = "0";
  document.getElementById("modalOffline").style.visibility = "hidden";
})


const showModalInfo = (modal, text) => {
  modal.style.opacity = "1";
  modal.style.transform = "translate(-50%, 10px)";
  modal.innerHTML = text;

  setTimeout(() => {
    modal.style.transform = "translate(-50%, -20px)";
    modal.style.opacity = "0";
  }, 2000);
};

const showModal = (modal) => {
  modal.style.opacity = "1";
  modal.style.visibility = "visible";
};

const getRandomIndex = () => {
  const random = Math.floor(Math.random() * 9);
  return random;
};

const convert = (func, number) => {
  switch (func) {
    case "dmToCm":
      return number * 10;
    case "hgToKg":
      return number / 10;
  }
};

const toUpper = (string) => {
  const formatted = string.charAt(0).toUpperCase() + string.substring(1);
  return formatted;
};

const loadTranslation = (container, textBefore) => {
  fetch(
    `https://api.mymemory.translated.net/get?q=${textBefore}&langpair=EN|PT-BR`
  )
    .then((res) => res.json())
    .then((data) => {
      container.innerHTML = data.responseData.translatedText;
      return container.innerHTML;
    });
};

const deletePokemon = (id) => {
  let pokedexList = JSON.parse(localStorage.getItem("pokemonList"));
  let foundId = id;
  let card = document.querySelector(`.card-pokemon-id-${id}`);
  let buttonDeletePokemon = document.querySelector(".delete-it");
  let buttonDontDeletePokemon = document.querySelector(".dont-delete-it");
  showModal(modalDeletePokemon);

  buttonDeletePokemon.addEventListener("click", () => {
    pokedexList = pokedexList.filter((pokemon) => pokemon.id !== foundId);
    localStorage.setItem("pokemonList", JSON.stringify(pokedexList));
    card.style.scale = "0.0";

    setTimeout(() => {
      modalDeletePokemon.style.opacity = "0";
      modalDeletePokemon.style.visibility = "hidden";
    }, 600);

    setTimeout(() => {
      loadPokedex();
    }, 1000);
  });

  buttonDontDeletePokemon.addEventListener("click", () => {
    modalDeletePokemon.style.opacity = "0";
    modalDeletePokemon.style.visibility = "hidden";
  });
};

const loadPokedex = () => {
  let pokedexList = JSON.parse(localStorage.getItem("pokemonList"));

  const colors = {
    normal: "#aa9",
    fire: "#f42",
    water: "#39f",
    electric: "#fc3",
    grass: "#7c5",
    ice: "#6cf",
    fighting: "#b54",
    poison: "#a59",
    ground: "#db5",
    flying: "#89f",
    psychic: "#f59",
    bug: "#ab2",
    rock: "#ba6",
    ghost: "#66b",
    dragon: "#76e",
    dark: "#111",
    steel: "#aab",
    fairy: "#e9e",
  };

  let pokemons = document.querySelector(".pokemons");

  if (pokedexList){
    pokemons.innerHTML = pokedexList
      .map((pokemon) => {
        return `
            <div class="cardPokemon card-pokemon-id-${pokemon.id}" style="border: 3px solid ${colors[pokemon.type]};">
              <div class="cardImgPokemon">
                  <img src="${pokemon.img}" alt="">
              </div>
              <div>
                  <p>${toUpper(pokemon.name)}</p>
                  <p class="cardTypePokemon" style="background-color: ${colors[pokemon.type]};">${pokemon.type}</p>
              </div>
              <button type="button" class="delete-pokemon" onclick=deletePokemon(${pokemon.id})><i class="fa-solid fa-trash-can"></i></button>
            </div>
            `;
      })
      .join("");
  }
};

buttonClosePokedex.addEventListener("click", () => {
  containerModalPokedex.style.transform = "translate(-50%, 100%)";
  modalPokedex.style.opacity = "0";
  modalPokedex.style.visibility = "hidden";
});

buttonClose.addEventListener("click", () => {
  modal.style.opacity = "0";
  modal.style.visibility = "hidden";
  input.value = "";
});

buttonShowPokedex.addEventListener("click", () => {
  loadPokedex();
  showModal(modalPokedex);
  setTimeout(() => {
    containerModalPokedex.style.transform = "translate(-50%, 0px)";
  }, 600);
});

buttonAddToPokedex.addEventListener("click", () => {
  let pokemon = input.value;
  let oldPokedex = JSON.parse(localStorage.getItem("pokemonList"));

  if (oldPokedex) {
    fetch(`${baseUrl}/pokemon/${pokemon.toLocaleLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        class Pokemon {
          constructor(name, idPokemon, type) {
            this.name = name;
            this.id = oldPokedex.length + 1;
            this.idPokemon = idPokemon;
            this.type = type;
            this.img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${idPokemon}.gif`;
          }
        }

        const found = oldPokedex.find((pokemon) => pokemon.name == data.name);

        if (found) {
          showModalInfo(modalInfo, "Você já salvou esse Pokemón.");
        } else {
          const newPokemon = new Pokemon(
            data.name,
            data.id,
            data.types[0].type.name
          );
          oldPokedex.push(newPokemon);

          localStorage.setItem("pokemonList", JSON.stringify(oldPokedex));
          showModalInfo(modalInfo, "Pokemón salvo com sucesso!");
        }
      });
  } else {
    fetch(`${baseUrl}/pokemon/${pokemon.toLocaleLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        class Pokemon {
          constructor(name, idPokemon, type) {
            this.name = name;
            this.id = 1;
            this.ididPokemon = idPokemon;
            this.type = type;
            this.img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${idPokemon}.gif`;
          }
        }

        const newPokemon = new Pokemon(
          data.name,
          data.id,
          data.types[0].type.name
        );
        pokedex.push(newPokemon);

        localStorage.setItem("pokemonList", JSON.stringify(pokedex));
      });
  }
});

buttonSearch.addEventListener("click", () => {
  let pokemon = input.value;
  if (pokemon.length !== 0) {
    fetch(`${baseUrl}/pokemon/${pokemon.toLocaleLowerCase()}`)
      .then((response) => response.json())
      .then((data) => {
        pokemonName.innerHTML = toUpper(data.name);
        pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${data.id}.gif`;
        height.innerHTML = `Altura: ${convert("dmToCm", data.height)}cm`;
        weight.innerHTML = `Peso: ${convert("hgToKg", data.weight)}kg`;

        fetch(`${baseUrl}/pokemon-species/${data.id}`)
          .then((response) => response.json())
          .then((data) => {
            let aboutText =
              data.flavor_text_entries[
                getRandomIndex(data.flavor_text_entries)
              ].flavor_text;
            // about.innerHTML = aboutText
            loadTranslation(about, aboutText);
            // demo
          });

        fetch(`${baseUrl}/characteristic/${data.id}`)
          .then((response) => response.json())
          .then((data) => {
            // charac.innerHTML = data.descriptions[7].description
            loadTranslation(charac, data.descriptions[7].description);
            // demo
          })
          .catch((error) => {
            charac.innerHTML = `O ${toUpper(
              data.name
            )} não tem característica!`;
            console.error(
              `A característica do Pokemón "${data.name}" não existe.`
            );
          });

        setTimeout(() => {
          showModal(modal);
        }, 1000);
      })

      .catch((error) => {
        console.log(error);
        if (
          (error =
            'SyntaxError: Unexpected token "N", "Not Found" is not valid JSON')
        ) {
          showModalInfo(
            modalInfo,
            "<p> O Pokemón digitado não foi encontrado! <br>Tente novamente."
          );
        }
      });
  } else {
    showModalInfo(modalInfo, "<p>Digite o nome de algum Pokémon.</p>");
  }
});

loadPokedex();