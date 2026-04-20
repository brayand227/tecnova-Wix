// pages/admin/dashboard.js
import { getAllCategories, deleteCategory } from 'backend/categories.jsw';
import { getAllProducts, deleteProduct } from 'backend/products.jsw';
import { isAdmin } from 'backend/auth.jsw';
import wixLocation from 'wix-location';

let isAdminUser = false;

$w.onReady(async () => {
    // Verificar si es admin
    isAdminUser = await isAdmin();
    if (!isAdminUser) {
        wixLocation.to('/');
        return;
    }
    
    await loadCategories();
    await loadProducts();
    setupButtons();
});

async function loadCategories() {
    const categories = await getAllCategories();
    $w('#categoriesRepeater').data = categories;
    
    $w('#categoriesRepeater').onItemReady(($item, itemData) => {
        $item('#editCategory').onClick(() => {
            wixLocation.to(`/admin/edit-category/${itemData._id}`);
        });
        
        $item('#deleteCategory').onClick(async () => {
            if (confirm(`¿Eliminar "${itemData.titulo}"?`)) {
                await deleteCategory(itemData._id);
                await loadCategories();
            }
        });
    });
}

async function loadProducts() {
    const products = await getAllProducts();
    $w('#productsRepeater').data = products;
    
    $w('#productsRepeater').onItemReady(($item, itemData) => {
        $item('#editProduct').onClick(() => {
            wixLocation.to(`/admin/edit-product/${itemData._id}`);
        });
        
        $item('#deleteProduct').onClick(async () => {
            if (confirm(`¿Eliminar "${itemData.nombre}"?`)) {
                await deleteProduct(itemData._id);
                await loadProducts();
            }
        });
    });
}

function setupButtons() {
    $w('#newCategoryBtn').onClick(() => {
        wixLocation.to('/admin/create-category');
    });
    
    $w('#newProductBtn').onClick(() => {
        wixLocation.to('/admin/create-product');
    });
}