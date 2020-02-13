function getLogin(){
    if(sessionStorage.getItem("account")){
        return JSON.parse(sessionStorage.getItem("account"));
    }else{
        return null;
    }
}

function setAccount(e,bp){
    sessionStorage.setItem("account",JSON.stringify({username:e,bounspoint:bp}));
}

function doLogin(){
    authLogin($("#loginName").val(),$("#loginPwd").val());
}

function doRegister(){
    var err = false;
    $.each(member, function(i,val){
        if(val.email == $("#regName").val()){
            err = true;
        }
    });
    if(err) alert("E-mail address is already in use.");
    if(!(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($("#regName").val()))){
        alert("Incorrect email address format!");    
        err = true;
    }
    if($("#regPwd1").val() != $("#regPwd2").val()){
        alert("Confirm password not match.");    
        err = true;
    }
    if($("#regName").val().length == 0 || $("#regPwd1").val() == 0 || $("#regPwd2").val() == 0){
        alert("Please fill all the blank.");    
        err = true;
    }
    if(!err){
        member.push({email:$("#regName").val(),password:$("#regPwd1").val(),bounspoint:0});
        alert("Create account successfully.");
        showLoginPage();
    }
    console.log(member);
}

function authLogin(username,password){
    var found = false;
    $.each(member, function(i,val){
        if(val.email == username && val.password == password){
            setAccount(val.email,val.bounspoint);
            init(ItemData);
            genMenuBar();
            showTips(3,"Welcome back!");
            found = true;
        }
    });
    if(!found) alert("Email or password not correct!");
}

function genMenuBar(){
    if(getLogin() != null){
        $(".menuItem:nth-child(3)").html("<a href='javascript:logout()'>Logout</a>");
        $(".menuItem:nth-child(4)").html("<a href='javascript:redeemGift()'>Redeem Gift</a>");
    }else{
        $(".menuItem:nth-child(3)").html("<a href='javascript:showLoginPage()' id=\"btnLogin\">Login</a>");
        $(".menuItem:nth-child(4)").html("<a href='javascript:showRegisterPage()'>Register</a>");
    }
}

function logout(){
    var comfirm = confirm("Are you sure that you want to logout? \n *All unsaved information will destroy.");
    if(comfirm){
        sessionStorage.removeItem("account");
        sessionStorage.setItem("shoppingcart",[]);
        shoppingcart = [];
        genMenuBar();
        init(ItemData);
        showTips(3,"Successfully<br />log out.");
    }
}

function showLoginPage(){
    var _html = $("<div class='formBox'></div>");
    _html.append("<h2>Login</h2>")
                 .append("<div class='inputBox'><input type='text' id='loginName' /><label for='regName' class='required title'>E-mail: </label></div>")
                 .append("<div class='inputBox'><input type='password' id='loginPwd' /><label for='regPwd1' class='required title'>Password: </label></div>")
                 .append("<br /><br /><button onclick='doLogin()' id='btnRegSubmit'>Login</button>");
    applyContent(_html);
}

function showRegisterPage(){
    var _html = $("<div class='formBox'></div>");
    _html.append("<h2>Register</h2>")
                 .append("<div class='inputBox'><input type='text' id='regName' /><label for='regName' class='required title'>E-mail: </label></div>")
                 .append("<div class='inputBox'><input type='password' id='regPwd1' /><label for='regPwd1' class='required title'>Password: </label></div>")
                 .append("<div class='inputBox'><input type='password' id='regPwd2' /><label for='regPwd2' class='required title'>Confirm password: </label></div>")
                 .append("<br /><br /><button onclick='doRegister()' id='btnRegSubmit'>Sign up now!</button>");
    applyContent(_html);
}

function redeemGift(){
    var _html = $("<div class='formBox'><h2>Gifts redemption</h2></div>");
    _html.append("<div style=''>Your bouns point: "+getLogin().bounspoint+"</div>");
    var itemList = $("<div class='itemsList'></div>");
    $.each(gifts, function( index, value ) {
        var _rowItem = $("<div class=\"item\"></div>");
               
        _rowItem.append("<img src=\""+value.image+"\" />")
                .append("<span class=\"title\">"+value.gName+"</span>")
                .append("<span class=\"price\"><h6>Bouns point: </h6>"+value.bp+"</span>")
                .append("<button class=\"addToCart\" onclick=\"redeemGiftById("+value.gid+")\">Get it!</button>");

        itemList.append(_rowItem);
    });
    _html.append(itemList);
    applyContent(_html);
}

function withdrawBp(amt){
    $.each(member, function(i,val){
        if(val.email == getLogin().username){
            val.bounspoint -= amt;
            sessionStorage.setItem("account",JSON.stringify({username:val.email,bounspoint:val.bounspoint}));
        }
    });
}

function redeemGiftById(id){
    console.log(gifts[id].bp);
    if(getLogin().bounspoint >= gifts[id-1].bp){
        withdrawBp(gifts[id-1].bp);
        alert("You redeem the gift successfully.");
        redeemGift();
    }else{
        alert("Not enought bouns pount!");
    }
}




















