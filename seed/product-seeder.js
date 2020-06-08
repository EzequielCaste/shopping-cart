const Product = require("../models/product");
const mongoose = require("mongoose")
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {  useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });

const products = [
  new Product({
    imagePath: "https://upload.wikimedia.org/wikipedia/en/1/1b/Monster_Hunter_World_cover_art.jpg",
    title: "Monster Hunter World",
    description: "Awesome Game!!",
    price: 10
  }),
  new Product({
    imagePath: "https://upload.wikimedia.org/wikipedia/en/1/1b/Monster_Hunter_World_cover_art.jpg",
    title: "Monster Hunter World",
    description: "Awesome Game!!",
    price: 10
  }),
  new Product({
    imagePath: "https://upload.wikimedia.org/wikipedia/en/1/1b/Monster_Hunter_World_cover_art.jpg",
    title: "Monster Hunter World",
    description: "Awesome Game!!",
    price: 10
  })
];

let done = 0;
for (let i = 0; i < products.length; i++){
  products[i].save(function(err, result){ 
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}