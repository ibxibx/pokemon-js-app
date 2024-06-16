let pokemonRepository = (function () {
  let e = [];
  function t(e) {
    return fetch(e).then((e) => e.json());
  }
  function o() {
    document.getElementById("loadingMessage").textContent = "Loading...";
  }
  function n() {
    document.getElementById("loadingMessage").textContent = "";
  }
  function r(e) {
    return (
      o(),
      t(e.detailsUrl)
        .then(
          (t) => (
            (e.imgUrl = t.sprites.front_default), (e.height = t.height), n(), e
          )
        )
        .catch((e) => {
          console.error(e), n();
        })
    );
  }
  function i() {
    return e;
  }
  function l(t) {
    "object" == typeof t
      ? e.push(t)
      : console.error("Error: Only objects can be added to the pokemonList.");
  }
  function a(e) {
    console.log("Showing details for:", e.name),
      r(e).then((e) => {
        let t = document.getElementById("modalTitle"),
          o = document.getElementById("modalText"),
          n = document.getElementById("modalImg");
        (t.innerText = d(e.name)),
          (o.innerText = `Height: ${e.height / 10} m`),
          n.setAttribute("src", e.imgUrl),
          $("#pokemonModal").modal("show");
      });
  }
  function s(e) {
    let t = document.querySelector("#pokemonList"),
      o = document.createElement("li");
    o.classList.add("list-group-item");
    let n = document.createElement("button");
    (n.innerText = d(e.name)),
      n.classList.add("pokemon-button"),
      n.setAttribute("data-toggle", "modal"),
      n.setAttribute("data-target", "#pokemonModal"),
      o.appendChild(n),
      t.appendChild(o),
      n.addEventListener("click", function () {
        a(e);
      });
  }
  function d(e) {
    return e.charAt(0).toUpperCase() + e.slice(1);
  }
  return {
    getAll: i,
    add: l,
    filterPokemonList: function t() {
      let o = document.getElementById("searchBar");
      o.addEventListener("keyup", () => {
        var t;
        let n = o.value.toLowerCase();
        (t = e.filter((e) => e.name.toLowerCase().includes(n))),
          (document.querySelector("#pokemonList").innerHTML = ""),
          t.forEach((e) => {
            s(e);
          });
      });
    },
    addListItem: s,
    loadList: function () {
      return (
        o(),
        t("https://pokeapi.co/api/v2/pokemon/?limit=150")
          .then((e) => {
            e.results.forEach((e) => {
              l({ name: e.name, detailsUrl: e.url });
            }),
              n();
          })
          .catch((e) => {
            console.error(e), n();
          })
      );
    },
    loadDetails: function (e) {
      return r(e);
    },
    showDetails: function (e) {
      return a(e);
    },
  };
})();
pokemonRepository
  .loadList()
  .then(() =>
    Promise.all(
      pokemonRepository.getAll().map((e) => pokemonRepository.loadDetails(e))
    )
  )
  .then(() => {
    pokemonRepository.getAll().forEach((e) => {
      pokemonRepository.addListItem(e);
    });
  })
  .catch((e) => console.error(e)),
  pokemonRepository.filterPokemonList();
