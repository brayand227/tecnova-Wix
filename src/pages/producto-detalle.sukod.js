import wixLocation from 'wix-location';

$w.onReady(function () {

    // Esperar a que el dataset cargue
    $w("#dynamicDataset").onReady(() => {

        const producto = $w("#dynamicDataset").getCurrentItem();

        // === SELECTOR DE COLORES ===
        if (producto.colores) {
            let colores = [];

            try {
                colores = JSON.parse(producto.colores);
            } catch (e) {
                colores = producto.colores.split(',');
            }

            // IMPORTANTE:
            // En Wix no puedes crear elementos dinámicamente con addElement
            // Debes usar un REPEATER (#repeaterColores)

            const coloresData = colores.map((color, index) => {
                return {
                    _id: index.toString(),
                    colorCode: typeof color === "string" ? color.trim() : color.color,
                    imagen: typeof color === "object" ? color.imagenUrl : null
                };
            });

            $w("#repeaterColores").data = coloresData;

            $w("#repeaterColores").onItemReady(($item, itemData) => {

                $item("#colorBox").style.backgroundColor = itemData.colorCode;

                $item("#colorBox").onClick(() => {
                    if (itemData.imagen) {
                        $w("#productImage").src = itemData.imagen;
                    }
                });

            });
        }

        // === BOTÓN DE WHATSAPP ===
        $w("#btnWhatsapp").onClick(() => {

            const mensaje = `Hola, me interesa el producto: *${producto.nombre}*\n💰 Precio: $${producto.precio}\n🔗 ${wixLocation.url}`;
            const numero = "573207512431";

            const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

            // Forma correcta en Wix
            wixLocation.to(url);
        });

    });
});