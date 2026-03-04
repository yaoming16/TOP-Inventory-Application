async function openEditModal(id, type) {
  let url;
  if (type === "category") {
    url = `/categories/${id}`;
  } else {
    url = `/developer/${id}`;
  }
  console.log(id, url);

  const response = await fetch(url);
  const category = await response.json();

  document.getElementById("nameInput").value = category.name;
  document.getElementById("editModal").showModal();
}

function closeModal() {
  document.getElementById("editModal").close();
}

async function closeSave() {
  let url;
  if (type === "category") {
    url = `/categories/${id}/edit`;
  } else {
    url = `/developer/${id}/edit`;
  }
  await fetch(url, {
    method: "PATCH",
  });
}
