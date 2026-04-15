const STORAGE_KEY = "controle_gastos_data_v2";

function getDefaultData() {
  return {
    salary: 0,
    cardExpenses: [
      {
        id: generateId(),
        name: "Celular",
        installmentValue: 100,
        totalInstallments: 10,
        paidInstallments: 3
      }
    ],
    extraExpenses: [
      {
        id: generateId(),
        name: "Academia",
        value: 90
      }
    ],
    notes: [
      {
        id: generateId(),
        text: "Verificar a próxima fatura.",
        color: "yellow"
      }
    ]
  };
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    const defaultData = getDefaultData();
    saveData(defaultData);
    return defaultData;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    const defaultData = getDefaultData();
    saveData(defaultData);
    return defaultData;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}