
// Clase base
class ItemCarrito {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = 1;
    }
    incrementarCantidad() {
        this.cantidad++;
    }
    decrementarCantidad() {
        if (this.cantidad > 1) {
            this.cantidad--;
        }
    }
}

// Clase derivada para experiencias
class Experiencia extends ItemCarrito {
    constructor(nombre, precio) {
        super(nombre, precio);
    }
}

// Clase derivada para productos físicos
class ProductoFisico extends ItemCarrito {
    constructor(nombre, precio, peso) {
        super(nombre, precio);
        this.peso = peso; // Peso específico del producto físico
    }
}

// Clase Carrito
class Carrito {
    constructor() {
        this.items = this.cargarDesdeLocalStorage(); // Cargar el carrito desde el localStorage al iniciar
        this.actualizarInterfaz();
    }

    añadirExperiencia(experiencia) {
        let existe = false;
        for (let i = 0; i < this.items.length; i++) { 
            if (this.items[i].nombre === experiencia.nombre) {
                this.items[i].incrementarCantidad();
                existe = true;
                break;
            }
        }
        if (!existe) {
            this.items.push(experiencia);
        }
        this.guardarEnLocalStorage();
        this.actualizarInterfaz();
    }

    eliminarExperiencia(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1); // Elimina 1 elemento en la posición index del array
            this.guardarEnLocalStorage();
            this.actualizarInterfaz(); // Actualiza la interfaz
        }
    }

    incrementarCantidad(index) {
        this.items[index].incrementarCantidad();
        this.guardarEnLocalStorage();
        this.actualizarInterfaz();
    }

    decrementarCantidad(index) {
        this.items[index].decrementarCantidad();
        this.guardarEnLocalStorage();
        this.actualizarInterfaz();
    }

    calcularTotal() {
        let total = 0;
        for (let i = 0; i < this.items.length; i++) {
            total += this.items[i].precio * this.items[i].cantidad;
        }
        return total;
    }

    actualizarInterfaz() {
        const lista = document.getElementById('elementos-carrito');
        lista.innerHTML = ''; // Limpiar la lista actual

        this.items.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.nombre} - $${item.precio} x ${item.cantidad}`;

            const incrementarBoton = document.createElement('button');
            incrementarBoton.textContent = '➕';
            incrementarBoton.classList.add('incrementar');
            incrementarBoton.addEventListener('click', () => this.incrementarCantidad(index));

            const decrementarBoton = document.createElement('button');
            decrementarBoton.textContent = '➖';
            decrementarBoton.classList.add('decrementar');
            decrementarBoton.addEventListener('click', () => this.decrementarCantidad(index));

            const eliminarBoton = document.createElement('button');
            eliminarBoton.innerHTML = '<i class="fa fa-trash"></i> Eliminar';
            eliminarBoton.addEventListener('click', () => this.eliminarExperiencia(index));

            li.appendChild(incrementarBoton);
            li.appendChild(decrementarBoton);
            li.appendChild(eliminarBoton);
            lista.appendChild(li);
        });

        document.getElementById('total').textContent = this.calcularTotal();
    }

    guardarEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    cargarDesdeLocalStorage() {
        const datosGuardados = localStorage.getItem('carrito');
        if (datosGuardados) {
            const itemsGuardados = JSON.parse(datosGuardados);
            return itemsGuardados.map(item => {
                if (item.peso !== undefined) {
                    return new ProductoFisico(item.nombre, item.precio, item.peso);
                } else {
                    return new Experiencia(item.nombre, item.precio);
                }
            });
        }
        return [];
    }
}

// Crear una instancia del carrito
const carrito = new Carrito();

// Función para manejar el click en el botón de añadir al carrito para Experiencia
function añadirAlCarrito(event) {
    const divExperiencia = event.target.parentElement; 
    const nombre = divExperiencia.querySelector('h3').textContent;
    const precio = parseFloat(divExperiencia.getAttribute('data-precio'));

    const experiencia = new Experiencia(nombre, precio);
    carrito.añadirExperiencia(experiencia);
}

// Función para manejar el click en el botón de añadir al carrito para ProductoFisico
function añadirProductoFisicoAlCarrito(event) {
    const divProducto = event.target.parentElement;
    const nombre = divProducto.querySelector('h3').textContent;
    const precio = parseFloat(divProducto.getAttribute('data-precio'));
    const peso = parseFloat(divProducto.getAttribute('data-peso'));

    const producto = new ProductoFisico(nombre, precio, peso);
    carrito.añadirExperiencia(producto);
}

// Añadir event listeners a los botones de añadir al carrito para Experiencia
document.querySelectorAll('.añadir-al-carrito').forEach(button => {
    button.addEventListener('click', añadirAlCarrito);
});

// Añadir event listeners a los botones de añadir al carrito para ProductoFisico
document.querySelectorAll('.añadir-producto').forEach(button => {
    button.addEventListener('click', añadirProductoFisicoAlCarrito);
});

// Funcionalidad para el botón "Comprar"
document.getElementById('comprar').addEventListener('click', () => {
    if (carrito.items.length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    carrito.items = [];  // Vaciar el carrito
    carrito.guardarEnLocalStorage();
    carrito.actualizarInterfaz();
    alert('¡Compra realizada con éxito!');
});

// Funcionalidad para el botón "Cancelar compra"
document.getElementById('cancelar').addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas cancelar la compra?')) {
        carrito.items = []; // Vaciar el carrito
        carrito.guardarEnLocalStorage();
        carrito.actualizarInterfaz();
    }
});


