/* =========================
   ADMIN DETAILS
========================= */

const ADMIN_EMAIL = "admin@budget.com";
const ADMIN_PASSWORD = "admin123";


/* =========================
   SIGNUP
========================= */

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("signupName").value;

        const email =
            document.getElementById("signupEmail").value;

        const password =
            document.getElementById("signupPassword").value;


        let users =
            JSON.parse(localStorage.getItem("users")) || [];


        const existingUser =
            users.find(user => user.email === email);


        if (existingUser) {

            document.getElementById("signupMessage")
                .textContent =
                "User already exists.";

            return;
        }


        const newUser = {

            name: name,

            email: email,

            password: password

        };


        users.push(newUser);


        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        document.getElementById("signupMessage")
            .textContent =
            "Signup successful! You can now login.";

        signupForm.reset();

    });

}


/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;


        /* ADMIN LOGIN */

        if (
            email === ADMIN_EMAIL &&
            password === ADMIN_PASSWORD
        ) {

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify({
                    role: "admin",
                    email: email
                })
            );


            window.location.href =
                "admin-dashboard.html";

            return;
        }


        /* USER LOGIN */

        const users =
            JSON.parse(localStorage.getItem("users")) || [];


        const user =
            users.find(
                user =>
                    user.email === email &&
                    user.password === password
            );


        if (user) {

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify({
                    role: "user",
                    email: user.email,
                    name: user.name
                })
            );


            window.location.href =
                "user-dashboard.html";

        } else {

            document.getElementById("loginMessage")
                .textContent =
                "Invalid email or password.";

        }

    });

}


/* =========================
   USER DASHBOARD
========================= */

if (
    window.location.pathname.includes(
        "user-dashboard.html"
    )
) {

    const loggedInUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );


    if (
        !loggedInUser ||
        loggedInUser.role !== "user"
    ) {

        window.location.href =
            "login.html";

    } else {

        document.getElementById("userName")
            .textContent =
            loggedInUser.name;

        loadUserData();

    }

}


/* =========================
   BUDGET
========================= */

const budgetForm =
    document.getElementById("budgetForm");


if (budgetForm) {

    budgetForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const amount =
                Number(
                    document.getElementById(
                        "budgetAmount"
                    ).value
                );


            localStorage.setItem(
                "budget",
                amount
            );


            document.getElementById(
                "totalBudget"
            ).textContent =
                "₹" + amount;


            updateBalance();

            budgetForm.reset();

        }
    );

}


/* =========================
   TRANSACTIONS
========================= */

const transactionForm =
    document.getElementById(
        "transactionForm"
    );


if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const type =
                document.getElementById(
                    "transactionType"
                ).value;


            const description =
                document.getElementById(
                    "transactionDescription"
                ).value;


            const amount =
                Number(
                    document.getElementById(
                        "transactionAmount"
                    ).value
                );


            const category =
                document.getElementById(
                    "transactionCategory"
                ).value;


            let transactions =
                JSON.parse(
                    localStorage.getItem(
                        "transactions"
                    )
                ) || [];


            const transaction = {

                type: type,

                description: description,

                amount: amount,

                category: category

            };


            transactions.push(transaction);


            localStorage.setItem(
                "transactions",
                JSON.stringify(transactions)
            );


            displayTransactions();

            updateBalance();

            transactionForm.reset();

        }
    );

}


/* =========================
   DISPLAY TRANSACTIONS
========================= */

function displayTransactions() {

    const transactionList =
        document.getElementById(
            "transactionList"
        );


    if (!transactionList) return;


    const transactions =
        JSON.parse(
            localStorage.getItem(
                "transactions"
            )
        ) || [];


    transactionList.innerHTML = "";


    transactions.forEach(
        function(transaction) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${transaction.description}
                </td>

                <td>
                    ${transaction.type}
                </td>

                <td>
                    ${transaction.category}
                </td>

                <td>
                    ₹${transaction.amount}
                </td>

            `;


            transactionList.appendChild(row);

        }
    );

}


/* =========================
   UPDATE BALANCE
========================= */

function updateBalance() {

    const transactions =
        JSON.parse(
            localStorage.getItem(
                "transactions"
            )
        ) || [];


    let income = 0;

    let expense = 0;


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type ===
                "income"
            ) {

                income +=
                    transaction.amount;

            } else {

                expense +=
                    transaction.amount;

            }

        }
    );


    const balance =
        income - expense;


    const incomeElement =
        document.getElementById(
            "totalIncome"
        );


    const expenseElement =
        document.getElementById(
            "totalExpense"
        );


    const balanceElement =
        document.getElementById(
            "balance"
        );


    if (incomeElement)
        incomeElement.textContent =
            "₹" + income;


    if (expenseElement)
        expenseElement.textContent =
            "₹" + expense;


    if (balanceElement)
        balanceElement.textContent =
            "₹" + balance;

}


/* =========================
   LOAD USER DATA
========================= */

function loadUserData() {

    const budget =
        Number(
            localStorage.getItem(
                "budget"
            )
        ) || 0;


    const budgetElement =
        document.getElementById(
            "totalBudget"
        );


    if (budgetElement) {

        budgetElement.textContent =
            "₹" + budget;

    }


    displayTransactions();

    updateBalance();

}


/* =========================
   ADMIN DASHBOARD
========================= */

if (
    window.location.pathname.includes(
        "admin-dashboard.html"
    )
) {

    const loggedInUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (
        !loggedInUser ||
        loggedInUser.role !== "admin"
    ) {

        window.location.href =
            "login.html";

    } else {

        loadUsers();

    }

}


/* =========================
   DISPLAY USERS
========================= */

function loadUsers() {

    const userList =
        document.getElementById(
            "userList"
        );


    if (!userList) return;


    const users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];


    userList.innerHTML = "";


    users.forEach(
        function(user) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${user.name}
                </td>

                <td>
                    ${user.email}
                </td>

            `;


            userList.appendChild(row);

        }
    );

}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem(
        "loggedInUser"
    );


    window.location.href =
        "login.html";

}