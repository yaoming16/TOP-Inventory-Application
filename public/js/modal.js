async function openEditModal(type, mode, id = null) {
  let url;
  let formAction;

  let input = document.getElementById("nameInput");

  if (mode === "edit") {
    url = `${type}/${id}`;
    formAction = `/${type}/${id}/edit`;

    const response = await fetch(url);
    const category = await response.json();
    input.value = category.name;
  } else if (mode === "add") {
    formAction = `/${type}/add`;
    input.value = "";
  }

  form.setAttribute("action", formAction);
  document.getElementById("editModal").showModal();
}

function closeModal() {
  document.getElementById("editModal").close();
}

const form = document.getElementById("editForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorMessageElement = document.getElementById("errorP");
  const formData = new FormData(e.target);
  const name = formData.get("name");

  errorMessageElement.classList.remove("error");

  let isValid = true;
  let errorMessage = "";
  if (name.length < 3 || name.length > 50) {
    errorMessage = "Name should be between 3 and 50 characters";
    isValid = false;
  }

  if (name.trim() === "") {
    errorMessage = "Name can't be empty";
    isValid = false;
  }

  if (isValid) {
    let res = await fetch(form.getAttribute("action"), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ name }),
    });
    if (res.ok) {
      window.location.reload();
    }
  } else {
    errorMessageElement.textContent = errorMessage;
    errorMessageElement.classList.add("error");
  }
});
