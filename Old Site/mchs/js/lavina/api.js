HOST = "https://projects.masu.edu.ru/lyamin/lavina_server"
REGISTER = "/register"
CSRF = "/crsf"
LOGIN = "/login"
LOGOUT = "/logout"
WHOAMI = "/whoami"

let current_user = null;

function __post(url, data, ondonecallback, onfailcallback = null){
    $.post({
        'url': url,
        'data': data,
        'dataType': 'json'})
    .done(ondonecallback)
    .fail(onfailcallback);
}

function __get(url, ondonecallback, onfailcallback = null){
    $.ajax({
        'url': url,
        'dataType': 'json'})
    .done(ondonecallback)
    .fail(onfailcallback);
}

// load and set CSRFToken
function fetchCsrf(){
    $.ajax({
        url: HOST + CSRF,
        dataType: 'json'
      }).done(function (data){
        console.log("Loaded token: "+data);
        $.ajaxSetup({
           headers: { 'X-CSRFToken':  data["X-CSRFToken"]} 
          });
      });
}

function tryFetchCurrentUser(onuserload, onfail){
    __get(HOST + WHOAMI, onuserload,
    // user is not autheficated
    onfail);
}

function logout(onlogout){
    __get(HOST + LOGOUT, onlogout,
        function(data){
            console.log("something went wrong");
            console.log(data);
        });
}

function register(data, ondonecallback, onfailcallback = null){
    __post(HOST + REGISTER, data, ondonecallback, onfailcallback);
}

function login(data, ondonecallback, onfailcallback = null){
    __post(HOST + LOGIN, data, ondonecallback, onfailcallback);
}

fetchCsrf();
