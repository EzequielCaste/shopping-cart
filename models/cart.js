module.exports = function Cart(oldCart){
  this.items = oldCart.items ||  {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {
        item: item, qty: 0, price: 0}
      }
      storedItem.qty++;
      storedItem.price = storedItem.item.price * storedItem.qty;
      this.totalQty++;
      this.totalPrice += storedItem.item.price;    
  }

  this.remove = function(item, id) { 

    this.items[id].qty--;
    this.items[id].price = this.items[id].item.price * this.items[id].qty;
    
    this.totalQty--;    
    this.totalPrice -= this.items[id].item.price;
           
    if (this.items[id].qty === 0) {
      delete this.items[id] 
    } 

    if (this.totalQty === 0) {         
      delete this.items
      delete this.totalQty
      delete this.totalPrice
    }
    
  }

  this.generateArray = function() {
    let arr = [];
    for( let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }
}