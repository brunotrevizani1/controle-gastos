const STORAGE_KEY = "controle_gastos_data_v2";

function getDefaultData() {
  return {
    salary: 0,
    cardExpenses: [
      {
        id: generateId(),
        name: "Celular",
        totalProductValue: 1000,
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

function normalizeData(data) {
  return {
    salary: Number(data?.salary || 0),

    cardExpenses: Array.isArray(data?.cardExpenses)
      ? data.cardExpenses.map((item) => ({
          id: item?.id || generateId(),
          name: item?.name || "Novo item",
          totalProductValue: Number(item?.totalProductValue || 0),
          installmentValue: Number(item?.installmentValue || 0),
          totalInstallments: Math.max(1, Number(item?.totalInstallments || 1)),
          paidInstallments: Math.max(
            0,
            Math.min(
              Number(item?.paidInstallments || 0),
              Math.max(1, Number(item?.totalInstallments || 1))
            )
          )
        }))
      : [],

    extraExpenses: Array.isArray(data?.extraExpenses)
      ? data.extraExpenses.map((item) => ({
          id: item?.id || generateId(),
          name: item?.name || "Novo gasto",
          value: Number(item?.value || 0)
        }))
      : [],

    notes: Array.isArray(data?.notes)
      ? data.notes.map((item) => ({
          id: item?.id || generateId(),
          text: item?.text || "",
          color: item?.color || "yellow"
        }))
      : []
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
    const parsedData = JSON.parse(saved);
    const normalizedData = normalizeData(parsedData);
    saveData(normalizedData);
    return normalizedData;
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