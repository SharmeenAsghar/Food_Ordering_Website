function login() {
    let email = document.getElementById("email")?.value;
    let password = document.getElementById("password")?.value;
    // localStorage.setItem("userId", data.userId);
    if (email && password) {
        alert("Login Successful");
        localStorage.setItem("loggedIn", "true");
        window.location.href = "menu.html";
    } else {
        alert("Please enter email and password");
    }
}

async function signup() {

    try {
      
        let fullname = document.getElementById("fullname").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let phone = document.getElementById("phone").value;

        console.log({
        fullname,
        email,
        password,
        phone
        });
        const response = await fetch("http://localhost:5000/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullname,
                email,
                password,
                phone
            })
        });
        console.log("Response status:", response.status);
        const data = await response.json();
    
        console.log("SERVER RESPONSE:", data);

        if (data.success) {
            alert("Signup Successful");
            window.location.href = "login.html";
        } else {
            alert(data.message);
        }

    } catch (error) {
    console.error(error);
    alert("Signup failed: " + error.message);
}
}

function isLoggedIn() {
    return localStorage.getItem("loggedIn") === "true";
}
async function adminLogin(){

    const username =
    document.getElementById("adminUsername").value.trim();

    const password =
    document.getElementById("adminPassword").value.trim();

    if(username === "" || password === ""){
        alert("Please enter username and password");
        return;
    }

    try{

        const res = await fetch(
            "http://localhost:5000/admin-login",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        const data = await res.json();

        if(data.success){

            localStorage.setItem("role","admin");

            alert("Admin Login Successful");

            window.location.href = "menu.html";
        }
        else{

            alert("Invalid Username or Password");
        }

    }
    catch(err){

        console.log(err);
        alert("Server connection failed");

    }
}
function continueAsUser(){

    localStorage.setItem(
    "role",
    "user"
    );

    window.location.href =
    "menu.html";
}

async function adminLogin(){

    const username =
    document.getElementById(
    "adminUsername"
    ).value;

    const password =
    document.getElementById(
    "adminPassword"
    ).value;

    const res = await fetch(
    "http://localhost:5000/admin-login",
    {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username,
            password
        })
    });

    const data = await res.json();

    if(data.success){

        localStorage.setItem(
            "role",
            "admin"
        );

        window.location.href =
            "menu.html";

    }else{

        alert(
        "Invalid Username or Password"
        );
    }
}

function continueAsUser(){

    localStorage.setItem(
    "role",
    "user"
    );

    window.location.href =
    "menu.html";
}

async function adminLogin(){

    const username =
    document.getElementById(
    "adminUsername"
    ).value;

    const password =
    document.getElementById(
    "adminPassword"
    ).value;

    const res = await fetch(
    "http://localhost:5000/admin-login",
    {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username,
            password
        })
    });

    const data =
    await res.json();

    if(data.success){

        localStorage.setItem(
        "role",
        "admin"
        );

        window.location.href =
        "menu.html";
    }
    else{

        alert(
        "Invalid Username or Password"
        );
    }
}

function showAdminLogin(){

    document.getElementById(
        "adminBox"
    ).style.display = "block";

}

function continueAsUser(){

    localStorage.setItem(
    "role",
    "user"
    );

    window.location.href =
    "menu.html";
}

window.onload = function(){

    const role =
    localStorage.getItem("role");

    const logoutBtn =
    document.getElementById(
    "logoutBtn");

    if(logoutBtn){

        if(role){
            logoutBtn.style.display =
            "inline-block";
        }
        else{
            logoutBtn.style.display =
            "none";
        }
    }

    const form =
    document.querySelector(
    ".add-item-form");

    if(form && role !== "admin"){
        form.style.display="none";
    }

    document
    .querySelectorAll(".delete-btn")
    .forEach(btn=>{

        if(role !== "admin"){
            btn.style.display="none";
        }
    });
}

async function addMenuItem() {

    const itemName = document.getElementById("newItemName").value;
    const price = document.getElementById("newItemPrice").value;
    const category = document.getElementById("newItemCategory").value;
    const restaurant = document.getElementById("newItemRestaurant").value;
    const image = document.getElementById("newItemImage").value;

    const newItem = {
        itemName,
        price: Number(price),
        category,
        restaurant,
        description: "",
        image
    };

    try {

        const res = await fetch("http://localhost:5000/menuItems", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newItem)
        });

        const data = await res.json();

        console.log("Saved:", data);

        // Add instantly to food gallery
        const gallery = document.querySelector(".gallery");

        if (gallery) {
            gallery.innerHTML += `
                <div class="food-card">
                    <img src="${image}">
                    <h3>${itemName}</h3>
                    <p>${restaurant}</p>
                    <p>Rs ${price}</p>
                    <button onclick='addToCart({
    name:"${itemName}",
    price:${price}
})'>
    Add to Cart
</button>
                        Add to Cart
                    </button>
                </div>
            `;
        }

        alert("Item added successfully!");

        document.getElementById("newItemName").value = "";
        document.getElementById("newItemPrice").value = "";
        document.getElementById("newItemCategory").value = "";
        document.getElementById("newItemRestaurant").value = "";
        document.getElementById("newItemImage").value = "";

    } catch (err) {
        console.log(err);
        alert("Failed to add item");
    }
}

