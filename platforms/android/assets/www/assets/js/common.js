document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {   
    window.open = cordova.InAppBrowser.open;
}

function inAppBrowserFunction(url){
    window.open(url, '_blank', 'location=yes');
}

var currentPage = localStorage.getItem('currentPage');

if(typeof currentPage !== "undefined" && currentPage !== null && currentPage !== ""){
    if (typeof localStorage.getItem('appMenu') !== 'undefined' && localStorage.getItem('appMenu') !== null && currentPage != "home"){                          

        var resultHtml = "";
        var appMenu = JSON.parse(localStorage.getItem('appMenu'));
        var menuClass = "";
        $.each(appMenu, function( key, value ) { 
            menuClass = (currentPage == value.button_link) ? "active" : "";
            resultHtml += "<li class='"+menuClass+"'><a href='"+value.button_link+".html'><i class='fa fa-"+value.menu_icon+"'></i>"+value.title+"</a></li>";    
        });        
        $("ul.nav-tabs").html(resultHtml);                
    }   
}

$(".close-btn").click(function(){
    $(".login-error").hide();    
    $("body").removeClass("popbackground");
});

if(currentPage == "index"){ 
    
    $.ajax({

        url : 'http://techmatessolutions.com/nouthlp/webAPI.php',
        type : 'POST',
        data : {
            'action' : 'options_data'
        },
        dataType:'json',
        success : function(data) {                          
            if(data.status == "success"){
                $(".signup-button").attr("data-href",data.data.register_user_link); 
                $(".nh-logo-image").attr("src", data.data.app_logo);

                localStorage.setItem('appLogo', data.data.app_logo);
                localStorage.setItem('appForgotPasswordLink', data.data.forgot_password_link);
                localStorage.setItem('appMenu', JSON.stringify(data.data.mobile_menu));
                loader("hide");
            }
        },
        error : function(request,error)
        {
            console.log("Request: "+JSON.stringify(request));
            loader("hide");
        }
    });

    if (typeof localStorage.getItem('userData') !== 'undefined' && localStorage.getItem('userData') !== null){            
        location.href = "home.html";
    }

    $(".signup-button").click(function(){
        inAppBrowserFunction($(this).attr("data-href"));
    });
}

if(currentPage == "login"){       
    loader("hide");
    if (typeof localStorage.getItem('appLogo') !== 'undefined' && localStorage.getItem('appLogo') !== null){            
        $(".nh-logo-image").attr("src", localStorage.getItem('appLogo'));
    }

    if (typeof localStorage.getItem('appForgotPasswordLink') !== 'undefined' && localStorage.getItem('appForgotPasswordLink') !== null){            
        $(".forgot-password-link").attr("href", localStorage.getItem('appForgotPasswordLink'));
    }
    
    $("#loginform").submit(function(event) {
        loader("show");
        if($("#login_username").val().length == 0 || $("#login_password").val().length == 0)
        {            
            $(".login-error p").html("Username and Password is required");
            error_popup("show");
            loader("hide");
        }
        else{
            error_popup("hide");
            $(".btn-submit").html("Loading...").prop("disabled", true);
            $.ajax({
                url : 'http://techmatessolutions.com/nouthlp/webAPI.php',
                type : 'POST',
                data : {
                    'action' : 'authenticateuser',
                    'username' : $("#login_username").val(),
                    'password' : $("#login_password").val()
                },
                dataType:'json',
                success : function(data) {
                    if(data.usersdata.status == 1){
                        localStorage.setItem('userData', JSON.stringify(data.usersdata.userdata));
                        $(".user_display_name").html(data.usersdata.userdata.data.display_name);
                        location.href = "home.html";
                        $("#loginform").submit();
                        $('#loginform').unbind('submit');
                        loader("hide");
                    }
                    else{
                        $(".login-error p").html(data.usersdata.message);
                        error_popup("show");                        
                        $(".btn-submit").html("Sign In").prop("disabled", false);
                        loader("hide");
                    }                    
                },
                error : function(request,error)
                {
                    console.log("Request: "+JSON.stringify(request));
                    loader("hide");
                }

            });
        }           
        event.preventDefault();      
    });

}

