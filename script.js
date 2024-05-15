const menu = document.getElementById('menu')
const cartItemConteiner = document.getElementById('cart-item')
const cartTotal = document.getElementById('cart-total')
const adressInput = document.getElementById('adress')
const adressWarn = document.getElementById('address-warn')
const closeModalBtn = document.getElementById('close-modal-btn')
const checkoutBtn = document.getElementById('checkout-btn')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartConter = document.getElementById('cart-count')


let cart = [];

//Abrir o modal do carrinho
cartBtn.addEventListener('click', () => {
    updateCartModal();
    cartModal.style.display = 'flex'
})

// Fechar o modal quando clicar fora
cartModal.addEventListener('click', event => {
    if(event.target === cartModal){
        cartModal.style.display = 'none'
    }
})

// Fechar o modal quando clicar no fechar
closeModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none'
})

menu.addEventListener('click', event => {
    let parentButton = event.target.closest('.add-to-cart-btn')

    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = Number(parentButton.getAttribute('data-price'))

        // Add no carrinho
        addToCart(name, price)
    }
})

// Função para adicionar no carrinho
function addToCart(name,price) {
    const existingItem = cart.find(item => item.name === name)
    
    //se o item já existir aumenta apenas a quantidade +1
    if (existingItem) {
        existingItem.qtd += 1;
        
    } else {

        cart.push({
            name,
            price,
            qtd: 1,
        })
    }

    updateCartModal()
 
}

//Atualizar o Carrinho
function updateCartModal() {
    cartItemConteiner.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class= 'flex items-center justify-between'>
                <div>
                    <p class= 'font-bold'>${item.name}</p>
                    <p>Qtd: ${item.qtd}</p>
                    <p class= 'font-medium mt-2'>R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class='remove-from-cart-btn' data-name='${item.name}'>
                    Remover
                </button>
                
                
            </div>
        `
        total += item.price * item.qtd;

        cartItemConteiner.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString('pt-BR',{
        style:'currency', 
        currency:'BRL'
    });

    cartConter.innerHTML = cart.length;
}

// Função para remover o item do carrinho
cartItemConteiner.addEventListener('click', event => {
    if (event.target.classList.contains('remove-from-cart-btn')){
        const name = event.target.getAttribute('data-name')

        removeItemCart(name);
    }

})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];
        
        if(item.qtd > 1) {
            item.qtd -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
        
    }
}

adressInput.addEventListener('input', event => {
    let inputValue = event.target.value;

    if (inputValue !== '') {
        adressInput.classList.remove('border-red-500')
        adressWarn.classList.add('hidden')
        
    }
})

// Finalizar pedido
checkoutBtn.addEventListener('click', () => {

    const isOpen = checkoutRestauranteOpen();
    if (!isOpen) {

        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
    }).showToast();

        return;

    }

    if(cart.length === 0) return;
    if (adressInput.value === '') {
        adressWarn.classList.remove('hidden')
        adressInput.classList.add('border-red-500')
        return;
    }

    // Enviar o pedido para a api whatsapp
    const cartItem = cart.map(item => {
        return(
            `${item.name} Quantidade: (${item.qtd}) Preço: R${item.price} | `
        )
    }).join('')

    const message = encodeURIComponent(cartItem)
    const phone = '11974835854'

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`, '_blank')

    cart = []
    updateCartModal()

})

// Verificar a hora e manipular o card horario
function checkoutRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById('date-span')
const isOpen = checkoutRestauranteOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")   
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}




