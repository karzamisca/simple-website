const express = require("express");
const mongoose = require("mongoose");
const Purchase = require("./models/purchaseModel.cjs");
const Coffee = require("./models/coffeeModel.cjs");
const Credential = require("./models/credentialModel.cjs");
const AdminCredential = require("./models/adminCredentialModel.cjs");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//routes

//test
app.get("/", (req, res) => {
  res.send("Hello");
});
app.get("/blog", (req, res) => {
  res.send("Hello");
});

//coffee collection
app.get("/coffee", async (req, res) => {
  try {
    const coffee = await Coffee.find({});
    res.status(200).json(coffee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/coffee", async (req, res) => {
  try {
    const coffee = await Coffee.create(req.body);
    res.status(200).json(coffee);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
// update coffee
app.get("/coffee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const coffee = await Coffee.findById(id);
    res.status(200).json(coffee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.put("/coffee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const coffee = await Coffee.findByIdAndUpdate(id, req.body);
    // we cannot find any product in database
    if (!coffee) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    const updatedCoffee = await Product.findById(id);
    res.status(200).json(updatedCoffee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete coffee
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Purchase.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//user credential collection
app.get("/credential", async (req, res) => {
  try {
    const credential = await Credential.find({});
    res.status(200).json(credential);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/credential", async (req, res) => {
  try {
    const credential = await Credential.create(req.body);
    res.status(200).json(credential);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
//admin credential collection
app.get("/adminCredential", async (req, res) => {
  try {
    const credential = await AdminCredential.find({});
    res.status(200).json(credential);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/adminCredential", async (req, res) => {
  try {
    const credential = await AdminCredential.create(req.body);
    res.status(200).json(credential);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
//purchase collection
app.get("/purchase", async (req, res) => {
  try {
    const products = await Purchase.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/purchase", async (req, res) => {
  try {
    const purchase = await Purchase.create(req.body);
    res.status(200).json(purchase);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//connect to mongodb
mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://<username>:<password>@<cluster>/<shop>?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(3000, () => {
      console.log(`API is running on port 3000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