if(currentPage == "home"){
    
    if (typeof localStorage.getItem('appMenu') !== 'undefined' && localStorage.getItem('appMenu') !== null){                          

        var resultHtml = "";
        var appMenu = JSON.parse(localStorage.getItem('appMenu'));
        $.each(appMenu, function( key, value ) {

            console.log(value);
            resultHtml += "<li>";
                resultHtml += "<img src='"+value.image+"' class='img-responsive' />";
                resultHtml += "<div class='no-text-box'>";
                    resultHtml += "<a href='"+value.button_link+".html'>"+value.title+"</a>";
                resultHtml += "</div>";
            resultHtml += "</li>";    
        });        
        $(".no-home-menu").html(resultHtml);
        loader("hide");
    }
}

if(currentPage == "store"){   

    var userdata = JSON.parse(localStorage.getItem('userData'));
    $(".user_display_name").html(userdata.data.display_name);
    var returnHTML = "";
    $.ajax({

        url : 'http://techmatessolutions.com/nouthlp/webAPI.php',
        type : 'POST',
        data : {
            'action' : 'productlist'
        },
        dataType:'json',
        success : function(data) {                          
            if(data.status == "success"){
                $.each( data.data.productdata, function( key, value ) {

                    returnHTML += "<li>";
                        returnHTML += "<a data-href='"+value.link+"' target='_blank' class='product-button'>";
                            returnHTML += "<div class='nh-product-img'><img src='"+value.productImg.image+"' class='img-responsive' />";
                            returnHTML += "</div>";
                            returnHTML += "<h4>"+value.title+"</h4>";
                            returnHTML += "<h5 class='nh-product-price'>$ "+value.price+"</h5>";
                        returnHTML += "</a>";    
                    returnHTML += "</li>"; 
                });
                returnHTML += "<div class='clearfix'></div>";
                $("ul.nh-product-list").html(returnHTML);
                loader("hide");
            }
            else{
                $("ul.nh-product-list").html("<li>No Data Found</li><div class='clearfix'></div>");
                loader("hide");
            }
        },
        error : function(request,error)
        {
            console.log("Request: "+JSON.stringify(request));
            loader("hide");
        }
    });

    $("body").on("click", ".product-button", function(){
        inAppBrowserFunction($(this).attr("data-href"));
    });
}

if(currentPage == "articles"){
    var userdata = JSON.parse(localStorage.getItem('userData'));
    $(".user_display_name").html(userdata.data.display_name);    
    var returnHTML = "";
    $.ajax({

        url : 'http://techmatessolutions.com/nouthlp/webAPI.php',
        type : 'POST',
        data : {
            //'action' : 'postlist'
            'action' : 'free_material_childs'
        },
        dataType:'json',
        success : function(data) {                          
            if(data.status == "success"){
                $.each( data.data.postdata, function( key, value ) {                
                    returnHTML += "<li>";
                        returnHTML += "<a href='#' onClick='post_detail("+value.ID+")'>";
                            returnHTML += value.title;
                            /*returnHTML += "<img src='"+value.productImg.image+"' class='img-responsive' />";                            
                                returnHTML += "<div class='nl-blog-overlay'>";
                                    returnHTML += "<div class='nl-blog-title'>";
                                        returnHTML += "<h4>"+value.title+"</h4>";
                                        returnHTML += "<h5>"+value.postdate+"</h5>";
                                    returnHTML += "</div>";
                                returnHTML += "</div>";*/
                            returnHTML += "</a>";
                    returnHTML += "</li>";
                });                
                $("ul.nl-blog-list").html(returnHTML);
                loader("hide");
            }
            else{
                $("ul.nl-blog-list").html("<li>No Data Found</li><div class='clearfix'></div>");
                loader("hide");
            }
        },
        error : function(request,error)
        {
            console.log("Request: "+JSON.stringify(request));
            loader("hide");
        }
    });
}

