

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

            for( i = 0; i< data.length-1; i++){
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

        if(parsed_response.statusCode === 400){
            alert(parsed_response.message);
        }
        else{
            alert(parsed_response.message)
        }

    } catch (error) {
        console.error('Error:', error);
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
                    window.location.href = `buyer.html?login=${token_key}&id=${id}`;
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
