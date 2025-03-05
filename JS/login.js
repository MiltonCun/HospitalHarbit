function validarLogin() {
    let usuario = "Coddy"
    let contrasena = "password"

    const username = $('#username').val();
    const password = $('#password').val();

    // Validación básica
    if (username.trim() === '' || password.trim() === '') {
        alert('Por favor, complete todos los campos.');
        return;
    }
    
    if (username == usuario && password == contrasena) {
        window.location.href = "inicioF.html" ;
        //$("#contenedorInicioF").show();
    }
    else {
        alert('Usuario o contraseña incorrectos');
    } 
}
