const API_URL = "https://p2-crear-una-api.onrender.com/api/productos";
const API_KEY = "llave_api_123";

const mensaje = document.getElementById("mensaje");
const resultados = document.getElementById("resultados");

async function listar(){
    mensaje.textContent = "Cargando productos...";
    try{
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error( `codigo ${respuesta.status}`);
        const productos = await respuesta.json();
        resultados.innerHTML = productos.map(p=> `
            <article class="tajeta">
                <h2>${p.nombre}</h2>
                <p>Precio: $${p.precio} . Stock: ${p.stock}</p>
                <button data-id="${p.id}"> Eliminar </button>
            </article>
        `).join("");
        mensaje.textContent = `${productos.length} productos cargados`;
    }catch (error){
        mensaje.textContent = "No se pudo conectar con la API: "+error.message;
    }
}

async function peticionProtegida(url, metodo, datos){
    const respuesta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: datos ? JSON.stringify(datos) : undefined
    });
    if (!respuesta.ok){
        const error = await respuesta.json();
        throw new Error(error.errores ? error.errores.join(", ") : `codigo ${respuesta.status}`);
    }
}

document.getElementById("formProducto").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const datos = {
        nombre: document.getElementById("txtNombre").value.trim(),
        precio: Number(document.getElementById("txtPrecio").value),
        stock: parseInt(document.getElementById("txtStock").value)
    };
    try{
        await peticionProtegida(API_URL, "POST", datos);
        e.target.reset();
        listar();
    }catch (error){
        mensaje.textContent = "Error al agregar producto: " + error.message;
    }
});

resultados.addEventListener("click", async (e)=>{
    if (e.target.tagName !== "BUTTON") return;
    try{
        await peticionProtegida(`${API_URL}/${e.target.dataset.id}`, "DELETE");
        listar();
    }
    catch (error){
        mensaje.textContent = "Error al eliminar producto: " + error.message;
    }
});

listar();
