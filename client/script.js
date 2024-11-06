//dashboard script

$(document).ready(function() {
    $('#contact_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            first_name: {
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please supply your first name'
                    }
                }
            },
             last_name: {
                validators: {
                     stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please supply your last name'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your email address'
                    },
                    emailAddress: {
                        message: 'Please supply a valid email address'
                    }
                }
            },
            phone: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your phone number'
                    },
                    phone: {
                        country: 'US',
                        message: 'Please supply a vaild phone number with area code'
                    }
                }
            },
            address: {
                validators: {
                     stringLength: {
                        min: 8,
                    },
                    notEmpty: {
                        message: 'Please supply your street address'
                    }
                }
            },
            city: {
                validators: {
                     stringLength: {
                        min: 4,
                    },
                    notEmpty: {
                        message: 'Please supply your city'
                    }
                }
            },
            state: {
                validators: {
                    notEmpty: {
                        message: 'Please select your state'
                    }
                }
            },
            zip: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your zip code'
                    },
                    zipCode: {
                        country: 'US',
                        message: 'Please supply a vaild zip code'
                    }
                }
            },
            comment: {
                validators: {
                      stringLength: {
                        min: 10,
                        max: 200,
                        message:'Please enter at least 10 characters and no more than 200'
                    },
                    notEmpty: {
                        message: 'Please supply a description of your project'
                    }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            $('#success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
                $('#contact_form').data('bootstrapValidator').resetForm();

            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');

            // Use Ajax to submit form data
            $.post($form.attr('action'), $form.serialize(), function(result) {
                console.log(result);
            }, 'json');
        });
});







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
        let response = await fetch('/addProducts', {
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

        window.location.href = `seller.html`;
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

        let deliveryto = document.getElementById('deliveryto');

        let deliveryData = `
        <div>Deliveryto  ${Address.name}
        <div>${Address.street} ${Address.pincode}<div>
        </div>
        `
        deliveryto.innerHTML = deliveryData
    } catch (error) {
        console.log("error", error);
    }
}


function buyerDashboard(){

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login')

   
    window.location.href = `buyerDashboard.html?id=${id}&login=${token_key}`
}

async function addAddress(){
    
}






