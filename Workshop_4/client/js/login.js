const apiBaseUrl = 'http://localhost:3001';

async function iniciarSesion() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!email || !password) {
        alert('Complete todos los campos correctamente');
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            // Enviar solo correo y contraseña para autenticación
            body: JSON.stringify({ email: email, password: password })
        });

        if (response.status === 201) {
            // Obtener el token del servidor
            const data = await response.json();
            // Guardar el token en sessionStorage
            sessionStorage.setItem('token', data.token);
            alert("Inicio de sesión exitoso ✅");
            location.href = '../index.html';
        }
        else if (response.status === 401) {
            alert("Credenciales inválidas ❌");
        }
    } catch (error) {
        alert("No se pudo conectar al servidor");
    }
}