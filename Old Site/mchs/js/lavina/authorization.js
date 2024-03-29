let current_user = null;

// добавляет после каждого поля ввода в форме регистрации
// строчку для вывода ошибок валидации этого поля
$("#reg-form input[type!=button]").each(function(index){
    $("<div>", {
        'class': 'error-message',
        'id': $(this).attr("name") + "-error-msg",
        'style': "display: none;"
    })
      .insertAfter($(this).next());
});

$("#vixod").click(function(){
    if(user != null){
      logout(onLogout);
    }
});

function onUserLoad(data){
    current_user = data;
    fetchCsrf();
    $("#register-btn").hide();
    $("#vixod").show();
    if(current_user.group == "regular_user"){
        $("#add-pane").hide();
    }
    else{
        $("#add-pane").show();
    }
    $("#current_user_fio").show();
    $("#model-pane").show();
    $("#current_user_fio").text(`Добрый день, ${current_user.fio}`);
}

function onLogout(data){
    current_user = null;
    fetchCsrf();
    $("#register-btn").show();
    $("#vixod").hide();
    $("#add-pane").hide();
    $("#model-pane").hide();
    $("#current_user_fio").hide();
}

function clearForms(){
    $(".error-message").hide();
    $("#reg-form, #login-form").each(function(index){
        $(this)[0].reset();
    });
}

//created by dmitriy
$("#register-btn").click(function () {
    $("#overlay").toggle();
});
  
$("#overlay_img").click(function () {
    $("#overlay").toggle();
    clearForms();
});

// переключение вкладок 
$("#reg-toggle").toggleClass('tab-inactive');
$("#in-toggle").toggleClass('tab-active');

$(".vkladki-toggle").click(function(){
  $("#in").toggle();
  $("#reg").toggle();
  $("#reg-toggle").toggleClass('tab-inactive');
  $("#reg-toggle").toggleClass('tab-active');
  $("#in-toggle").toggleClass('tab-active');
  $("#in-toggle").toggleClass('tab-inactive');
  clearForms();
});

  
$("#register-submit-btn").click(function(){
    register($('#reg-form').serialize(), function(data){
        console.log(data);
        login($('#reg-form')
                .find("input[name=username], input[name=password]").serialize(),
                () => tryFetchCurrentUser(onUserLoad));
        clearForms();
        $("#overlay").hide();
    }, function(data){
        console.log("register failed!");
        console.log(data);
        if(data.responseJSON != undefined){
            for(const [key, value] of Object.entries(data.responseJSON)){
                $(`#${key}-error-msg`).html(value.join("<br>")).show();
            }
        }
    });
});

$("#login-submit-btn").click(function () {
    login($('#login-form').serialize(), function (data) {
        console.log(data);
        $("#login-error").hide();
        tryFetchCurrentUser(onUserLoad);
        clearForms();
        $("#overlay").hide();
    }, function(data){
        if(data.responseJSON != undefined){
            let errorMsg = "Ошибка сервера";
            if(data.responseJSON.detail == "Invalid credentials."){
                errorMsg = "Неверный логин или пароль";
            }
            $("#login-error").text(errorMsg).show();
        }
        console.log("login failed");
        console.log(data);
    });
});

window.addEventListener("load", function(event) {
    tryFetchCurrentUser(onUserLoad, onLogout);
});