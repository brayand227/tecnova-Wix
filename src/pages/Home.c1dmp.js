// pages/home.js
import { getAllCategories } from 'backend/categories.jsw';
import { getAllProducts, searchProducts } from 'backend/products.jsw';
import wixLocation from 'wix-location';

let allProducts = [];

$w.onReady(async () => {
    try {
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
    $w('#categoriesRepeater').data = categories;
    
    $w('#categoriesRepeater').onItemReady(($item, itemData) => {
        $item('#categoryCard').onClick(() => {
            wixLocation.to(`/categoria/${itemData._id}`);
        });
    });
}

async function loadProducts() {
    allProducts = await getAllProducts();
    console.log('Productos cargados:', allProducts);
    $w('#productsRepeater').data = allProducts;
    
    $w('#productsRepeater').onItemReady(($item, itemData) => {
        $item('#productCard').onClick(() => {
            wixLocation.to(`/producto/${itemData._id}`);
        });
    });
}

function setupEventListeners() {
    $w('#searchInput').onKeyPress(async (event) => {
        if (event.key === 'Enter') {
            const term = $w('#searchInput').value;
            const results = await searchProducts(term);
            $w('#productsRepeater').data = results;
        }
    });
    
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
    
    $w('#clearSearch').onClick(async () => {
        $w('#searchInput').value = '';
        $w('#productsRepeater').data = allProducts;
    });
}