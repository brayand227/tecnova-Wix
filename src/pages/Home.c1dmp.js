// pages/home.js
import { getAllCategories } from 'backend/categories.jsw';
import { getAllProducts, searchProducts } from 'backend/products.jsw';
import wixLocation from 'wix-location';

let allProducts = [];

$w.onReady(async () => {
    await loadCategories();
    await loadProducts();
    setupEventListeners();
});

async function loadCategories() {
    const categories = await getAllCategories();
    $w('#categoriesRepeater').data = categories;
    
    // Configurar clic en cada categoría
    $w('#categoriesRepeater').onItemReady(($item, itemData) => {
        $item('#categoryCard').onClick(() => {
            wixLocation.to(`/categoria/${itemData._id}`);
        });
    });
}

async function loadProducts() {
    allProducts = await getAllProducts();
    $w('#productsRepeater').data = allProducts;
    
    // Hacer los productos clickeables
    $w('#productsRepeater').onItemReady(($item, itemData) => {
        $item('#productCard').onClick(() => {
            wixLocation.to(`/producto/${itemData._id}`);
        });
    });
}

function setupEventListeners() {
    // Buscador
    $w('#searchInput').onKeyPress(async (event) => {
        if (event.key === 'Enter') {
            const term = $w('#searchInput').value;
            const results = await searchProducts(term);
            $w('#productsRepeater').data = results;
        }
    });
    
    // Ordenar
    $w('#orderSelect').onChange(() => {
        const order = $w('#orderSelect').value;
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
    
    // Limpiar búsqueda
    $w('#clearSearch').onClick(async () => {
        $w('#searchInput').value = '';
        $w('#productsRepeater').data = allProducts;
    });
}