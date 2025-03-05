$(document).ready(function() {
    // Expandir / Contraer Navbar
    $("#toggle-btn").click(function() {
        if ($(window).width() <= 767.98) { // Solo para pantallas pequeñas
            $("#sidebar").toggleClass("open");
        } else { // Para pantallas más grandes
            $("#sidebar").toggleClass("collapsed");
            $("#main-content").toggleClass("collapsed");
        }
    });

    // Cerrar la sidebar al hacer clic fuera de ella en pantallas pequeñas
    $(document).click(function(event) {
        if ($(window).width() <= 767.98) {
            if (!$(event.target).closest("#sidebar").length && !$(event.target).is("#toggle-btn")) {
                $("#sidebar").removeClass("open");
            }
        }
    });
});

$("#contenedorInicio").show();

// Mostrar contenedores pagina inicio 1
$("#inicio").click(function() {
    $("#contenedorInicio").show();
    $("#contenedorNotrotros").hide();
    $("#contenedorSedes").hide();
});

$("#notrotros").click(function() {
    $("#contenedorNotrotros").show();
    $("#contenedorInicio").hide();
    $("#contenedorSedes").hide();
});

$("#sedes").click(function() {
    $("#contenedorSedes").show();
    $("#contenedorInicio").hide();
    $("#contenedorNotrotros").hide();
});


$("#contenedorInicioF").show();
// Mostrar contenedores pagina inicio 2
$("#urgencias").click(function() {
    $("#contenedorUrgencias").show();
    $("#contenedorConsulta").hide();
    $("#contenedorFarmacia").hide();
    $("#contenedorInicioF").hide();
    $("#contenedorAsignarCama").hide();
    $("#ConfirmacionCama").hide();
});

$("#consulta").click(function() {
    $("#contenedorConsulta").show();
    $("#contenedorUrgencias").hide();
    $("#contenedorFarmacia").hide();
    $("#contenedorInicioF").hide();
    $("#contenedorAsignarCama").hide();
    $("#ConfirmacionCama").hide();
});

$("#farmacia").click(function() {
    $("#contenedorFarmacia").show();
    $("#contenedorUrgencias").hide();
    $("#contenedorConsulta").hide();
    $("#contenedorInicioF").hide();
    $("#contenedorAsignarCama").hide();
    $("#ConfirmacionCama").hide();
});

function ConsultaCama(valor) {
    $("#contenedorAsignarCama").show();
    $("#contenedorUrgencias, #contenedorFarmacia, #contenedorConsulta, #contenedorInicioF").hide();

    if (valor == '1') {
        entradaConsultaMedica();

    } else {
        entradaUrgencias();
    }

}

function ConfirmacionCama() {
    $("#ConfirmacionCama").show();
    $("#contenedorUrgencias, #contenedorFarmacia, #contenedorConsulta, #contenedorInicioF, #contenedorAsignarCama").hide();
}
