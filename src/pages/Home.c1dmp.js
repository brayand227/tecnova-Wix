// pages/home.js
import { getAllCategories } from 'backend/categories.jsw';
import { getAllProducts, searchProducts } from 'backend/products.jsw';
import wixLocation from 'wix-location';

let allProducts = [];

$w.onReady(async () => {
    console.log('=== INICIANDO HOME ===');
    
    // Reemplaza 'TU_ID_REPEATER_CATEGORIAS' con el ID real de tu repeater de categorías
    // Reemplaza 'TU_ID_REPEATER_PRODUCTOS' con el ID real de tu repeater de productos
    
    const categoriesRepeaterId = 'categoriesRepeater'; // 👈 CAMBIA ESTO POR EL ID REAL
    const productsRepeaterId = 'productsRepeater';   // 👈 CAMBIA ESTO POR EL ID REAL
    
    // Verificar que los elementos existen
    console.log('Buscando repeater:', categoriesRepeaterId);
    console.log('Existe?', $w(categoriesRepeaterId).length);
    
    try {
        await loadCategories(categoriesRepeaterId);
        await loadProducts(productsRepeaterId);
        setupEventListeners(productsRepeaterId);
    } catch (error) {
        console.error('Error al cargar la página:', error);
    }
});

async function loadCategories(repeaterId) {
    const categories = await getAllCategories();
    console.log('Categorías cargadas:', categories.length);
    
    const repeater = $w(repeaterId);
    if (repeater.length === 0) {
        console.error(`No se encontró el repeater con ID: ${repeaterId}`);
        return;
    }
    
    repeater.data = categories;
    
    // Hacer clickeable cada ítem del repeater
    repeater.onItemReady(($item, itemData) => {
        // Hacer que toda la fila sea clickeable
        $item.onClick(() => {
            wixLocation.to(`/categoria/${itemData._id}`);
        });
    });
}

async function loadProducts(repeaterId) {
    allProducts = await getAllProducts();
    console.log('Productos cargados:', allProducts.length);
    
    const repeater = $w(repeaterId);
    if (repeater.length === 0) {
        console.error(`No se encontró el repeater con ID: ${repeaterId}`);
        return;
    }
    
    repeater.data = allProducts;
    
    repeater.onItemReady(($item, itemData) => {
        $item.onClick(() => {
            wixLocation.to(`/producto/${itemData._id}`);
        });
    });
}

function setupEventListeners(productsRepeaterId) {
    // Buscador
    const searchInput = $w('#searchInput');
    if (searchInput.length > 0) {
        searchInput.onKeyPress(async (event) => {
            if (event.key === 'Enter') {
                const term = searchInput.value;
                const results = await searchProducts(term);
                $w(productsRepeaterId).data = results;
            }
        });
    }
    
    // Ordenar
    const orderSelect = $w('#orderSelect');
    if (orderSelect.length > 0) {
        orderSelect.onChange(() => {
            const order = orderSelect.value;
            let sorted = [...$w(productsRepeaterId).data];
            
            if (order === 'price-asc') {
                sorted.sort((a, b) => a.precio - b.precio);
            } else if (order === 'price-desc') {
                sorted.sort((a, b) => b.precio - a.precio);
            } else {
                sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
            }
            
            $w(productsRepeaterId).data = sorted;
        });
    }
    
    // Limpiar búsqueda
    const clearBtn = $w('#clearSearch');
    if (clearBtn.length > 0) {
        clearBtn.onClick(async () => {
            $w('#searchInput').value = '';
            $w(productsRepeaterId).data = allProducts;
        });
    }
}