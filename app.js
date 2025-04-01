let productos = JSON.parse(localStorage.getItem("productos")) || [];
let productoEditando = null; // Índice del producto en edición (null si no hay edición)

// Referencias del DOM
const productosAdmin = document.getElementById("productos-admin");
const formAgregar = document.getElementById("form-agregar");
const nombreInput = document.getElementById("nombre");
const categoriaInput = document.getElementById("categoria");
const precioInput = document.getElementById("precio");
const tallasInput = document.getElementById("tallas");
const coloresInput = document.getElementById("colores");
const imagenInput = document.getElementById("imagen");
const botonSubmit = formAgregar.querySelector("button[type='submit']");

// Guardar productos en localStorage
function guardarProductos() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Convertir imagen a Base64
function convertirImagenBase64(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
}




function eliminarProducto(index) {
    console.log("Intentando eliminar producto", index); // Verifica si la función se está ejecutando
    const confirmar = confirm("¿Estás seguro de que quieres eliminar este producto?");
    
    if (confirmar) {
        productos.splice(index, 1);
        guardarProductos();
        actualizarAdmin();
    }
}


// Función para actualizar la lista de productos en el panel de administración
function actualizarAdmin() {
    productosAdmin.innerHTML = ''; 

    const categorias = ["Ropa", "Accesorios", "Interiores"];
    
    categorias.forEach(categoria => {
        const productosCategoria = productos.filter(p => p.categoria === categoria);
        
        if (productosCategoria.length > 0) {
            const categoriaDiv = document.createElement("div");
            categoriaDiv.classList.add("mb-6");
            categoriaDiv.innerHTML = `<h2 class="text-xl font-bold text-gray-800 mb-3">Productos en ${categoria}</h2>`;

            const gridContainer = document.createElement("div");
            gridContainer.classList.add("grid", "grid-cols-2", "sm:grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4", "gap-3", "sm:gap-4", "md:gap-6", "justify-center", "p-4");

            productosCategoria.forEach((producto, index) => {
                const productoDiv = document.createElement("div");
                productoDiv.classList.add("bg-white", "rounded-xl", "shadow-lg", "overflow-hidden", "flex", "flex-col", "p-3", "transition-transform", "duration-300", "hover:scale-105", "w-full", "max-w-[220px]", "mx-auto");
                
                productoDiv.innerHTML = `
                    <!-- Imagen -->
                    <div class="w-full aspect-square bg-gray-200 flex justify-center items-center rounded-md overflow-hidden">
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-full object-cover">
                    </div>

                    <!-- Contenido del producto -->
                    <div class="text-center mt-2">
                        <h3 class="text-sm font-semibold text-gray-800 truncate">${producto.nombre}</h3>
                        <p class="text-gray-500 text-xs mt-1">Precio: $${producto.precio}</p>
                    </div>

                    <!-- Tallas y colores -->
                    <div class="mt-2 text-xs">
                        <p class="text-gray-600">Tallas: ${producto.tallas.length ? producto.tallas.join(', ') : 'No especificado'}</p>
                        <p class="text-gray-600">Colores: ${producto.colores.length ? producto.colores.join(', ') : 'No especificado'}</p>
                    </div>

                    <!-- Botones de acción -->
                    <div class="mt-3 flex justify-between">
                        <button onclick="editarProducto(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Editar</button>
                        <button onclick="eliminarProducto(${index})" class="bg-red-500 text-white px-2 py-1 rounded text-xs">Eliminar</button>
                    </div>
                `;
                gridContainer.appendChild(productoDiv);
            });

            categoriaDiv.appendChild(gridContainer);
            productosAdmin.appendChild(categoriaDiv);
        }
    });
}

// Función para manejar el formulario (agregar o editar)
formAgregar.addEventListener("submit", (e) => {
    e.preventDefault();

    if (productoEditando === null) {
        // Agregar un nuevo producto
        if (imagenInput.files.length === 0) {
            alert("Debes seleccionar una imagen");
            return;
        }

        convertirImagenBase64(imagenInput.files[0], (imagenBase64) => {
            const nuevoProducto = {
                nombre: nombreInput.value,
                categoria: categoriaInput.value,
                precio: parseFloat(precioInput.value),
                tallas: tallasInput.value ? tallasInput.value.split(',').map(t => t.trim()) : [],
                colores: coloresInput.value ? coloresInput.value.split(',').map(c => c.trim()) : [],
                imagen: imagenBase64
            };

            productos.push(nuevoProducto);
            guardarProductos();
            actualizarAdmin();
            formAgregar.reset();
        });

    } else {
        // Editar producto existente
        let productoActualizado = {
            nombre: nombreInput.value,
            categoria: categoriaInput.value,
            precio: parseFloat(precioInput.value),
            tallas: tallasInput.value ? tallasInput.value.split(',').map(t => t.trim()) : [],
            colores: coloresInput.value ? coloresInput.value.split(',').map(c => c.trim()) : [],
            imagen: productos[productoEditando].imagen // Mantiene la imagen actual por defecto
        };

        if (imagenInput.files.length > 0) {
            // Si se seleccionó una nueva imagen, convertirla y luego actualizar
            convertirImagenBase64(imagenInput.files[0], (imagenBase64) => {
                productoActualizado.imagen = imagenBase64;
                productos[productoEditando] = productoActualizado;
                guardarProductos();
                actualizarAdmin();
                formAgregar.reset();
                productoEditando = null;
                botonSubmit.textContent = "Agregar Producto";
            });
        } else {
            // Si no se cambió la imagen, actualizar los datos directamente
            productos[productoEditando] = productoActualizado;
            guardarProductos();
            actualizarAdmin();
            formAgregar.reset();
            productoEditando = null;
            botonSubmit.textContent = "Agregar Producto";
        }
    }
});

// Función para cargar datos en el formulario al editar
function editarProducto(index) {
    const producto = productos[index];
    productoEditando = index;

    nombreInput.value = producto.nombre;
    categoriaInput.value = producto.categoria;
    precioInput.value = producto.precio;
    tallasInput.value = producto.tallas.join(', ');
    coloresInput.value = producto.colores.join(', ');

    botonSubmit.textContent = "Guardar Cambios";
}

// Función para eliminar un producto
function eliminarProducto(index) {
    productos.splice(index, 1);
    guardarProductos();
    actualizarAdmin();
}

// Cargar productos al iniciar
actualizarAdmin();
