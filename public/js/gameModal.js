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
    input.checked = gameCategories.includes(cat.name) ? true : false;
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
}

// This is for the btn to add a new game
const modal = document.getElementById("gameModal");
const titleInput = document.getElementById("title");
const releaseDateInput = document.getElementById("releseDate");
const descriptionTextArea = document.getElementById("description");
const categoriesFieldset = document.getElementById("categoriesFieldset");
const developersSelect = document.getElementById("developer");
document.getElementById("addGameBtn").addEventListener("click", async () => {
  //we need to fetch the categories and developers info when the user clicks the button because the could have been changes between first loaded the page and clicked add btn
  const categories = await fetchData("/categories/info");
  const developers = await fetchData("/developers/info");

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

  const categories = await fetchData("/categories/info");
  const developers = await fetchData("/developers/info");

  const response = await fetch(`/games/${id}`);
  let gameInfo = await response.json();

  titleInput.value = gameInfo.title;
  releaseDateInput.valueAsDate = new Date(gameInfo.release);
  descriptionTextArea.value = gameInfo.description;

  //Add developers to the select
  if (developers) {
    console.log(gameInfo.developer_id)
    addDevelopers(developers, developersSelect, gameInfo.developer_id);
  }

  //Add categories to the fieldset
  if (categories) {
    addCategories(categories, categoriesFieldset, gameInfo.categories);
  }

  modal.showModal();
}
