function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function calculateCardMonthTotal(data) {
  return data.cardExpenses.reduce((total, item) => {
    const totalInstallments = Number(item.totalInstallments || 0);
    const paidInstallments = Number(item.paidInstallments || 0);
    const installmentValue = Number(item.installmentValue || 0);

    if (paidInstallments >= totalInstallments || totalInstallments <= 0) {
      return total;
    }

    return total + installmentValue;
  }, 0);
}

function calculateExtraTotal(data) {
  return data.extraExpenses.reduce((total, item) => {
    return total + Number(item.value || 0);
  }, 0);
}

function renderSalary(data) {
  const salaryInput = document.getElementById("salaryInput");
  salaryInput.value = Number(data.salary || 0);
}

function renderTotals(data) {
  const cardMonthTotal = calculateCardMonthTotal(data);
  const extraTotal = calculateExtraTotal(data);
  const remaining = Number(data.salary || 0) - cardMonthTotal - extraTotal;

  document.getElementById("cardMonthTotal").textContent = formatCurrency(cardMonthTotal);
  document.getElementById("extraTotal").textContent = formatCurrency(extraTotal);

  const remainingElement = document.getElementById("remainingValue");
  remainingElement.textContent = formatCurrency(remaining);
  remainingElement.classList.remove("positive", "negative");
  remainingElement.classList.add(remaining < 0 ? "negative" : "positive");
}

function renderCardExpenses(data) {
  const list = document.getElementById("cardExpensesList");
  list.innerHTML = "";

  if (!data.cardExpenses.length) {
    list.innerHTML = `<div class="empty-state">Nenhum item no cartão ainda.</div>`;
    return;
  }

  data.cardExpenses.forEach((item) => {
    const row = document.createElement("div");
    row.className = "card-row";

    row.innerHTML = `
      <input
        type="text"
        class="input-field card-name"
        data-id="${item.id}"
        value="${item.name}"
        placeholder="Nome"
      />

      <input
        type="number"
        class="input-field card-total-product-value"
        data-id="${item.id}"
        value="${Number(item.totalProductValue || 0)}"
        min="0"
        step="0.01"
        placeholder="Valor total"
      />

      <input
        type="number"
        class="input-field card-installment-value"
        data-id="${item.id}"
        value="${Number(item.installmentValue || 0)}"
        min="0"
        step="0.01"
        placeholder="Valor da parcela"
      />

      <input
        type="number"
        class="input-field card-total-installments"
        data-id="${item.id}"
        value="${Number(item.totalInstallments || 0)}"
        min="1"
        step="1"
        placeholder="Totais"
      />

      <input
        type="number"
        class="input-field card-paid-installments"
        data-id="${item.id}"
        value="${Number(item.paidInstallments || 0)}"
        min="0"
        step="1"
        placeholder="Pagas"
      />

      <button class="delete-btn delete-card-expense-btn" data-id="${item.id}" title="Excluir">
        <i data-lucide="trash-2"></i>
      </button>
    `;

    list.appendChild(row);
  });
}

function renderExtraExpenses(data) {
  const list = document.getElementById("extraExpensesList");
  list.innerHTML = "";

  if (!data.extraExpenses.length) {
    list.innerHTML = `<div class="empty-state">Nenhum gasto diverso ainda.</div>`;
    return;
  }

  data.extraExpenses.forEach((item) => {
    const row = document.createElement("div");
    row.className = "extra-row";

    row.innerHTML = `
      <input
        type="text"
        class="input-field extra-name"
        data-id="${item.id}"
        value="${item.name}"
        placeholder="Nome"
      />

      <input
        type="number"
        class="input-field extra-value"
        data-id="${item.id}"
        value="${Number(item.value || 0)}"
        min="0"
        step="0.01"
        placeholder="Valor"
      />

      <button class="delete-btn delete-extra-expense-btn" data-id="${item.id}" title="Excluir">
        <i data-lucide="trash-2"></i>
      </button>
    `;

    list.appendChild(row);
  });
}

function renderNotes(data) {
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";

  if (!data.notes.length) {
    notesList.innerHTML = `<div class="empty-state">Nenhum lembrete criado ainda.</div>`;
    return;
  }

  data.notes.forEach((note) => {
    const card = document.createElement("div");
    card.className = `note-card ${note.color}`;

    card.innerHTML = `
      <textarea
        class="note-text"
        data-id="${note.id}"
        placeholder="Escreva um lembrete..."
      >${note.text}</textarea>

      <div class="note-actions">
        <button class="note-delete-btn" data-id="${note.id}" title="Excluir">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;

    notesList.appendChild(card);
  });
}

function renderCalculatorDisplay(value) {
  const display = document.getElementById("calculatorDisplay");
  if (!display) return;

  display.textContent = value && value.length ? value : "0";
}

function renderAll(data) {
  renderSalary(data);
  renderTotals(data);
  renderCardExpenses(data);
  renderExtraExpenses(data);
  renderNotes(data);

  if (window.lucide) {
    lucide.createIcons();
  }
}