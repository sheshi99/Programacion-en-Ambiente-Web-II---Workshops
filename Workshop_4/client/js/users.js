async function saveUser() {

    const userData = {
        name: document.getElementById("name").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch("http://localhost:3001/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        alert("Usuario creado correctamente");
        console.log(data);

    } catch (error) {
        console.error("Error:", error);
    }
}