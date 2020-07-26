import Calculator from "./Calculator.js"

// ---------- GLOBAL VARS ----------
try{
    var socket = io();

    socket.on('newMessage', (message) => {
        SetMessage(message.name, message.date, message.result, message.exp);
    });
} catch{
    console.log("No server!!")
}

var usernameDom = document.getElementById('username');
var expressionDom = document.getElementById('expression');
var resultDom = document.getElementById('result');

var numInputDom = document.getElementById('numberInput');

// ---------- EVENTS ----------

document.querySelectorAll("[exp='roller']").forEach(btn => btn.onclick = () => CalculateExpression());
document.querySelectorAll("[exp='inner'],[exp='operator']").forEach(btn => btn.onclick = () => AddToExpression(btn.innerHTML));
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
    ResetResults();
    //TODO display undo btn (during X) times and after that undisplay and set savedExp to null;
}

function AddToExpression(str)
{
    expressionDom.value += str;
}

function CalculateExpression(isRecreation = false)
{
    const exp = expressionDom.value;
    if (exp !== "") {
        var calc = new Calculator(exp, () => console.log("Incorrect Formula"));
        if (calc.validExp){
            SetResults(calc.GetValues());
            if (!isRecreation){
                AddHist();
                SendMessage();
            }
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

function ResetResults()
{
    resultDom.value = "";
    document.getElementById('result-half').value = "";
    document.getElementById('result-onethird').value = "";
    document.getElementById('result-min').value = "";
    document.getElementById('result-max').value = "";
}

function ReCreate(expElement)
{
    expressionDom.value = expElement.innerHTML;
    ResetResults();
    //CalculateExpression(true);
}

// ---------- HISTORIC ----------
//const histArr = [];

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
//const chatArr = [];

function SendMessage()
{
    const message = {
        name: usernameDom.value, 
        data: null,
        result: resultDom.value, 
        exp: expressionDom.value
    }
    
    if(io)
        socket.emit('sendMessage', message);
}

function SetMessage(username, date, nbResult, expression)
{
    console.log(date);
    const chatContainer = document.getElementById("right-side").getElementsByClassName("container")[0];
    const newEl = document.createElement("div");
    newEl.className = "chat-item";
    const name = document.createElement("span");
    name.setAttribute("text", "name");
    const dt = document.createElement("span");
    dt.setAttribute("text", "date");
    const result = document.createElement("span");
    result.setAttribute("text", "result");
    const exp = document.createElement("span");
    exp.setAttribute("text", "exp");

    name.innerHTML = username;    
    dt.innerHTML = date;
    result.innerHTML = nbResult;
    exp.innerHTML = expression;

    newEl.ondblclick = () => ReCreate(exp); 

    newEl.appendChild(name);
    newEl.appendChild(dt);
    newEl.appendChild(result);
    newEl.appendChild(exp);
    chatContainer.appendChild(newEl);
}