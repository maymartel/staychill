//creando clase de productos
class Producto {

    constructor(nombre, categoria, descripcion, precio, stock, foto) {
        this.nombre = nombre;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.precio = parseInt(precio);
        this.stock = parseInt(stock);
        this.foto = foto;
    }
}


//array carrito
const carrito = [];

//variables globales
let index = 0; //se va a encargar de contar la cantidad de productos que hay en el carrito
let total = 0; // se va a encargar de contar el total de la compra

const carritoEnStorage = localStorage.getItem("carrito"); 

const agregandoAlCarrito = (producto) => {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    let cartelAgregado = $(document.createElement("p"))
        .html(`${producto.nombre} fue agregado al carrito`)
        .addClass("cartelAgregado")
        .fadeOut(1500, function(){ alCarrito(producto) } );

    $(seccionCarrito).append(cartelAgregado);

}

let botonCarrito = document.getElementById("botonCarrito");


const alCarrito = (producto) => {
    index++; //modificar la cantidad que se muestra en el boton del carrito 
    total = total + producto.precio; //cuenta cuanto lleva el carrito

    $(botonCarrito).show(500); 
    botonCarrito.innerText = `Carrito (${index})`; 


}

const cancelarCompraFuncion = () => {

    let seccionCarrito = $("#seccionCarrito");
    $(seccionCarrito).html(" "); //limpiando carrito 

    carrito.length = 0; 
    total = 0; 
    index = 0; 

    localStorage.setItem("carrito", JSON.stringify(carrito));
    location.reload();

}


//agarra lo que haya en el storage y lo pushea adentro del array carrito 
const convertirCarritoEnStorage = () => {

    if (carritoEnStorage != null) { 
        const carritoLocal = JSON.parse(carritoEnStorage); 

        for (const producto of carritoLocal) { 
            carrito.push(new Producto(producto.nombre, producto.categoria, producto.descripcion, producto.precio, producto.stock, producto.foto)) //Agregamos los productos al array del Carrito
            alCarrito(producto); 
        }
    }
}

const carritoVacio = () => {
    if (carrito.length != 0) { 
        mostrarCarrito(); 
    } else {
        let carritoCard = document.getElementById("carritoCard");
        carritoCard.parentNode.removeChild(carritoCard); 
        localStorage.removeItem("carrito"); 
    }
}

const quitarProducto = (producto) => {

    if (carrito.length != 1) { 
        let indexProducto = carrito.indexOf(producto); 
        carrito.splice(indexProducto, 1); 

        let carritoCard = document.getElementById("carritoCard");
        carritoCard.parentNode.removeChild(carritoCard); 

        total = total - producto.precio; 

        localStorage.setItem("carrito", JSON.stringify(carrito)); 

        carritoVacio();
    }
}

const confirmarCompra = () => {

    //Declaramos la url que vamos a usar para el GET
    const URLGET = "https://jsonplaceholder.typicode.com/posts";
    const infoPost = { texto: "Compra finalizada" };

    $.post(URLGET, infoPost, (respuesta, estado) => {
        if (estado === "success") {
            let cartelExitoso = document.createElement("p");
            $(cartelExitoso).html(`${respuesta.texto}`);
            $("#seccionCarrito").append(cartelExitoso);
        }
    });

    carrito.length = 0;
    localStorage.setItem("carrito", JSON.stringify(carrito));

    setTimeout(function () { location.reload(); }, 3000); //después de 3seg recarga la pagina 

}


const mostrarCarrito = () => {

    $("#carritoCard").remove();

    $(botonCarrito).hide(1000);
    $("#seccionProductos").html(" "); 


    let carritoCard = document.createElement("div");
        $(carritoCard).addClass("carritoCard");
        carritoCard.id = "carritoCard";
        carritoCard.innerHTML = "Tu compra es: ";


    for (const producto of carrito) {

        let productoCard = document.createElement("div");
        productoCard.classList.add("productoCard");
        
        let nombre = document.createElement("p");
        nombre.innerHTML = producto.nombre;
        productoCard.appendChild(nombre);

        let precio = document.createElement("p");
        precio.innerHTML = `$${producto.precio}`;
        productoCard.appendChild(precio);

        let botonQuitarProducto = document.createElement("button");
        botonQuitarProducto.innerText = "X";
        botonQuitarProducto.classList.add("quitar");
        botonQuitarProducto.onclick = () => quitarProducto(producto)
        productoCard.appendChild(botonQuitarProducto);
        
        carritoCard.appendChild(productoCard);
    }

    let tituloTotal = document.createElement("p");
        tituloTotal.innerHTML = `TOTAL: ${total}`;
        tituloTotal.classList.add("negrita", "precio");
        carritoCard.append(tituloTotal);
    
    
    let finalizarCompra = document.createElement("button");
    finalizarCompra.innerText = "Confirmar compra";
    finalizarCompra.classList.add("botonConfirmarCompra");
    carritoCard.appendChild(finalizarCompra);
    finalizarCompra.onclick = () => confirmarCompra();

        

    let cancelarCompra = document.createElement("button");
    cancelarCompra.innerHTML = "Cancelar compra";
    cancelarCompra.classList.add("botonCancelar");
    carritoCard.appendChild(cancelarCompra);
    cancelarCompra.onclick = () => cancelarCompraFuncion(); 

    $(seccionCarrito).append(carritoCard);
}


//PINTANDO PRODUCTOS EN PANTALLA
let seccionProductos = $("#seccionProductos");

const mostrarProductosEnPantalla = (array) => {

    $(seccionProductos).html(" "); //Limpia seccion productos 

    for (const elemento of array){

        let producto = document.createElement("div");
        $(producto).addClass("productoCard");


        let botonAgregarCarrito = $(document.createElement("button"))
            .html("AGREGAR AL CARRITO")
            .addClass("botonAgregar")
            .on('click', () => agregandoAlCarrito(elemento));


        $(producto).append(`
            <p class="titulo">${elemento.nombre}</p>
            <img class="foto" src="${elemento.foto}">
            <p class="negrita">${elemento.descripcion}</p>
            <p class="negrita">$${elemento.precio}</p>                            
        
        `);

        $(producto).append(botonAgregarCarrito);
        $(seccionProductos).append(producto);

    }
}

//url que contiene base de datos
let URLGET = "";

//adaptar la url a cada categoria y consumir la base de datos 
$("#botonRemeras").click(() => {
    URLGET = "https://my-json-server.typicode.com/maymartel/staychill/remeras";
    consumirProductos(); 
})

$("#botonBuzos").click(() => {
    URLGET = "https://my-json-server.typicode.com/maymartel/staychill/buzos";
    consumirProductos(); 
})

$("#botonEncendedores").click(() => {
    URLGET = "https://my-json-server.typicode.com/maymartel/staychill/encendedores";
    consumirProductos(); 
})

$("#botonLlaveros").click(() => {
    URLGET = "https://my-json-server.typicode.com/maymartel/staychill/llaveros";
    consumirProductos(); 
})

//creando llamada a base de datos
const consumirProductos = () => {
    $.get(URLGET, function(respuesta, estado){
        if (estado === "success"){
            let productos = respuesta;
            mostrarProductosEnPantalla(productos); 
        }
    })
} 

$(window).on("load", function(){
    convertirCarritoEnStorage();
}) 
