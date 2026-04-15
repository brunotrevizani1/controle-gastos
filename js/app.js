let appData = loadData();
let calculatorExpression = "";

function generateId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}

function updateAndSave() {
  saveData(appData);
  renderAll(appData);
}

function setSalary(value) {
  appData.salary = Number(value) || 0;
  updateAndSave();
}

function addCardExpense() {
  appData.cardExpenses.push({
    id: generateId(),
    name: "Novo item",
    installmentValue: 0,
    totalInstallments: 1,
    paidInstallments: 0
  });

  updateAndSave();
}

function updateCardExpenseField(id, field, value) {
  const item = appData.cardExpenses.find((expense) => expense.id === id);
  if (!item) return;

  if (field === "name") {
    item.name = value;
  }

  if (field === "installmentValue") {
    item.installmentValue = Number(value) || 0;
  }

  if (field === "totalInstallments") {
    item.totalInstallments = Math.max(1, Number(value) || 1);
    if (Number(item.paidInstallments) > Number(item.totalInstallments)) {
      item.paidInstallments = item.totalInstallments;
    }
  }

  if (field === "paidInstallments") {
    const paid = Math.max(0, Number(value) || 0);
    item.paidInstallments = Math.min(paid, Number(item.totalInstallments || 1));
  }

  saveData(appData);
  renderTotals(appData);
}

function deleteCardExpense(id) {
  appData.cardExpenses = appData.cardExpenses.filter((item) => item.id !== id);
  updateAndSave();
}

function addExtraExpense() {
  appData.extraExpenses.push({
    id: generateId(),
    name: "Novo gasto",
    value: 0
  });

  updateAndSave();
}

function updateExtraExpenseField(id, field, value) {
  const item = appData.extraExpenses.find((expense) => expense.id === id);
  if (!item) return;

  if (field === "name") {
    item.name = value;
  }

  if (field === "value") {
    item.value = Number(value) || 0;
  }

  saveData(appData);
  renderTotals(appData);
}

function deleteExtraExpense(id) {
  appData.extraExpenses = appData.extraExpenses.filter((item) => item.id !== id);
  updateAndSave();
}

function getNextNoteColor() {
  const colors = ["yellow", "blue", "green", "pink"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function addNote() {
  appData.notes.push({
    id: generateId(),
    text: "",
    color: getNextNoteColor()
  });

  updateAndSave();
}

function updateNote(id, text) {
  const note = appData.notes.find((item) => item.id === id);
  if (!note) return;

  note.text = text;
  saveData(appData);
}

function deleteNote(id) {
  appData.notes = appData.notes.filter((item) => item.id !== id);
  updateAndSave();
}

function appendToCalculator(value) {
  const lastChar = calculatorExpression.slice(-1);
  const operators = ["+", "-", "*", "/"];

  if (operators.includes(value)) {
    if (!calculatorExpression.length) return;
    if (operators.includes(lastChar)) {
      calculatorExpression = calculatorExpression.slice(0, -1) + value;
      renderCalculatorDisplay(calculatorExpression);
      return;
    }
  }

  if (value === ".") {
    const parts = calculatorExpression.split(/[\+\-\*\/]/);
    const currentPart = parts[parts.length - 1];
    if (currentPart.includes(".")) return;
  }

  calculatorExpression += value;
  renderCalculatorDisplay(calculatorExpression);
}

function clearCalculator() {
  calculatorExpression = "";
  renderCalculatorDisplay(calculatorExpression);
}

function backspaceCalculator() {
  calculatorExpression = calculatorExpression.slice(0, -1);
  renderCalculatorDisplay(calculatorExpression);
}

function calculateResult() {
  if (!calculatorExpression.trim()) return;

  try {
    const sanitized = calculatorExpression.replace(/[^0-9+\-*/.]/g, "");
    if (!sanitized) return;

    const result = Function(`"use strict"; return (${sanitized})`)();

    if (!Number.isFinite(result)) {
      calculatorExpression = "";
      renderCalculatorDisplay("Erro");
      return;
    }

    calculatorExpression = String(result);
    renderCalculatorDisplay(calculatorExpression);
  } catch (error) {
    calculatorExpression = "";
    renderCalculatorDisplay("Erro");
  }
}

function setupCalculatorEvents() {
  const calculatorCard = document.querySelector(".calculator-grid");
  if (!calculatorCard) return;

  calculatorCard.addEventListener("click", (event) => {
    const button = event.target.closest(".calc-btn");
    if (!button) return;

    const action = button.dataset.calcAction;
    const value = button.dataset.calcValue;

    if (action === "clear") {
      clearCalculator();
      return;
    }

    if (action === "backspace") {
      backspaceCalculator();
      return;
    }

    if (action === "equals") {
      calculateResult();
      return;
    }

    if (value !== undefined) {
      appendToCalculator(value);
    }
  });
}

function setupStaticEvents() {
  const salaryInput = document.getElementById("salaryInput");
  const addCardExpenseBtn = document.getElementById("addCardExpenseBtn");
  const addExtraExpenseBtn = document.getElementById("addExtraExpenseBtn");
  const addNoteBtn = document.getElementById("addNoteBtn");

  const cardExpensesList = document.getElementById("cardExpensesList");
  const extraExpensesList = document.getElementById("extraExpensesList");
  const notesList = document.getElementById("notesList");

  salaryInput.addEventListener("input", (event) => {
    setSalary(event.target.value);
  });

  addCardExpenseBtn.addEventListener("click", () => {
    addCardExpense();
  });

  addExtraExpenseBtn.addEventListener("click", () => {
    addExtraExpense();
  });

  addNoteBtn.addEventListener("click", () => {
    addNote();
  });

  cardExpensesList.addEventListener("input", (event) => {
    const target = event.target;
    const id = target.dataset.id;
    if (!id) return;

    if (target.classList.contains("card-name")) {
      updateCardExpenseField(id, "name", target.value);
    }

    if (target.classList.contains("card-installment-value")) {
      updateCardExpenseField(id, "installmentValue", target.value);
    }

    if (target.classList.contains("card-paid-installments")) {
      updateCardExpenseField(id, "paidInstallments", target.value);
    }

    if (target.classList.contains("card-total-installments")) {
      updateCardExpenseField(id, "totalInstallments", target.value);
    }
  });

  cardExpensesList.addEventListener("click", (event) => {
    const button = event.target.closest(".delete-card-expense-btn");
    if (!button) return;

    deleteCardExpense(button.dataset.id);
  });

  extraExpensesList.addEventListener("input", (event) => {
    const target = event.target;
    const id = target.dataset.id;
    if (!id) return;

    if (target.classList.contains("extra-name")) {
      updateExtraExpenseField(id, "name", target.value);
    }

    if (target.classList.contains("extra-value")) {
      updateExtraExpenseField(id, "value", target.value);
    }
  });

  extraExpensesList.addEventListener("click", (event) => {
    const button = event.target.closest(".delete-extra-expense-btn");
    if (!button) return;

    deleteExtraExpense(button.dataset.id);
  });

  notesList.addEventListener("input", (event) => {
    const target = event.target;
    const id = target.dataset.id;
    if (!id) return;

    if (target.classList.contains("note-text")) {
      updateNote(id, target.value);
    }
  });

  notesList.addEventListener("click", (event) => {
    const button = event.target.closest(".note-delete-btn");
    if (!button) return;

    deleteNote(button.dataset.id);
  });

  setupCalculatorEvents();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll(appData);
  renderCalculatorDisplay(calculatorExpression);
  setupStaticEvents();
});