if(currentPage == "post_detail"){
    var userdata = JSON.parse(localStorage.getItem('userData'));
    $(".user_display_name").html(userdata.data.display_name);    
    var returnHTML = "";
    $.ajax({

        url : 'http://techmatessolutions.com/nouthlp/webAPI.php',
        type : 'POST',
        data : {
            //'action' : 'postdetail',
            'action' : 'free_material_child_detail',
            'postid' : localStorage.getItem('postid')
        },
        dataType:'json',
        success : function(data) {                          
            if(data.status == "success"){                              
                    $("#article_title").html(data.data.postdata.title);

                    returnHTML += "<div class='nl-post-img'><img src='"+data.data.postdata.productImg.image+"' class='img-responsive' /></div>";
                    returnHTML += "<div class='nl-posi-title'>";
                        //returnHTML += "<h4>"+data.data.postdata.title+"</h4>";
                        returnHTML += "<h5>"+data.data.postdata.postdate+"</h5>";
                    returnHTML += "</div>";
                    returnHTML += "<div class='clearfix'></div>";
                    returnHTML += "<p style='direction:rtl;'>"+data.data.postdata.content+"</p>";                    
                
                $(".nl-post-details").html(returnHTML);
                loader("hide");
            }
            else{
                $(".nl-post-details").html("No Data Found");
                loader("hide");
            }
        },
        error : function(request,error)
        {
            console.log("Request: "+JSON.stringify(request));
            loader("hide");
        }
    });
}

if(currentPage == "order"){
    var userdata = JSON.parse(localStorage.getItem('userData'));
    $(".user_display_name").html(userdata.data.display_name);
    var returnHTML = "";
    $.ajax({

        url : 'http://techmatessolutions.com/nouthlp/webAPI.php',
        type : 'POST',
        data : {
            'action' : 'customer_orders',
            'customer_id' : userdata.data.ID
        },
        dataType:'json',
        success : function(data) {                          
            if(data.status == "success"){
                $.each( data.order_data, function( key, value ) {

                    returnHTML += "<li>";
                        returnHTML += "<div class='media'>";
                            returnHTML += "<div class='media-left'>"
                                returnHTML += "<div class='nh-order-img'>";
                                    returnHTML += "<img class='media-object img-responsive' src='"+value.product_image+"' alt='order-product'>";
                                returnHTML += "</div>";
                            returnHTML += "</div>";
                            returnHTML += "<div class='media-body'>";
                                returnHTML += "<h4 class='media-heading'>"+value.name+"</h4>";
                                returnHTML += "<div class='nh-justify-content'>";
                                    returnHTML += "<h5 class='nl-order-date'>01/01/2018</h5>";
                                    returnHTML += "<h5 class='nl-order-price'>$ "+value.total+"</h5>";
                                returnHTML += "</div>";
                            returnHTML += "</div>";
                            returnHTML += "<div class='media-btn'>";
                                if(value.download_link != ""){
                                returnHTML += "<a data-href='"+value.download_link+"' target='_blank' type='button' class='btn order-button'><i class='fa fa-download'></i></a>";
                                }
                            returnHTML += "</div>";
                        returnHTML += "</div>";
                    returnHTML += "</li>";
                });
                $("ul.nl-order-list").html(returnHTML);
                loader("hide");
            }
            else{
                $("ul.nl-order-list").html("<li>No Data Found</li>");
                loader("hide");
            }
        },
        error : function(request,error)
        {
            console.log("Request: "+JSON.stringify(request));
            loader("hide");
        }
    });

    $("body").on("click",".order-button", function(){
        inAppBrowserFunction($(this).attr("data-href"));
    });
}

