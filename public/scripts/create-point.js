function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then(res => res.json())
        .then(states => {

            for(let state of states){
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }            
        } )
}

populateUFs();

function getCities(event){
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
        .then(res => res.json())
        .then(cities => {

            for(let city of cities){
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }        
            
            citySelect.disabled = false
        } )
}

document
    .querySelector("select[name=uf]")  
    .addEventListener("change", getCities)

//itens de coleta
const itensToCollect = document.querySelectorAll(".itens-grid li")

for(let iten of itensToCollect){
    iten.addEventListener("click", handleSelectedItem)
}

const collectedItens = document.querySelector("input[name=itens]")

let selectedItems = []

function handleSelectedItem(event){
    const itenLi = event.target

    itenLi.classList.toggle("selected")

    const itemId = itenLi.dataset.id
    //verificar se existem itens selecionados
    const alreadySelected = selectedItems.findIndex(item => item == itemId)
    
    if(alreadySelected >= 0){
        const filteredItens = selectedItems.filter(item => item != itemId)
        selectedItems = filteredItens
    }else{
        selectedItems.push(itemId)
    }
    collectedItens.value = selectedItems
}

