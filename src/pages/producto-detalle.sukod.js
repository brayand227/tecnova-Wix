// pages/product-details.js
import { getProductById } from 'backend/products.jsw';
import { getProductsByCategory } from 'backend/products.jsw';
import wixLocation from 'wix-location';
import wixWindow from 'wix-window';

let currentProduct = null;

$w.onReady(async () => {
    // Obtener el ID del producto desde la URL (en páginas dinámicas está en $w('#dynamicDataset'))
    const productId = $w('#dynamicDataset').getCurrentItem()._id;
    await loadProduct(productId);
    setupWhatsAppButton();
    setupColorSelector();
});

async function loadProduct(productId) {
    currentProduct = await getProductById(productId);
    
    // Llenar los datos en la página
    $w('#productName').text = currentProduct.nombre;
    $w('#productPrice').text = `$${currentProduct.precio}`;
    $w('#productDescription').text = currentProduct.descripcion;
    
    // Si hay imagen principal, mostrarla
    if (currentProduct.imagenPrincipal) {
        $w('#productImage').src = currentProduct.imagenPrincipal;
    }
    
    // Cargar productos relacionados (misma categoría)
    loadRelatedProducts(currentProduct.categoria);
}

function setupColorSelector() {
    if (currentProduct.colores && currentProduct.colores.length > 0) {
        const colorsContainer = $w('#colorsContainer');
        
        currentProduct.colores.forEach(color => {
            // Crear un círculo de color (puedes usar un elemento Box)
            const colorBox = colorsContainer.addElement('Box');
            colorBox.style = {
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: color,
                marginRight: '10px',
                cursor: 'pointer',
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            };
            
            colorBox.onClick(() => {
                // Cambiar la imagen según el color
                if (currentProduct.imagenesPorColor && currentProduct.imagenesPorColor[color]) {
                    $w('#productImage').src = currentProduct.imagenesPorColor[color];
                }
            });
        });
    }
}

async function loadRelatedProducts(categoryId) {
    const relatedProducts = await getProductsByCategory(categoryId);
    const filtered = relatedProducts.filter(p => p._id !== currentProduct._id).slice(0, 4);
    $w('#relatedRepeater').data = filtered;
}

function setupWhatsAppButton() {
    $w('#whatsappButton').onClick(() => {
        const message = `Hola, me interesa el producto: *${currentProduct.nombre}*\n💰 Precio: $${currentProduct.precio}\n🔗 ${wixWindow.location.href}`;
        const phoneNumber = "573207512431";
        wixWindow.openURL(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
    });
}