if(currentPage == "material"){
    var userdata = JSON.parse(localStorage.getItem('userData'));
    $(".user_display_name").html(userdata.data.display_name);
    var returnHTML = "";
    $.ajax({

        url : 'http://techmatessolutions.com/nouthlp/webAPI.php',
        type : 'POST',
        data : {
            'action' : 'free_material'
        },
        dataType:'json',
        success : function(data) {                                      
            if(data.status == "success"){                
                $.each( data.data, function( key, value ) {
                    returnHTML += "<li>";
                        returnHTML += "<iframe src='"+value+"' width='100%' height='auto' frameborder='0' allowfullscreen='allowfullscreen'></iframe>";
                    returnHTML += "</li>";
                });
                
                $("ul.nl-videos").html(returnHTML);             
                loader("hide");  
                
            }
            else{
                $("ul.nl-videos").html("<li>No Data Found</li>");
                loader("hide");
            }
        },
        error : function(request,error)
        {
            console.log("Request: "+JSON.stringify(request));
            loader("hide");
        }
    });
}

function ArrayToObject(arr){
    var obj = {};
    for (var i = 0;i < arr.length;i++){
        obj[arr[i]] = arr[i];
    }
    return obj
}

if(currentPage == "goal"){    

    if(typeof localStorage['category'] !== "undefined" && localStorage['category'] != "undefined")
    {
        jsoncatObject = JSON.parse(localStorage['category']);        
    }
    /*else{
        var catObject = new Object();
        var catObjectArr = new Array();
        catObject.categoryName = "Social";  
        catObject.goals = ["Social goal"];
        catObjectArr.push(catObject);
        localStorage['category'] = JSON.stringify(catObjectArr);    
        jsoncatObject = JSON.parse(localStorage['category']);        
    }*/   

    resultHtml = "";
    if(typeof jsoncatObject != "undefined" && jsoncatObject != ""){
        $.each(jsoncatObject, function(index, value){
            if(typeof value !== "undefined" && value != null){
                resultHtml += '<li class="list-group-item">';
                    resultHtml += '<div class="action-buttons">';
                        resultHtml += '<a href="#"><span class="glyphicon glyphicon-trash" onClick="remove_category('+index+')"></span></a>';
                        resultHtml += '<a href="#" onClick="rename_category('+index+')"><span class="glyphicon glyphicon-pencil"></span></a>';
                    resultHtml += '</div>';
                    resultHtml += '<a href="#" onClick="category_goal('+index+')" class="nh-list">';
                        resultHtml += '<label>'+value.categoryName+'</label>';
                    resultHtml += '</a>';
                resultHtml += '</li>';
            }
        });        
        $(".nh-goal-list").html(resultHtml);        
    }
    loader("hide");
}

if(currentPage == "rename-category"){  
    var categoryId = localStorage.getItem('categoryid');
    jsoncatObject = JSON.parse(localStorage['category']);
    if(typeof jsoncatObject != "undefined" && jsoncatObject != ""){
        $.each(jsoncatObject, function(index, value){
            if(index == categoryId){
                $("#category_name").val(value.categoryName);
            }
        });
    }

    $(".goal-rename-btn").click(function(){
        if(typeof jsoncatObject != "undefined" && jsoncatObject != ""){
            $.each(jsoncatObject, function(index, value){
                if(index == categoryId){
                    value.categoryName = $("#category_name").val();
                }
            });
        }     
        localStorage['category'] = JSON.stringify(jsoncatObject);    
        window.location = "goal.html";
    });
}


