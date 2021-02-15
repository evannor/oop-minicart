class Product {
  title = "DEFAULT";
  imageUrl;
  price;
  description;

  // constructor allows you to make a new object following the code below
  constructor(title, img, desc, price) {
    this.title = title;
    this.imageUrl = img;
    this.description = desc;
    this.price = price;
  }
}

// guarantees the structure requested in createRootElement method in Component
class ElementAttribute {
  // store data we got on the constructor in properties of the class
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

// class used to output different similar pieces of the webpage
class Component {
  constructor(renderHook, shouldRender = true) {
    this.hookId = renderHook;
    if (shouldRender) {
      this.render();
    }
  }

  // create in parent class for clarity on reading code
  // this method will be overridden by every subclass render call
  // also works because this will reference what called render, which will be the subclass and not this component class
  render() {}

  createRootElement(tag, cssClasses, attributes) {
    const rootEl = document.createElement(tag);
    // check to see if any classes were passed, and then assign
    if (cssClasses) {
      rootEl.className = cssClasses;
    }
    // check to see if attributes were passed and confirm receipt of array
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootEl.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.hookId).append(rootEl);
    return rootEl;
  }
}

// inherits from one class
// cannot inherit from multiple classes in JS
class ShoppingCart extends Component {
  items = [];

  // this setter is optional, just shown to provide an example
  set cartItems(value) {
    this.items = value;
    // will later dynamically render a new total here
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(
      2
    )}</h2>`;
  }

  get totalAmount() {
    const sum = this.items.reduce(
      (prevVal, curItem) => prevVal + curItem.price,
      0
    );
    return sum;
  }

  constructor(renderHookId) {
    // use this in the constructor if you need to utilize the constructor in the base class / the one being extended
    super(renderHookId);
    // always call super first, then use this inside the constructor
  }

  addProduct(product) {
    // makes a true copy of the items array
    const updatedItems = [...this.items];
    updatedItems.push(product);
    // trigger the setter, pass updatedItems as a value to it
    this.cartItems = updatedItems;
  }

  // method called after Order Now button clicked
  orderProducts() {
    console.log("Ordering...");
    console.log(this.items);
  }
  // can also make this a field and call an arrow function, to be used without arrow function in addEventListener below

  render() {
    // extends methods of base class Component
    // simply render which shows the total amount and an order now button
    const cartEl = this.createRootElement("section", "cart");
    cartEl.innerHTML = `
      <h2>Total: \$${0}</h2>
      <button>Order Now!</button>
    `;
    const orderBtn = cartEl.querySelector("button");
    // arrow function prevent this from referencing the button
    // allows it to reference the code above as it is this code which calls the button
    orderBtn.addEventListener("click", () => this.orderProducts());
    // dyanmically add totalOutput field
    this.totalOutput = cartEl.querySelector("h2");
    // doesn't return anythin b/c not interested in cart element anymore
  }
}

class ProductItem extends Component {
  constructor(product, renderHookId) {
    // false prevents original render, allowing us to call it manually after products have loaded
    super(renderHookId, false);
    // adds a new 'product' property to the eventually created objects
    this.product = product;
    this.render();
  }

  addToCart() {
    App.addProductToCart(this.product);
    // product is passed when a ProductItem is created, as seen in constructor method
  }

  render() {
    // use Component method to create element
    const prodEl = this.createRootElement("li", "product-item");
    const image = this.product.imageUrl;
    // create the structure and code for html we want to add to each li
    prodEl.innerHTML = `
      <div>
        <img src=${image} alt="${this.product.title}" />
        <div class="product-item__content">
          <h2>${this.product.title}</h2>
          <h3>\$${this.product.price}</h3>
          <p>${this.product.description}</p>
          <button>Add to Cart</button>
        </div>
      </div>
    `;
    // b/c executed inside render method of class, this always applies to each concrete instance which is later created on that class
    // having multiple products with buttons does not cause a problem
    const addCartButton = prodEl.querySelector("button");
    addCartButton.addEventListener("click", this.addToCart.bind(this));
  }
}

class ProductList extends Component {
  products = [];

  // should be app passed as renderHookId, but using variable to be more flexible
  constructor(renderHookId) {
    super(renderHookId);
    this.fetchProducts();
  }

  // can be used later to make calls to fetch external data
  // changed order to that super() is called before we use 'this'
  fetchProducts() {
    this.products = [
      new Product(
        "Hiking Boots",
        "data:image/jpeg;base64,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",
        "A lightweight women's hiking boot.",
        99.99
      ),
      new Product(
        "2 Person Backpacking Tent",
        "https://outdoorgearo.com/dev/wp-content/uploads/2019/07/Screen-Shot-2019-07-16-at-2.24.01-PM-600x599.png",
        "A great summer 2 person backpacking tent.",
        159.99
      ),
    ];
    this.renderProducts();
  }

  renderProducts() {
    // loop through each prod in products array in this object
    for (const prod of this.products) {
      // want to pass id of element where this item should be added
      new ProductItem(prod, "prod-list");
    }
  }

  render() {
    this.createRootElement("ul", "product-list", [
      new ElementAttribute("id", "prod-list"),
    ]);
    // if products exists and has a length greate than zero
    if (this.products && this.products.length > 0) {
      this.renderProducts();
    }
  }
}

class Shop extends Component {
  constructor() {
    super();
  }

  render() {
    this.cart = new ShoppingCart("app");
    new ProductList("app");
  }
}

class App {
  // below is not required but adds readability
  static cart;

  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }

  // use this to create
  static addProductToCart(product) {
    // forward the product using this static method as proxy
    this.cart.addProduct(product);
  }
}

// will execute init method directly on the class itself
App.init();
