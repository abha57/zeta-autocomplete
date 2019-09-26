class AutoComplete {
    constructor(){
        // initialization
        this.apiResponse = null;
        this.availableCountries = [];
        this.isValuePresent = false;
        this.countriesToList = [];
        this.selectedCountries = [];


        // Dom element
        this.inputElement = document.getElementById('countryInput');

        // binding with class instance
        var newHandleInputChange = this.handleInputChange.bind(this);

        // attaching event listener
        this.inputElement.addEventListener('input', newHandleInputChange);

        // making API request
        this.handleApiCall();
    }

    async handleApiCall(){
        this.apiResponse = await fetch('https://restcountries.eu/rest/v2/all').then(res => res.json());
        this.availableCountries = this.apiResponse;
    }

    handleInputChange(e){
        const inputValue = e.target.value;
       if(inputValue === ''){
           this.isValuePresent = false;
           this.removeDropdownCountries();
           return false;
       }
       this.isValuePresent = true;
       this.countriesToList = this.availableCountries.filter((country) => country.name.toLowerCase().includes(inputValue.toLowerCase()));
       this.createDropdownCountries();
    }
    removeDropdownCountries() {
        var elem = document.getElementById('countriesList');
        elem.innerHTML = '';
    }
    createDropdownCountries() {
        if(this.isValuePresent){
            const ulContainer = document.getElementById('countriesList');
            ulContainer.innerHTML = '';
            for(let i = 0; i < this.countriesToList.length; i++){
                var li = document.createElement('li');
                li.setAttribute('class', 'item');
                ulContainer.appendChild(li);
                li.innerHTML=this.countriesToList[i].name.concat('-', this.countriesToList[i].cioc);
            }
        }
        
    }
    showSelectedCountriesWithTag(){

        const ulContainer = document.getElementById('countryWithTag');
        ulContainer.innerHTML = '';
        if(this.selectedCountries.length){
            for(let i = 0; i < this.selectedCountries.length; i++){
                const li = document.createElement('li');
                li.setAttribute('class', 'withTag');
                const removeEle = document.createElement('span');
                removeEle.setAttribute('class', 'removeTag');
                removeEle.innerHTML = '&#9747';
                const nameEle = document.createElement('span');
                nameEle.innerHTML = this.selectedCountries[i].name;
                li.appendChild(nameEle);
                li.appendChild(removeEle);
                ulContainer.appendChild(li);
            }
        }
        
    }
    remPushedCounFromMasterData(country){
        this.availableCountries = this.availableCountries.filter((c) => c.name !== country.name );
        this.availableCountries.splice(this.availableCountries.findIndex((c) => c.name === country.name), 1);
    }
    addCountryInMasterData(country){
        this.availableCountries.push(country);
    }
    showSelectedCountries(){
        const selectedCountriesContainer = document.getElementById('selectedCountries');
        if(this.selectedCountries.length > 0){
            selectedCountriesContainer.innerHTML = JSON.stringify(this.selectedCountries);
        } else {
            selectedCountriesContainer.innerHTML = '';
        }
    }
    controlUI(){
        this.showSelectedCountriesWithTag();
        this.showSelectedCountries();
    }
}


var autoComplete = new AutoComplete();


const ulContainer = document.getElementById('countriesList');
ulContainer.addEventListener("click",function(e) {
    let liValue;
    if (e.target && e.target.matches("li.item")) {
        liValue = e.target.innerHTML;
    }
    if(liValue){
        const countryToFind = liValue.split('-')[0];
        const countryToPush = this.countriesToList.filter((country) => country.name === countryToFind);
        const ifCountryAlreadySelected = this.selectedCountries.find((country) => country.name === countryToPush[0].name);
        if(!ifCountryAlreadySelected){
            this.selectedCountries.push(countryToPush[0]);
            this.remPushedCounFromMasterData(countryToPush[0]);
            this.controlUI();
            ulContainer.innerHTML = '';
            this.inputElement.value = '';
        }
    }
}.bind(autoComplete));

const withTagUlContainer = document.getElementById('countryWithTag');
withTagUlContainer.addEventListener("click",function(e) {
    let liValue;
    if (e.target && e.target.matches("span.removeTag")) {
        const parentNode = e.target.parentNode;
        const text = parentNode.textContent;
        liValue = text.slice(0, text.length - 1);
    }
    if(liValue){
    const countryRemoved = this.selectedCountries.splice(this.selectedCountries.findIndex((country) => country.name === liValue), 1);
    this.addCountryInMasterData(countryRemoved[0]);
    this.controlUI();
    }
}.bind(autoComplete));