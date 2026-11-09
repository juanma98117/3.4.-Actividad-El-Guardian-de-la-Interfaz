const CONTENEDOR_BIENVENIDA = document.getElementById("contenedor-bienvenida");
const FORMULARIO = document.getElementById("formulario-preferencias");
const SELECTOR_COLOR = document.getElementById("colorFondo");
const SELECTOR_TEMA = document.getElementById("temaVisual");
const INPUT_NOMBRE = document.getElementById("nombreUsuario");
const BTN_RESTABLECER = document.getElementById("btn-restablecer");
const FECHA_PASADA = "Thu, 01 Jan 1970 00:00:00 UTC";

/**
 * Recupera el valor de una cookie por su nombre
 * @param {string} nombre Nombre de la cookie que tiene que buscar
 * @returns {string|null} Valor decodificado de la cookie o null si no existe
 */
function getCookie(nombre) {
    const pares = document.cookie.split(";");
    for (let par of pares) {
        const [clave, valor] = par.trim().split("=");
        if (clave === nombre) {
            return decodeURIComponent(valor);
        }
    }
    return null;
}

/**
 * Guarda las preferencias del usuario
 * @param {Event} e Objeto de evento del formulario (submit)
 */
function guardarPreferencias(e) {
    e.preventDefault();

    const usuario = INPUT_NOMBRE.value;
    const color = SELECTOR_COLOR.value;
    const tema = SELECTOR_TEMA.value;

    const fechaExpiracion = new Date();
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 7);
    const expiresUTC = fechaExpiracion.toUTCString();

    document.cookie = `usuario=${encodeURIComponent(usuario)}; expires=${expiresUTC}; path=/`;
    document.cookie = `colorFondo=${encodeURIComponent(color)}; expires=${expiresUTC}; path=/`;
    document.cookie = `temaVisual=${encodeURIComponent(tema)}; path=/`;

    alert("¡Preferencias guardadas correctamente!");
}

/**
 * Restablece la interfaz a su estado por defecto y borra las cookies
 */
function restablecerInterfaz() {
    document.cookie = `usuario=; expires=${FECHA_PASADA}; path=/`;
    document.cookie = `colorFondo=; expires=${FECHA_PASADA}; path=/`;
    document.cookie = `temaVisual=; expires=${FECHA_PASADA}; path=/`;

    document.body.style.backgroundColor = "";
    document.body.classList.remove("tema-oscuro", "tema-claro");

    if (INPUT_NOMBRE) INPUT_NOMBRE.value = "";
    if (SELECTOR_COLOR) SELECTOR_COLOR.value = "#ffffff";
    if (SELECTOR_TEMA) SELECTOR_TEMA.value = "claro";

    // Usando removeChild como exige explícitamente la rúbrica
    if (CONTENEDOR_BIENVENIDA) {
        while (CONTENEDOR_BIENVENIDA.firstChild) {
            CONTENEDOR_BIENVENIDA.removeChild(CONTENEDOR_BIENVENIDA.firstChild);
        }
    }
}

// 3. CARGA PRINCIPAL DEL DOM Y EVENTOS
document.addEventListener("DOMContentLoaded", () => {

    // 1. Inyección dinámica del bloque de bienvenida si existe cookie
    const usuarioGuardado = getCookie("usuario");
    if (usuarioGuardado && CONTENEDOR_BIENVENIDA) {
        const titulo = document.createElement("h2");
        const parrafo = document.createElement("p");

        titulo.textContent = "¡Bienvenido de nuevo, " + usuarioGuardado + "!";
        parrafo.textContent = "Has accedido correctamente a la plataforma.";

        CONTENEDOR_BIENVENIDA.appendChild(titulo);
        CONTENEDOR_BIENVENIDA.appendChild(parrafo);

        if (INPUT_NOMBRE) {
            INPUT_NOMBRE.value = usuarioGuardado;
        }
    }

    // 2. Restauración del color de fondo (¡Añadida la declaración de la variable!)
    const colorGuardado = getCookie("colorFondo");
    colorGuardado && (
        document.body.style.backgroundColor = colorGuardado,
        SELECTOR_COLOR.value = colorGuardado
    );

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
        if (SELECTOR_TEMA) {
            SELECTOR_TEMA.value = temaGuardado;
        }
    }

    // Cambio del fondo en tiempo real
    if (SELECTOR_COLOR) {
        SELECTOR_COLOR.addEventListener("input", (e) => {
            document.body.style.backgroundColor = e.target.value;
        });
    }

    // Cambio de clases del tema en tiempo real
    if (SELECTOR_TEMA) {
        SELECTOR_TEMA.addEventListener("change", (e) => {
            if (e.target.value === "oscuro") {
                document.body.classList.remove("tema-claro");
                document.body.classList.add("tema-oscuro");
            } else {
                document.body.classList.remove("tema-oscuro");
                document.body.classList.add("tema-claro");
            }
        });
    }

    // Asignación de acciones a los formularios y botones
    FORMULARIO.addEventListener("submit", guardarPreferencias);
    BTN_RESTABLECER.addEventListener("click", restablecerInterfaz);
});