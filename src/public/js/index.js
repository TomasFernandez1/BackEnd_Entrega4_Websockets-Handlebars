const socketClient=io()

// Recieve the sendProducts event from the server
socketClient.on("sendProducts", obj =>{
    updateProductList(obj)
})

const updateProductList = productList => {
 
  // Take the div of the products from the DOM
    const productsDiv  = document.getElementById('list-products')

    let productsHTML = "";
  
    // Go through the list of products and create a card for each of these
    productList.forEach((product) => {
        productsHTML += `<div class="card">
        <div class="card-header">Code:  ${product.code}</strong></div>
        <div class="card-body">
            <h4 class="card-title">${product.title}</h4>
            <p class="card-text">
            <ul class="card-text">
            <li>ID: ${product.id}</li>
            <li>Description: ${product.description}</li>
            <li>Price: $${product.price}</li>
            <li>Category: ${product.category}</li>
            <li>Status: ${product.status}</li>
            <li>Stock: ${product.stock}</li>
            Thumbnail: <img src="${product.thumbnail}" alt="img" class="img-thumbnail">
            </ul>
            </p>
        </div>
        <div>
        <button type="button" class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
        </div>
        
    </div>
</div>`;
    });
  
    // Insert the Product list to the DOM
    productsDiv.innerHTML = productsHTML;
  }

  // Get the form element from the DOM
  const form = document.getElementById("formProduct");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  
    const title = form.elements.title.value;
    const description = form.elements.description.value;
    const stock = form.elements.stock.value;
    const thumbnail = form.elements.thumbnail.value;
    const category = form.elements.category.value;
    const price = form.elements.price.value;
    const code = form.elements.code.value;
    const status = form.elements.status.checked;
  
    // Send the addProduct event to the server
    socketClient.emit("addProduct", {
      title,
      description,
      stock,
      thumbnail,
      category,
      price,
      code,
      status,
  
    });
     // Reset the values of the form
    form.reset();
  });

  // Get the delete-btn element from the DOM
document.getElementById("delete-btn").addEventListener("click", () => {
  // Get the id-prod element from the DOM
    const deleteidinput = document.getElementById("id-prod");
    // Get the value from the id-prod
    const deleteid = parseInt(deleteidinput.value);
    // Send the deleteProduct event to the server
    socketClient.emit("deleteProduct", deleteid);
    deleteidinput.value = "";
  })
