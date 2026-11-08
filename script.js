
/**
 * Recupera el valor de una cookie específica por su nombre
 * @param {string} nombre - Nombre de la cookie que tiene que buscar
 * @returns {string|null} Valor decodificado de la cookie o null si no existe
 */
function getCookie(nombre) {
    const pares = document.cookie.split("; ");
    for (let par of pares) {
        const [clave, valor] = par.split("=");
        if (clave === nombre) {
            return decodeURIComponent(valor);
        }
    }
    return null;
}

/**
 * Guarda las preferencias en 3 cookies diferenciadas
 * @param {Event} e - Evento submit del formulario
 */
function guardarPreferencias(e) {
    e.preventDefault();

    const usuario = document.getElementById("nombreUsuario").value;
    const color = document.getElementById("colorFondo").value;
    const tema = document.getElementById("temaVisual").value;

    // Cálculo exacto de 7 días usando el objeto Date
    const fechaExpiracion = new Date();
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 7);
    const expiresUTC = fechaExpiracion.toUTCString();

    // Cookies persistentes con fecha de expiración a 7 días
    document.cookie = `usuario=${encodeURIComponent(usuario)}; expires=${expiresUTC}; path=/`;
    document.cookie = `colorFondo=${encodeURIComponent(color)}; expires=${expiresUTC}; path=/`;

    // Cookie de sesión
    document.cookie = `temaVisual=${encodeURIComponent(tema)}; path=/`;

    alert("¡Preferencias guardadas correctamente!");
}

/**
 * Restablece la interfaz a su estado por defecto y borra las cookies
 */
function restablecerInterfaz() {
    // 1. Eliminar cookies configurando su caducidad en el pasado
    const fechaPasada = "Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = `usuario=; expires=${fechaPasada}; path=/`;
    document.cookie = `colorFondo=; expires=${fechaPasada}; path=/`;
    document.cookie = `temaVisual=; expires=${fechaPasada}; path=/`;

    // 2. Limpiar estilos en línea y clases CSS
    document.body.style.backgroundColor = "";
    document.body.classList.remove("tema-oscuro", "tema-claro");

    // Reajustar controles del formulario
    const inputNombre = document.getElementById("nombreUsuario");
    const selectorColor = document.getElementById("colorFondo");
    const selectorTema = document.getElementById("temaVisual");

    if (inputNombre) inputNombre.value = "";
    if (selectorColor) selectorColor.value = "#ffffff";
    if (selectorTema) selectorTema.value = "claro";

    // 3. Eliminar del DOM el bloque de bienvenida usando removeChild
    const contenedor = document.getElementById("contenedor-bienvenida");
    if (contenedor) {
        while (contenedor.firstChild) {
            contenedor.removeChild(contenedor.firstChild);
        }
    }
}

// Carga principal del DOM 
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-bienvenida");
    const formulario = document.getElementById("formulario-preferencias");
    const selectorColor = document.getElementById("colorFondo");
    const selectorTema = document.getElementById("temaVisual");
    const inputNombre = document.getElementById("nombreUsuario");
    const btnRestablecer = document.getElementById("btn-restablecer");


    // 1. Inyección dinámica del bloque de bienvenida si existe cookie
    const usuarioGuardado = getCookie("usuario");
    if (usuarioGuardado && contenedor) {
        const titulo = document.createElement("h2");
        const parrafo = document.createElement("p");

        titulo.textContent = "¡Bienvenido de nuevo, " + usuarioGuardado + "!";
        parrafo.textContent = "Has accedido correctamente a la plataforma.";

        contenedor.appendChild(titulo);
        contenedor.appendChild(parrafo);

        if (inputNombre) {
            inputNombre.value = usuarioGuardado;
        }
    }

    // 2. Restauración del color de fondo
    const colorGuardado = getCookie("colorFondo");
    if (colorGuardado) {
        document.body.style.backgroundColor = colorGuardado;
        if (selectorColor) {
            selectorColor.value = colorGuardado;
        }
    }

    // 3. Restauración del tema
    const temaGuardado = getCookie("temaVisual");
    if (temaGuardado) {
        if (temaGuardado === "oscuro") {
            document.body.classList.remove("tema-claro");
            document.body.classList.add("tema-oscuro");
        } else {
            document.body.classList.remove("tema-oscuro");
            document.body.classList.add("tema-claro");
        }
        if (selectorTema) {
            selectorTema.value = temaGuardado;
        }
    }

    // Cambio instantáneo del fondo
    if (selectorColor) {
        selectorColor.addEventListener("input", (e) => {
            document.body.style.backgroundColor = e.target.value;
        });
    }

    // Cambio de clases
    if (selectorTema) {
        selectorTema.addEventListener("change", (e) => {
            if (e.target.value === "oscuro") {
                document.body.classList.remove("tema-claro");
                document.body.classList.add("tema-oscuro");
            } else {
                document.body.classList.remove("tema-oscuro");
                document.body.classList.add("tema-claro");
            }
        });
    }

    // Asignación de acciones a los botones
    if (formulario) {
        formulario.addEventListener("submit", guardarPreferencias);
    }

    if (btnRestablecer) {
        btnRestablecer.addEventListener("click", restablecerInterfaz);
    }
});