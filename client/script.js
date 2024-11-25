
async function getUserTypes() {
    try {
        let response = await fetch('/getUserType', { method: 'GET' })

        if (response) {
            console.log("response", response);

            let parsed_response = await response.json();
            console.log("parsed_response", parsed_response);

            let data = parsed_response.data;
            console.log('data', data);

            let userTypes = document.getElementById('UserType')
            let u_rows = '<option selected = "userType">userType</option>'

            for (i = 0; i < data.length - 1; i++) {
                u_rows = u_rows + `
                <option value="${data[i].userType}">${data[i].userType}</option>
                
                `
            }

            userTypes.innerHTML = u_rows

        }
    } catch (error) {
        console.log('error', error);

    }
}

async function signin(event) {
    event.preventDefault();

    // Retrieve values from input fields
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone_number = document.getElementById('Phone').value;
    let password = document.getElementById('password').value;
    let userType = document.getElementById('UserType').value;

    // Validate input
    if (!name || !email || !phone_number || !password || !userType) {
        console.error("All fields are required.");
        alert("All fields are required.")
        return;
    }

    // Prepare user data object
    let userDatas = {
        name,
        email,
        phone_number,
        password,
        userType
    };
    console.log("datas", userDatas);

    // Convert user data to JSON string
    let strUserDatas = JSON.stringify(userDatas);

    try {
        let response = await fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: strUserDatas
        });



        // Optionally parse the response JSON
        let parsed_response = await response.json();
        console.log("response data", parsed_response);

        if (parsed_response.statusCode === 400) {
            alert(parsed_response.message);
        }
        else {
            alert(parsed_response.message)
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

async function signOut() {
    if (confirm("Are you sure you want to sign out?")) {
        let params = new URLSearchParams(window.location.search);
        let token_key = params.get('login');

        // Remove the token from local storage using the key
        localStorage.removeItem(token_key);

        // Redirect to the login page
        window.location = `login.html`;
    }
}

async function login(event) {
    event.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let login_data = {
        email,
        password
    };

    if (email && password) {
        let strLoginData = JSON.stringify(login_data);

        try {
            let response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: strLoginData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let parsed_response = await response.json();
            console.log("parsed Response", parsed_response);

            if (parsed_response.statusCode === 200 && parsed_response.data) {
                alert(parsed_response.message);

                let data = parsed_response.data;
                let token = data.token;
                let userType;

                // Check if user or admin exists to determine userType
                if (data.user) {
                    userType = data.user.userType.userType;
                } else if (data.admin) {
                    userType = data.admin.userType.userType;
                } else {
                    alert("User type not found in response.");
                    return; // Exit if user type is not found
                }

                console.log("userType", userType);
                let id = data.user ? data.user._id : data.admin._id;

                let token_key = id;

                // Store token in localStorage
                localStorage.setItem(token_key, token);

                // Redirect based on userType
                if (userType === "Buyer") {
                    window.location.href = `index.html?login=${token_key}&id=${id}`;

                } else if (userType === "Seller") {
                    window.location.href = `seller.html?login=${token_key}&id=${id}`;
                } else if (userType === "Admin") {
                    window.location.href = `admin.html?login=${token_key}&id=${id}`;
                } else {
                    alert("You do not have permission to access the page.");
                }
            } else {
                alert(parsed_response.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred during login. Please try again.");
        }
    } else {
        alert("Please enter both email and password.");
    }
}

function indextobuyer() {
    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    if (token && id) {
        let signin = document.getElementById('signin');
        signin.style.display = "none";

        let account = document.getElementById('account');
        account.style.display = "block";  // Show account element
    } else {
        // Optionally handle the case when token and id are not available
        let signin = document.getElementById('signin');
        signin.style.display = "block";

        let account = document.getElementById('account');
        account.style.display = "none";
    }

}

async function buyerProfile() {
    console.log("reached")

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    console.log("id", id)

    try {
        let response = await fetch(`/user/${id}`, {
            method: 'GET',
        });
        console.log("response", response);

        let parsed_response = await response.json();
        console.log("parsed_Response", parsed_response)
    } catch (error) {
        console.log("error", error);
    }
}

function gotoAddPage() {

    let params = new URLSearchParams(window.location.search);
    let token_key = params.get('login');
    let id = params.get('id');
    let token = localStorage.getItem(token_key);

    if (token) {

        window.location.href = `addProduct.html?login=${token_key}&id=${id}`;
    } else {
        console.error("Token not found in localStorage");

    }
}

async function getCategory() {
    try {
        let response = await fetch('/getcategory', { method: 'GET' });

        console.log("response", response);

        if (response) {
            let parsed_response = await response.json();


            let data = parsed_response.data;

            let category = document.getElementById('category')


            let c_rows = '<option selected = "category" disabled>category</option>'

            for (i = 0; i < data.length; i++) {
                c_rows = c_rows + `
                <option value="${data[i].category}">${data[i].category}</option>
            
            `
                category.innerHTML = c_rows
            }



        }
    } catch (error) {
        console.log("error", error)
    }
}

async function addProduct(event) {
    event.preventDefault();

    let params = new URLSearchParams(window.location.search);
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);
    let id = params.get('id')
    console.log("id", id)

    let name = document.getElementById('name').value.trim();
    let description = document.getElementById('description').value.trim();
    let price = parseFloat(document.getElementById('price').value);
    let category = document.getElementById('category').value.trim();
    let brand = document.getElementById('brand').value.trim();
    let stock = parseInt(document.getElementById('stock').value);
    let images = document.getElementById('imagesUpload');

    // Check if all required fields are filled
    if (!name || !description || !category || !brand || isNaN(price) || isNaN(stock)) {
        alert("Please fill in all required fields correctly.");
        return;
    }

    // Validate price and stock
    if (price <= 0) {
        alert("Price must be a positive number.");
        return;
    }
    if (stock < 0) {
        alert("Stock cannot be negative.");
        return;
    }

    // Check if files are selected
    const imageFiles = images.files; // Get all files
    console.log("imageFiles", imageFiles);

    if (imageFiles.length === 0) {
        alert("Please upload at least one image.");
        return;
    }

    // Validate file types
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    for (let i = 0; i < imageFiles.length; i++) {
        if (!validImageTypes.includes(imageFiles[i].type)) {
            alert(`File type not supported: ${imageFiles[i].name}. Please upload JPEG, PNG, or GIF images.`);
            return;
        }
    }

    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('stock', stock);

    // Loop through the files and append them to FormData
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images[]', imageFiles[i]); // Use 'images[]' if your backend expects an array
    }

    console.log("formdata", formData);

    try {
        let response = await fetch(`/addProducts/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });
        console.log("response", response);

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        let parsed_response = await response.json();
        console.log("parsedresponse", parsed_response);
        alert("Product added successfully!");

        window.location.href = `seller.html?login=${token_key}&id=${id}`;
    } catch (error) {
        console.log("error", error);
        alert("There was an error adding the product. Please try again.");
    }
}

async function profile() {
    console.log("reached")

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    console.log("id", id)

    try {
        let response = await fetch(`/user/${id}`, {
            method: 'GET',
        });
        console.log("response", response);

        let parsed_response = await response.json();
        console.log("parsed_Response", parsed_response)
    } catch (error) {
        console.log("error", error);
    }
}

function logOut() {
    if (confirm("Are you sure you want to LogOut?")) {
        let params = new URLSearchParams(window.location.search);
        let token_key = params.get('login');

        // Remove the token from local storage using the key
        localStorage.removeItem(token_key);

        // Redirect to the login page
        window.location = `index.html`;
    }
}

async function Deliveryto() {

    let params = new URLSearchParams(window.location.search)

    let id = params.get('id');
    console.log("id", id)

    try {
        let response = await fetch(`/user/${id}`, {
            method: 'GET',
        });
        console.log("response", response);

        let parsed_response = await response.json();
        console.log("parsed_Response", parsed_response)

        let data = parsed_response.data

        let Address = data.Address;
        console.log("ASddress", Address)

        let deliveryto = document.getElementById('deliveryto');

        let deliveryData = `
        <div>Deliveryto  ${Address[0].name}
        <div>${Address[0].street} ${Address[0].pincode}<div>
        </div>
        `
        deliveryto.innerHTML = deliveryData
    } catch (error) {
        console.log("error", error);
    }
}

function buyerDashboard() {

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login')


    window.location.href = `buyerDashboard.html?id=${id}&login=${token_key}`
}

function loginnedIndex() {
    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');

    window.location.href = `index.html?id=${id}&login=${token_key}`;
}

async function showForm() {

    let newaddress = document.getElementById('newaddress');
    newaddress.style.display = "none";

    let addressform = document.getElementById('address-form').style;
    addressform.display = 'block';



}

async function addAddress(event) {
    event.preventDefault();

    let params = new URLSearchParams(window.location.search);

    // Get input values from the form
    let name = document.getElementById('name1').value.trim();
    console.log("name111111", name);
    let street = document.getElementById('street').value.trim();
    let city = document.getElementById('city').value.trim();
    let state = document.getElementById('state').value.trim();
    let country = document.getElementById('country').value.trim();
    let pincode = document.getElementById('pincode').value.trim();



    // Validations
    if (!name) {
        alert('name is required')
    }
    if (!street) {
        alert("Street is required");
        return;
    }

    if (!city) {
        alert("City is required");
        return;
    }
    if (!state) {
        alert("State is required");
        return;
    }
    if (!country) {
        alert("Country is required");
        return;
    }
    if (!pincode) {
        alert("Pincode is required");
        return;
    }

    // Check if pincode is a valid number and has a specific length (e.g., 5 or 6 digits)
    if (!/^\d{5,6}$/.test(pincode)) {
        alert("Pincode must be a 5 or 6-digit number");
        return;
    }

    // Prepare the new address object
    let newAddress = {
        name,
        street,
        city,
        state,
        country,
        pincode,

    };

    console.log("New Address:", newAddress);

    // Get user ID from the URL
    let id = params.get('id');
    console.log("User ID:", id);

    try {
        // Send the new address to the backend
        let response = await fetch(`/addAddress/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Address: newAddress }),
        });

        console.log("Response:", response);

        if (response.status === 200) {
            let parsed_response = await response.json();
            console.log("Parsed Response:", parsed_response);

            if (parsed_response.statusCode === 200) {
                alert(parsed_response.message);



            } else {
                alert(parsed_response.message);
            }
        } else {
            alert("Failed to add address. Please try again.");
        }
    } catch (error) {
        console.log("Error:", error);
        alert("An error occurred while adding the address. Please try again later.");
    }
}

