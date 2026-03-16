const gamesContainer = document.getElementById("gamesContainer");
gamesContainer.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("deleteBtn")) return;

  const res = await fetch(`games/${e.target.id}/delete`, {
    method: "DELETE",
  });

  if (res.ok) {
    window.location.reload();
  } else {
    console.log("Failed to delete the game");
  }
});