if(currentPage == "add-new-goal"){  
    var categoryId = localStorage.getItem('categoryid');
    var goalId = localStorage.getItem('goalid');
    var buttonType = localStorage.getItem("buttonType");

    if(buttonType == "edit"){
        $(".add-new-goal-btn").val("Rename");
    }

    jsoncatObject = JSON.parse(localStorage['category']);
    if(typeof jsoncatObject != "undefined" && jsoncatObject != ""){
        $.each(jsoncatObject, function(index, value){
            if(index == categoryId){
                $("#category_name").val(value.categoryName);                
                if(buttonType == "addGoal"){
                    goalId = value.goals.length;
                    $(".add-new-goal-btn").val("إضافة");                             
                }
                else{
                    if(value.goals.length > 0){ 
                        $.each(value.goals, function(arrIndex, arrValue){
                            if(goalId == arrIndex){
                                $("#goal-name").val(arrValue);
                            }
                        });
                    }
                }
            }
        });
    }    

    $(".add-new-goal-btn").click(function(){

        if($("#goal-name").val() == ""){
            error_popup("show");
        }else{
            if(typeof jsoncatObject != "undefined" && jsoncatObject != ""){
                $.each(jsoncatObject, function(index, value){
                    if(index == categoryId){
                        if(value.goals.length > 0){ 
                            if(buttonType == "addGoal"){
                                value.goals[goalId] = $("#goal-name").val();
                            }
                            else{
                                $.each(value.goals, function(arrIndex, arrValue){
                                    if(goalId == arrIndex){
                                        value.goals[arrIndex] = $("#goal-name").val();
                                    }
                                });
                            }
                        }
                        else{
                            value.goals[0] = $("#goal-name").val();
                        }
                    }
                });
            }     
            localStorage['category'] = JSON.stringify(jsoncatObject); 
            localStorage.setItem('categoryid', categoryId);           
            window.location = "category-goals.html";
        }
    });
}

if(currentPage == "add-new-category"){
    $(".add-new-category").click(function(){

        if($("#category_name").val() == ""){
            error_popup("show");
        }
        else{
            if(typeof localStorage['category'] !== "undefined" && localStorage['category'] != "undefined")
            {
                jsoncatObject = JSON.parse(localStorage['category']);  
                var catObject = new Object();
                catObject.categoryName = $("#category_name").val(); 
                catObject.goals = [];    
                jsoncatObject.push(catObject);      

                localStorage['category'] = JSON.stringify(jsoncatObject);    
                window.location = "goal.html";
            }
            else{
                var catObject = new Object();
                var catObjectArr = new Array();
                catObject.categoryName = $("#category_name").val();  
                catObject.goals = [];
                catObjectArr.push(catObject);
                localStorage['category'] = JSON.stringify(catObjectArr);    
                jsoncatObject = JSON.parse(localStorage['category']);        
            }  
        }        
    });     
}

if(currentPage == "category-goals"){
    
    var categoryId = localStorage.getItem('categoryid');
    jsoncatObject = JSON.parse(localStorage['category']);
    resultHtml = "";
    if(typeof jsoncatObject != "undefined" && jsoncatObject != ""){
        $.each(jsoncatObject, function(index, value){
            if(index == categoryId){
                $("#category_name").html(value.categoryName);
                if(value.goals.length > 0){ 
                    $.each(value.goals, function(arrIndex, arrValue){
                        
                        resultHtml += '<li class="list-group-item">';
                            resultHtml += '<div class="action-buttons">';
                                resultHtml += '<a href="#" onClick="goal_delete_inside_category('+index+', '+arrIndex+')"><span class="glyphicon glyphicon-trash"></span></a>';
                                resultHtml += '<a href="#"  onClick="goal_edit('+index+', '+arrIndex+')" ><span class="glyphicon glyphicon-pencil"></span></a>';
                            resultHtml += '</div>';
                            resultHtml += '<div class="nh-list">';
                                resultHtml += '<label>'+arrValue+'</label>';
                            resultHtml += '</div>';
                        resultHtml += '</li>';

                    });
                }
            }
        });
    }
    $(".category-goals").html(resultHtml);
}

