import { Calculator } from "./Calculator.js"


// ---------- GLOBAL VARS ----------

var usernameDom = document.getElementById('username');
var expressionDom = document.getElementById('expression');
var resultDom = document.getElementById('result');

var numInputDom = document.getElementById('numberInput');

// ---------- EVENTS ----------
document.querySelectorAll("[exp='roller']").forEach(btn => btn.onclick = () => CalculateExpression());
document.querySelectorAll("[exp='inner']").forEach(btn => btn.onclick = () => AddToExpression(btn.innerHTML));
document.querySelectorAll("[exp='dice']").forEach(btn => btn.onclick = () => AddToExpression(numInputDom.value + btn.innerHTML));

document.querySelector("[exp='diceX']").onclick = () => AddToExpression(numInputDom.value + "D");
document.querySelector("[exp='clear']").onclick = () => ClearExpression();
document.querySelector("[exp='del']").onclick = () => expressionDom.value = expressionDom.value.slice(0, -1);

// ---------- ETC ----------

function log(arg){
    console.log(arg);
}

function ChangeCSS(cssFile, cssLinkIndex) 
{
    const oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

    const newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", cssFile);

    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}

// ---------- EXPRESSION ----------
var savedExp;
function ClearExpression(str)
{
    savedExp = expressionDom.value;
    expressionDom.value = String();
    //TODO display undo btn (during X) times and after that undisplay and set savedExp to null;
}

function AddToExpression(str)
{
    expressionDom.value += str;
}

function CalculateExpression(goHist = true)
{
    const exp = expressionDom.value;
    if (exp !== "") {
        var calc = new Calculator(exp, () => console.log("Incorrect Formula"));
        if (calc.validExp){
            SetResults(calc.GetValues());
            if (goHist) 
                AddHist();
        }
    }
}

function SetResults(result)
{
    resultDom.value = result.roll;
    document.getElementById('result-half').value = result.roll/2;
    document.getElementById('result-onethird').value = Math.round((result.roll/3 + Number.EPSILON) * 100) / 100;
    document.getElementById('result-min').value = result.minRoll;
    document.getElementById('result-max').value = result.maxRoll;
}

function ReCreate(expElement)
{
    expressionDom.value = expElement.innerHTML;
    CalculateExpression(false);
}

// ---------- HISTORIC ----------
const histArr = [];

function AddHist()
{
    let histContainer = document.getElementById("left-side").getElementsByClassName("container")[0];

    let newEl = document.createElement("div");
    newEl.className = "hist-item";
    let exp = document.createElement("span");
    exp.setAttribute("text", "exp");
    let btn = document.createElement("button");
    let result = document.createElement("span");
    result.setAttribute("text", "result");

    exp.innerHTML = expressionDom.value;
    btn.innerHTML = 'X';
    result.innerHTML = resultDom.value;    

    newEl.ondblclick = () => ReCreate(exp); 
    btn.onclick = (x) => RemoveHist(x.target);    

    newEl.appendChild(exp);
    newEl.appendChild(btn);
    newEl.appendChild(document.createElement("br"));
    newEl.appendChild(result);    
    histContainer.insertBefore(newEl, histContainer.childNodes[0]);
}

function RemoveHist(el)
{
    el.parentNode.remove();
}

// ---------- CHAT ----------

function NewMessage()
{
    const chatContainer = document.getElementById("right-side").getElementsByClassName("container")[0];
    const newEl = document.createElement("div");

    const name = document.createElement("span");
    name.setAttribute("text", "name");
    const dt = document.createElement("span");
    dt.setAttribute("text", "data");
    const result = document.createElement("span");
    result.setAttribute("text", "result");
    const exp = document.createElement("span");
    exp.setAttribute("text", "exp");

    name.innerHTML = usernameDom.value;    
    dt.innerHTML = Date();
    result.innerHTML = resultDom.value;
    exp.innerHTML = expressionDom.value;

    newEl.ondblclick = () => ReCreate(exp); 

    newEl.appendChild(name);
    newEl.appendChild(dt);
    newEl.appendChild(document.createElement("br"));
    newEl.appendChild(result);
    newEl.appendChild(exp);
    chatContainer.appendChild(newEl);
}