// ===============================
// BUDGET BUDDY - SCRIPT.JS
// ===============================


// ===============================
// SIGNUP
// ===============================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const message = document.getElementById("signupMessage");

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match!";
            message.style.color = "red";
            return;
        }

        if (name === "" || email === "" || password === "") {
            message.textContent = "Please fill all fields!";
            message.style.color = "red";
            return;
        }

        // Save user details
        const user = {
            name: name,
            email: email,
            password: password
        };

        localStorage.setItem("budgetBuddyUser", JSON.stringify(user));

        // ==========================================
        // NEW USER STARTS WITH ZERO FINANCIAL DATA
        // ==========================================

        localStorage.setItem("budget", "0");
        localStorage.setItem("transactions", JSON.stringify([]));
        localStorage.removeItem("goal");

        message.textContent = "Signup successful! Redirecting to login...";
        message.style.color = "green";

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1000);
    });
}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        // ADMIN LOGIN
        if (
            email === "admin@budgetbuddy.com" &&
            password === "admin123"
        ) {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userRole", "admin");

            window.location.href = "admin-dashboard.html";
            return;
        }

        // USER LOGIN
        const savedUser = JSON.parse(
            localStorage.getItem("budgetBuddyUser")
        );

        if (
            savedUser &&
            email === savedUser.email &&
            password === savedUser.password
        ) {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userRole", "user");
            localStorage.setItem("currentUserName", savedUser.name);

            window.location.href = "user-dashboard.html";
        } else {
            message.textContent = "Invalid email or password!";
            message.style.color = "red";
        }
    });
}


// ===============================
// USER DASHBOARD
// ===============================

if (document.getElementById("userName")) {

    // Display logged-in user's name
    const currentUserName =
        localStorage.getItem("currentUserName");

    document.getElementById("userName").textContent =
        currentUserName || "User";


    // ===============================
    // BUDGET FORM
    // ===============================

    const budgetForm = document.getElementById("budgetForm");

    if (budgetForm) {
        budgetForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const budgetInput =
                document.getElementById("budgetInput");

            const budget = Number(budgetInput.value);

            if (budget < 0 || isNaN(budget)) {
                alert("Please enter a valid budget.");
                return;
            }

            localStorage.setItem("budget", budget);

            budgetInput.value = "";

            updateDashboard();
        });
    }


    // ===============================
    // TRANSACTION FORM
    // ===============================

    const transactionForm =
        document.getElementById("transactionForm");

    if (transactionForm) {

        transactionForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const type =
                document.getElementById("transactionType").value;

            const amount =
                Number(
                    document.getElementById("transactionAmount").value
                );

            const category =
                document.getElementById("transactionCategory").value;

            const description =
                document.getElementById("transactionDescription").value;

            const date =
                document.getElementById("transactionDate").value;

            if (amount <= 0 || isNaN(amount)) {
                alert("Please enter a valid amount.");
                return;
            }

            const transaction = {
                id: Date.now(),
                type: type,
                amount: amount,
                category: category,
                description: description,
                date: date
            };

            let transactions =
                JSON.parse(
                    localStorage.getItem("transactions")
                ) || [];

            transactions.push(transaction);

            localStorage.setItem(
                "transactions",
                JSON.stringify(transactions)
            );

            transactionForm.reset();

            loadTransactions();
            updateDashboard();
        });
    }


    // ===============================
    // LOAD DASHBOARD
    // ===============================

    updateDashboard();
    loadTransactions();
    loadGoal();
}


// ===============================
// UPDATE DASHBOARD
// ===============================

