const User = require("./model/user");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// const userRoutes = require("./routes/idea");
console.log("Before loading routes");

const userRoutes = require("./routes/idea");

console.log("After loading routes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

// ================== MONGODB CONNECTION ==================
mongoose.connect("mongodb://127.0.0.1:27017/FastFest")
.then(() => {
    console.log("MongoDB Connected");
})
.catch(err => {
    console.log(err);
});


// MENU ITEMS
const menuSchema = new mongoose.Schema({
    itemName: String,
    price: Number,
    category: String,
    restaurant: String,
    description: String,
    image: String
});

app.get("/menuItems", async (req, res) => {
    const items = await MenuItem.find();
    res.json(items);
});
// CART
const cartSchema = new mongoose.Schema({
    userId: String,

    items: [
        {
            name: String,
            price: Number
        }
    ],

    total: Number
});
const adminSchema = new mongoose.Schema({
    username:String,
    password:String
});

const Admin =
mongoose.model("Admin", adminSchema);

app.post("/admin-login", async (req, res) => {

    const { username, password } = req.body;

    const admin = await Admin.findOne({
        username,
        password
    });

    if(admin){
        res.json({ success: true });
    }
    else{
        res.json({ success: false });
    }
});
// ORDERS
const orderSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String,
    items: Array,
    total: Number,
    date: {
        type: Date,
        default: Date.now
    }
});


const MenuItem = mongoose.model("MenuItem", menuSchema);
const Cart = mongoose.model("Cart", cartSchema);
const Order = mongoose.model("Order", orderSchema);

// ================== API ROUTES ==================

// USERS
app.post("/users", async (req, res) => {
    let data = new User(req.body);
    let result = await data.save();
    res.send(result);
});

// MENU ITEMS
app.post("/menuItems", async (req, res) => {
    console.log("MENU ITEM RECEIVED:");
    console.log(req.body);
    let data = new MenuItem(req.body);
    let result = await data.save();
    console.log("MENU ITEM SAVED");
    res.send(result);
});

// CART
app.post("/cart", async (req, res) => {
    try {
        console.log("CART RECEIVED:", req.body);
        const { userId, items, total } = req.body;
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = items;
            cart.total = total;
            await cart.save();
            return res.json({
                success: true,
                message: "Cart updated"
            });
        }
        const newCart = new Cart({
            userId,
            items,
            total
        });
        await newCart.save();
        res.json({
            success: true,
            message: "Cart created"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// ORDERS
app.post("/orders", async (req, res) => {

    try {

        console.log("ORDER RECEIVED:");
        console.log(req.body);

        const { firstName, lastName, address, items, total } = req.body;

        const order = new Order({
            firstName,
            lastName,
            address,
            items,
            total
        });

        const result = await order.save();

        console.log("ORDER SAVED:");
        console.log(result);

        res.json({
            success: true,
            order: result
        });

    } catch (error) {

        console.log("ORDER ERROR:");
        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});