async function addToCart(name, price) {

    if (!isLoggedIn()) {
        alert("Please login first");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = {
        name: String(name),
        price: Number(price)
    };

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));

    let userId = localStorage.getItem("userId") || "guest";
    let total = cart.reduce((sum, i) => sum + Number(i.price), 0);

    try {
        await fetch("http://localhost:5000/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                items: cart,
                total
            })
        });
    } catch (err) {
        console.log(err);
    }

    alert(name + " added to cart!");
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert(" Your cart is empty!");
        return;
    }

    window.location.href = "order.html";
}

async function saveToMongo(food) {
    try {
        await fetch("http://localhost:5000/menuItems", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(food)
        });

        console.log("Saved to MongoDB:", food.itemName);
    } catch (error) {
        console.log("Error saving to MongoDB:", error);
    }
}

const foodContainer = document.getElementById("foodContainer");
const foodDetails = document.getElementById("foodDetails");

if (foodContainer && foodDetails && typeof foods !== "undefined") {
    foods.forEach(food => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${food.image}" alt="${food.itemName}">
            <h2>${food.itemName}</h2>
            <p>Rs ${food.price}</p>
            <button onclick='addToCart({
    name: "${food.itemName}",
    price: ${food.price}
})'>Add to Cart</button>
        `;

        card.querySelector("img").onclick = function () {
            foodDetails.innerHTML = `
                <h2>${food.itemName}</h2>
                <img src="${food.image}" width="300"/>
                <p><b>Price:</b> Rs ${food.price}</p>
                <p><b>Category:</b> ${food.category}</p>
                <p><b>Description:</b> ${food.description}</p>
            `;

            saveToMongo(food);
        };

        foodContainer.appendChild(card);
    });
}

const menuForm = document.getElementById("menuForm");

if (menuForm) {
    menuForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let itemName = document.getElementById("itemName").value;
        let price = document.getElementById("price").value;
        let category = document.getElementById("category").value;

        let menuContainer = document.getElementById("menuContainer");

        menuContainer.innerHTML += `
            <div class="meal-card">
                <h3>${itemName}</h3>
                <p>${category}</p>
                <b>Rs ${price}</b>
            </div>
        `;

        menuForm.reset();
    });
}

const orderForm = document.getElementById("orderForm");

if (orderForm) {
   if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
        e.preventDefault();

        placeOrder();
    });
}
}

function loadBill() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let billContainer = document.getElementById("billContainer");
    let totalAmount = document.getElementById("totalAmount");

    if (!billContainer) return;

    billContainer.innerHTML = "";

    if (cart.length === 0) {
        billContainer.innerHTML = "<p> Cart is empty</p>";
        totalAmount.innerText = "";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        let price = Number(item.price) || 0;
        total += price;

        billContainer.innerHTML += `
            <div class="bill-item">
                <span>${item.name}</span>
                <span>Rs ${price}</span>
                <button onclick="removeItem(${index})">❌</button>
            </div>
        `;
    });

    totalAmount.innerText = "Total: Rs " + total;
}
    
function deleteItem(btn){

    if(localStorage.getItem("role") !== "admin"){
        alert("Only admin can delete items");
        return;
    }

    btn.parentElement.remove();
}
   
async function placeOrder() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    let firstName = document.getElementById("firstName")?.value || "";
    let lastName = document.getElementById("lastName")?.value || "";
    let address = document.getElementById("address")?.value || "";

    let total = cart.reduce(
        (sum, item) => sum + Number(item.price),
        0
    );

    try {

        const response = await fetch(
            "http://localhost:5000/orders",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    address,
                    items: cart,
                    total
                })
            }
        );

        const data = await response.json();

        console.log("ORDER RESPONSE:", data);

        if(response.ok){

            alert("🎉 Order placed successfully!");

            localStorage.removeItem("cart");

            window.location.href = "index.html";

        } else {

            alert("Order failed");

        }

    } catch (error) {

        console.log("ORDER ERROR:", error);

        alert("Server error. Check console.");

    }
}
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadBill(); 
}
function logout(){

    localStorage.removeItem("role");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userId");

    window.location.href =
    "role.html";
}
