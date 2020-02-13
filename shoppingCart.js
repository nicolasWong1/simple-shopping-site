if(!sessionStorage.getItem("shoppingcart")){
    sessionStorage.shoppingcart = JSON.stringify([]);
}
var shoppingcart = JSON.parse(sessionStorage.shoppingcart);

function addTocart(index){
    var found = false;
    $.each(shoppingcart, function(i,val){
        if(val[0].itemId == index){
            alert("This product already in your shopping cart.");
            found = true;
        }
        
    });
    if(!found){
        showTips(5,"Added one items");
        shoppingcart.push([ItemData[index],1]);
        $("#cartItemNum").text(shoppingcart.length);
        saveShoppingCart(shoppingcart);
        $("#items_"+index).removeClass("addToCart").addClass("inTheCart").text("");
    }
}

function showShoppingCart(){
    var _html = $("<div class=\"shoppingCartList\" id=\"shoppingCartList\"></div>");
    var sidebar = $("<div class='sidebar'><h2>Subtotal</h2></div>");
    var sidebarUL = $("<ul id='bill'></ul>");
    var totalAmt = 0;
    $.each(shoppingcart, function( index, val ) {
        var value = val[0];
        var _rowItem = $("<div class=\"item\"></div>");
        var _tags = "";
        $.each(value.tags, function (i,val){
            _tags += "<a href=\"javascript:searchTag('"+val+"')\">"+val+"</a> &nbsp;";
        });
            
        
        _rowItem.append("<button class=\"removeBtn\" onclick=\"removeFormCart("+index+")\">&#10008;</button>")
                .append("<img src=\""+value.image+"\" />")
                .append("<span class=\"title\">"+value.itemName+"</span>")
                .append("<span class=\"tags\">Cate: <a href=\"javascript:searchCate('"+value.cate+"')\">"+value.cate+"</a><br />Tags: "+_tags+"</span>")
                .append("<span class=\"desc\">"+value.itemDesc+"</span>")
                .append("<span class=\"price\"><h6>HKD$</h6>"+value.price+"</span>")
                .append("<div class=\"qty\"><button class=\"addQtyBtn\" onclick=\"addQty("+index+")\">+</button><input type='text' id='qtyOf_"+index+"' value='"+val[1]+"' disabled=disabled /><button class=\"drawQtyBtn\" onclick=\"drawQty("+index+")\">-</button></div>");

        _html.append(_rowItem);
        
        var subtotal = parseInt(value.price) * val[1];
        totalAmt+=subtotal;
        
        var _subRow = $("<li></li>");
        _subRow.append("<p>"+value.itemName+"<br />Qty: "+val[1]+"</p>")
               .append("<span class='sub'>HKD$"+subtotal+"</span>");
        sidebarUL.append(_subRow);
    });
    
    applyContent(_html);
    sidebar.append(sidebarUL);
    sidebarUL.append("<li><span class='sub'><b>Total Amount:</b> HKD$"+totalAmt+"</span></li>");
    checkoutDisplay(sidebar);
    $("#content").append(sidebar);
    $("#wrong").hide();
    scrollBack();
}

function addQty(index){
    var _item = shoppingcart[index];
    _item[1]++;
    $("#qtyOf_"+index).val(shoppingcart[index][1]);
    updateSidebar();
    saveShoppingCart(shoppingcart);
}

function drawQty(index){
    var _item = shoppingcart[index];
    if(_item[1] > 1) _item[1]--;
    $("#qtyOf_"+index).val(shoppingcart[index][1]);
    updateSidebar();
    saveShoppingCart(shoppingcart);
}

function removeFormCart(index){
    var comfirm = confirm("Are you sure that you want to delete this item?");
    if(comfirm){
        shoppingcart.splice(index, 1);
        $("#cartItemNum").text(shoppingcart.length);
        showShoppingCart();
        saveShoppingCart(shoppingcart);
    }
}

function updateSidebar(){
    var sidebarUL = $("#bill");
    sidebarUL.html("");
    var totalAmt = 0;
    $.each(shoppingcart, function( index, val ) {
        var value = val[0];
        var subtotal = parseInt(value.price) * val[1];
        var _subRow = $("<li></li>");
        _subRow.append("<p>"+value.itemName+"<br />Qty: "+val[1]+"</p>")
               .append("<span class='sub'>HKD$"+subtotal+"</span>");
        sidebarUL.append(_subRow);
        totalAmt += subtotal;
    });
    sidebarUL.append("<li><span class='sub'><b>Total Amount:</b> HKD$"+totalAmt+"</span></li>");
    
    
}

