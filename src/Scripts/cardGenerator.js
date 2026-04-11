let cardCount = 0;
const sliderCache = {}

function createCard() {
    cardCount++;
    const id = cardCount;

    const card = document.createElement('div');
    card.className = 'col card';
    card.id = `card${id}`;

    card.innerHTML = `
        <input id="plot${id}" class="plot-input" type="text" placeholder="(x, y) or y = mx^2 + b">
    `;

    const input = card.querySelector(`#plot${id}`);
    input.addEventListener('input', function() {
        handleNewCardInjection(id);
    });

    input.addEventListener('blur', function() {
        const sidebar = document.getElementById('plotter-sidebar');
        const allCards = sidebar.querySelectorAll('.card');
    
        // 1. Get the last card in the sidebar
        const lastCard = allCards[allCards.length - 1];

        // 2. ONLY delete if:
        //    - The input is empty
        //    - It is NOT the last card in the list
        if (input.value.trim() === "" && card !== lastCard) {
            card.remove();
            // No need to decrement cardCount; 
            // new cards will just keep getting higher IDs which is fine.
        }
    });

    input.addEventListener('input', (e) => {
        const equation = e.target.value.trim();

        const cleaned = equation.replace(/log|ln|sin|cos|tan|sqrt|abs|[xy]/gi, "");

        const matches = cleaned.match(/[a-z]/gi);
        const uniqueVariables = [...new Set(matches)];

        console.log("Unique Variables:", uniqueVariables);
        renderDynamicSliders(card.id, uniqueVariables);

        if (window.Graph) window.Graph.updateGraph();
    });

    document.getElementById('plotter-sidebar').appendChild(card);
}

function handleNewCardInjection(id) {
    const currentInput = document.getElementById(`plot${id}`);
    const sidebar = document.getElementById('plotter-sidebar');

    if (id === cardCount && currentInput.value.trim() !== "") {
        createCard();
    }
}

function renderDynamicSliders(cardId, variables) {
    if (variables === null) return; // No variables, no sliders needed

    const card = document.getElementById(`${cardId}`);
    
    //Clear existing sliders
    const existingSliders = card.querySelectorAll('.slider-container');
    
    existingSliders.forEach(container => {
        const varName = container.dataset.variable;
        const slider = container.querySelector('.main-slider');
        if (varName && slider) {
            sliderCache[`${cardId}-${varName}`] = {
                val: slider.value,
                min: slider.min,
                max: slider.max,
                step: slider.step
            };
        }
    })
    
    existingSliders.forEach(slider => slider.remove());

    // Create Sliders for each variable 
    variables.forEach(variable => {
        const cacheKey = `${cardId}-${variable}`;
        const saved = sliderCache[cacheKey] || {
            val: 1, min: -10, max: 10, step: 0.1
        };
        sliderCache[cacheKey] = { ...saved };

        const container = document.createElement('div');
        container.className = 'slider-container';
        container.dataset.variable = variable; // Store variable name for caching

        // 1. Header Row
        const header = document.createElement('div');
        header.className = 'slider-header';
        header.innerHTML = `<span>${variable.toUpperCase()}</span><span id="val-${variable}">${saved.val}</span>`;

        // Slider Row
        const slider = document.createElement('input');
        slider.className = 'main-slider';
        slider.type = 'range';
        slider.step = saved.step;
        slider.min = saved.min;
        slider.max = saved.max;
        slider.value = saved.val;

        slider.addEventListener('input', () => {
            // Update the label text with the current slider value
            const valueSpan = header.querySelector(`#val-${variable}`);
            if (valueSpan) {
                valueSpan.textContent = slider.value;
                sliderCache[`${cardId}-${variable}`].val = slider.value;
            }
            if (window.Graph) window.Graph.updateGraph();
        });

        // 3. Settings Row
        const settings = document.createElement('div');
        settings.className = 'slider-settings';

        // Min Changer
        const minInput = document.createElement('input');
        minInput.type = 'number';
        minInput.value = saved.min;

        minInput.addEventListener('input', () => {
            slider.min = minInput.value;
            sliderCache[`${cardId}-${variable}`].min = slider.min;
            if (window.Graph) window.Graph.updateGraph();
        });

        // Max Changer
        const maxInput = document.createElement('input');
        maxInput.type = 'number';
        maxInput.value = saved.max;

        maxInput.addEventListener('input', () => {
            slider.max = maxInput.value;
            sliderCache[`${cardId}-${variable}`].max = slider.max;
            if (window.Graph) window.Graph.updateGraph();
        });

        // step changer
        const stepinput = document.createElement('input');
        stepinput.type = 'number';
        stepinput.min = 0.001;
        stepinput.value = saved.step;
        stepinput.step = 0.1;

        stepinput.addEventListener('input', () => { 
            slider.step = stepinput.value;
            sliderCache[`${cardId}-${variable}`].step = slider.step;
            if (window.Graph) window.Graph.updateGraph();
        });

        // Append settings
        settings.appendChild(document.createTextNode('Min: '));
        settings.appendChild(minInput);
        settings.appendChild(document.createTextNode(' Max: '));
        settings.appendChild(maxInput);
        settings.appendChild(document.createTextNode(' Step: '));
        settings.appendChild(stepinput);

        container.appendChild(header);
        container.appendChild(slider);
        container.appendChild(settings);

        card.appendChild(container);
    });

}

createCard(); // Start with one card