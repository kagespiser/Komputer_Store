// Dummy data

var values = [
    {
    name: "Laptop1", 
    price: 500, 
    features: ["It Works", "Has a screen"], 
    image: "https://image.shutterstock.com/image-vector/illustration-computer-monitor-holding-cpu-260nw-82095055.jpg",
    description: "Its not the most powerful laptop, but it will do the job!"
    },
    {
    name: "Laptop2", 
    price: 1400, 
    features: ["Nice trackpad!", "Purrs like a kitten"], 
    image: "https://www.komplett.dk/img/p/800/1171370.jpg",
    description: "A good laptop for youtube and school work"
    }, 
    {
    name: "Laptop3", 
    price: 2400, 
    features: ["Has speakers", "Glows in the dark!"], 
    image: "https://i.gadgets360cdn.com/large/mi_gaming_laptop_2019_image_1565003115644.jpg?output-quality=80",
    description: "Is you want to game a little in your freetime this is the laptop"
    }, 
    {
    name: "Laptop4", 
    price: 7000, 
    features: ["Has a BIG GPU", "The fan works"], 
    image: "https://gaming-dk.s3.amazonaws.com/carrierwave/embedded_image/3387/image/msi_laptop_120_hz.jpg",
    description: "Its the most powerful laptop"
    }
]

// Dummy data end

// creates a Komputerstore object 

class KomputerStore {
    constructor(bankBalanceTextElement, walletBalanceTextElement, loanOutstandingTextElement){
        this.bankBalanceTextElement = bankBalanceTextElement
        this.walletBalanceTextElement = walletBalanceTextElement
        this.loanOutstandingTextElement = loanOutstandingTextElement
        this.clear()
        this.update()
    }

    //cleares all variables 
    clear(){
        this.payBalance = 0
        this.bankBalance = 0
        this.bankLoan = 0
        this.loanForPc = 0
    }

    work(){
        this.payBalance = this.payBalance + 100
    }

    // takes an amount, if amount fulfilleds the conditions it takes out a loan and returnes a message as string
    // checkes if the conditions for getting a loan if fulfilled
    getLoan(amount){
        let amountInt = parseInt(amount)
        let message = ""

        if (this.bankLoan != 0){
           return "You have to pay off your loan before you can get a new one"
        }

        if (this.loanForPc != 0){
            return "You can only borrow money for a pc once!"
        }

        if (amountInt <= (this.bankBalance / 2)){
            this.bankLoan = amountInt
            this.bankBalance = this.bankBalance + amountInt
            this.loanForPc = 1
            message = "You have taken out a loan of: " + amount
        } else {
            message ="You can not take out a loan larger than: " + (this.bankBalance / 2)
        }
        return message
    }

    //moves the pay balance to the bank, if there is a loan it takes 10% of the pay to pay it back
    bankSalery(){
        if( this.bankLoan > 0 ){
            let deduction = (this.payBalance * 0.10)  
            this.payBalance = this.payBalance - deduction
            if(deduction > this.bankLoan){
                this.bankBalance = this.bankBalance + (deduction - this.bankLoan)
                this.bankLoan = 0
            } else {
                this.bankLoan = this.bankLoan - deduction
            }
        }
        this.bankBalance = this.bankBalance + this.payBalance 
        this.payBalance = 0
    }

    //takes a laptop, checks if the bank contains enough to buy it, if it does, it removes price from the bank
    // and reruens a message as a string
    buy(laptopName){
        let laptop = this.getLaptop(laptopName)
        let message = ""
        if(parseInt(laptop.price) <= this.bankBalance){
            this.bankBalance = this.bankBalance - parseInt(laptop.price) 
            message = "Congratulations with your new laptop!"
        } else {
            message = "You cant buy that yet"
        }
        this.loanForPc = 0
        return message
    }

    payLoan(){
        if(this.payBalance > this.bankLoan){
            this.payBalance = this.payBalance - this.bankLoan
            this.bankLoan = 0
        } else {
            this.bankLoan = this.bankLoan - this.payBalance
        }
    }

