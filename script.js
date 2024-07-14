function createUser(firstName, lastName, pin) {
    return {
        firstName,
        lastName,
        pin,
        transactions: [],
        balance() {
            return this.transactions.reduce((acc, t) => acc + t.amount, 0);
        },
        matchUserName(name) {
            return (this.firstName.at(0) + this.lastName.at(0)).toLowerCase() === name;
        },
        deposit(amount) {

            this.transactions.push(createTransaction(amount));
            updateUI();
        },
        withdraw(amount) {
            if (this.balance() < amount) {
                alert('Insufficient balance');
            }
            else {
                this.transactions.push(createTransaction(-amount));
                updateUI();
            }
        },
        loan(amount) {
            this.transactions.push(createTransaction(amount));
            updateUI();
        }
    }
}

function createTransaction(amount) {
    return {
        amount,
        date: dateFormatter.format(new Date())

    }
}

const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium"
})

const user1 = createUser('Java', 'Script', '0000');
const user2 = createUser('Ajay', 'Jangir', '1111');
const user3 = createUser('Andrew', 'Huberman', '1234');

const users = [user1, user2, user3];

console.log(...users);
currentUser = null;
const btnLogin = document.querySelector('.login-submit');

btnLogin.addEventListener('click', (e) => {
    e.preventDefault();

    const form = e.target.parentElement;
    const userName = form.querySelector('input[name="user-name"]').value.trim();
    const pin = form.querySelector('input[name="pin"]').value.trim();
    currentUser = getUser(userName)?.pin === pin ? getUser(userName) : null;

    if (currentUser) {
        hideLogin();
        showUI();
        updateUI();
    }
    else alert('Invalid credentials');

    function hideLogin() {
        document.querySelector('.login-form').classList.add('hidden');
        document.querySelector('.login-text').classList.add('hidden');
    }

    function showUI() {
        document.querySelector('.balance').classList.remove('hidden');
        document.querySelector('.actions').classList.remove('hidden');
        document.querySelector('.transactions').classList.remove('hidden');
    }

})


function getUser(name) {
    return users.find((u) => u.matchUserName(name));
}

const transferBtn = document.querySelector('.transfer-btn');
const loanBtn = document.querySelector('.loan-btn');
const closeBtn = document.querySelector('.close-account-btn');
const logOutBtn = document.querySelector('.logout-btn');

transferBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const form = e.target.parentElement;
    const toUserName = form.querySelector('input[name="to-user"]').value.trim();
    const amount = form.querySelector('input[name="amount"]').value.trim();
    if (!toUserName || !(+amount) || amount < 0) {
        alert('Please enter valid details');
        return;
    }
    transferAmount();
    form.reset();
    function transferAmount() {
        const toUser = getUser(toUserName);
        toUser.deposit(+amount);
        currentUser.withdraw(+amount);
    }
});


loanBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const form = e.target.parentElement;
    const amount = form.querySelector('input[name="amount"]').value.trim();
    if (!(+amount) || amount < 0) {
        alert('Please enter valid details');
        return;
    }
    loanAmount();
    form.reset();

    function loanAmount() {
        currentUser.loan(+amount);
    }
})


closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const form = e.target.parentElement;
    const userName = form.querySelector('input[name="user-name"]').value.trim();
    const pin = form.querySelector('input[name="pin"]').value.trim();
    if (!userName || !pin) {
        alert('Please enter valid details');
        return;
    }

    if (currentUser.matchUserName(userName) || currentUser.pin !== pin) {
        alert('Invalid credentials');
        return;
    }

    closeAccount();
    form.reset();

    function closeAccount() {
        const index = users.findIndex((u) => u.matchUserName(userName));
        users.splice(index, 1);
        alert('Account closed successfully');
        logOut();
    }
})


logOutBtn.addEventListener('click', logOut);

function logOut() {
    currentUser = null;
    hideUI();
    showLogin();
    function hideUI() {
        document.querySelector('.balance').classList.add('hidden');
        document.querySelector('.actions').classList.add('hidden');
        document.querySelector('.transactions').classList.add('hidden');
    }
    function showLogin() {
        document.querySelector('.login-form').classList.remove('hidden');
        document.querySelector('.login-text').classList.remove('hidden');
        document.querySelector('.login-form').reset();
        document.querySelector('.login-form input[name="user-name"]').focus();
    }
}

function updateUI() {
    document.querySelector(".update-date").textContent = dateFormatter.format(new Date());
    document.querySelector(".balance-value").textContent = currency.format(currentUser.balance());

    const transactions = document.querySelector(".transactions-container");
    transactions.innerHTML = '';

    if (currentUser.transactions.length === 0)
        transactions.innerHTML = 'Transactions will appear here!';
    else
        currentUser.transactions.forEach(t => {
            let [transactionType, transactionText] = t.amount > 0 ? ["deposit", "Deposit"] : ["withdraw", "Withdrawal"];


            const newTransaction = `<div class="transaction flex-row">
        <div class="transaction-description flex-row">
          <p class="transaction-type ${transactionType} ">${transactionText}</p>
          <p class="transaction-date flex-row">${t.date}</p>
        </div>
        <p class="transaction-value">${currency.format(t.amount)}</p>
      </div>
      
      <hr />`;
            transactions.insertAdjacentHTML("afterbegin", newTransaction);
        })
}