function updateDashboard() {

    const budget =
        Number(localStorage.getItem("budget")) || 0;

    const transactions =
        JSON.parse(
            localStorage.getItem("transactions")
        ) || [];


    let totalIncome = 0;
    let totalExpenses = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type === "Income") {
            totalIncome += Number(transaction.amount);
        }

        if (transaction.type === "Expense") {
            totalExpenses += Number(transaction.amount);
        }

    });


    // Remaining balance = budget - expenses + income
    const remaining =
        budget - totalExpenses + totalIncome;


    // Display values
    const budgetDisplay =
        document.getElementById("budgetDisplay");

    const incomeDisplay =
        document.getElementById("incomeDisplay");

    const expenseDisplay =
        document.getElementById("expenseDisplay");

    const remainingDisplay =
        document.getElementById("remainingDisplay");


    if (budgetDisplay) {
        budgetDisplay.textContent =
            "₹" + budget.toLocaleString("en-IN");
    }

    if (incomeDisplay) {
        incomeDisplay.textContent =
            "₹" + totalIncome.toLocaleString("en-IN");
    }

    if (expenseDisplay) {
        expenseDisplay.textContent =
            "₹" + totalExpenses.toLocaleString("en-IN");
    }

    if (remainingDisplay) {
        remainingDisplay.textContent =
            "₹" + remaining.toLocaleString("en-IN");
    }
}


// ===============================
// LOAD TRANSACTIONS
// ===============================

function loadTransactions() {

    const table =
        document.getElementById("transactionTable");

    if (!table) return;


    const transactions =
        JSON.parse(
            localStorage.getItem("transactions")
        ) || [];


    table.innerHTML = "";


    if (transactions.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    No transactions yet.
                </td>
            </tr>
        `;

        return;
    }


    transactions.forEach(function (transaction) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${transaction.type}</td>
            <td>₹${Number(transaction.amount).toLocaleString("en-IN")}</td>
            <td>${transaction.category}</td>
            <td>${transaction.description}</td>
            <td>${transaction.date}</td>
            <td>
                <button 
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})">
                    🗑️ Delete
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}


// ===============================
// DELETE TRANSACTION
// ===============================

function deleteTransaction(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this transaction?");

    if (!confirmDelete) {
        return;
    }


    let transactions =
        JSON.parse(
            localStorage.getItem("transactions")
        ) || [];


    transactions =
        transactions.filter(function (transaction) {
            return transaction.id !== id;
        });


    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    loadTransactions();
    updateDashboard();
}


// ===============================
// GOALS
// ===============================

const goalForm = document.getElementById("goalForm");

if (goalForm) {

    goalForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name =
            document.getElementById("goalName").value.trim();

        const amount =
            Number(
                document.getElementById("goalAmount").value
            );


        if (name === "" || amount <= 0) {
            alert("Please enter valid goal details.");
            return;
        }


        const goal = {
            name: name,
            amount: amount
        };


        localStorage.setItem(
            "goal",
            JSON.stringify(goal)
        );


        loadGoal();

        goalForm.reset();
    });
}


// ===============================
// LOAD GOAL
// ===============================

function loadGoal() {

    const goalDisplay =
        document.getElementById("goalDisplay");

    if (!goalDisplay) return;


    const goal =
        JSON.parse(
            localStorage.getItem("goal")
        );


    if (goal) {

        goalDisplay.innerHTML = `
            <strong>${goal.name}</strong>
            <p>Target: ₹${Number(goal.amount).toLocaleString("en-IN")}</p>
        `;

    } else {

        goalDisplay.innerHTML = `
            <p>No financial goal added yet.</p>
        `;
    }
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUserName");

    window.location.href = "login.html";
}


// ===============================
// ADMIN DASHBOARD
// ===============================

if (document.getElementById("registeredUsers")) {

    const savedUser =
        JSON.parse(
            localStorage.getItem("budgetBuddyUser")
        );

    if (savedUser) {

        document.getElementById("registeredUsers").textContent = "1";

        const userInfo =
            document.getElementById("userInfo");

        if (userInfo) {
            userInfo.innerHTML = `
                <p><strong>Name:</strong> ${savedUser.name}</p>
                <p><strong>Email:</strong> ${savedUser.email}</p>
            `;
        }
    }


    const budget =
        Number(localStorage.getItem("budget")) || 0;

    const transactions =
        JSON.parse(
            localStorage.getItem("transactions")
        ) || [];


    const totalBudget =
        document.getElementById("totalBudget");

    const totalTransactions =
        document.getElementById("totalTransactions");


    if (totalBudget) {
        totalBudget.textContent =
            "₹" + budget.toLocaleString("en-IN");
    }

    if (totalTransactions) {
        totalTransactions.textContent =
            transactions.length;
    }
}