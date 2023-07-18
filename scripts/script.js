const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer-venta')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}
let numeroticket = 0

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

const fetchData = async() => {
    try{
        const res = await fetch('../scripts/api.json')
        const data = await res.json()
        pintarCards(data)
    }catch(error){
        console.log(error)
    }
}

const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h3').textContent = producto.title
        templateCard.querySelectorAll('p')[1].textContent = producto.precio
        templateCard.querySelectorAll('p')[0].textContent = producto.tipo
        templateCard.querySelector('img').setAttribute("src", producto.imagen)
        templateCard.querySelector('button').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if (e.target.classList.contains('template-button')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.template-button').dataset.id,
        title: objeto.querySelector('h3').textContent,
        precio: objeto.querySelectorAll('p')[1].textContent,
        tipo: objeto.querySelectorAll('p')[0].textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){  
        footer.innerHTML = `
        <th scope="row" colspan="5">carrito vacio</th>
        `
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad,precio}) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('th')[0].textContent = "Cant: " + nCantidad
    templateFooter.querySelectorAll('th')[1].textContent = "Total: $" + nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

    const btnComprar = document.getElementById('comprar-carrito')
    btnComprar.addEventListener('click', () => {
        alert("comprado")
        generarTicketPDF()
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = e => {
    if(e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }

    e.stopPropagation()
}

const generarTicketPDF = () => {
    const datosCarrito = {
        carrito: carrito // Envía el objeto carrito como parte de los datos del carrito
    };

    // Enviar los datos del carrito al archivo PHP utilizando AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '../scripts/ticket.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Descargar el archivo PDF en el navegador
            const link = document.createElement('a');
            link.href = URL.createObjectURL(xhr.response);
            link.download = 'compra.pdf';
            numeroticket++
            link.click();
        }
    };

    xhr.responseType = 'blob';
    xhr.send(JSON.stringify(datosCarrito)); // Envía los datos del carrito como una cadena JSON
};