if(currentPage == "alerts"){            
    resultHtml = "";
    if(typeof localStorage['alerts'] !== "undefined" && localStorage['alerts'] != "" && localStorage['alerts'] != null){
        jsonAlertObject = JSON.parse(localStorage['alerts']);
        resultHtml = "";

        if(jsonAlertObject.length > 0){
            $.each(jsonAlertObject, function(index, value){
                resultHtml += '<li class="list-group-item">';
                    resultHtml += '<div class="action-buttons">';
                        resultHtml += '<a href="#" onClick="alert_delete('+value.id+')"><span class="glyphicon glyphicon-trash"></span></a>';                                
                    resultHtml += '</div>';
                    resultHtml += '<div class="nh-list">';
                        resultHtml += '<label>'+value.alert_name+'</label>';
                    resultHtml += '</div>';
                resultHtml += '</li>';
            });
            $(".nh-goal-list").html(resultHtml);
        }
        else{
            resultHtml = "";
            resultHtml += '<div  class="tab-pane active" id="5">';
                resultHtml += '<div class="no-add-alert">';
                    resultHtml += '<a href="add-new-alert.html"><i class="fa fa-plus-circle"></i></a>';
                    resultHtml += '<a href="#" type="button" class="no-alertF-btn">لا يموجد تنبيهات</a>';
                resultHtml += '</div>';
            resultHtml += '</div>';
            $(".tab-content").html(resultHtml);
        }
    }
    else
    {
        resultHtml = "";
        resultHtml += '<div  class="tab-pane active" id="5">';
            resultHtml += '<div class="no-add-alert">';
                resultHtml += '<a href="add-new-alert.html"><i class="fa fa-plus-circle"></i></a>';
                resultHtml += '<a href="#" type="button" class="no-alertF-btn">لا يموجد تنبيهات</a>';
            resultHtml += '</div>';
        resultHtml += '</div>';
        $(".tab-content").html(resultHtml);
    }
    
}
function post_detail(postid){    
    localStorage.setItem('postid', postid);
    window.location = "post-detail.html";
}

function category_goal(categoryid){    
    localStorage.setItem('categoryid', categoryid);
    window.location = "category-goals.html";
}

function goal_edit(categoryid, goalid){
    localStorage.setItem('categoryid', categoryid);
    localStorage.setItem('goalid', goalid);
    localStorage.setItem("buttonType", "edit");

    window.location = "add-new-goal.html";    
}
function rename_category(categoryid){    
    localStorage.setItem('categoryid', categoryid);
    window.location = "rename-category.html";
}

function remove_category(categoryid){
    /*if(typeof localStorage['category'] !== "undefined" && localStorage['category'] != "" && localStorage['category'] != null)
    {
        jsoncatObject = JSON.parse(localStorage['category']);        
        //delete jsoncatObject[categoryid];
        jsoncatObject.splice(categoryid, 1);
        localStorage['category'] = JSON.stringify(jsoncatObject);    
        window.location = "goal.html";
    }*/
    error_popup("show");   
    $(".ok-btn").click(function(){
        if(typeof localStorage['category'] !== "undefined" && localStorage['category'] != "" && localStorage['category'] != null)
        {
            jsoncatObject = JSON.parse(localStorage['category']);        
            //delete jsoncatObject[categoryid];
            jsoncatObject.splice(categoryid, 1);
            localStorage['category'] = JSON.stringify(jsoncatObject);    
            window.location = "goal.html";
        }   
    });
}

