// pages/home.js
import { getAllCategories } from 'backend/categories.jsw';
import { getAllProducts, searchProducts } from 'backend/products.jsw';
import wixLocation from 'wix-location';

let allProducts = [];

$w.onReady(async () => {
    try {
        // Verificar que los elementos existen
        console.log('Verificando elementos:');
        console.log('categoriesRepeater existe:', $w('#categoriesRepeater').length > 0);
        console.log('productsRepeater existe:', $w('#productsRepeater').length > 0);
        
        await loadCategories();
        await loadProducts();
        setupEventListeners();
    } catch (error) {
        console.error('Error al cargar la página:', error);
    }
});

async function loadCategories() {
    const categories = await getAllCategories();
    console.log('Categorías cargadas:', categories);
    
    const repeater = $w('#categoriesRepeater');
    if (repeater.length === 0) {
        console.error('No se encontró el repeater de categorías con ID: categoriesRepeater');
        return;
    }
    
    repeater.data = categories;
    
    // Configurar clic en cada categoría
    repeater.onItemReady(($item, itemData) => {
        // Asegúrate de que el elemento dentro del repeater tenga ID 'categoryCard'
        const card = $item('#categoryCard');
        if (card.length > 0) {
            card.onClick(() => {
                wixLocation.to(`/categoria/${itemData._id}`);
            });
        } else {
            // Si no hay un elemento específico, hacer click en toda la fila del repeater
            $item.onClick(() => {
                wixLocation.to(`/categoria/${itemData._id}`);
            });
        }
    });
}

async function loadProducts() {
    allProducts = await getAllProducts();
    console.log('Productos cargados:', allProducts);
    
    const repeater = $w('#productsRepeater');
    if (repeater.length === 0) {
        console.error('No se encontró el repeater de productos con ID: productsRepeater');
        return;
    }
    
    repeater.data = allProducts;
    
    repeater.onItemReady(($item, itemData) => {
        const card = $item('#productCard');
        if (card.length > 0) {
            card.onClick(() => {
                wixLocation.to(`/producto/${itemData._id}`);
            });
        } else {
            $item.onClick(() => {
                wixLocation.to(`/producto/${itemData._id}`);
            });
        }
    });
}

function setupEventListeners() {
    // Buscador
    const searchInput = $w('#searchInput');
    if (searchInput.length > 0) {
        searchInput.onKeyPress(async (event) => {
            if (event.key === 'Enter') {
                const term = searchInput.value;
                const results = await searchProducts(term);
                $w('#productsRepeater').data = results;
            }
        });
    }
    
    // Ordenar
    const orderSelect = $w('#orderSelect');
    if (orderSelect.length > 0) {
        orderSelect.onChange(() => {
            const order = orderSelect.value;
            let sorted = [...$w('#productsRepeater').data];
            
            if (order === 'price-asc') {
                sorted.sort((a, b) => a.precio - b.precio);
            } else if (order === 'price-desc') {
                sorted.sort((a, b) => b.precio - a.precio);
            } else {
                sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
            }
            
            $w('#productsRepeater').data = sorted;
        });
    }
    
    // Limpiar búsqueda
    const clearBtn = $w('#clearSearch');
    if (clearBtn.length > 0) {
        clearBtn.onClick(async () => {
            $w('#searchInput').value = '';
            $w('#productsRepeater').data = allProducts;
        });
    }
}