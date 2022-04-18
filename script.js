let userName = prompt('Insira o seu nome');
let userNameObject = {
    'name' : userName
}    


logIn();
importActiveUsers();
refreshMessages();
setInterval(refreshStatus, 5000); 
setInterval(refreshMessages, 3000);
setInterval(importActiveUsers, 10000);



function logIn()
{
    requisition = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userNameObject);
    requisition.then(refreshMessages);
    requisition.catch(() => {
        alert('Nome já está sendo usado. Por favor, insira outro nome.'); 
         window.location.reload();
        }
    )    
}


function refreshStatus(){
    let requisition = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userNameObject);
}


function refreshMessages(){
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(importMessages);
}


function importMessages(response){
    let allMessages = response.data;
    let filteredMessages = allMessages.filter( (message) => {
        if ( message.to === userName || message.to === "Todos" || message.from === userName){
            return true;
        }else return false;
    })
    displayMessages(filteredMessages);
}

function displayMessages(allMessages){
    document.querySelector('ul').innerHTML = ""; 
    for( let i = 0 ; i < allMessages.length  ; i++ ){
        if (allMessages[i].type === 'status'){
            document.querySelector('ul').innerHTML += `<li class="mensagem status">
                ${allMessages[i].time} ${allMessages[i].from} ${allMessages[i].text} 
            </li>`
        }else if (allMessages[i].type === "message"){
            document.querySelector('ul').innerHTML += `<li class="mensagem geral">
                ${allMessages[i].time} ${allMessages[i].from} para ${allMessages[i].to}: ${allMessages[i].text} 
            </li>`
        }else if (allMessages[i].type === "private_message"){
            document.querySelector('ul').innerHTML += `<li class="mensagem privada">
                ${allMessages[i].time} ${allMessages[i].from} para ${allMessages[i].to}: ${allMessages[i].text} 
            </li>`
        }
    }
   document.querySelector('main').scrollIntoView(false);    
}

function sendMessage(){
    let message = document.querySelector("footer input").value;
    let privacy = document.querySelector('.check-user').querySelector('span').innerHTML;
    let type = "message";
    if ( privacy !== 'Todos' ){ type = "private_message"}
    if (message === '') {
        alert('Mensagem não pode ser vazia!');
        return;
    } 
    let messageObject = {
        from: userName,
        to: privacy, 
        text: message,
        type: type 
    }

    let requisition =  axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", messageObject);

    requisition.then( function() {
        let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
        promise.then(refreshMessages);   
        document.querySelector("footer input").value = '';
    })

    requisition.catch( () => {
            window.location.reload();
    })
    
}

function enterMessage(event){
    let unicode = event.which;
    if ( unicode === 13 ){
        sendMessage();
    }
}

function toggleSideBar(){
    document.querySelector('.sidebar-background').classList.toggle('show-sidebar');
    document.querySelector('.sidebar').classList.toggle('show-sidebar');
}
function pickUser(element){
    let previousChosenUser = document.querySelector(".check-user");
    element.classList.toggle('check-user');
    if(previousChosenUser !== null){
        previousChosenUser.classList.remove('check-user');
    }
    let currentChosenUser = element.querySelector('span');
    let currentPrivacy = document.querySelector('.check-privacy').querySelector("span").innerHTML;
    let bottomImput = document.querySelector('footer').querySelector('div');
    bottomImput.innerHTML = ` Enviando para ${currentChosenUser.innerHTML} (${currentPrivacy})`
}
function pickPrivacy(element){
    let previousChosenPrivacy = document.querySelector(".check-privacy");
    element.classList.add('check-privacy'); 
    if(previousChosenPrivacy !== null){
        previousChosenPrivacy.classList.remove('check-privacy');
    }
    let currentChosenUser = document.querySelector('.check-user').querySelector('span');
    let currentPrivacy = element.querySelector("span").innerHTML;
    let bottomImput = document.querySelector('footer').querySelector('div');
    bottomImput.innerHTML = ` Enviando para ${currentChosenUser.innerHTML} (${currentPrivacy})`
}




function importActiveUsers(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then( (response) => {
        let activeUsers = response.data;
        let sideBarList = document.querySelector('.side-elements');
        sideBarList.innerHTML = 
        `<div class="participants check-user" onclick="pickUser(this)">
            <ion-icon name="people"></ion-icon>
            <span>Todos</span>
            <ion-icon class=" show1" name="checkmark-sharp"></ion-icon>
        </div>` 
        

        for ( let i = 0 ; i < activeUsers.length ; i++ ){
            sideBarList.innerHTML +=  `<div class="participants" onclick="pickUser(this)">
            <ion-icon name="people"></ion-icon>
            <span>${activeUsers[i].name}</span>
            <ion-icon class="hide1" name="checkmark-sharp"></ion-icon>
        </div>`
        }
        
        let bottomImput = document.querySelector('footer').querySelector('div');
        bottomImput.innerHTML = ` Enviando para Todos (Público)`
        
    })
}
