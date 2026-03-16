async function fetchData(link) {
  const response = await fetch(link);
  if (!response.ok) {
    console.error("Failed to fetch:", response.status);
    return null;
  }
  const data = await response.json();
  return data;
}

function addCategories(categories, categoriesFieldset, gameCategories = []) {
  categories.forEach((cat) => {
    const div = document.createElement("div");

    const label = document.createElement("label");
    label.setAttribute("for", `${cat.name}`);
    label.textContent = cat.name;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "category";
    input.checked =
      gameCategories && gameCategories.includes(cat.name) ? true : false;
    input.id = cat.name;
    input.value = cat.id;

    div.appendChild(label);
    div.appendChild(input);

    categoriesFieldset.appendChild(div);
  });
}

function addDevelopers(developers, developersSelect, gameDeveloperId = null) {
  developers.forEach((dev) => {
    const option = document.createElement("option");
    option.value = dev.id;
    option.selected = gameDeveloperId === dev.id ? true : false;
    option.textContent = dev.name;
    developersSelect.appendChild(option);
  });
}

function emptyForm() {
  //Empty developers select and categories fieldset
  categoriesFieldset.replaceChildren();
  developersSelect.replaceChildren();
  //Empty other fields
  titleInput.value = "";
  releaseDateInput.value = "";
  descriptionTextArea.value = "";
  //Empty error messages
}

// This is for the btn to add a new game
const modal = document.getElementById("gameModal");
const titleInput = document.getElementById("title");
const releaseDateInput = document.getElementById("releaseDate");
const descriptionTextArea = document.getElementById("description");
const categoriesFieldset = document.getElementById("categoriesFieldset");
const developersSelect = document.getElementById("developer");
const gameImgInput = document.getElementById("gameImg");

//Event to open modal to add a new game
document.getElementById("addGameBtn").addEventListener("click", async () => {
  //we need to fetch the categories and developers info when the user clicks the button because the could have been changes between first loaded the page and clicked add btn
  const categories = await fetchData("/categories/info");
  const developers = await fetchData("/developers/info");

  gameForm.setAttribute("action", `/games/add`);
  gameImgInput.required = true;

  //Clear form
  emptyForm();

  //Add developers to the select
  if (developers) {
    addDevelopers(developers, developersSelect);
  }

  //Add categories to the fieldset
  if (categories) {
    addCategories(categories, categoriesFieldset);
  }

  modal.showModal();
});

// this is for the modal to edit a game
async function openGameEditModal(id) {
  //Clear form
  emptyForm();

  gameForm.setAttribute("action", `/games/${id}/edit`);
  gameImgInput.required = false;

  const categories = await fetchData("/categories/info");
  const developers = await fetchData("/developers/info");

  const response = await fetch(`/games/${id}`);
  let gameInfo = await response.json();

  titleInput.value = gameInfo.title;
  releaseDateInput.valueAsDate = new Date(gameInfo.release);
  descriptionTextArea.value = gameInfo.description;

  //Add developers to the select
  if (developers) {
    addDevelopers(developers, developersSelect, gameInfo.developer_id);
  }

  //Add categories to the fieldset
  if (categories) {
    addCategories(categories, categoriesFieldset, gameInfo.categories);
  }

  modal.showModal();
}

// Form submission
const gameForm = document.getElementById("gameForm");

gameForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const category = formData.getAll("category");

  //validate categories
  if (category.length === 0) {
    categoriesError.textContent = "Please, select at least one category";
  } else {
    let res = await fetch(gameForm.getAttribute("action"), {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      window.location.reload();
    }
  }
});

//Error messages spans
const titleError = document.getElementById("titleError");
const releaseDateError = document.getElementById("releaseDateError");
const descriptionError = document.getElementById("descriptionError");
const categoriesError = document.getElementById("categoriesError");
const developerError = document.getElementById("developerError");

//Set title and description validations
function setValidation(DomElement, name, errorElement, minLength) {
  DomElement.addEventListener("input", () => {
    if (DomElement.validity.valueMissing) {
      DomElement.setCustomValidity(`Game ${name} can't be left empty`);
      errorElement.textContent = `Game ${name} can't be left empty`;
    } else if (DomElement.validity.tooShort) {
      DomElement.setCustomValidity(
        `Game ${name} must have at least three characters`,
      );
      errorElement.textContent = `Game ${name} must have at least ${minLength} characters`;
    } else {
      DomElement.setCustomValidity("");
      errorElement.textContent = "";
    }
  });
}

setValidation(titleInput, "title", titleError, 3);
setValidation(descriptionTextArea, "description", descriptionError, 15);

// Release date validation
releaseDateInput.addEventListener("input", () => {
  if (releaseDateInput.validity.valueMissing) {
    releaseDateInput.setCustomValidity(
      "Please, select a date before today's date",
    );
    releaseDateError.textContent = "Please, select a date before today's date";
  } else if (releaseDateInput.value >= new Date().toLocaleDateString("en-CA")) {
    releaseDateInput.setCustomValidity(
      "The selected date must be before today's date",
    );
    releaseDateError.textContent =
      "The selected date must be before today's date";
  } else {
    releaseDateInput.setCustomValidity("");
    releaseDateError.textContent = "";
  }
});

//Developer validation
developersSelect.addEventListener("input", () => {
  if (developersSelect.validity.valueMissing) {
    developersSelect.setCustomValidity("Please, select a developer");
    releaseDateError.textContent = "Please, select a developer";
  } else {
    releaseDateInput.setCustomValidity("");
    releaseDateError.textContent = "";
  }
});
