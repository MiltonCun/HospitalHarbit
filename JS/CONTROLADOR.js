// Función para cambiar el tipo de identificación en el formulario de ingreso de urgencias
let tipoIdentidadUrgencia = "";

$(document).ready(function() {
    $("#tipoIdentificacionUrgencias").change(function() {
        tipoIdentidadUrgencia = $(this).val();
    });
});

// Función para cambiar el tipo de identificación en el formulario de ingreso de consulta médica
let tipoIdentidadMedica = "";

$(document).ready(function() {
    $("#tipoIdentificacionPaciente").change(function() {
        tipoIdentidadMedica = $(this).val();
    });
});

// Función para cambiar el nivel de urgencia en el formulario de ingreso de urgencias
let niveldeurgencia = "";

$(document).ready(function() {
    $("#selectNiveldeUrgencia").change(function() {
        niveldeurgencia = $(this).find("option:selected").text();
        $("#NiveldeUrgencia").text(niveldeurgencia);
    });
});

// Función para cambiar el tipo de cama en el formulario de ingreso de urgencias
let TipodeCama = "";

$(document).ready(function() {
    $("#selectTipodeCama").change(function() {
        TipodeCama = $(this).find("option:selected").text();
        $("#TipodeCama").text(TipodeCama);
    });
});


let Prioridad = "";

$(document).ready(function() {
    $("#selectPrioridad").change(function() {
        Prioridad = $(this).find("option:selected").text();
        $("#Prioridad").text(Prioridad);
    });
});


function entradaUrgencias() {
    let nombreUrgencias = $("#nombresUrgencias").val();
    let apellidoUrgencias = $("#apellidosUrgencias").val();
    let numerodocumentoUrgencias = $("#numeroIdentificacionUrgencias").val();

    let nombreApellidoUrgencias = nombreUrgencias + " " + apellidoUrgencias;
    let identidaddelyamuerto = tipoIdentidadUrgencia + " " + numerodocumentoUrgencias;

    $("#nombredelmuerto").text(nombreApellidoUrgencias);        
    $("#IDdelmuerto").text(tipoIdentidadUrgencia);
    $("#IDdelmuerto").text(identidaddelyamuerto);    
}

function entradaConsultaMedica() {
    let nombrePaciente = $("#nombresPaciente").val();
    let apellidoPaciente = $("#apellidosPaciente").val();
    let numerodocumentoPaciente = $("#numeroIdentificacionPaciente").val();

    let nombreApellidoPaciente = nombrePaciente + " " + apellidoPaciente;
    let identidaddelyamuerto = tipoIdentidadMedica + " " + numerodocumentoPaciente;

    $("#nombredelmuerto").text(nombreApellidoPaciente);        
    $("#IDdelmuerto").text(tipoIdentidadMedica);
    $("#IDdelmuerto").text(identidaddelyamuerto);
}

