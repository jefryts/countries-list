// For add attributes to object
const addAttrs = (element, obj) => {
  for (let attr in obj) {
    if (obj.hasOwnProperty(attr)) element.setAttribute(attr, obj[attr]);
  }
};

// For create a custom element
const createEl = (element, attributes, children) => {
  let customEl = document.createElement(element);
  if (children !== undefined) {
    children.forEach((el) => {
      if (el.nodeType) {
        if (el.nodeType === 1 || el.nodeType === 11) customEl.appendChild(el);
      } else {
        customEl.innerHTML += el;
      }
    });
  }

  addAttrs(customEl, attributes);
  return customEl;
};

// To add click event listener to card titles
const createModal = () => {
  document.addEventListener("click", (e) => {
    if (e.target.matches(".card-title")) {
      const info = JSON.parse(e.target.dataset.info);

      let modal = `
        <section class='modal-card'>
          <article>
            <small>Continente</small>
            <h1 class='modal-card-title'>${info.region}</h1>
          </article>
        </section>      
      `;

      showModal(modal);
    }
  });
};

// To show modal element and content
const showModal = (content) => {
  const modalContent = createEl(
    "div",
    {
      id: "modal-content",
      class: "modal-content",
    },
    [content]
  );
  const modalContainer = createEl(
    "div",
    {
      id: "modal",
      class: "modal",
    },
    [modalContent]
  );

  document.body.appendChild(modalContainer);

  const closeModal = () => document.body.removeChild(modalContainer);

  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContent) closeModal();
  });
};

const main = async () => {
  const elements = document.getElementById("countries-list");
  let countries;
  try {
    countries = await fetch("https://restcountries.eu/rest/v2/lang/es");
    countries = await countries.json();
    countries = countries.slice(0, 12);
    // console.log(countries);
  } catch (error) {
    console.error("error", error);
  }

  countries.forEach((country) => {
    let element = `
    <div class='col'>
      <article class='card'>
        <header class='card-header'>
          <h1 class='card-title' data-info='
          ${JSON.stringify({
            region: country.region + " - " +country.subregion
          })}
          '>${country.nativeName}</h1>
          <img class='card-flag' src='${country.flag}'></img>
        </header>
        <div class='card-body'>
          <div class='card-detail'>
            <p class='card-detail-title'>Capital</p>
            <strong class='card-detail-subtitle'>
              ${country.capital}
            </strong>
          </div>
          <div class='card-detail'>
            <p class='card-detail-title'>Población</p>
            <strong class='card-detail-subtitle'>
              ${new Intl.NumberFormat().format(country.population)}
            </strong>
          </div>
        </div>
      </article>
    </div>`;

    elements.innerHTML += element;
  });
};

main();

createModal();