function checkoutDisplay(sidebar){
    var _html = $("<div class='checkoutBox'></div>");
    if(getLogin() == null){
        _html.append("<span id='wrong'></span>Enter your email address: <br /><input type=email id='emailAddr' required=required placeholder='example@example.com' /><br />");
    }
    _html.append("Select payment method: <br />")
        .append("<label><input type=radio name=paymentMethod value=1 id=Creditcard checked=checked onclick='$(\"#payViaOnline\").show();' />Credit card (VISA / MasterCard)</label><br />")
        .append("<label><input type=radio name=paymentMethod value=2 id=atCashierOffice onclick='$(\"#payViaOnline\").hide();' />At Cashier Office</label><br />")
        .append($("<div id='payViaOnline'></div>")
        .append("Credit Card No.<br /><input type='text' class='creditCardNum' id='creditCardNum1' maxlength='4' size='4' />")
        .append("-<input type='text' class='creditCardNum' id='creditCardNum2' maxlength='4' size='4' />")
        .append("-<input type='text' class='creditCardNum' id='creditCardNum3' maxlength='4' size='4' />")
        .append("-<input type='text' class='creditCardNum' id='creditCardNum4' maxlength='4' size='4' />")
        .append("<br />Expiry Date: <input type='text' class='creditCardNum' id='edMM' maxlength='2' size='2' placeholder='MM' />")
        .append(" / <input type='text' class='creditCardNum' id='edYYYY' maxlength='4' size='4' placeholder='YYYY' />")
       .append("<br /> Security Code: <input type='text' class='creditCardNum' id='ss' maxlength='3' size='3' />"))
        .append("<button class='checkoutBtn' onclick='checkoutCart()'>Check-out!</button>");
    sidebar.append(_html);
}

function checkoutCart(){
    if(shoppingcart.length == 0){
        alert("Empty shopping cart.")
    }else{
        var check = true;
        if(getLogin() == null){
            if($("#emailAddr").val().length == 0){
                $("#wrong").show();
                $("#wrong").text("Please enter the email address!");
                check = false;
            }
            if(!(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($("#emailAddr").val()))){
                $("#wrong").show();
                $("#wrong").text("Incorrect email address format!");
                check = false;
            }
        }
        if($('input[type="radio"][name="paymentMethod"]:checked').val() == 1){
            $(".creditCardNum").each(function(i, obj){
                if(check){
                if(obj.getAttribute("length") != obj.getAttribute("size")){
                    if(obj.value.length == 0){
                        $("#wrong").show();
                        $("#wrong").text("Please fill all the blank.");
                        check = false;
                    }
                    if(isNaN(obj.value)){
                        $("#wrong").show();
                        $("#wrong").text("Accept number only.");
                        check = false;
                    }else{
                        if(obj.id == "edMM" && !(parseInt(obj.value) > 0 && parseInt(obj.value) < 13 )){
                            $("#wrong").show();
                            $("#wrong").text("Month need to be 1 to 12.");
                            check = false;
                        }
                    }
                    
                }
                }
            });
        }
        if(check){
            $("#wrong").hide();
            finishCheckout();
        }
    }
}

function finishCheckout(){
    alert("Checkout sucessfully!");
    if(getLogin() != null){
        addbp(shoppingcart);
    }
    shoppingcart.splice(0,shoppingcart.length);
    saveShoppingCart(shoppingcart);
    $("#cartItemNum").text(shoppingcart.length);
    showShoppingCart();
}

function saveShoppingCart(shoppingcart){
    sessionStorage.shoppingcart = JSON.stringify(shoppingcart);
}

function addbp(shoppingcart){
    var bp = 0,totalAmt = 0;
    $.each(shoppingcart, function( index, val ) {
        var value = val[0];
        var subtotal = parseInt(value.price) * val[1];
        totalAmt += subtotal;
    });
    bp = parseInt(totalAmt * 0.03);
    $.each(member, function(i,val){
        if(val.email == getLogin().username){
            val.bounspoint += bp;
            sessionStorage.setItem("account",JSON.stringify({username:val.email,bounspoint:val.bounspoint}));
        }
    });
}

















