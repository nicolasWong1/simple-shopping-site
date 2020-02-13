//Document

$(document).ready(function(){
    
    init(ItemData);
    genMenuBar();
    
    
    var top_px = $('.header_menu').offset();
    $(window).scroll(function(){

        if($(window).scrollTop() > top_px.top){
              $('.header_menu').addClass("fixedBar");
        } else {
            $('.header_menu').removeClass("fixedBar");
        }    
    });
    
    $("#btnShoppingCart").click(showShoppingCart);
    
    $("#btnSearch").click(function(){
        if($("#search").val().length > 0){
            init(ItemData);
            $("#itemsList").prepend("<h2 style='min-width:100%;text-align:center'>Search Result - keywords : "+$("#search").val()+"</h2>");
            $(".item").each(function () {
                $(this).hide(); //.filter(":contains(" + $("#search").val() + ")").show();
                if($(this).text().toLowerCase().indexOf($("#search").val().toLowerCase()) >=0 ){
                    $(this).show();
                }
            });
        }else{
            showTips(2,"Enter the keywords.");
        }
    });
});

function init(ItemData){
    $("#cartItemNum").text(shoppingcart.length);
    scrollBack();
    /*
                            <span class="title">Macbook Pro 13inch 2016 (256gb)</span>
                        <span class="tags">Cate: <a href="###">Notebook</a><br />Tags: <a href="###">macbook</a>, <a href="###">apple</a></span>
                        <span class="desc">Newest Macbook Pro with Retina Display</span>
                        <span class="price"><h6>HKD$</h6>88,888</span>
                        <button class="addToCart">Add to cart</button>
    */
    var _html = $("<div class=\"itemsList\" id=\"itemsList\"></div>");;
    $.each(ItemData, function( index, value ) {
        var _rowItem = $("<div class=\"item\"></div>");
        var _tags = "";
        $.each(value.tags, function (i,val){
            _tags += "<a href=\"javascript:searchTag('"+val+"')\">"+val+"</a> &nbsp;";
        });
            
        
        _rowItem.append("<img src=\""+value.image+"\" />")
                .append("<span class=\"title\">"+value.itemName+"</span>")
                .append("<span class=\"tags\">Cate: <a href=\"javascript:searchCate('"+value.cate+"')\">"+value.cate+"</a><br />Tags: "+_tags+"</span>")
                .append("<span class=\"desc\">"+value.itemDesc+"</span>")
                .append("<span class=\"price\"><h6>HKD$</h6>"+value.price+"</span>");
        var found = false;
        $.each(shoppingcart, function(si,sval){
            if(sval[0].itemId == value.itemId){
                found = true;
            }
        });
        
        if(found){
            _rowItem.append("<button id='items_"+value.itemId+"' class=\"inTheCart\"></button>");
        }else{
            _rowItem.append("<button id='items_"+value.itemId+"' class=\"addToCart\" onclick=\"addTocart("+value.itemId+")\">Add to cart</button>");
        }
        
        if(value.hotItem){
            _rowItem.prepend("<span class='hotitem'>HOT ITEM</span>");
        }

        _html.append(_rowItem);
    });
    applyContent(_html);
    
}

function searchCate(name){
    var _html = $("<div class=\"itemsList\" id=\"itemsList\"></div>");
    _html.append("<h2 style='min-width:100%;text-align:center'>Search Result - category : "+name+"</h2>");
    $.each(ItemData, function( index, value ) {
        var _rowItem = $("<div class=\"item\"></div>");
        var _tags = "";
        $.each(value.tags, function (i,val){
            _tags += "<a href=\"javascript:searchTag('"+val+"')\">"+val+"</a> &nbsp;";
        });
            
        if(value.cate == name) {
            _rowItem.append("<img src=\""+value.image+"\" />")
                    .append("<span class=\"title\">"+value.itemName+"</span>")
                    .append("<span class=\"tags\">Cate: <a href=\"javascript:searchCate('"+value.cate+"')\">"+value.cate+"</a><br />Tags: "+_tags+"</span>")
                    .append("<span class=\"desc\">"+value.itemDesc+"</span>")
                    .append("<span class=\"price\"><h6>HKD$</h6>"+value.price+"</span>");
            var found = false;
            $.each(shoppingcart, function(si,sval){
                if(sval[0].itemId == value.itemId){
                    found = true;
                }
            });

            if(found){
                _rowItem.append("<button id='items_"+value.itemId+"' class=\"inTheCart\"></button>");
            }else{
                _rowItem.append("<button id='items_"+value.itemId+"' class=\"addToCart\" onclick=\"addTocart("+value.itemId+")\">Add to cart</button>");
            }

            _html.append(_rowItem);
            if(value.hotItem){
                _rowItem.prepend("<span class='hotitem'>HOT ITEM</span>");
            }
        }
    });
    applyContent(_html);
}