    //takes a laptop name and updates all the fields that display data from the laptop 
    laptopUpdate(laptopName){
        let laptop = this.getLaptop(laptopName)
        priceTextElement.innerText = laptop.price + " DKK"
        laptopNameTextElement.innerText = laptop.name
        laptopDescriptionTextElement.innerText = laptop.description
        laptopImage.src = laptop.image

        featuresDiv.innerHTML = ""

        laptop.features.forEach(feature => {
                var textnode = document.createElement("P")
                textnode.innerHTML = feature
                featuresDiv.appendChild(textnode)
            })
        this.update()
    }

    //updates value fields and hides / unhides loan actions if a loan is taken out
    update(){
        this.walletBalanceTextElement.innerText = this.payBalance + " Kr"
        this.bankBalanceTextElement.innerText = this.bankBalance + " Kr"
        this.loanOutstandingTextElement.innerText = this.bankLoan + " Kr"
        for(var i = 0; i < loanDivs.length; i++){
            if(this.bankLoan > 0){
                loanDivs[i].style.visibility = "visible"
            } else {
                loanDivs[i].style.visibility = "hidden"
            }
        }
    }

    //gets laptop object by laptop name
    getLaptop(laptopName){
        var result = values.find(obj => {
            return obj.name === laptopName
          })
        return result
    }
}

//*** connection to document

const getLoanButton = document.querySelector('[data-getLoan]')
const putBankButton = document.querySelector('[data-putBank]')
const workButton = document.querySelector('[data-work]')
const buyButton = document.querySelector('[data-buy]')
const payLoanButton = document.querySelector('[data-payLoan]')

const bankBalanceTextElement = document.querySelector('[data-bankBalance]')
const walletBalanceTextElement = document.querySelector('[data-walletBalance]')
const loanOutstandingTextElement = document.querySelector('[data-outstanding]')
const priceTextElement = document.querySelector('[data-laptopPrice]')
const laptopNameTextElement = document.querySelector('[data-laptopName]')
const laptopDescriptionTextElement = document.querySelector('[data-laptopDescription]')

const laptopImage = document.querySelector('[data-laptopImage]')

const loanDivs = document.getElementsByClassName('loan-div')
const featuresDiv = document.getElementById('features-div')
const laptopSelect = document.getElementById("laptops");

//*** connection to document end


// instantiates a now komputerStore object
const komputerStore = new KomputerStore(bankBalanceTextElement, walletBalanceTextElement, loanOutstandingTextElement)

// Runs on window load, hides loan divs and adds laptop options to laptopSelector
window.onload = function() { 

    for(var i = 0; i < loanDivs.length; i++){
        loanDivs[i].style.visibility = "hidden"
    }

    for(var i = 0; i < values.length; i++){
        var option = document.createElement("option")
        option.value = values[i].name
        option.text = values[i].name
        laptopSelect.appendChild(option)
    }

    komputerStore.laptopUpdate(laptopSelect.value)

}

//*** Event listeners for the buttons and selectors

workButton.addEventListener('click', () => {
    komputerStore.work()
    komputerStore.update()
})

putBankButton.addEventListener('click', () => {
    komputerStore.bankSalery()
    komputerStore.update()
})

getLoanButton.addEventListener('click', () => {
    var loanAmount = prompt("How much do you want to borrow?", "Amount")
    if (loanAmount != 0) {
        let message = komputerStore.getLoan(loanAmount)
        alert(message)
    }
    komputerStore.update()
})

payLoanButton.addEventListener('click', () => {
    komputerStore.payLoan()
    komputerStore.update()
})

laptopSelect.addEventListener('change', () => {
    komputerStore.laptopUpdate(laptopSelect.value)
})

buyButton.addEventListener('click', () => {
    alert(komputerStore.buy(laptopSelect.value))
    komputerStore.update()
})

//*** Event listeners for the buttons and selectors end