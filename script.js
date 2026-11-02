const transactionType = document.getElementById("transactionType");
const description = document.getElementById("description");
const transactionAmount = document.getElementById("transactionAmount");
const transactionCategory = document.getElementById("transactionCategory");
const transactionDate = document.getElementById("transactionDate");
const addTransactionBtn = document.getElementById("addTransactionBtn");
const clearFormBtn = document.getElementById("clearFormBtn");
const filterByType = document.getElementById("filterByType");
const searchTransaction = document.getElementById("searchTransaction");

const descriptionErrorMessage = document.getElementById("descriptionErrorMessage");
const categoryErrorMessage = document.getElementById("categoryErrorMessage");
const dateErrorMessage = document.getElementById("dateErrorMessage");
const typeErrorMessage = document.getElementById("typeErrorMessage");
const amountErrorMessage = document.getElementById("amountErrorMessage");

const descriptionSearch = document.getElementById("descriptionSearch");
const categorySearch = document.getElementById("categorySearch");
const searchDescription = document.getElementById("searchDescription");
const searchCategory = document.getElementById("searchCategory");

const totalIncomeCalculator = document.getElementById("totalIncomeCalculator");
const totalExpenseCalculator = document.getElementById("totalExpenseCalculator");
const balance = document.getElementById("balance");

// Store the transactions
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Get the selected transaction type
transactionType.addEventListener("change", function() {

    let selectedType = transactionType.value;

    console.log(selectedType);

});

// Get the selected category
transactionCategory.addEventListener("change", function() {

    let selectedCategory = transactionCategory.value;

    console.log(selectedCategory);

});

// Add a new transaction
function addTransaction() {

    // Get the selected transaction type
    const selectedType = transactionType.value;

    if (selectedType === "") {
        typeErrorMessage.textContent = "Please select a transaction type!";
        return;
    }

    // Get the transaction description
    const transactionDescription = description.value.trim();

    if (transactionDescription === "") {
        descriptionErrorMessage.textContent = "Please enter a description!";
        return;
    }

    // Get the transaction amount
    const amount = transactionAmount.value.trim();

    if (amount === "") {
        amountErrorMessage.textContent = "Please enter an amount!";
        return;
    }

    if (parseFloat(amount) <= 0 || !Number.isFinite(Number(amount))) {
        amountErrorMessage.textContent = "Please enter a valid amount!";
        return;
    }

    // Get the selected category and date
    
    const selectedCategory = transactionCategory.value;

    
    if (selectedCategory === "") {
        categoryErrorMessage.textContent = "Please select a category!";
        return;
    }

    const date = transactionDate.value;

    if (date === "") {
        dateErrorMessage.textContent = "Please select a date!";
        return;
    }

    // Create a transaction object
    const transaction = {
        id: Date.now(),
        type: selectedType,
        description: transactionDescription,
        amount: parseFloat(amount),
        category: selectedCategory,
        date: date
    };

    // Add the transaction to the array
    transactions.push(transaction);

    saveTransactions();

    displayTransactions();

    alert("Transaction added successfully!");

    updateSummary();

    // Clear the input fields after adding the transaction
    description.value = "";
    transactionAmount.value = "";
    transactionType.value = "";
    transactionCategory.value = "";
    transactionDate.value = "";

}

// Clear transaction type error when a type is selected
transactionType.addEventListener("change", function() {
    if (transactionType.value !== "") {
        typeErrorMessage.textContent = "";
    }
});


// Clear description error when text is entered
description.addEventListener("input", function() {
    if (description.value.trim() !== "") {
        descriptionErrorMessage.textContent = "";
    }
});


// Clear amount error when a valid amount is entered
transactionAmount.addEventListener("input", function() {
    const amount = Number(transactionAmount.value);

    if (transactionAmount.value.trim() !== "" &&
        Number.isFinite(amount) && amount > 0) {
        amountErrorMessage.textContent = "";
    }
});


// Clear category error when a category is selected
transactionCategory.addEventListener("change", function() {
    if (transactionCategory.value !== "") {
        categoryErrorMessage.textContent = "";
    }
});


// Clear date error when a date is selected
transactionDate.addEventListener("change", function() {
    if (transactionDate.value !== "") {
        dateErrorMessage.textContent = "";
    }
});

// Add a transaction when the button is clicked
addTransactionBtn.addEventListener("click", addTransaction);

//Clear form midway
clearFormBtn.addEventListener("click", function() {
    description.value = "";
    transactionAmount.value = "";
    transactionType.value = "";
    transactionCategory.value = "";
    transactionDate.value = "";
});

let currentFilter = "all";

// Filter by transaction type
filterByType.addEventListener("change", function() {
    currentFilter = filterByType.value;
    displayTransactions();
});

// Search by description
searchDescription.addEventListener("input", function() {
    displayTransactions();
});

// Search by category
searchCategory.addEventListener("change", function() {
    displayTransactions();
});

searchTransaction.addEventListener("change", function() {

    // Hide both search fields
    descriptionSearch.classList.add("d-none");
    categorySearch.classList.add("d-none");

    // Show the selected search field
    if (searchTransaction.value === "description") {

        descriptionSearch.classList.remove("d-none");

    } 
    else if (searchTransaction.value === "category") {

        categorySearch.classList.remove("d-none");

    }

});


function displayTransactions() {

    // Start with all transactions
    let filteredTransactions = transactions;

    // Filter by transaction type
    if (currentFilter !== "all") {
        filteredTransactions = filteredTransactions.filter(function(transaction) {
            return transaction.type === currentFilter;
        });
    }

    // Search by description
    if (searchTransaction.value === "description") {

        const searchValue = searchDescription.value.toLowerCase().trim();

        filteredTransactions = filteredTransactions.filter(function(transaction) {
            return transaction.description.toLowerCase().includes(searchValue);
        });

    }

    // Search by category
    else if (searchTransaction.value === "category") {

        const selectedCategory = searchCategory.value;

        if (selectedCategory !== "") {
            filteredTransactions = filteredTransactions.filter(function(transaction) {
                return transaction.category === selectedCategory;
            });
        }

    }

    // Get the transaction table
    const transactionList = document.getElementById("transactionList");

    // Clear previous transactions
    transactionList.innerHTML = "";

    // Display filtered transactions
    filteredTransactions.forEach(function(transaction) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td class="${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
                ${transaction.type}
            </td>
            <td>${transaction.category}</td>
            <td>${transaction.amount.toFixed(2)}</td>
            <td></td>
        `;

        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-sm btn-outline-danger";
        deleteBtn.textContent = "Delete";

        // Delete selected transaction
        deleteBtn.addEventListener("click", function() {

            transactions = transactions.filter(function(item) {
                return item.id !== transaction.id;
            });

            saveTransactions();
            displayTransactions();
            alert("Transaction deleted successfully!");
            updateSummary();

        });

        // Add delete button to the table
        row.querySelector("td:last-child").appendChild(deleteBtn);

        transactionList.appendChild(row);

    });

}

// Update the summary of total income, total expense, and balance
function updateSummary() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else if (transaction.type === "expense") {
            totalExpense += transaction.amount;
        }

    });

    const currentBalance = totalIncome - totalExpense;

    totalIncomeCalculator.textContent = `LKR ${totalIncome.toFixed(2)}`;
    totalExpenseCalculator.textContent = `LKR ${totalExpense.toFixed(2)}`;
    balance.textContent = `LKR ${currentBalance.toFixed(2)}`;
}

displayTransactions();
alert("Login successfull!");
updateSummary();