function searchTag(name){
    var _html = $("<div class=\"itemsList\" id=\"itemsList\"></div>");
    _html.append("<h2 style='min-width:100%;text-align:center'>Search Result - Tag : "+name+"</h2>");
    $.each(ItemData, function( index, value ) {
        var _rowItem = $("<div class=\"item\"></div>");
        var _tags = "";
        $.each(value.tags, function (i,val){
            _tags += "<a href=\"javascript:searchTag('"+val+"')\">"+val+"</a> &nbsp;";
        });
        
        $.each(value.tags, function (i,val){
            if(val == name){
                _rowItem.append("<img src=\""+value.image+"\" />")
                        .append("<span class=\"title\">"+value.itemName+"</span>")
                        .append("<span class=\"tags\">Cate: <a href=\"javascript:searchCate('"+value.cate+"')\">"+value.cate+"</a><br />Tags: "+_tags+"</span>")
                        .append("<span class=\"desc\">"+value.itemDesc+"</span>")
                        .append("<span class=\"price\"><h6>HKD$</h6>"+value.price+"</span>");
                var found = false;
                $.each(shoppingcart, function(si,sval){
                    if(sval[0].itemId == value.itemId){
                        found = true;
                    }
                });

                if(found){
                    _rowItem.append("<button id='items_"+value.itemId+"' class=\"inTheCart\"></button>");
                }else{
                    _rowItem.append("<button id='items_"+value.itemId+"' class=\"addToCart\" onclick=\"addTocart("+value.itemId+")\">Add to cart</button>");
                }
                _html.append(_rowItem);
                if(value.hotItem){
                _rowItem.prepend("<span class='hotitem'>HOT ITEM</span>");
            }
            }
        });
        
            
    });
    applyContent(_html);
}

function newProduct(ItemData){
    scrollBack();
    var _html = $("<div class=\"itemsList\" id=\"itemsList\"></div>");
    var count = 0;
    $.each(ItemData.reverse(), function( index, value ) {
        if(count++ < 10){
            var _rowItem = $("<div class=\"item\"></div>");
            var _tags = "";
            $.each(value.tags, function (i,val){
                _tags += "<a href=\"javascript:searchTag('"+val+"')\">"+val+"</a> &nbsp;";
            });


            _rowItem.append("<img src=\""+value.image+"\" />")
                    .append("<span class=\"title\">"+value.itemName+"</span>")
                    .append("<span class=\"tags\">Cate: <a href=\"javascript:searchCate('"+value.cate+"')\">"+value.cate+"</a><br />Tags: "+_tags+"</span>")
                    .append("<span class=\"desc\">"+value.itemDesc+"</span>")
                    .append("<span class=\"price\"><h6>HKD$</h6>"+value.price+"</span>");
            
            var found = false;
            $.each(shoppingcart, function(si,sval){
                if(sval[0].itemId == value.itemId){
                    found = true;
                }
            });

            if(found){
                _rowItem.append("<button id='items_"+value.itemId+"' class=\"inTheCart\"></button>");
            }else{
                _rowItem.append("<button id='items_"+value.itemId+"' class=\"addToCart\" onclick=\"addTocart("+value.itemId+")\">Add to cart</button>");
            }

            _html.append(_rowItem);
            if(value.hotItem){
                _rowItem.prepend("<span class='hotitem'>HOT ITEM</span>");
            }
        }
    });
    ItemData.reverse();
    applyContent(_html);
}

function showTips(pos,text){
    $(".menuItem:nth-child("+pos+")").append("<div class='tooltips' id='tips_"+pos+"'>"+text+"</div>");
    $("#tips_"+pos).show("fast",function(){
        setTimeout(function() {
            $("#tips_"+pos).remove()
        }, 3000 );
    })
}


function applyContent(html){
    $("#content").html(html);
    scrollBack();
}

function scrollBack(){
    if($(document).scrollTop() > $("#navMenu").offset().top + 48){
        $("body").animate({
            scrollTop: $("#navMenu").offset().top
        });
    }
}
