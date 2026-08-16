const budgetInput = document.querySelector("#budget-input");
const setBudgetBtn = document.querySelector("#set-budget-btn");
const totalBudgetDisplay = document.querySelector("#total-budget");
const totalSpentDisplay = document.querySelector("#total-spent");
const remainingBalanceDisplay = document.querySelector("#remaining-balance");
const balanceCard = document.querySelector("#balance-card");
const expenseForm = document.querySelector("#expense-form");
const expenseNameInput = document.querySelector("#expense-name");
const expenseAmountInput = document.querySelector("#expense-amount");
const expenseCategoryInput = document.querySelector("#expense-category");
const expenseList = document.querySelector("#expense-list");

let monthlyBudget = parseFloat(localStorage.getItem("monthlyBudget")) || 0;
let expensesArray = JSON.parse(localStorage.getItem("expensesArray")) || [];

function updateDashboardUI() {
  // Math 1: Sum up all items in the expense ledger array using .reduce()
  const totalSpent = expensesArray.reduce(
    (accumulator, item) => accumulator + item.amount,
    0
  );

  // Math 2: Subtract expenditure from allowance
  const remainingBalance = monthlyBudget - totalSpent;

  // Display updates locked to 2 decimal places (.toFixed(2))
  totalBudgetDisplay.textContent = monthlyBudget.toFixed(2);
  totalSpentDisplay.textContent = totalSpent.toFixed(2);
  remainingBalanceDisplay.textContent = remainingBalance.toFixed(2);

  // VISUAL ALERT TRIGGER: Turn the balance card crimson if spending exceeds budget limit
  if (remainingBalance < 0) {
    balanceCard.classList.add("danger");
  } else {
    balanceCard.classList.remove("danger");
  }

  // Clear ledger viewport to prepare for a fresh rewrite loop
  expenseList.innerHTML = "";

  // Loop through array data to construct UI list elements dynamically
  expensesArray.forEach((expense) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <div class="expense-info">
                <span class="expense-title">${expense.name}</span>
                <span class="expense-tag">${expense.category}</span>
            </div>
            <div class="expense-cost-box">
                <span class="expense-val">£${expense.amount.toFixed(2)}</span>
                <button class="delete-btn" onclick="deleteExpense(${
                  expense.id
                })">×</button>
            </div>
        `;
    expenseList.appendChild(li);
  });
}

// Save active configurations down into local browser space
function saveToLocalStorage() {
  localStorage.setItem("monthlyBudget", monthlyBudget);
  localStorage.setItem("expensesArray", JSON.stringify(expensesArray));
}

// Setting / Updating the overarching Allowance Limit
function handleBudgetUpdate() {
  const value = parseFloat(budgetInput.value);
  if (isNaN(value) || value < 0) return;

  monthlyBudget = value;
  budgetInput.value = "";
  saveToLocalStorage();
  updateDashboardUI();
}

// Creating a brand-new transaction log entry
function handleAddExpense(event) {
  event.preventDefault(); // Prevents web form layout from flashing/reloading the app

  const expenseName = expenseNameInput.value.trim();
  const expenseAmount = parseFloat(expenseAmountInput.value);
  const expenseCategory = expenseCategoryInput.value;

  if (!expenseName || isNaN(expenseAmount) || !expenseCategory) return;

  // Construct data structure snapshot container object
  const newExpense = {
    id: Date.now(), // High precision timestamp acts as a completely unique ID string
    name: expenseName,
    amount: expenseAmount,
    category: expenseCategory,
  };

  expensesArray.push(newExpense);
  saveToLocalStorage();
  updateDashboardUI();

  // Reset fields back to clean placeholder states
  expenseForm.reset();
}

// Removing an existing entry utilizing Array .filter() matching
window.deleteExpense = function (targetId) {
  // Keep everything that does NOT match the ID of the item we clicked delete on
  expensesArray = expensesArray.filter((expense) => expense.id !== targetId);
  saveToLocalStorage();
  updateDashboardUI();
};

setBudgetBtn.addEventListener("click", handleBudgetUpdate);
expenseForm.addEventListener("submit", handleAddExpense);

// Fire automatically when web view initiates to parse pre-saved memory assets
updateDashboardUI();
