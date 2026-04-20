import wixData from 'wix-data';

let todasLasCategorias = [];
let todosLosProductos = [];

$w.onReady(function () {

    // =========================
    // CARGAR CATEGORÍAS
    // =========================
    wixData.query("Categorias")
        .ascending("orden")
        .find()
        .then((results) => {
            todasLasCategorias = results.items;

            $w("#repeaterCategorias").data = todasLasCategorias;

            // IMPORTANTE: renderizar cada item
            $w("#repeaterCategorias").onItemReady(($item, itemData) => {
                $item("#txtCategoria").text = itemData.nombre;

                // Evento click categoría
                $item("#txtCategoria").onClick(() => {
                    filtrarPorCategoria(itemData._id);
                });
            });
        });

    // =========================
    // CARGAR PRODUCTOS
    // =========================
    cargarProductos();

    // =========================
    // EVENTOS
    // =========================

    $w("#btnBuscar").onClick(() => {
        const termino = ($w("#inputBusqueda").value || "").toLowerCase();
        buscarProductos(termino);
    });

    $w("#dropdownOrden").onChange(() => {
        const criterio = $w("#dropdownOrden").value;
        ordenarProductos(criterio);
    });

    $w("#inputBusqueda").onKeyPress((event) => {
        if (event.key === "Enter") {
            buscarProductos(($w("#inputBusqueda").value || "").toLowerCase());
        }
    });
});

// =========================
// CARGAR PRODUCTOS
// =========================
function cargarProductos() {
    wixData.query("Productos")
        .find()
        .then((results) => {
            todosLosProductos = results.items;

            renderProductos(todosLosProductos);
        });
}

// =========================
// RENDERIZAR PRODUCTOS
// =========================
function renderProductos(productos) {

    $w("#repeaterProductos").data = productos;

    $w("#repeaterProductos").onItemReady(($item, itemData) => {
        $item("#txtNombre").text = itemData.nombre;
        $item("#txtPrecio").text = `$${itemData.precio}`;

        if (itemData.imagen) {
            $item("#imgProducto").src = itemData.imagen;
        }
    });
}

// =========================
// BUSCAR PRODUCTOS
// =========================
function buscarProductos(termino) {

    if (!termino) {
        renderProductos(todosLosProductos);
        return;
    }

    const filtrados = todosLosProductos.filter(producto =>
        (producto.nombre && producto.nombre.toLowerCase().includes(termino)) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(termino))
    );

    renderProductos(filtrados);
}

// =========================
// ORDENAR PRODUCTOS
// =========================
function ordenarProductos(criterio) {

    let productosOrdenados = [...$w("#repeaterProductos").data];

    switch (criterio) {
        case "precio_asc":
            productosOrdenados.sort((a, b) => (a.precio || 0) - (b.precio || 0));
            break;

        case "precio_desc":
            productosOrdenados.sort((a, b) => (b.precio || 0) - (a.precio || 0));
            break;

        default:
            productosOrdenados.sort((a, b) =>
                (a.nombre || "").localeCompare(b.nombre || "")
            );
    }

    renderProductos(productosOrdenados);
}

// =========================
// FILTRAR POR CATEGORÍA
// =========================
function filtrarPorCategoria(categoriaId) {

    const filtrados = todosLosProductos.filter(producto =>
        producto.categoria === categoriaId
    );

    renderProductos(filtrados);
}