async function buyerData() {
    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');

    try {
        let response = await fetch(`/user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        });
        console.log("response", response);

        let parsed_response = await response.json();
        console.log("parsed_Response", parsed_response);

        let data = parsed_response.data;
        console.log('data', data);

        let username = document.getElementById('username');

        let usernamedata = ''
        usernamedata += `
        <div class="px-5 pt-3 fs-3">${data.name}</div>
        `
        username.innerHTML = usernamedata
        console.log("username", usernamedata)
    } catch (error) {
        console.log("error", error);
    }
}

async function getAllProducts() {
    try {
        let response = await fetch(`/getProducts`, { method: 'GET' });
        console.log("response", response);

        if (response.status === 200) {
            let parsed_response = await response.json();
            console.log("parsed_response", parsed_response);

            let data = parsed_response.data;
            console.log("data", data);

            let productsContainer = document.getElementById('productsContainer');

            let productData = ''

            for (let i = 0; i < data.length; i++) {
                // Get URLs for first and second images if available
                let firstImageUrl = data[i].images && data[i].images[0] ? data[i].images[0].url : '';
                let secondImageUrl = data[i].images && data[i].images[1] ? data[i].images[1].url : '';

                // Only include the second image if it's available
                productData += `
                  <div class="box-alignment shadow-lg mb-5 bg-body-tertiary" style="border-radius: 20px;" >
                    <div class="image-container" onclick = "gotoSingleview('${data[i]._id}')">
                        <!-- First image is initially visible -->
                        <img src="${firstImageUrl}" class="imagehover" style="height: 300px; width: 100%; border-radius: 20px 20px 0px 0px;" >
                        
                        <!-- Second image is initially hidden and shown on hover if it exists -->
                        ${secondImageUrl ? `<img src="${secondImageUrl}" class="imagehover" style="height: 300px; width: 100%; border-radius: 20px 20px 0px 0px;">` : ''}
                    </div>   
                    <div class="px-3 pt-4" onclick = "gotoSingleview('${data[i]._id}')">${data[i].name.slice(0, 50) + ".."}</div>
                    <div class="text-danger px-3 pb-4">$${data[i].price}</div>
                    <div>
                        <button class="px-3" onclick="handleaddtocart('${data[i]._id}', event, ${data[i].price})">Add to cart</button>
                    </div>
                  </div>
                `;
            }

            productsContainer.innerHTML = productData;
            let brandnewcontainer = document.getElementById('brand-new-container');

            let brandNewData = '';

            // Loop through the last 4 products in the data array in reverse order (most recent first)
            for (let i = data.length - 1; i >= Math.max(data.length - 4, 0); i--) {
                let firstImageUrl = data[i].images && data[i].images[0] ? data[i].images[0].url : '';
                let secondImageUrl = data[i].images && data[i].images[1] ? data[i].images[1].url : '';

                brandNewData += `
                    <div class="box-alignment shadow-lg mb-5 bg-body-tertiary" style="border-radius: 20px;">
                        <div class="image-container">
                            <!-- First image is initially visible -->
                            <img src="${firstImageUrl}" class="imagehover" style="height: 300px; width: 100%; border-radius: 20px 20px 0px 0px;">
                            
                            <!-- Second image is initially hidden and shown on hover if it exists -->
                            ${secondImageUrl ? `<img src="${secondImageUrl}" class="imagehover" style="height: 300px; width: 100%; border-radius: 20px 20px 0px 0px;">` : ''}
                        </div>   
                        <div class="px-3 pt-4">${data[i].name.slice(0, 50) + ".."}</div>
                        <div class="text-danger px-3 pb-4">$${data[i].price}</div>
                        <div>
                            <button class="px-3" onclick="handleaddtocart('${data[i]._id}', event, ${data[i].price})">Add to cart</button>
                        </div>
                    </div>
                `;
            }

            // Once the loop finishes, update the innerHTML of the container
            brandnewcontainer.innerHTML = brandNewData;


        }
    } catch (error) {
        console.log('error', error);
    }
}

function gotoSingleview(p_id) {
    console.log("id", p_id)

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    console.log("id", id);

    let token_key = params.get("login");

    window.location.href = `singleProductView.html?p_id=${p_id}&id=${id}&login=${token_key}`;
}

async function singleView() {
    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get("login");
    let p_id = params.get('p_id');

    let token = localStorage.getItem(token_key);
    console.log('token', token);

    try {
        let response = await fetch(`/getSingleViewProduct/${p_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log("response", response);

        if (response.status === 200) {
            let parsed_response = await response.json();
            console.log("parsed_response", parsed_response);
            if (parsed_response.statusCode === 200) {
                let data = parsed_response.data;
                console.log("data", data);
                if (data && data.product.images) {
                    let imageContainer = document.getElementById('image-container');
                    let enlargeContainer = document.getElementById('enlargeContainer');

                    // Clear the container if there are previous elements
                    imageContainer.innerHTML = '';
                    enlargeContainer.innerHTML = ''; // Clear the enlarge container

                    // Display the first image as default
                    if (data.product.images.length > 0) {
                        let firstImage = data.product.images[0];
                        enlargeContainer.innerHTML = `
                            <img src="${firstImage.url}" alt="${firstImage.alt}" style="width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;">
                        `;
                    }

                    // Add images vertically
                    data.product.images.forEach((image) => {
                        let imageBox = `
                            <div class="image-box" style="margin-bottom: 16px;" onclick="enlarge('${encodeURIComponent(image.url)}')">
                                <img src="${image.url}" alt="${image.alt}" style="width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;">
                            </div>
                        `;
                        imageContainer.innerHTML += imageBox;
                    });

                    let productData = document.getElementById('productData');

                    let productdetails = `
                    <div class="pt-5">
                        <div class="productname">${data.product.name}</div>
                        <div class="productprice pt-2">$${data.product.price}</div>
                        <div class="pt-3">
                            <div class="productbrand">Brand</div>
                            <div>${data.product.brand}</div>
                        </div>
                        <div class = "pt-4">
                            <div class="productabout">About this product</div>
                            <div>${data.product.description}</div>
                        </div>
                        <div class=" pt-4">
                            <div class="productseller">Seller Details</div>
                            <div>Name : ${data.seller.name}</div>
                            <div>Email : ${data.seller.email}</div>
                        </div>
                        <div>
                            <div><button onclick="handleaddtocart('${data._id}', event, ${data.price})">Add to cart</button></div>
                            <div><button>Buy now</button></div>
                        </div>
                    </div>
                    `
                    productData.innerHTML = productdetails;
                }
            } else {
                alert(parsed_response.message);
            }
        } else {
            alert("Fetching failed");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function enlarge(imageUrl) {
    let enlargeContainer = document.getElementById('enlargeContainer');

    // Decode the URL before using it
    let decodedUrl = decodeURIComponent(imageUrl);

    // Clear existing content
    enlargeContainer.innerHTML = '';

    // Add the clicked image
    let imageElement = `
       <div style="width: 100%; height: 50%;" class="card">
         <img src="${decodedUrl}" alt="Enlarged Image"  border: 1px solid #ddd; border-radius: 8px;">
       </div>
      

    `;
    enlargeContainer.innerHTML = imageElement;
}







async function getfiltercategory() {
    try {
        let response = await fetch('/getcategory', { method: 'GET' });
        console.log('response', response);

        if (response.status === 200) {

            let parsed_response = await response.json();

            let data = parsed_response.data;
            console.log("data for filter", data);


            let category = document.getElementById('categorySelect')

            let fc_rows = ` <option selected="category" disabled>Select a category</option>`

            for (i = 0; i < data.length; i++) {
                fc_rows = fc_rows + `
                <option value="${data[i].category}">${data[i].category}</option>
                `
            }

            category.innerHTML = fc_rows


        }
    } catch (error) {
        console.log('error', error);
    }
}

async function filterCategory(event) {
    event.preventDefault();

    let category = document.getElementById('categorySelect').value;
    console.log("category", category);

    let data = {
        category
    };
    console.log("data from filter", data);

    let strdata = JSON.stringify(data);
    console.log("strdata", strdata);

    try {
        let response = await fetch(`/filter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: strdata,
        });
        console.log('response', response);

        let parsed_response = await response.json();
        console.log("parsed_response", parsed_response);

        if (response.status === 400) {
            alert(parsed_response.message);
        } else if (response.status === 200) {
            let data = parsed_response.data;
            console.log("filtered data", data);

            // Update productsContainer with the filtered products
            let productsContainer = document.getElementById('productsContainer');
            let productData = '';

            for (let i = 0; i < data.length; i++) {
                // Get URLs for first and second images if available
                let firstImageUrl = data[i].images && data[i].images[0] ? data[i].images[0].url : '';
                let secondImageUrl = data[i].images && data[i].images[1] ? data[i].images[1].url : '';

                // Only include the second image if it's available
                productData += `
                  <div class="box-alignment shadow-lg mb-5 bg-body-tertiary" style="border-radius: 20px;">
                    <div class="image-container">
                        <!-- First image is initially visible -->
                        <img src="${firstImageUrl}" class="imagehover" style="height: 300px; width: 100%; border-radius: 20px 20px 0px 0px;">
                        
                        <!-- Second image is initially hidden and shown on hover if it exists -->
                        ${secondImageUrl ? `<img src="${secondImageUrl}" class="imagehover" style="height: 300px; width: 100%; border-radius: 20px 20px 0px 0px;">` : ''}
                    </div>   
                    <div class="px-3 pt-4">${data[i].name.slice(0, 10) + ".."}</div>
                    <div class="text-danger px-3 pb-4">$${data[i].price}</div>
                    <div>
                        <button class="px-3" onclick="handleaddtocart('${data[i]._id}', event, ${data[i].price})">Add to cart</button>
                    </div>
                  </div>
                `;
            }

            productsContainer.innerHTML = productData; // Update the container with filtered products
        }
    } catch (error) {
        console.log('error', error);
    }
}


// function incrementQuantity(productId) {
//     const quantityElement = document.getElementById(`quantity-${productId}`);
//     let quantity = parseInt(quantityElement.textContent);
//     quantity += 1;
//     quantityElement.textContent = quantity;
// }

// // Decrement quantity
// function decrementQuantity(productId) {
//     const quantityElement = document.getElementById(`quantity-${productId}`);
//     let quantity = parseInt(quantityElement.textContent);
//     if (quantity > 1) {
//         quantity -= 1;
//         quantityElement.textContent = quantity;
//     }
// }

function handleaddtocart(id, event, price) {

    event.preventDefault();

    let params = new URLSearchParams(window.location.search)
    let userId = params.get('id');
    let token_key = params.get('login');

    let token = localStorage.getItem(token_key);



    if (!token) {
        alert("Login to continue");
        window.location.href = (`login.html`);
    }
    else {

        const quantity = 1
        console.log(`Adding product ID: ${id} with quantity: ${quantity} and price: $${price}`);
        // Add your logic to handle adding to the cart (e.g., saving to session storage or sending to a server)
        window.location.href = `addtocart.html?id=${id}&quantity=${quantity}&price=${price}&userId=${userId}&login=${token_key}`;
    }
}

async function addtocart() {
    let params = new URLSearchParams(window.location.search);

    let productId = params.get('id');
    let quantity = params.get('quantity');
    let price = params.get('price');
    let userId = params.get('userId');
    let token_key = params.get('login');

    // Parse quantity and ensure it's a valid number
    quantity = parseInt(quantity, 10); // Convert to an integer

    // Validate quantity to ensure it's a positive number, and set default if invalid
    if (!quantity || isNaN(quantity) || quantity <= 0) {
        quantity = 1; // Default to 1 if invalid
    }

    // Limit the quantity to a reasonable value
    quantity = Math.min(quantity, 100); // Set max quantity to 100

    let token = localStorage.getItem(token_key);

    let addToCartData = {
        productId,
        quantity,
        price,
        userId
    };

    try {
        let response = await fetch(`/addtocart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(addToCartData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let parsed_response = await response.json();
        let data = parsed_response.data;

        let cartData = document.getElementById('cartData');

        // Reset cart data before updating the UI to avoid duplication
        cartData.innerHTML = '';

        // Initialize an empty string to hold the HTML for the cart rows
        let cartRows = '';

        // Iterate over the items in the cart data
        for (let i = 0; i < data.cart.items.length; i++) {
            let item = data.cart.items[i];
            let productData = data.cartItemsWithProducts[i];

            // Ensure productData and product exist before accessing properties
            if (productData && productData.product) {
                let product = productData.product;

                // Ensure the product has an images array with at least one image
                let imageUrl = product.images && product.images[0] ? product.images[0].url : 'placeholder.jpg';

                // Create the HTML structure for each item in the cart
                cartRows += `
                    <div class="card p-4">
                        <div class="d-flex gap-5">
                            <div>
                                <img src="${imageUrl}" alt="${product.name}" style="width: 200px; height: 300px;">
                            </div>
                            <div>
                                <div>${product.name}</div>
                                <div>${product.price}</div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                console.warn(`Invalid product data at index ${i}`, productData);
            }
        }

        // Insert the cart rows into the cartData container
        cartData.innerHTML = cartRows;

    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}

async function gotoCart() {
    // Get the URL parameters
    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');

    // Check if 'id' and 'login' token_key exist in the URL and if token is present in localStorage
    if (!id || !token_key) {
        alert('please login to continue');
        window.location = `login.html`
        return;
    }

    // Retrieve token from localStorage
    let token = localStorage.getItem(token_key);

    // Check if token exists in localStorage
    if (!token) {
        alert('User is not authenticated. Please log in again.');
        return;
    }

    // If both id and token are valid, redirect to the cart
    window.location.href = `viewCart.html?id=${id}&login=${token_key}`;
}
async function getCartData() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    let token_key = params.get('login');

    if (!id || !token_key) {
        alert('Missing required parameters: id or login token.');
        return;
    }

    let token = localStorage.getItem(token_key);

    if (!token) {
        alert('User is not authenticated. Please log in again.');
        return;
    }

    try {
        let response = await fetch(`/getCartData/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        let parsed_response = await response.json();

        let cartData = document.getElementById('cartData');
        let emptyCartElement = document.getElementById('emptycart');

        // If there are no items in the cart, show the empty cart message
        if (parsed_response.data && parsed_response.data.length === 0) {
            emptyCartElement.style.display = "block"// Show the empty cart message
            cartData.innerHTML = '';  // Clear the cart data section
        } else {
            emptyCartElement.style.display = "none" // Hide the empty cart message
            let cd_values = '';
            parsed_response.data.forEach((item) => {
                cd_values += `
                    <div class="p-5 card">
                        <div><img src="${item.images[0]?.url || ''}" alt="Product image"></div>
                        <div>${item.name || 'Unknown Product'}</div>
                        <div>${item.brand || 'Unknown Brand'}</div>
                        <div>${item.price || 'N/A'}</div>
                        <div>${item.stock || 'Out of stock'}</div>
                    </div>
                `;
            });
            cartData.innerHTML = cd_values;  // Populate the cart data
        }

    } catch (error) {
        console.error("Error fetching cart data:", error);
        let cartData = document.getElementById('cartData');
        cartData.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p>An error occurred while fetching your cart data. Please try again later.</p>
            </div>
        `;
    }
}


async function getAddedProducts() {
    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');

    try {
        let response = await fetch(`/getAddedProducts/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('response', response);

        let parsed_response = await response.json();
        console.log("parsed_response", parsed_response);

        let data = parsed_response.data;
        console.log("data", data);

        let addedProducts = document.getElementById('addedProducts');

        let addProductsvalues = ''
        for (i = 0; i < data.length; i++) {
            addProductsvalues += `
            <div class="pt-5">
                    <div class="card" style="width: 18rem; height:392.4px;">
                    <img src="${data[i].images[0].url}" class="card-img-top" alt="Product Image" style="width: 286.4px; height:214.8px;">
                    <div class="card-body">
                        <h5 class="card-title">${data[i].name.slice(0, 50)}</h5>
                   
                        <div class="d-flex justify-content-between align-items-center">
                        <span class="text-success font-weight-bold">${data[i].price}</span>
                      
                        </div>
                    </div>
                </div>
            </div>
            `
        }
        addedProducts.innerHTML = addProductsvalues;


    } catch (error) {
        console.log("error", error);
    }
}

async function gotosettings() {
    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');

    if (token_key) {
        window.location.href = `settings.html?id=${id}&login=${token_key}`
    }
}

// Function to load user data when the page loads
async function userDataSettings() {
    const params = new URLSearchParams(window.location.search);
    const token_key = params.get('login');
    const id = params.get('id');

    if (!token_key || !id) {
        console.error("Missing required query parameters: 'login' or 'id'.");
        return;
    }

    const token = localStorage.getItem(token_key);

    if (!token) {
        console.error("Token not found or invalid. Please log in again.");
        return;
    }

    try {
        const response = await fetch(`/user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch user data. Status: ${response.status} - ${response.statusText}`);
            return;
        }

        const parsed_response = await response.json();
        const data = parsed_response.data;
        console.log("data", data);

        // Display user name in the settings container
        const settings_name_container = document.getElementById('settings-name-container');
        if (settings_name_container) {
            settings_name_container.innerHTML = data.name || "Unknown User";
        }

        // Populate the input fields
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');

        if (nameInput) nameInput.value = data.name || '';
        if (emailInput) emailInput.value = data.email || '';
        if (phoneInput) phoneInput.value = data.phone_number || '';

        // Initialize button logic
        initializeEditSaveCancelLogic();
    } catch (error) {
        console.error("An error occurred while fetching user data:", error);
    }
}

// Function to handle the Manage Addresses button click
async function manageAddress() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');

    try {
        let response = await fetch(`/user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        let parsed_response = await response.json();
        console.log("parsed_response", parsed_response);

        let data = parsed_response.data;
        console.log("data", data);

        let addresses = data.Address; // Assuming 'Address' is an array
        console.log('addresses', addresses);

        // Hide the main content and show the manage address content
        document.getElementById('main-content').style.display = "none";
        document.getElementById('manageAdresses').style.display = "block";

        // Display the address data inside the manageAdresses div
        const addressContainer = document.getElementById('address-data');
        addressContainer.innerHTML = ''; // Clear any previous data

        if (addresses.length === 0) {
            // If no addresses are available, display a message
            addressContainer.innerHTML = `
                <div class="no-address-message pt-5">
                    No addresses found for this user.
                </div>
            `;
        } else {
            // Map over the addresses and create HTML for each address
            let address_rows = addresses.map(address => `
              <div class="pt-3">
              <div class="card">
                  <div class="address-item px-3 p-3 ">
                    <div class="d-flex gap-4">
                        <div style="color: black; font-weight: 500; font-size: 14px; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;">${address.name}</div>
                        <div><strong>${data.phone_number}</strong></div>
                    </div>
                    <div>
                        <div>${address.street}, ${address.city}, ${address.state}, ${address.pincode} </div>
                    </div>
                    
                </div>
              </div></div>
            `).join('');

            addressContainer.innerHTML = address_rows;
        }
    } catch (error) {
        console.log("Error fetching user data:", error);
    }
}

function showProfile() {
    // Hide the manage addresses section and show the main content
    document.getElementById('main-content').style.display = "block";
    document.getElementById('manageAdresses').style.display = "none";
}

// Run the userDataSettings function when the page loads
window.addEventListener('DOMContentLoaded', (event) => {
    userDataSettings();
});

function initializeEditSaveCancelLogic() {
    // Function to set up logic for each input section
    function setupField(fieldId) {
        const input = document.getElementById(fieldId);
        const editButton = document.getElementById(`edit-${fieldId}-button`);
        const saveButton = document.getElementById(`save-${fieldId}-button`);
        const cancelButton = document.getElementById(`cancel-${fieldId}-button`);

        let originalValue = input.value; // Store original value for cancel functionality

        let params = new URLSearchParams(window.location.search);

        let id = params.get('id')

        // Toggle between edit and read-only mode
        function toggleEditMode(editMode) {
            const isEditable = !!editMode;

            input.readOnly = !isEditable;
            editButton.style.display = isEditable ? 'none' : 'inline-block';
            saveButton.style.display = isEditable ? 'inline-block' : 'none';
            cancelButton.style.display = isEditable ? 'inline-block' : 'none';

            if (isEditable) {
                originalValue = input.value; // Update original value on edit
                input.focus(); // Focus input for editing
            }
        }

        // Edit Button Logic
        editButton.addEventListener('click', () => toggleEditMode(true));

        // Save Button Logic
        saveButton.addEventListener('click', async () => {
            try {
                const updatedValue = input.value;

                // Prepare the data for updating the user
                const updateData = {};
                updateData[fieldId] = updatedValue;

                // Send PATCH request to update user data
                const response = await fetch(`/updateuser/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateData),
                });

                if (response.ok) {
                    console.log(`${fieldId} updated successfully.`);
                    toggleEditMode(false); // Exit edit mode after saving
                } else {
                    console.error(`Failed to save ${fieldId}. Please try again.`);
                }
            } catch (error) {
                console.error(`An error occurred while saving ${fieldId}:`, error);
            }
        });

        // Cancel Button Logic
        cancelButton.addEventListener('click', () => {
            input.value = originalValue; // Revert to original value
            toggleEditMode(false); // Exit edit mode
        });

        // Start in non-edit mode
        toggleEditMode(false);
    }

    // Set up logic for each field
    setupField('name');
    setupField('email');
    setupField('phone');
}

function closeForm() {
    document.getElementById("address-form").style.display = "none";
    document.getElementById("newaddress").style.display = "block";


}

function checkUserStatus() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    console.log("id", id)

    let profile = document.getElementById('profile');
    let signin = document.getElementById('signin'); 
    if (id === null) {
        profile.style.display = "none"
    } else {
        profile.style.display = 'block'

        signin.style.display = "none"

    }
}






// Run the script after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    userDataSettings(); // Fetch and populate user data
    initializeEditSaveCancelLogic(); // Initialize button logic
});





