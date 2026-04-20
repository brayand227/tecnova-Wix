import wixLocation from 'wix-location';

$w.onReady(function () {
    const producto = $w("#dynamicDataset").getCurrentItem();

    $w("#btnWhatsapp").onClick(() => {
        const mensaje = `Hola, me interesa el producto: ${producto.title} - $${producto.precio}`;
        const numero = "573207512431";

        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
        
        wixLocation.to(url);
    });
});