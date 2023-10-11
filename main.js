let coffeeCart = {};
let totalGalletas = 0;
let totalPaquetesGalletas = 0;
let totalPrice = 0;

function addCoffee(coffeeType, price) {
    if (!coffeeCart[coffeeType]) {
        coffeeCart[coffeeType] = { count: 0, price: price };
    }
    coffeeCart[coffeeType].count++;

    switch(coffeeType) {
        case 'Café Mediano':
            totalGalletas += 3;
            break;
        case 'Café Grande':
            totalGalletas += 6;
            break;
        case 'Café Jumbo':
            totalPaquetesGalletas += 1;
            break;
    }
    totalPrice += price;

    // Resumen con los totales
    updateCoffeeSummary();
}

function updateCoffeeSummary() {
    const summaryElement = document.getElementById('coffeeSummary');
    summaryElement.innerHTML = '';

    for (let coffeeType in coffeeCart) {
        let listItem = document.createElement('li');
        listItem.innerHTML = `
            ${coffeeType} - ${coffeeCart[coffeeType].count} x $${coffeeCart[coffeeType].price}
            <button onclick="removeCoffee('${coffeeType}')">Eliminar</button>
        `;
        summaryElement.appendChild(listItem);
    }

    if (totalGalletas > 0) {
        let galletasItem = document.createElement('li');
        galletasItem.innerText = `Galletas de regalo: ${totalGalletas}`;
        summaryElement.appendChild(galletasItem);
    }

    if (totalPaquetesGalletas > 0) {
        let paquetesItem = document.createElement('li');
        paquetesItem.innerText = `Paquetes de galletas de regalo: ${totalPaquetesGalletas}`;
        summaryElement.appendChild(paquetesItem);
    }

    let totalPriceItem = document.createElement('li');
    totalPriceItem.innerText = `Precio total: $${totalPrice}`;
    summaryElement.appendChild(totalPriceItem);
}

function removeCoffee(coffeeType) {
    if (coffeeCart[coffeeType]) {
        totalPrice -= coffeeCart[coffeeType].price;
        switch(coffeeType) {
            case 'Café Mediano':
                totalGalletas += 3;
                break;
            case 'Café Grande':
                totalGalletas += 6;
                break;
            case 'Café Jumbo':
                totalPaquetesGalletas += 1;
                break;
        }
        coffeeCart[coffeeType].count--;
        if (coffeeCart[coffeeType].count <= 0) {
            delete coffeeCart[coffeeType];
        }
    }
    updateCoffeeSummary();
}




function nextStep(step) {
    switch(step) {
        case 2:
            if (!document.getElementById('name').value.trim()) {
                alert('Por favor, ingrese su nombre para continuar.');
                return;
            }
            break;
        case 3:
            if (!Object.keys(coffeeCart).length) {
                alert('Por favor, seleccione al menos un café para continuar.');
                return;
            }
            generateTicketSummary();
            break;
    }

    const currentStep = document.querySelector('.step:not([style*="display: none"])');
    const next = document.getElementById('step' + step);

    if (currentStep) {
        currentStep.style.display = 'none';
    }

    if (next) {
        next.style.display = 'block';
    }

    updateStepIndicator(step);
}

function jumpToStep(step) {
    // No permitir saltar a un paso si no se cumple la validación
    if(step === 2 && !document.getElementById('name').value.trim()) {
        alert('Por favor, ingrese su nombre para continuar.');
        return;
    }
    if(step === 3 && !Object.keys(coffeeCart).length) {
        alert('Por favor, seleccione al menos un café para continuar.');
        return;
    }

    const currentStep = document.querySelector('.step:not([style*="display: none"])');
    if (currentStep) {
        currentStep.style.display = 'none';
    }

    const targetStep = document.getElementById('step' + step);
    if (targetStep) {
        targetStep.style.display = 'block';
    }

    updateStepIndicator(step);
}

function updateStepIndicator(step) {
    const indicators = document.querySelectorAll('.step-indicator');
    indicators.forEach(indicator => {
        indicator.classList.remove('current');
        if (indicator.getAttribute('data-step') == step) {
            indicator.classList.add('current'); 
        }
    });
}

async function checkStepperAccessibility() {
    const step2Indicator = document.querySelector('.step-indicator[data-step="2"]');
    const step3Indicator = document.querySelector('.step-indicator[data-step="3"]');

    // Verificar si el nombre está ingresado
    if (document.getElementById('name').value.trim()) {
        step2Indicator.classList.remove('disabled');
    } else {
        step2Indicator.classList.add('disabled');
    }

    // Verificar si hay al menos un café seleccionado
    if (Object.keys(coffeeCart).length) {
        step3Indicator.classList.remove('disabled');
    } else {
        step3Indicator.classList.add('disabled');
    }

    await new Promise(resolve => setTimeout(resolve, 100));
    checkStepperAccessibility();
}

function generateTicketSummary() {
    const ticketElement = document.getElementById('ticketSummary');
    // Limpiamos el contenido anterior
    ticketElement.innerHTML = ''; 
    
    // Información del cliente
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    let clientInfo = `<h3>Información del Cliente</h3>
                      <p>Nombre: ${name}</p>`;
    if (email) clientInfo += `<p>Email: ${email}</p>`;
    if (phone) clientInfo += `<p>Teléfono: ${phone}</p>`;

    ticketElement.innerHTML += clientInfo;

    // Resumen de pedido
    let orderSummary = '<h3>Detalle del Pedido</h3>';
    for (let coffeeType in coffeeCart) {
        orderSummary += `<p>${coffeeType} - ${coffeeCart[coffeeType].count} x $${coffeeCart[coffeeType].price}</p>`;
    }
    orderSummary += `<p>Galletas de regalo: ${totalGalletas}</p>`;
    orderSummary += `<p>Paquetes de galletas de regalo: ${totalPaquetesGalletas}</p>`;
    orderSummary += `<p>Precio total: $${totalPrice}</p>`;
    
    ticketElement.innerHTML += orderSummary;
}

function processOrder() {

    //SweetAlert y resetear contenido
    Swal.fire({
        title: 'Pedido Realizado',
        text: '¡Gracias por tu compra en Cafetería Cielo Negro!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Resetear el contenido
            resetOrder();
        }
    });
}

function resetOrder() {
    // Resetear información del cliente
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    
    coffeeCart = {};
    totalGalletas = 0;
    totalPaquetesGalletas = 0;
    totalPrice = 0;

    updateCoffeeSummary();
    nextStep(1);  // Volver al paso 1
}
