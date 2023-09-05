const inputSlider=document.querySelector("[data-lengthslider]")
const lengthDisplay=document.querySelector("[data-LengthNumber]")


const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");

//Query Selector All Method is used here to get all the checkboxes. 
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

//The String For Symbols
const symbols='~`!@#$%^&*()_-+={[}]:;"<,>.?/';

let password="";
let passwordLength=10;
let checkcount=0;

handleSlider(); 

//set Strength circle colour to grey.
setIndicator("#ccc");


function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color)
{
    indicator.style.backgroundColor=color;

    //Shadow wala Homework
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandInteger(min,max)
{
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber()
{
    return getRandInteger(0,9)
}

function generateLowercase()
{
    // Askii Value of the small a is 97 and z is 126
    // return getRandInteger(97,126) --? this will return the Number and we want the Alphabet 
    return String.fromCharCode(getRandInteger(97,122));
}

function generateUppercase()
{
    return String.fromCharCode(getRandInteger(65,90));
}

function generateSymbol()
{
    const randNum=getRandInteger(0,symbols.length)

    return symbols.charAt(randNum)
}

//Ye wale function me Password Strong ya Weak Hone ke "RULES" diye Huae Hai....
function calcStrength()
{
    let hasUpper =false
    let hasLower = false
    let hasSymbol =false
    let hasNumber =false

    //Agar Koi bi checkbox checked hai then-->>uske according ham value change karte chale jayenge 
    if(uppercaseCheck.checked) hasUpper=true
    if(lowercaseCheck.checked) hasLower=true
    if(symbolsCheck.checked) hasSymbol=true
    if(numbersCheck.checked) hasNumber=true

    if(hasUpper && hasLower && (hasSymbol || hasNumber) && passwordLength >=8) {
        setIndicator("#0f0") // SetIndicator Ek Function hai jo ek Argument Leta hai as A "Colour".
    } else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >=6) {
        setIndicator("#ff0")
    } else {
        setIndicator("#f00")
    }
}

async function copyContent()
{
    try
    {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied"
    }

    catch(e)
    {
        copyMsg.innerText="Failed";
    }

    //To Make Copy Wala "Span" Visible
    copyMsg.classList.add("active")

    setTimeout( ()=>
    {
        copyMsg.classList.remove("active");
    },2000);

}


//Event Listeners
inputSlider.addEventListener('input',(e)=> 
{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>
{
    if(passwordDisplay.value)
        copyContent();
})

function handleCheckBoxChange()
{
    checkcount=0;

    allCheckBox.forEach((checkbox) =>
    {
        if(checkbox.checked)
            checkcount++;
    })

    //Special Condition --> CORNER CASE
    if(passwordLength<checkcount)
    {
        passwordLength=checkcount;
        handleSlider();   // Jab Bhi Password ki Length change hoti hai ye wala function call karte hai....

    }
}

//Saare Checkboxes pe Event Listeners
allCheckBox.forEach((checkbox)=>
{
    checkbox.addEventListener('change',handleCheckBoxChange)
    //Change Matlab "Ticekd" ya "Unticked"
})

//To Shuffle the Password

function shufflePassword(array)
{
    //Fisher Yates Method
    for (let i =array.length -1; i > 0; i--)
     {
        //This will find out the random j
        const j = Math.floor(Math.random() * (i+1));
        //Swapping the number at i and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

generateBtn.addEventListener('click',()=>
{
    //None of the checkboxes are "Chcecked"
    if(checkcount<=0) return;

    if(passwordLength<checkcount)
    {
        passwordLength=checkcount;
        handleSlider();
    }


    //Let's start the Journey to find a New Password
    console.log("Starting the Jouney");
    //Remove old Password
    password="";

    //Let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked)
    // {
    //     password+=generateUppercase();
    // }

    // if(lowercaseCheck.checked)
    // {
    //     password+=generateLowercase();
    // }

    // if(numbersCheck.checked)
    // {
    //     password+=generateRandomNumber();
    // }

    // if(symbols.checked)
    // {
    //     password+=generateSymbol();
    // }

    let funcArr=[];

    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //Compulsory Addition
    for(let i=0;i<funcArr.length;i++)
    {
        password+=funcArr[i]();
    }
    console.log("Complusory Done")

    //Remaining Addition
    for(let i=0;i<passwordLength-funcArr.length;i++)
    {
        let randIndex=getRandInteger(0,funcArr.length);
        console.log("randIndex"+randIndex);
        password+=funcArr[randIndex]();
    }
    console.log("Remaining Done")

    //Shuffle the Password
    password=shufflePassword(Array.from(password));
    console.log("Shuffling Done")

    //Show in UI
    passwordDisplay.value=password;
    console.log("ui addiotn Done")

    //Strength Bhi dikhana Padega
    calcStrength();
})