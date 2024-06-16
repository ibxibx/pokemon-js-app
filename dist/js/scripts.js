let pokemonRepository = (function () {
  let e = [];
  function t(e) {
    return fetch(e).then((e) => e.json());
  }
  function o() {
    let e = document.getElementById("loadingMessage");
    e.textContent = "Loading...";
  }
  function n() {
    let e = document.getElementById("loadingMessage");
    e.textContent = "";
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
      r(e).then(function (e) {
        var t, o, n;
        (t = e.name),
          (o = `Height: ${e.height / 10} m`),
          (n = e.imgUrl),
          console.log("Showing modal for:", t),
          (document.getElementById("modalTitle").innerText = d(t)),
          (document.getElementById("modalText").innerText = o),
          document.getElementById("modalImg").setAttribute("src", n),
          $("#pokemonModal").modal("show");
      });
  }
  function s(e) {
    let t = document.querySelector("#pokemonList"),
      o = document.createElement("li");
    o.classList.add("list-group-item");
    let n = document.createElement("button");
    (n.innerText = d(e.name)),
      n.classList.add("btn", "btn-primary", "pokemon-button"),
      n.setAttribute("data-toggle", "modal"),
      n.setAttribute("data-target", "#pokemonModal"),
      o.appendChild(n),
      t.appendChild(o),
      n.addEventListener("click", () => {
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
        let t = o.value.toLowerCase(),
          n = e.filter((e) => e.name.toLowerCase().includes(t));
        !(function e(t) {
          let o = document.querySelector("#pokemonList");
          (o.innerHTML = ""),
            t.forEach((e) => {
              s(e);
            });
        })(n);
      });
    },
    addListItem: s,
    loadList: function e() {
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
    loadDetails: r,
    showDetails: a,
  };
})();
pokemonRepository
  .loadList()
  .then(() => {
    let e = pokemonRepository
      .getAll()
      .map((e) => pokemonRepository.loadDetails(e));
    return Promise.all(e);
  })
  .then(() => {
    pokemonRepository.getAll().forEach((e) => {
      pokemonRepository.addListItem(e);
    });
  })
  .catch((e) => console.error(e)),
  pokemonRepository.filterPokemonList();
