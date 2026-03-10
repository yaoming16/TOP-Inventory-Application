async function fetchData(link) {
  const response = await fetch(link);
  if (!response.ok) {
  console.error('Failed to fetch:', response.status);
  return null;
}
  const data = await response.json();
  return data;
}

const modal = document.getElementById("gameModal");
document.getElementById("addGameBtn").addEventListener("click", async () => {
  //we need to fetch the categories and developers info when the user clicks the button because the could have been changes between first loaded the page and clicked add btn
  const categories = await fetchData("/categories/info");
  const developers = await fetchData("/developers/info");

  //Add developers to the select 
  if (developers) {
    const developersSelect = document.getElementById("developer");
    developers.forEach(dev => {
      const option = document.createElement("option");
      option.value = dev.id;
      option.textContent = dev.name;
      developersSelect.appendChild(option);
    });
  }

  //Add categories to the fieldset 
  if (categories) {
    const categoriesFieldset = document.getElementById("categoriesFieldset");
    categories.forEach((cat) => {
      const div = document.createElement("div");

      const label = document.createElement("label");
      label.setAttribute("for", `${cat.name}`);
      label.textContent = cat.name;

      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "category";
      input.id = cat.name;
      input.value = cat.id;

      div.appendChild(label);
      div.appendChild(input);

      categoriesFieldset.appendChild(div);
    })
  }

  modal.showModal();
  
});

