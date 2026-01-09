document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const addBtn = document.getElementById("add-btn");
  const list = document.getElementById("todo-list");
  const errorMsg = document.getElementById("error-msg");
  const deleteAllBtn = document.getElementById("delete-all-btn");

  const filterBtns = document.querySelectorAll("[data-filter]");

  // DELETE MODAL
  const deleteModal = document.getElementById("delete-modal");
  const confirmDeleteBtn = document.getElementById("confirm-delete");
  const cancelDeleteBtn = document.getElementById("cancel-delete");

  let taskToDelete = null;
  let deleteMode = "single"; 

  addBtn.addEventListener("click", addTodo);

  // FILTER
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.dataset.filter);
    });
  });

  // DELETE ALL
  deleteAllBtn.addEventListener("click", () => {
    if (list.querySelectorAll("tr:not(#empty-state)").length === 0) return;

    deleteMode = "all";
    deleteModal.classList.remove("hidden");
    deleteModal.classList.add("flex");
  });

  // ADD TODO
  function addTodo() {
    const text = input.value.trim();
    const date = dateInput.value;

    errorMsg.classList.add("hidden");

    if (!text) return showError("Tugas tidak boleh kosong");
    if (!date) return showError("Silakan pilih deadline");

    removeEmptyState();

    const tr = document.createElement("tr");
    tr.dataset.status = "active";

    // TASK
    const tdTask = document.createElement("td");
    tdTask.textContent = text;
    tdTask.className = "px-6 py-4 font-medium text-slate-800";

    // DEADLINE
    const tdDate = document.createElement("td");
    tdDate.textContent = date;
    tdDate.className = "px-6 py-4 text-center text-sm text-slate-500";

    // STATUS
    const tdStatus = document.createElement("td");
    tdStatus.className = "px-6 py-4 text-right";

    const statusBadge = document.createElement("span");
    statusBadge.textContent = "Aktif";
    statusBadge.className =
      "inline-block px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700";

    tdStatus.appendChild(statusBadge);

    // ACTION
    const tdAction = document.createElement("td");
    tdAction.className = "px-6 py-4 text-right space-x-2";

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Selesai";
    doneBtn.className =
      "px-4 py-1.5 text-xs rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Hapus";
    deleteBtn.className =
      "px-4 py-1.5 text-xs rounded-full bg-red-100 text-red-700 hover:bg-red-200";

    // DONE
    doneBtn.addEventListener("click", () => {
      tdTask.classList.add("text-slate-400");

      statusBadge.textContent = "Selesai";
      statusBadge.className =
        "inline-block px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700";

      tr.dataset.status = "done";

      doneBtn.disabled = true;
      doneBtn.classList.add("opacity-50", "cursor-not-allowed");
      deleteBtn.remove();
    });

    // DELETE SINGLE
    deleteBtn.addEventListener("click", () => {
      taskToDelete = tr;
      deleteMode = "single";
      deleteModal.classList.remove("hidden");
      deleteModal.classList.add("flex");
    });

    tdAction.append(doneBtn, deleteBtn);
    tr.append(tdTask, tdDate, tdStatus, tdAction);
    list.appendChild(tr);

    input.value = "";
    dateInput.value = "";
  }

  // CONFIRM DELETE
  confirmDeleteBtn.addEventListener("click", () => {
    if (deleteMode === "single" && taskToDelete) {
      taskToDelete.remove();
      taskToDelete = null;
    }

    if (deleteMode === "all") {
      list.innerHTML = "";
    }

    checkEmpty();
    closeDeleteModal();
  });

  cancelDeleteBtn.addEventListener("click", closeDeleteModal);

  function closeDeleteModal() {
    deleteModal.classList.add("hidden");
    deleteModal.classList.remove("flex");
    deleteMode = "single";
  }

  // FILTER
  function applyFilter(filter) {
    const rows = list.querySelectorAll("tr");

    rows.forEach(row => {
      if (row.id === "empty-state") return;

      if (filter === "all") {
        row.style.display = "";
      } else {
        row.style.display =
          row.dataset.status === filter ? "" : "none";
      }
    });
  }

  // EMPTY STATE
  function removeEmptyState() {
    const empty = document.getElementById("empty-state");
    if (empty) empty.remove();
  }

  function checkEmpty() {
    if (list.children.length === 0) {
      const tr = document.createElement("tr");
      tr.id = "empty-state";

      const td = document.createElement("td");
      td.colSpan = 4;
      td.className = "p-0";

      const box = document.createElement("div");
      box.className =
        "mx-6 py-12 text-center text-slate-400 rounded-xl bg-slate-50";
      box.textContent = "Tidak ada tugas";

      td.appendChild(box);
      tr.appendChild(td);
      list.appendChild(tr);
    }
  }

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
  }
});
