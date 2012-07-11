var home = {
    load : function(){
        var oi = $("#login").html();
        var data = {
            title : "Login",
            user : "Usuário",
            pass : "Senha",
            login: "Login"
        };
        var html = require('ejs').render(oi, {data : data});
        var login = $(html).find(".login-window");
        login.dialog({
            buttons: {
                "Login": function () {
                    $(this).dialog("close");
                }
            },
            draggable:false,
            resizable:false,
            position: ["right","center"]
        });
        login.find('input[type=button]').button();
        login.parents(".ui-dialog").css("left", (parseInt(login.parents(".ui-dialog").css("left"))-150)+"px");
        login.parents(".ui-dialog").css("top", (parseInt(login.parents(".ui-dialog").css("top"))-50)+"px");
        login.parents(".ui-dialog").css("border-radius", "5px");
        login.parents(".ui-dialog").find(".ui-dialog-titlebar-close").remove();
    },
    login : function(){

    }
}
onload = function(){
    home.load();
}
