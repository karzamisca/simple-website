const express = require("express");
const mongoose = require("mongoose");
const Purchase = require("./models/purchaseModel.cjs");
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
app.get("/products", async (req, res) => {
  try {
    const products = await Purchase.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Purchase.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// update coffee
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Purchase.findByIdAndUpdate(id, req.body);
    // we cannot find any product in database
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    const updatedProduct = await Purchase.findById(id);
    res.status(200).json(updatedProduct);
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

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority"
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