function alert_delete(alertid){    
    /*if(typeof localStorage['alerts'] !== "undefined" && localStorage['alerts'] != "" && localStorage['alerts'] != null)
    {
        jsonAlertObject = JSON.parse(localStorage['alerts']);      

        jsonAlertObject.splice(parseInt(alertid) - 1, 1);        
        localStorage['alerts'] = JSON.stringify(jsonAlertObject);            
        alertCancel(alertid);
        window.location = "alerts.html";
    }*/
    error_popup("show");   
    $(".ok-btn").click(function(){
        if(typeof localStorage['alerts'] !== "undefined" && localStorage['alerts'] != "" && localStorage['alerts'] != null)
        {
            jsonAlertObject = JSON.parse(localStorage['alerts']);      

            jsonAlertObject.splice(parseInt(alertid) - 1, 1);        
            localStorage['alerts'] = JSON.stringify(jsonAlertObject);            
            alertCancel(alertid);
            window.location = "alerts.html";
        }
    });
}
function goal_delete_inside_category(categoryid, goalid){

    /*if(typeof localStorage['category'] !== "undefined" && localStorage['category'] != "undefined")
    {
        jsoncatObject = JSON.parse(localStorage['category']);        
        //delete jsoncatObject[categoryid].goals[goalid];
        jsoncatObject[categoryid].goals.splice(goalid,1);        
        localStorage['category'] = JSON.stringify(jsoncatObject);    
        localStorage.setItem('categoryid', categoryid);        
        window.location = "category-goals.html";
    }*/

    error_popup("show");   
    $(".ok-btn").click(function(){
        if(typeof localStorage['category'] !== "undefined" && localStorage['category'] != "undefined")
        {
            jsoncatObject = JSON.parse(localStorage['category']);        
            //delete jsoncatObject[categoryid].goals[goalid];
            jsoncatObject[categoryid].goals.splice(goalid,1);        
            localStorage['category'] = JSON.stringify(jsoncatObject);    
            localStorage.setItem('categoryid', categoryid);        
            window.location = "category-goals.html";
        }        
    });
}

function add_goal_in_category(){
    localStorage.setItem('buttonType', "addGoal");
    window.location = "add-new-goal.html";    
}

function logout(){
    localStorage.removeItem("userData");
    window.location = "index.html";
}

function loader(loader_state){
    if(loader_state == "show"){
        $(".appLoader").show();
    }
    else if(loader_state == "hide"){
        $(".appLoader").hide();
    }
}

function error_popup(error_state){

    if(error_state == "show"){
        $(".login-error").show();
        $("body").addClass("popbackground");
    }
    else if(error_state == "hide"){
        $(".login-error").hide();
        $("body").removeClass("popbackground");
    }
}

function add_new_alert(){  

    var error = 0;
    $('#add_alert_form input, #add_alert_form select').each(function(index){
        var input = $(this);
        if(input.val() == ""){
            error++;
        }
    });

    if(error > 0){
        error_popup("show");
    }
    else{
        if(typeof localStorage['alerts'] !== "undefined" && localStorage['alerts'] != "" && localStorage['alerts'] != null)
        {        
            jsonAlertObject = JSON.parse(localStorage['alerts']);  

            var alertObject = {};
            $('#add_alert_form input, #add_alert_form select').each(function(index){  
                var input = $(this);
                var alertObjectKey = input.attr('name');
                var alertObjectValue = input.val();                    
                alertObject[alertObjectKey] = alertObjectValue;                         
            });            
            alertObject['id'] = parseInt(jsonAlertObject.length) + 1; 
            alertObject['alerted_count'] = 0;
            jsonAlertObject.push(alertObject);      
            localStorage['alerts'] = JSON.stringify(jsonAlertObject);            
        }
        else{        
            var alertObject = {};
            var alertObjectArr = new Array();
            $('#add_alert_form input, #add_alert_form select').each(function(index){  
                var input = $(this);
                var alertObjectKey = input.attr('name');
                var alertObjectValue = input.val();        
                alertObject[alertObjectKey] = alertObjectValue;                         
            });         
            alertObject['id'] = 1;
            alertObject['alerted_count'] = 0;
            alertObjectArr.push(alertObject);
            localStorage['alerts'] = JSON.stringify(alertObjectArr);            
        }
        schedule(alertObject);
        window.location = "alerts.html";
    }

    /*var alertObject = {};
    $('#add_alert_form input, #add_alert_form select').each(function(index){  
        var input = $(this);
        var alertObjectKey = input.attr('name');
        var alertObjectValue = input.val();        
        alertObject[alertObjectKey] = alertObjectValue;                         
    });*/
}