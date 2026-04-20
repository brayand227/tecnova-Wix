// pages/admin/create-product.js
import { getAllCategories } from 'backend/categories.jsw';
import { createProduct } from 'backend/products.jsw';
import wixLocation from 'wix-location';

$w.onReady(async () => {
    // Cargar categorías para el dropdown
    const categories = await getAllCategories();
    $w('#categorySelect').options = categories.map(cat => ({
        label: cat.titulo,
        value: cat._id
    }));
    
    setupFormSubmission();
});

function setupFormSubmission() {
    $w('#submitBtn').onClick(async () => {
        const productData = {
            nombre: $w('#nameInput').value,
            descripcion: $w('#descriptionInput').value,
            precio: parseFloat($w('#priceInput').value),
            categoria: $w('#categorySelect').value,
            destacado: $w('#featuredCheckbox').checked,
            stock: parseInt($w('#stockInput').value) || 0,
            colores: $w('#colorsInput').value.split(',').map(c => c.trim()),
            imagenPrincipal: $w('#imageUpload').value
        };
        
        await createProduct(productData);
        wixLocation.to('dashboard');
    });
}