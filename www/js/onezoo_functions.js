var creditcard_token_payments_cards = [];
var numbersToSend = [];
var emailssToSend = [];
var firstSendInvitation = false;
var phoneExpression = /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/;
function errorCB(err) {
    console.log(err);
}
function successCB() {}

function openPopupInvite(fullName, email, phoneNumber) {
   
}
function technicalError(){
    toastMessage("Technical error occurred please try again.", "Ok");
}
var cumulativeOffset = function(element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        top: top,
        left: left
    };
};
function clearAppCache(){
   if (device.platform != 'browser') {
       showLoading();
       window.cache.clear();
       ImgCache.clearCache(function () {
          toastMessage("Cache cleared successfully");
          hideLoading();
        }, function () {
          toastMessage("Some error occurred, Please try again.");
          hideLoading();
        });
   }else{
        toastMessage("Cache cleared successfully");
   }
}
function internetConnection() {
    return ((navigator.connection.type === "none" || navigator.connection.type === null) ? false : true);
}

function goToHelp() {
    cordova.InAppBrowser.open('https://onezoo.zendesk.com/hc/en-us/categories/202577048-Mobile-Apps', '_system', 'location=yes');
}

function nativeSlide(direction) {
    if (typeof window.plugins.nativepagetransitions.slide !== 'undefined') {
        if (typeof direction == "undefined") {
            direction = "right";
        }
        window.plugins.nativepagetransitions.slide({
            'direction': direction
        });
    }
}
function nativeFade() {
    if (typeof window.plugins.nativepagetransitions.fade !== 'undefined') {
        var options = {
            "duration": 200,
            "iosdelay": 20,
            "androiddelay": 20,
        };
        window.plugins.nativepagetransitions.fade(options);
    }
}

function nativeFlip(direction) {
    if (typeof window.plugins.nativepagetransitions.flip !== 'undefined') {
        window.plugins.nativepagetransitions.flip({
            'direction': direction
        });
    }
}

function goTO(gotoPage) {
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            if (gotoPage == 'invite_supplier') {
                $('#invite_suppliers_back_btn').show();
                $.mobile.changePage("#"+gotoPage, { transition: "none" });
                nativeFade();
            } else {
                $.mobile.changePage("#"+gotoPage, { transition: "none" });
                nativeFade();
            }
        } else {
            var slider_display_setting = getValue('slider_show');
            if (slider_display_setting == '1') {
                $.mobile.changePage("#"+gotoPage, { transition: "none" });
            } else {
                $.mobile.changePage("#slide01", { transition: "none" });
            }
        }
    }, successCB, errorCB);
}

function addgoBackSupplier(goBackSupplier_id) {
    addValue("goBackSupplier_id", goBackSupplier_id);
}

function goBack() {
    var goBackSupplier_id = getValue("goBackSupplier_id");
    if (history.state.pageUrl == "supplier_home_page" && goBackSupplier_id != null) {
        deleteValue("goBackSupplier_id");
        goTO("suppliers_page");
    } else {
        history.back();
    }
    return false;
}

function deviceInfo() {
    if (typeof device != 'undefined') {
        return "&cordova=" + encodeURIComponent(device.cordova) + "&model=" + encodeURIComponent(device.model) + "&platform=" + encodeURIComponent(device.platform) + "&uuid=" + encodeURIComponent(device.uuid) + "&version=" + encodeURIComponent(device.version);
    } else {
        return "&deviceInfo=0";
    }
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function toastMessage(message, title, buttonName) {
    title = title || " ";
    buttonName = buttonName || 'OK';
    if (window.plugins && window.plugins.toast && device.platform != 'browser') {
        window.plugins.toast.showWithOptions({
            message: message,
            duration: 3000,
            position: "center",
            styling: {
                opacity: 0.9,
                backgroundColor: '#FFC746',
                textColor: '#FFFFFF',
                textSize: 14,
            }
        });
    } else {
        toastHTML(message);
    }
}
function toastMessageLong(message, title, buttonName) {
    title = title || " ";
    buttonName = buttonName || 'OK';
    if (window.plugins && window.plugins.toast && device.platform != 'browser') {
        window.plugins.toast.showWithOptions({
            message: message,
            duration: "long",
            position: "center",
            styling: {
                opacity: 0.9,
                backgroundColor: '#FFC746',
                textColor: '#FFFFFF',
                textSize: 14,
            }
        });
    } else {
        toastHTML(message);
    }
}
function toastHTML(message) {
    var $toast = $('<div class="ui-loader ui-overlay-shadow ui-body-e ui-corner-all"><h3>' + message + '</h3></div>');
    $toast.css({
        display: 'block',
        background: '#FFC746',
        color: '#FFF',
        opacity: 1,
        position: 'fixed',
        padding: '7px',
        'text-align': 'center',
        width: '270px',
        left: ($(window).width() - 284) / 2,
        top: $(window).height() / 2 - 20
    });
    var removeToast = function() {
        $(this).remove();
    };
    $toast.click(removeToast);
    $toast.appendTo($.mobile.pageContainer).delay(3000);
    $toast.fadeOut(400, removeToast);
}

function showMessage(message, title, buttonName) {
    title = title || " ";
    buttonName = buttonName || 'OK';
    if (navigator.notification && navigator.notification.alert) {
        navigator.notification.alert(message, successCB, title, buttonName);
    } else {
        alert(message);
    }
}

var backbutton = 0;
function backButtonAction() {
    var activePage = $.mobile.activePage.attr('id');
    var $checkBackButton = $("#"+ activePage + " .ui-btn-left img");
    if (typeof $checkBackButton !== "undefined" && $checkBackButton.attr("src") == "img/backDark.png") {
        $checkBackButton.trigger("click");
    }else {
        if (backbutton == 0) {
            backbutton++;
            toastMessage('Press again to exit.');
            setTimeout(function() { backbutton = 0; }, 3000);
        } else {
            ExitAPP();
        }
    }
}
function showConfirm() {
    if (navigator.notification && navigator.notification.confirm) {
        navigator.notification.confirm('Do you really want to exit?', function(buttonIndex) {
            if (buttonIndex == 2) {
                ExitAPP();
            }
        }, 'Exit', 'No,Yes');
    } else {
        var exitapp = confirm("Do you really want to exit?");
        if (exitapp == true) {
            ExitAPP();
        }
    }
}
function ExitAPP() {
    navigator.app.exitApp();
}
function getSingleColumn(field, query, condition, return_function) {
    db.query('SELECT ' + field + ' FROM ' + query + ' ' + condition, function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var rows = results.rows.item(0);
            return_function(rows);

        } else
            return_function('');
    }, successCB, errorCB);
}

function cartCount() {
    
}
function openPopup() {
    $("#minimum_order_popup").popup("open");
}

function callBackPopup() {
    $("#callBackPopup").popup("open");
}

function addCart(id, prod_supplierId, changeProductPrice,loadingScreen) {

    productSupplierID = '';
    if (prod_supplierId || prod_supplierId == 0) {
        productSupplierID = prod_supplierId;
    } else {
        productSupplierID = supplierID;
    }
    var supplier_exist = sidebar_supplier.filter(function(obj) {
        return obj.supplier_id == productSupplierID;
    });

    if (supplier_exist.length == 0) {
        add_supplier_to_list(productSupplierID, 0);
    }

    var qty = $("#product_qty" + id + "").val();
    var customers_basket_quantity = qty;
    var activePage = $.mobile.activePage.attr('id');
    var package_id = $("#p" + id + " option:selected").val();
    var package_name = $("#p" + id + " option:selected").text();
    if (package_id == '' || package_id == 0 || package_id == 'undefined' || package_name == '') {
        package_id = 0;
        package_name = '';
    } else {
        package_id = package_id;
        if (package_name != '' || package_id > 0 || package_id != '')
            package_name = package_name;

        addValue("package_id"+id,package_id);
    }

    var products_name = $("input#product_name" + id).val() + " " + package_name;
    var options_structure_complete = '';
    var options_structure_text_complete = '';
    var product_unique_code = '';
    var products_options_array = [];
    $('.new_option' + id).each(function(i, selected) {
        var options_structure       = null;
        var options_structure_text  = null;
        var options_id          = $(selected).find('input.option_id_hidden').val();
        var options_text        = $(selected).find('input.option_value_hidden').val();
        var options_value_id    = $(selected).find('select option:selected').val();
        var options_value_text  = $(selected).find('select option:selected').text();
        
        var products_options_json = {
          "options_id": options_id,
          "options_value_id": options_value_id
        };
        products_options_array.push(products_options_json);
        addValue("products_options"+id,JSON.stringify(products_options_array));
        options_structure = "{" + options_id + "}" + options_value_id;
        product_unique_code        += options_value_id + "-";
        options_structure_complete += options_structure;

        options_structure_text       = "{" + options_text + "}" + options_value_text;
        options_structure_text_complete += options_structure_text;
    });
    var pattern_products_id = $.trim(id + options_structure_complete);
    var array_option_text = options_structure_text_complete.split("{");
    var array_option = options_structure_complete.split("{");
    var serverCart = '';
    
    if(!changeProductPrice){
        serverCart = 'addtoCart';
        if(customers_basket_quantity=='' || typeof customers_basket_quantity=="undefined"){
            customers_basket_quantity = 1;
            $("#product_qty"+id).val(customers_basket_quantity);
        }
       
    }else{
        var active_supplier_option = $("#saved_products").hasClass("active_supplier_option");
        if($.mobile.activePage.attr('id')=='supplier_home_page' && active_supplier_option && category_supplier_type != 'all_suppliers'){ 
            if(package_name!==''){
                $("#package_name" + id).html('('+package_name+')');
            }
            var options_name = [];
            $('.new_option' + id).each(function(i, selected) {
                var options_name_text = $(selected).find('select option:selected').text();
                options_name.push(" "+options_name_text);
            });
            if(options_name.length>0){
                $("#options_name"+id).html($.trim(options_name));
            }
        }
    }
    if(!loadingScreen && !changeProductPrice){
         showLoading();
    }
    
    $.ajax({
        type: "POST",
        data: "action=cartPrice&products_id=" + id + "&package_id=" + package_id + "&pattern_products_id=" + product_unique_code.replace(/-+$/, '') + "&serverCart="+serverCart+"&products_id_with_options=" + pattern_products_id + "&customers_basket_quantity=" + customers_basket_quantity,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            if(!loadingScreen && !changeProductPrice){
                hideLoading();
            }
            if (dataresult.result == 'error') {
                toastMessage(dataresult.message, "Error", "OK");
                return false;
            }
            if (changeProductPrice) {
                var active_supplier_option = $("#saved_products").hasClass("active_supplier_option");
                if($.mobile.activePage.attr('id')=='supplier_home_page' && active_supplier_option && category_supplier_type != 'all_suppliers'){ 
                    $('#listprice'+id).html("$"+Number($.trim(dataresult.price)).toFixed(2));
                    
                }else{
                    $('#listprice'+id).html("Price $"+Number($.trim(dataresult.price)).toFixed(2));
                    if(product_unique_code!=='' || package_id>0){
                        $('#customlistprice'+id).html("Price with selected options $"+Number($.trim(dataresult.price)).toFixed(2));
                    }else{
                        $('#customlistprice'+id).html("Price $"+Number($.trim(dataresult.price)).toFixed(2));
                    }
                }

            }else {
                db.query('SELECT customers_id FROM customers', function(tx, results) {
                    var len = results.rows.length;
                    if (len > 0) {
                        var row = results.rows.item(0);
                        getSingleColumn("customers_basket_quantity", "customers_basket", "WHERE supplier_id=" + productSupplierID + " AND products_id = " + convertField(pattern_products_id), function(data) {
                            if (data == '') {

                                var sql = "INSERT INTO customers_basket (supplier_id, customers_id, products_id, products_name, customers_basket_quantity, package_id, package_product_id, final_price, products_tax) VALUES (" + productSupplierID + ", " + row.customers_id + ", " + convertField(pattern_products_id) + "," + convertField(products_name) + "," + customers_basket_quantity + "," + package_id + "," + id + "," + dataresult.price + "," + dataresult.products_tax + ")";
                                db.execute(sql, cartCount, errorCB);
                                for (var i = 1; i < array_option.length; i++) {
                                    var array_option_id = array_option[i].split("}");
                                    var array_option_value = array_option_text[i].split("}");
                                    var sql = "INSERT INTO customers_basket_attributes (supplier_id, customers_id, products_id, products_options_id, products_options, products_options_value_id, products_options_value) VALUES (" + productSupplierID + ", " + row.customers_id + ", " + convertField(pattern_products_id) + "," + array_option_id[0] + "," + convertField(array_option_value[0]) + "," + array_option_id[1] + "," + convertField(array_option_value[1]) + ")";
                                    db.execute(sql, successCB, errorCB);

                                }
                                if (category_supplier_type == 'all_suppliers') {
                                    var supplier = sidebar_supplier.filter(function(obj) {
                                        return obj.supplier_id == productSupplierID;
                                    });
                                    toastMessage("Product sucessfully added into " + supplier[0].name + " cart");
                                } else {
                                    if(!loadingScreen){
                                        toastMessage("Product sucessfully added into cart");
                                    }
                                    var active_supplier_option = $("#saved_products").hasClass("active_supplier_option");
                                    if($.mobile.activePage.attr('id')=='supplier_home_page' && active_supplier_option&& category_supplier_type != 'all_suppliers'){ 
                                        $("#product_qty"+id).addClass("input_products_list_color_green");
                                        $("#product_qty"+id).removeClass("input_products_list_color_white");
                                    }
                                }
                                cartPageHTML(prod_supplierId);
                                closemoreDetails(id);

                            } else {

                                var sql = "UPDATE customers_basket SET customers_basket_quantity = " + Number(customers_basket_quantity) + ", products_name =" + convertField(products_name) + ", package_id = " + package_id + ", final_price = " + dataresult.price + ", products_tax = " + dataresult.products_tax + " WHERE supplier_id=" + productSupplierID + " AND products_id = " + convertField(pattern_products_id);
                                db.execute(sql, successCB, errorCB);
                                if(!loadingScreen){
                                    toastMessage("Product sucessfully update");
                                }
                                cartPageHTML(prod_supplierId);
                                closemoreDetails(id);

                            }
                        });

                    } else {
                        goTO('user_login');
                    }
                }, successCB, errorCB);

                
            }




        },
        error: function(error) {
            connectionAlert();
        }
    });
 
}
$(document).on('tap', '.go-back-invite-contact', function() {
    userContactsToInvite = [];
    $(".check-span-active").removeClass('check-span-active');
    $(".check-span").removeClass('check-span');
    $('.send-sms-button').attr('disabled', true);
    $('.done-sms-button').attr('disabled', true);
});

function checkAndSend(elem) {
    $(elem).children().children().toggleClass('check-span');
    var phoneNum = $(elem).parent().prev().find('.phone-p').text();
    var sup_email = $(elem).parent().prev().find('.email-p').text();
    var sup_fullname = $(elem).parent().prev().find('.fullname-p').text();
    var supplier_info = {
        mobile: phoneNum,
        email: sup_email,
        name: sup_fullname
    };

    if ($(elem).children().children().hasClass('check-span') == false && $(elem).children().children().hasClass('check-span-active') == false) {
        userContactsToInvite = userContactsToInvite.filter(function(contact) {
            return contact.mobile != phoneNum;
        });

    } else if ($(elem).children().children().hasClass('check-span-active') == false) {
        userContactsToInvite.push(supplier_info);

    }
    if (userContactsToInvite.length == 0) {
        $('.send-sms-button').attr('disabled', true);
    } else {
        $('.send-sms-button').removeAttr('disabled');
    }

    if ($(".send-invite-email-btn span").hasClass('check-span') == true) {
        firstSendInvitation = true;
    } else {
        firstSendInvitation = false;
    }
}

function requestRep() {
    $("#request_rep_form").hide();
    $("#request_rep_subject").show();

    $("#request_rep").popup('open');
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            if (!guest_mode) {
                $("#request_rep_customer_name").val(row.customers_firstname + ' ' + row.customers_lastname);
                $("#request_rep_customer_company").val(getValue("account_entry"));
                $("#request_rep_customer_mobile").val(customers_mobile);
            } else {
                if (customers_name)
                    $("#customer_name").val(customers_name);
                if (customers_mobile)
                    $("#customer_mobile").val(customers_mobile);
                if (customers_trading_name)
                    $("#customer_company").val(customers_trading_name);
            }
        } else
            goTO('user_login');
    }, successCB, errorCB);
}

function productQuestion(product_id, product_name) {
    $("#question_form").hide();
    $("#question_subject").show();
    $("#product_name").text(product_name);

    $("#product_question").popup('open');
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            if (!guest_mode) {
                $("#customer_name").val(row.customers_firstname + ' ' + row.customers_lastname);
                $("#customer_company").val(getValue("account_entry"));
                $("#customer_mobile").val(customers_mobile);
            } else {
                if (customers_name) $("#customer_name").val(customers_name);
                if (customers_mobile) $("#customer_mobile").val(customers_mobile);
                if (customers_trading_name) $("#customer_company").val(customers_trading_name);
            }

        } else
            goTO('user_login');
    }, successCB, errorCB);

}

function sendProductQuestion() {
    var customer_name = $("#customer_name").val();
    var customer_company = $("#customer_company").val();
    var customer_mobile = $("#customer_mobile").val();
    var question_subject = $("#question_form .question_subject").text();
    var question_comments = $("#question_form #question_comments").val();
    var product_name = $("#product_name").text();

    var errors = [];

    if (customer_name.length == 0)
        errors[errors.length] = "Customer name is required.";
    if (customer_company.length == 0)
        errors[errors.length] = "Company Name is required.";
    if (customer_mobile.length == 0 || !Number(customer_mobile))
        errors[errors.length] = "Invalid Mobile Number.";
    if (question_comments.length == 0)
        errors[errors.length] = "Comment is required";

    if (errors.length > 0) {
        mutipleErrors(errors);
        return false;
    }
    var question_message = 'Product Name : ' + product_name + '<br>Question Type : ' + question_subject + '<br>Comment : ' + question_comments;
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            var customers_id = row.customers_id;
            showLoading();
            $.ajax({
                type: "POST",
                data: "action=sendProductQuestion&customers_id=" + customers_id + "&supplier_id=" + supplierID + "&question_subject=" + question_subject + "&question_comments=" + question_comments + "&customer_name=" + customer_name + "&customer_company=" + customer_company + "&customer_mobile=" + customer_mobile + "&product_name=" + product_name + "&question_message=" + question_message,
                url: CONECTION_SERVER(),
                crossDomain: true,
                cache: false,
                dataType: "json",
                success: function(dataresult) {
                    hideLoading();
                    if (dataresult.result == 'error') {
                        hideLoading();
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    } else {
                        customers_mobile = customer_mobile;
                        customers_name = customer_name;
                        customers_trading_name = customer_company;
                        toastMessage('We have sent your question to the supplier');
                        $("#product_question").popup('close');

                    }
                },
                error: function(error) {
                    connectionAlert();
                }
            });

        } else goTO('user_login');
    }, successCB, errorCB);
}

function sendRequestRep() {
    var customer_name = $("#request_rep_customer_name").val();
    var customer_company = $("#request_rep_customer_company").val();
    var customer_mobile = $("#request_rep_customer_mobile").val();
    var question_subject = $("#request_rep_form .question_subject").text();
    var question_comments = $("#request_rep_form #request_rep_question_comments").val();

    var errors = [];

    if (customer_name.length == 0)
        errors[errors.length] = "Customer name is required.";
    if (customer_company.length == 0)
        errors[errors.length] = "Company Name is required.";
    if (customer_mobile.length == 0 || !Number(customer_mobile))
        errors[errors.length] = "Invalid Mobile Number.";
    if (question_comments.length == 0)
        errors[errors.length] = "Comment is required";

    if (errors.length > 0) {
        mutipleErrors(errors);
        return false;
    }

    var question_message = 'Question Type : ' + question_subject + '<br>Comment : ' + question_comments;
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            var customers_id = row.customers_id;
            showLoading();
            $.ajax({
                type: "POST",
                data: "action=sendProductQuestion&customers_id=" + customers_id + "&supplier_id=" + supplierID + "&question_subject=" + question_subject + "&question_comments=" + question_comments + "&customer_name=" + customer_name + "&customer_company=" + customer_company + "&customer_mobile=" + customer_mobile + "&question_message=" + question_message,
                url: CONECTION_SERVER(),
                crossDomain: true,
                cache: false,
                dataType: "json",
                success: function(dataresult) {
                    hideLoading();
                    if (dataresult.result == 'error') {
                        hideLoading();
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    } else {
                        customers_mobile = customer_mobile;
                        customers_name = customer_name;
                        customers_trading_name = customer_company;
                        toastMessage('We have sent your question to the supplier');
                        $("#request_rep").popup('close');

                    }
                },
                error: function(error) {
                    connectionAlert();
                }
            });

        } else goTO('user_login');
    }, successCB, errorCB);
}

function openPopupDone() {
    if (firstSendInvitation) {
        $("#popupDone").popup("open");
    } else {
        skipInviteFriends();
    }
}

function closePopupDone() {
    $("#popupDone").popup("close");
}

function InviteSupplierAfterCheck() {
    $(".check-span").addClass('check-span-active');
    $(".check-span-active").removeClass('check-span');
    $(".send-invite-email-btn span").removeClass('check-span');
    inviteSupplier(userContactsToInvite);
    sendSms(userContactsToInvite);
    saveInvitedSupplier(userContactsToInvite);
    userContactsToInvite = [];
    $('.send-sms-button').attr('disabled', true);
}

function replaceChsaracters(data) {
    data = data.replace(/{/g, "").replace(/}/g, "");
    return +$.trim(data);
}

function removeCart(products_id,silent_remove) {
    
    var supplier_id_cart = '';
    getSingleColumn("supplier_id", "customers_basket", "WHERE products_id = " + convertField(products_id), function(data) {
        supplier_id_cart = Number(data.supplier_id);

        if (supplier_id_cart !== '') {
            if(!silent_remove){ 
                showLoading();
            }
            $.ajax({
                type: "POST",
                data: "action=removeCart&customers_id=" + customerID + "&products_id=" + products_id,
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {
                    if(!silent_remove){ 
                        hideLoading();
                    }
                    if (dataresult.result == 'error') {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    } else {
                        db.execute("DELETE FROM customers_basket WHERE products_id = " + convertField(products_id), closeCart, errorCB);
                        cartCount();
                        db.execute("DELETE FROM customers_basket_attributes WHERE products_id = " + convertField(products_id), function(data){
                               if(!silent_remove){ 
                                    $("div.cart_html_main").html(loading_image);
                                    $("div.sub_total_div").html('');
                                    setTimeout(function(){
                                        cartPageHTML(supplier_id_cart);    
                                    },500);
                                }else{
                                    $("#product_qty"+parseInt(products_id)).addClass("input_products_list_color_white");
                                    $("#product_qty"+parseInt(products_id)).removeClass("input_products_list_color_green");
                                    $("#product_qty"+parseInt(products_id)).val('');
                                    cartPageHTML(supplier_id_cart); 
                                }
                                
                            }, errorCB);
                        
                            getUserSuppliersList();
                    }
                },
                error: function(error) {
                    hideLoading();
                    connectionAlert();
                }
            });

        } else {
            toastMessage("Some technical error occurred please try again.", "Error");
        }
    });
}

function closeCart() {
    $("div.cart_html_div").html('');
    $("div.sub_total_div").html('');
    $("div.cart_html_main").html('');
}

function emptyProductsList() {
   /* var activePage = $.mobile.activePage.attr('id');
    $('.products_category_list').html('');
    $('.products_category_list').hide();*/
}
function emptyHtml(array) {
    for (var i = 0; i < array.length; i++) {
        $(array[i]).html('');
    }

}

function close_popup(popup_id) {
    $(popup_id).popup('close');
    if (popup_id === '#missing_info_popup') goTO('suppliers_page');
}


function updateAcc() {
    goTO('user_singup');
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            console.log(row.customers_firstname);
            $("#singup_form #singup_firstname").val(outputSting(row.customers_firstname));
            $("#singup_form #singup_lastname").val(outputSting(row.customers_lastname));
            $("#singup_form #singup_email").val(outputSting(row.customers_email_address));
            $("#singup_form #singup_email").attr('disabled', true);
            if (guest_company_type)
                $("#singup_industry_type").val(guest_company_type);
            if (customers_mobile)
                $("#singup_form #singup_mobile").val(outputSting(customers_mobile));
            if (guest_postcode)
                $("#singup_form_postcode").val(guest_postcode);
            if (customers_trading_name)
                $("#singup_company").val(customers_trading_name);

        } else {

        }

    }, successCB, errorCB);

}
// Checkout Page 
function checkOut() {
    document.getElementById("checout_details").innerHTML = "";
    $("#back_from_cart ").hide();
    deleteValue("discount_amount");
    deleteValue("coupon_code");
    deleteValueSession("redirect_supplier_checkout");
    if(typeof supplierID == "undefined"){
      goTO("suppliers_page");
      toastMessage("Sorry we have some technical error. Please try again.");
      return false;
    }
    cartPageHTML(supplierID);
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            getSingleColumn("customers_id", "customers_basket", "WHERE customers_id>0 LIMIT 1", function(data) {
                if (data.customers_id > 0) {
                    var customers_id = data.customers_id;
                    var selected_customers_id = 0;
                    if (getValue("account_type") == 'user') selected_customers_id = getValue("account_id");
                    showLoading();
                    $.ajax({
                        type: "POST",
                        data: "action=customerAddress&customers_id=" + data.customers_id + "&selected_customers_id=" + selected_customers_id+"&supplier_id="+supplierID+"&credit_card_payment_gateway=promisepay",
                        url: CONECTION_SERVER(),
                        crossDomain: true,
                        dataType: "json",
                        success: function(dataresult) {
                            hideLoading();

                            if (dataresult.result == 'error') {
                                toastMessage(dataresult.message, "Error", "OK");
                                return false;
                            }
                            if (dataresult.result == 'guest_mode') {
                                checkout_redirect = true;
                                guest_email     = dataresult.guest_email;
                                guest_postcode  = dataresult.guest_postcode;
                                guest_company_type = dataresult.guest_company_type;
                                customers_mobile = dataresult.customers_mobile;
                                addValue("account_entry", dataresult.entry_company);
                                
                                var sql = "UPDATE customers SET customers_id = " + dataresult.customers_id + ", customers_email_address = " + convertField(dataresult.customers_email_address) + ", customers_firstname = " + convertField(dataresult.customers_firstname) + ",customers_lastname = " + convertField(dataresult.customers_lastname) + " WHERE customers_id = " + dataresult.customers_id + "";
                                db.execute(sql, successCB, errorCB);
                                $("#missing_info_popup").popup('open');

                            } else if (dataresult.result == 'verify_error') {
                                $("#verify_popup_text").text('We need to verify your email address so we can send you your invoice. Would you like us to resend it to ' + dataresult.guest_email + '? You can finalise your order once we have verified your email address.');
                                $("#email_verify_popup").popup('open');
                                toastMessage(dataresult.message, "Error", "OK");
                            } else {
                                $(".account-setting").css('display', 'block');
                                $(".create-account").css('display', 'none');
                                guest_mode = false;
                                creditcard_token_payments_cards = dataresult.creditcard_token_payments_cards_id;
                                document.getElementById("checout_details").innerHTML = "";
                                $("#email_verify_popup").popup('close');
                                $("#address_book_selection").popup("destroy");
                                addValue("card_fee", dataresult.card_fee);
                                addValue("bank_details", dataresult.bank_details);
                                addValue("payment_method", dataresult.payment_method);

                                var comment_order = '<p><input data-inline="true" type="text" placeholder="Enter Coupon Code" name="coupon_code" id="coupon_code"></p><p><textarea name="ordercomment" placeholder="Enter Comments" id="ordercomment"></textarea></p>';

                                /*var urgent_order = '<p><input type="checkbox" data-role="none" name="urgent_order" id="urgent_order" value="1" class="custome_checkbox"><span>I need this order earlier.</span></p><p id="urgent_comment">Why you need earlier?</br><textarea name="ordercommentText" id="ordercommentText"></textarea></p>';*/
                                var change_delivert_date_html = '<p><a style="font-weight: normal;" href="javascript:changeDeliveryDate();"><i class="fa fa-refresh"></i> Change Delivery Date</a><input id="delivery_date" name="delivery_date" type="hidden" value=""></p>'; 

                                var change_address_html = '<h2>Change Address</h2><div class="clear_both">&nbsp;</div><p class="alert alert-info">Note: Change of shipping address will affect the shipping charges.</p>';
                                for (var i = 0; i < dataresult.total_address.length; i++) {
                                    change_address_html += '<div style="padding:5px;border:1px solid #ddd;margin:0px 15px;"><input data-role="none" type="radio" class="custome_checkbox" name="address_book_id" style="float:left;" id="address_book_id_' + dataresult.total_address[i].address_book_id + '" value="' + dataresult.total_address[i].address_book_id + '" ><lable style="margin-left:10px;" for="address_book_id_' + dataresult.total_address[i].address_book_id + '"> ' + dataresult.total_address[i].entry_company + ',' + dataresult.total_address[i].entry_firstname + ',' + dataresult.total_address[i].entry_lastname + ',' + dataresult.total_address[i].entry_street_address + ',' + dataresult.total_address[i].entry_suburb + ',' + dataresult.total_address[i].entry_postcode + ',' + dataresult.total_address[i].entry_state + ', Australia</lable></div><div style="clear:both; padding:5px;"></div>';
                                }
                                change_address_html += '<div style="clear:both; padding:5px;"></div>';
                                change_address_html += '<div style="text-align:center;"><a href="#" onclick="addEditAddressBook();" data-mini="true" data-inline="true" data-role="button" data-theme="b">Add New Address</a>';
                                change_address_html += '<a href="javascript:changePrimaryAddress(' + data.customers_id + ');" class="button_blue" data-mini="true" data-inline="true" data-role="button" data-theme="b">Change Address</a></div>';

                                var popup_address = '<div data-role="popup" id="address_book_selection" data-theme="a" class="ui-corner-all" >' + change_address_html + '</div>';
                                var address_flag = dataresult.address_flag;
                                var update_address_warning_html = '';
                                if (address_flag == 'false') {
                                    checkout_redirect = true;
                                    update_address_warning_html += '<div class="text-center" style="color:red">You need to update your delivery address before you can check out.&nbsp;&nbsp;&nbsp;<a href="javascript:goTO(\'user_account\');">Update Address</a></div><br>';
                                    update_address_warning_html += '<input type="hidden" name="delivery_address_hdn" id="delivery_address_hdn" value="true">';
                                } else {
                                    checkout_redirect = false;
                                    update_address_warning_html += '<input type="hidden" name="delivery_address_hdn" id="delivery_address_hdn" value="false">';
                                }
                                var  current_address = '<div class="customer_display_name text-center"> <div class="customer_display_name_icon"><i class="fa fa-user-circle-o fa-5x" style="padding:14px;"></i></div><div class="customer_display_name_icon"><h3><strong>'+dataresult.company+'</strong></br></br><span class="checkout_gray_color">'+dataresult.firstname+' '+dataresult.lastname+'</span></h3></div></div>';

                                    current_address += '<div class="text-center shipping_adress_details"><p id="delivery_address_marker" class="checkout_gray_color"> <i class="fa fa-map-marker fa-2x"></i> '+dataresult.street_address+' '+dataresult.suburb+', '+dataresult.postcode+' '+dataresult.state+'</p><a href="#address_book_selection"  style="font-weight: normal;" data-rel="popup" data-position-to="window" data-transition="none"> <i class="fa fa-refresh"></i> Change Address</a>'+popup_address+'</div>';

                                var payment_methods_html = '';
                                if(typeof dataresult.payment_methods_array!="undefined" && dataresult.payment_methods_array.length>0){
                                    payment_methods_html = '<div class="payment_methods_row text-center" style="display:inline-block;">';

                                    $.each(dataresult.payment_methods_array, function(index, payment_methods_value) {
                                       var payment_class = '';
                                        if(payment_methods_value.id=='1')
                                            payment_class = 'fa fa-money';
                                        else if(payment_methods_value.id=='2') 
                                            payment_class = 'fa fa-university';
                                        else if(payment_methods_value.id=='3') 
                                            payment_class = 'fa fa-credit-card-alt';
                                        else if(payment_methods_value.id=='4') 
                                            payment_class = 'fa fa-user';
                                       
                                       payment_methods_html += '<div class="style_payment active_payment" id="style_payment'+payment_methods_value.id+'"> <a href="javascript:void(0);" data-role="none" onclick="changePayment('+payment_methods_value.id+')"><i class="'+payment_class+' fa-2x"></i><br>'+payment_methods_value.method+'</a><div class="payment_method_check" id="payment_method_check'+payment_methods_value.id+'" style="display: none;"><i class="fa fa-check-circle" aria-hidden="true"></i></div></div>';
                                    });
                                    payment_methods_html += '</div>';
                                }

                                $("#checout_details").append('<div id="current_address">' +current_address+ '</div>' + update_address_warning_html + '<div  id="deliveryAlert" class="text-center">' + outputSting(dataresult.delivery_date) + change_delivert_date_html + '</div>'+payment_methods_html+'<div id="checkoutConfirmation"></div><div id="checkoutCart"></div>'+
                                    '<div id="checkout_comment_coupen">'+
                                        '<div class="comment_coupen">'+comment_order+'</div>'+
                                        '<div class="checkout_total_order"><table align="right"></table></div><div class="clear_both"></div>'+
                                    '</div>');
                               
                                checkoutpageCart(data.customers_id);
                                $("#checout_details").trigger('create');
                                
                                $("#coupon_code").keypress(function(e) {
                                    if(e.which == 13) {
                                        applyCouponCode();
                                        e.preventDefault();
                                        e.stopImmediatePropagation();
                                    }
                                });
                                
                                $('.custome_checkbox').checkradios({
                                    checkbox: {
                                        iconClass: 'fa fa-check'
                                    },
                                    radio: {
                                        iconClass: 'fa fa-check'
                                    }
                                });

                            }
                        },
                        error: function(error) {
                            hideLoading();
                            $("#checout_details").html('<p style="text-align:center;"><img class="error_image" src="img/cannot.png" onClick="checkOut();" /></p>');
                            $("#checout_details").trigger('create');
                        }
                    });

                } else { goToCartPage(supplierID); }

            });
        } else goTO('user_login');
    }, successCB, errorCB);
}

function addEditAddressBook() {
    if (getValue("account_type") == 'user' && getValue("account_perm_addr") != 'add_address') {
        toastMessage("Sorry you don't have a permission for this action.");
    } else {
        goTO('add_edit_address_book');
    }
}

function changePrimaryAddress(customers_id) {
    var change_address_radio = $.trim($("input[name=address_book_id]:checked").val());
    if (change_address_radio == "") {
        toastMessage("Address is required.");
    } else {
        if (getValue("account_type") == 'user') customers_id = getValue("account_id");

        var supplier_id = supplierID;

        showLoading();
        $.ajax({
            type: "POST",
            data: "action=changePrimaryAddress&address_book_id=" + change_address_radio + "&customers_id=" + customers_id + "&supplier_id=" + supplier_id,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                hideLoading();
                if (dataresult.result == 'error') {
                    
                    toastMessage(dataresult.message, "Error", "OK");
                    return false;
                } else if (dataresult.result == "success") {
                    $("#address_book_selection").popup("close");
                    toastMessage(dataresult.message);
                    showLoading("Please wait we are updating your details.");
                    deleteValueSession("allSuppliers");
                    deleteValueSession("sidebar_supplier_session");
                    getSuppliers();
                    fetchsidebar(true);
                    addValueSession("redirect_supplier_checkout",supplierID);
                }
            },
            error: function(xhr, error) {
                connectionAlert();
            }
        });
    }
}

function addValue(key, value) {
    localStorage.setItem(key, value);
}

function getValue(key) {
    return localStorage.getItem(key);
}

function deleteValue(key) {
    localStorage.removeItem(key);
}

function addValueSession(key, value) {
    sessionStorage.setItem(prefix + "-" + key, value);
}

function getValueSession(key) {
    return sessionStorage.getItem(prefix + "-" + key);
}

function deleteValueSession(key) {
    sessionStorage.removeItem(prefix + "-" + key);
}

function checkoutpageCart(customers_id) {
    var activePage = $.mobile.activePage.attr('id');
    db.query('SELECT * FROM customers_basket WHERE supplier_id=' + supplierID + ' AND customers_id=' + customers_id + ' ORDER BY customers_basket_id DESC', function(tx, results) {
        var len = results.rows.length;
        var cart_html = '';
        if (len > 0) {
             cart_html = '<table style="border:1px solid #5B88C9; border-radius:4px;" data-role="none"  width="100%" cellpadding="0" cellspacing="0" border="0"><tr class="cart_html_heading"><td>Product</td><td>Total</td></tr></table>';
            $("#" + activePage + " div#checkoutCart").html('');
            $("#" + activePage + " div#checkoutCart").append(cart_html);
            var cart_date;
            var sub_total = 0;
            var products_tax_total = 0;
            for (var i = 0; i < Number(len); i++) {
                cart_date = results.rows.item(i);
                var total_price = cart_date.customers_basket_quantity * cart_date.final_price;
                var products_tax = (total_price * cart_date.products_tax) / 100;
                sub_total += total_price;
                products_tax_total += products_tax;
                $("#" + activePage + " div#checkoutCart table").append('<tr class="cart_html_body"><td id="attribute' + replaceChsaracters(cart_date.products_id) + '">' + cart_date.customers_basket_quantity + ' x ' + cart_date.products_name + '</td><td>$' + (total_price).toFixed(2) + '</td></tr>');
                db.query('SELECT * FROM customers_basket_attributes WHERE supplier_id=' + supplierID + ' AND customers_id=' + customers_id + ' AND products_id=' + convertField(cart_date.products_id), function(tx, attribute) {

                    var attribute_len = attribute.rows.length;
                    if (attribute_len > 0) {
                        var attrib_text = '';
                        for (var j = 0; j < Number(attribute_len); j++) {
                            var attribute_data = attribute.rows.item(j);
                            $("#" + activePage + " #checout_details table td#attribute" + replaceChsaracters(attribute_data.products_id)).append('</br><b>' + attribute_data.products_options + '</b>:' + attribute_data.products_options_value);
                        }

                    }
                }, successCB, errorCB);


            }
            $("#" + activePage + " div#checkoutCart").append('<p style="text-align: right;"><a href="javascript:void(0);" onclick="goToCartPage('+supplierID+');" style="font-weight: normal;"><i class="fa fa-shopping-cart"></i> View Cart</a></p>');

            $("#" + activePage + " div.checkout_total_order table").html('');
            var shipping_charge = parseFloat(!isNaN(getValue('calculate_supplier_extra_charges_'+supplierID)) ? getValue('calculate_supplier_extra_charges_'+supplierID) : 0.00);

            var total_checkout = (sub_total + products_tax_total + parseFloat(shipping_charge)).toFixed(2);

            $("#" + activePage + " div.checkout_total_order table").append('<tr class="checkout_html_body total_products_checkout"><td colspan="2" align="right" onClick="checkoutCartToggle();">' + Number(len) + ' Products</td></tr>');
            $("#" + activePage + " div.checkout_total_order table").append('<tr class="checkout_html_body"><td align="right">Sub-Total:</td><td class="sub_total_checkout">$' + sub_total.toFixed(2) + '</td></tr>');
            $("#" + activePage + " div.checkout_total_order table").append('<tr class="checkout_html_body"><td align="right">Shipping Charges:</td><td class="shipping_total_checkout">$' +Number(shipping_charge).toFixed(2)+'</td></tr>');
            $("#" + activePage + " div.checkout_total_order table").append('<tr class="checkout_html_body"><td align="right">GST:</td><td class="gst_total_checkout">$' + Number(products_tax_total).toFixed(2) + '</td></tr>');
            $("#" + activePage + " div.checkout_total_order table").append('<tr class="checkout_html_body"><td align="right">Order Total:</td><td class="total_checkout">$' + total_checkout + '</td></tr>');
            changePayment(getValue("payment_method"));

        } else {
            cart_html = '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr class="cart_html_body"><td>Sorry your cart is empty</td></tr></table>';
            $("#" + activePage + " div.ui-content #checout_details").html(cart_html);

        }
    }, successCB, errorCB);

}
function checkoutCartToggle(){
    $("#checkoutCart").slideToggle(500);
}
function addCreditCard(){
    $(".credit_card_a").removeClass("active_credit_card");
    $("#credit_card_a_new").addClass("active_credit_card");
    $(".credit_card_check").hide();
    $("#credit_card_check_new").show();
    $("#credit-cards-area").slideDown(500);
    $("input[name='promisepay_token_payments_cards_id']").val('');
}
function selectCreditCard(creditcard_token_payments_cards_id){
    $(".credit_card_check").hide();
    $("#credit_card_check"+creditcard_token_payments_cards_id).show();
    
    $(".credit_card_a").removeClass("active_credit_card");
    $("#credit_card_a"+creditcard_token_payments_cards_id).addClass("active_credit_card");
    $("#credit-cards-area").slideUp(500);
    $("input[name='creditcard_token_payments_cards_id']").val(creditcard_token_payments_cards_id);
}
function changePayment(payments_id) {
    $(".payment_method_check").hide();
    $(".style_payment").removeClass("active_payment");
    $("#payment_method_check"+payments_id).show();
    $("#style_payment"+payments_id).addClass("active_payment");   
    
    var confirm_order = '<div class="checkout_confirm_button"><button onClick= "goToCartPage('+supplierID+');" class="button_yellow" data-theme="b" style="float:left" type="button">BACK TO CART</button><button onClick= "checkoutQuery();" class="button_green" data-theme="b" type="button">CONFIRM ORDER</button></div><div class="clear_both"></div>';
    addValue("payment_method", payments_id);
    var shipping_charge = parseFloat(!isNaN(getValue('calculate_supplier_extra_charges_'+supplierID))? getValue('calculate_supplier_extra_charges_'+supplierID) : 0.00);

    $("div#checkoutConfirmation").html('');
    if ($(".total_transfee").length) {
        var trans = $(".total_transfee").html().replace("$", "");
        var ordertotal = Number($(".total_checkout").html().replace("$", ""));
        $("td.total_transfee").parent("tr").remove();
        $(".total_checkout").html('$' + (ordertotal - trans).toFixed(2));
    }
    var payment_method_text = "Payment Method: "+$("#style_payment"+payments_id+" > a").text();
    var payment_collaps = '';
    switch (Number(payments_id)) {
        case 1:
            payment_collaps = "<p><strong>"+payment_method_text+"</strong></p>";
            $("div#checkoutConfirmation").html(payment_collaps + confirm_order);
            break;
        case 2:
            if (getValue("bank_details") != null)
                payment_collaps = "<p><strong>"+payment_method_text+"</strong> " + getValue("bank_details") + "</p><p><strong style='color:red;'>Note:</strong> Your order will be dispatched after payment is received.</p>";
            else
                payment_collaps = "<p><strong>"+payment_method_text+"</strong></p>";
                $("div#checkoutConfirmation").html(payment_collaps + confirm_order);
        break;
        case 4:
            payment_collaps = "<p><strong>"+payment_method_text+"</strong></p>";

            $("div#checkoutConfirmation").html(payment_collaps + confirm_order);
        break;
        case 3:
            var add_new_credit_card = '<a data-role="none" href="javascipt:void(0);" onClick="addCreditCard();" class="credit_card_a" id="credit_card_a_new"><i class="fa fa-credit-card-alt fa-2x fa-credit-card-custom"></i><br><span>Add New</span><div class="credit_card_check" id="credit_card_check_new"><i class="fa fa-check-circle" aria-hidden="true"></i></div></a>';

            var ordertotal = Number($(".total_checkout").html().replace("$", ""));
            var trans_fee = (Number(getValue("card_fee")) * ordertotal) / 100;

            $("td.total_checkout").parent("tr").before('<tr class="checkout_html_body"><td align="right">Transation Fee:</td><td class="total_transfee">$' + (trans_fee).toFixed(2) + '</td></tr>');

            $(".total_checkout").html('$' + (ordertotal + trans_fee).toFixed(2));
            var creditcard_cards_html = '';
            if(creditcard_token_payments_cards.length > 0) {
                
                creditcard_cards_html += '<div class="list_of_credit_cards checkout_gray_color"><input type="hidden" name="creditcard_token_payments_cards_id" id="creditcard_token_payments_cards_id" value="" />';
                $.each(creditcard_token_payments_cards, function(index, creditcard) {
                    var card_icon = '';
                    if(creditcard.card_type == 'MasterCard'){
                        card_icon = '<i class="fa fa-cc-mastercard fa-2x fa-credit-card-custom"></i>';
                    }else if(creditcard.card_type == 'Visa'){
                        card_icon = '<i class="fa fa-cc-visa fa-2x fa-credit-card-custom"></i>';
                    }else if(creditcard.card_type == 'American Express'){
                        card_icon = '<i class="fa fa-cc-amex fa-2x fa-credit-card-custom"></i>';
                    }else{
                        card_icon = '<i class="fa fa-credit-card-alt fa-2x fa-credit-card-custom"></i>';
                    }
                    creditcard_cards_html += '<a data-role="none" href="javascipt:void(0);" onclick="selectCreditCard('+creditcard.id+');" class="credit_card_a" id="credit_card_a'+creditcard.id+'">'+card_icon+'<br><span>'+creditcard.card_number+'</span><div class="credit_card_check" id="credit_card_check'+creditcard.id+'" style="display: none;"><i class="fa fa-check-circle" aria-hidden="true"></i></div></a>';
                });
                creditcard_cards_html += add_new_credit_card+'</div>';
            }else{
                creditcard_cards_html = add_new_credit_card;
            }

            var payment_collaps = '<p><strong>'+payment_method_text+'</strong> ('+Number(getValue("card_fee")).toFixed(2)+'%)</p>'+
                '<div class="saved_cards">'+creditcard_cards_html+'</div>'+
                '<div class="new_cc_details">'+
                    '<div class="credit_card_input_fileds" id="credit-cards-area">'+
                        '<div><label for="card_holder_name">Card Holder\'\s Name</label><input name="card_holder_name" id="card_holder_name" type="text" pattern="\w+ \w+.*" data-role="none" class="holo holo_full" title="Fill your first and last name"></div><div class="clear_both">&nbsp;</div>';

            payment_collaps += '<div><label for="credit_card">Card Number:</label><input type="number" name="credit_card" id="credit_card"  placeholder="4111 1111 1111 1111" data-role="none" class="holo holo_full" title="Fill your Card Number" maxlength="16"></div><div class="clear_both">&nbsp;</div>';

            payment_collaps += '<div class="two-inputs"><label for="month">Expiry Month</label><input type="number" name="month" id="month"  placeholder="01" title="Expiry Month" maxlength="2" data-role="none" class="holo"></div>';

            payment_collaps += '<div class="two-inputs"><label for="year">Expiry Year</label><input type="number" name="year" id="year"  placeholder="' + new Date().getFullYear() + '" title="Expiry Year" maxlength="4" data-role="none" class="holo"></div><div class="clear_both">&nbsp;</div>';

            payment_collaps += '<div><label for="card_cvv">Card CVV</label><input type="number" name="card_cvv" id="card_cvv"  placeholder="123" title="CVV" maxlength="4" data-role="none" class="holo holo_full"></div><div class="clear_both">&nbsp;</div>';

            payment_collaps += '<div><input type="checkbox" data-role="none" name="save_card_later" id="save_card_later" value="1" class="custome_checkbox_css"><label for="save_card_later">I want to save this credit card for later use. <i class="fa fa-lock fa-lg text-success"></i></label></div></div>'+confirm_order+'</div>';
     
            $("div#checkoutConfirmation").html(payment_collaps);
            if(!creditcard_token_payments_cards.length > 0) {
                setTimeout(function(){ 
                    $("#credit_card_a_new").trigger("click");
                }, 1000);    
                    
            }
            break;
    }
    $("#checkoutConfirmation").trigger('create');
}

function applyCouponCode() {
    deleteValue("discount_amount");
    deleteValue("coupon_code");
    getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
        db.query('SELECT * FROM customers_basket WHERE supplier_id=' + supplierID + ' AND customers_id=' + data.customers_id + ' ORDER BY customers_basket_id DESC', function(tx, results) {
            var len = results.rows.length;
            var products_id = [];
            var quantity = [];
            var package_id = [];
            if (len > 0) {
                for (var i = 0; i < Number(len); i++) {
                    cart_date = results.rows.item(i);
                    products_id[i] = cart_date.products_id;
                    quantity[i] = cart_date.customers_basket_quantity;
                    package_id[i] = cart_date.package_id;
                }
                var coupon_code = $("#coupon_code").val();
                if (coupon_code == '') {
                    toastMessage("Coupon Code required.", "Error", "OK");
                } else {
                    showLoading("Checking coupon code..");
                    $.ajax({
                        type: "POST",
                        data: "action=applyCouponCode&products_id=" + products_id + "&quantity=" + quantity + "&package_id=" + package_id + "&customers_id=" + cart_date.customers_id + "&payment_method=" + Number(getValue("payment_method")) + "&coupon_code=" +encodeURIComponent(coupon_code)+"&supplier_id="+supplierID,
                        url: CONECTION_SERVER(),
                        crossDomain: true,
                        dataType: "json",
                        success: function(dataresult) {
                            hideLoading();
                            if (dataresult.result == 'error') {
                                toastMessage(dataresult.message, "Error", "OK");
                                $("#coupon_code").val('');
                                return false;
                            } else {
                                if (dataresult.result == 'success') {
                                    addValue("discount_amount", dataresult.discount_amount);
                                    addValue("coupon_code", coupon_code);
                                    var discount_amount = dataresult.discount_amount;
                                    var ordertotal = Number($(".total_checkout").html().replace("$", ""));
                                    $("td.total_coupon_code").parent("tr").remove();
                                    $(".total_checkout").html('$' + (ordertotal - discount_amount).toFixed(2));
                                    $("td.sub_total_checkout").parent("tr").after('<tr class="checkout_html_body"><td align="right">' + dataresult.discount_coupon_text + ':</td><td class="total_coupon_code">-$' + (discount_amount).toFixed(2) + '</td></tr>');
                                    toastMessage("Discount coupon applied.");

                                }
                            }
                        }
                    });
                }
            } else { goToCartPage(supplierID); }
        }, successCB, errorCB);
    });
}

function checkoutQuery() {
    if (Number(getValue("payment_method")) == 3) {
        var errors = [];
        var card_holder_name = $.trim($("#card_holder_name").val());
        var credit_card = $.trim($("#credit_card").val());
        var month = $.trim($("#month").val());
        var year = $.trim($("#year").val());
        var card_cvv = $.trim($("#card_cvv").val());
        var delivery_address_hdn = $.trim($("#delivery_address_hdn").val());
        var save_card_later = $.trim($("input[name=save_card_later]:checked").val());
        var currentYear = parseInt(new Date().getFullYear().toString().substr(2, 2));

        if (delivery_address_hdn == 'true') {
            toastMessage("Please update delivery address.");
            return false;
        }

        if (save_card_later == "") {
            save_card_later = 0;
        }
        var ordertotal_creditcard = Number($(".total_checkout").html().replace("$", ""));

        if (card_holder_name.length == 0)
            errors[errors.length] = "Card holder name is required.";
        if (Validate(credit_card) == false)
            errors[errors.length] = "Invalid credit card number.";
        if (month.length == 0 || !Number(month) || Number(month) > 12)
            errors[errors.length] = "Invalid expiry month.";
        if (year.length == 0 || !Number(year) || Number(year) < currentYear)
            errors[errors.length] = "Invalid expiry year.";
        if (card_cvv.length == 0 || !Number(card_cvv))
            errors[errors.length] = "Invalid CVV.";
        if (ordertotal_creditcard<1)
            errors[errors.length] = "Minimum $1.00 order amount required for credit card payment.";

        var save_credit_card_radio = $.trim($("input[name=creditcard_token_payments_cards_id]").val());

        if ((errors.length > 0 && save_credit_card_radio == "") || (ordertotal_creditcard<1 && errors.length > 0)) {
            mutipleErrors(errors);
            return false;
        } else {
            checkoutConfrimation(supplierID);

        }

    } else {
        checkoutConfrimation(supplierID);

    }

}

function checkoutConfrimation(supplier_id) {
    if (!supplier_id && supplier_id != 0){ 
        supplier_id = supplierID;
    }
    getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
        db.query('SELECT * FROM customers_basket WHERE supplier_id=' + supplier_id + ' AND customers_id=' + data.customers_id + ' ORDER BY customers_basket_id DESC', function(tx, results) {
            var errors = [];

            var attachData       = '';
            var ordercomment     = $.trim($("#ordercomment").val());
            var urgent_order     = $.trim($("#urgent_order:checked").val());
            var ordercommentText = $.trim($("#ordercommentText").val());
            var coupon_code      = $.trim(getValue("coupon_code"));
            var discount_amount  = $.trim(getValue("discount_amount"));

            var firstname       = $.trim($("#chk_firstname").val());
            var lastname        = $.trim($("#chk_lastname").val());
            var company         = $.trim($("#chk_company").val());
            var state           = $.trim($("#chk_state").val());
            var street_address  = $.trim($("#chk_street_address").val());
            var suburb          = $.trim($("#singup_form_suburb").val());
            var postcode        = $.trim($("#chk_postcode").val());
            var delivery_date   = $.trim($("#delivery_date").val());

            if (Number(getValue("payment_method")) == 3) {
                var card_holder_name = $.trim($("#card_holder_name").val());
                var credit_card = $.trim($("#credit_card").val());
                var month = $.trim($("#month").val());
                var year = $.trim($("#year").val());
                var card_cvv = $.trim($("#card_cvv").val());
                var delivery_address_hdn = $.trim($("#delivery_address_hdn").val());
                var save_card_later = $.trim($("input[name=save_card_later]:checked").val());
                var currentYear = parseInt(new Date().getFullYear().toString().substr(2, 2));

                if (delivery_address_hdn == 'true') {
                    toastMessage("Please update delivery address.");
                    return false;
                }

                if (save_card_later == "") {
                    save_card_later = 0;
                }
                var ordertotal_creditcard = Number($(".total_checkout").html().replace("$", ""));

                if (card_holder_name.length == 0)
                    errors[errors.length] = "Card holder name is required.";
                if (Validate(credit_card) == false)
                    errors[errors.length] = "Invalid credit card number.";
                if (month.length == 0 || !Number(month) || Number(month) > 12)
                    errors[errors.length] = "Invalid expiry month.";
                if (year.length == 0 || !Number(year) || Number(year) < currentYear)
                    errors[errors.length] = "Invalid expiry year.";
                if (card_cvv.length == 0 || !Number(card_cvv))
                    errors[errors.length] = "Invalid CVV.";
                if (ordertotal_creditcard<1)
                    errors[errors.length] = "Minimum $1.00 order amount required for credit card payment.";
                
                var save_credit_card_radio = $.trim($("input[name=creditcard_token_payments_cards_id]").val());

                if ((errors.length > 0 && save_credit_card_radio == "") || (ordertotal_creditcard<1 && errors.length > 0)) {
                    mutipleErrors(errors);
                    return false;
                } else {
                    attachData = "creditcard_token_payments_cards_id=" + encodeURIComponent(save_credit_card_radio) + "&card_holder_name=" + encodeURIComponent(card_holder_name) + "&credit_card=" + credit_card + "&month=" + month + "&year=" + year + "&card_cvv=" + card_cvv + "&save_card_later=" + save_card_later+"&credit_card_payment_gateway=promisepay";
                }
            } else {
                var delivery_address_hdn = $.trim($("#delivery_address_hdn").val());
                if (delivery_address_hdn == 'true') {
                    toastMessage("Please update delivery address.");
                    return false;
                }
            }
            var len = results.rows.length;
            var products_id = [];
            var quantity = [];
            var package_id = [];
            var products_name = [];
            if (len > 0) {
                for (var i = 0; i < Number(len); i++) {
                    cart_date = results.rows.item(i);
                    products_id[i] = cart_date.products_id;
                    quantity[i] = cart_date.customers_basket_quantity;
                    package_id[i] = cart_date.package_id;
                    products_name[i] = encodeURIComponent(cart_date.products_name);

                }
                var isMobile = {
                    Android: function() {
                        return navigator.userAgent.match(/Android/i);
                    },
                    BlackBerry: function() {
                        return navigator.userAgent.match(/BlackBerry/i);
                    },
                    iOS: function() {
                        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                    },
                    Opera: function() {
                        return navigator.userAgent.match(/Opera Mini/i);
                    },
                    Windows: function() {
                        return navigator.userAgent.match(/IEMobile/i);
                    },
                    any: function() {
                        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                    }
                };
                if (isMobile.any()) {
                    var deviceType = device.platform + ' ' + device.version;
                } else {
                    var deviceType = "computer";
                }
                var shipping_charge = parseFloat(!isNaN(getValue('calculate_supplier_extra_charges_' + supplier_id)) ? getValue('calculate_supplier_extra_charges_' + supplier_id) : 0.00);
                var selected_customers_id = 0;
                if (getValue("account_type") == 'user') selected_customers_id = getValue("account_id");
                showLoading("Checkout in process..");
                $.ajax({
                    type: "POST",
                    data: "action=checkoutProcess&supplier_id=" + supplier_id + "&products_id=" + products_id + "&products_name=" + products_name + "&quantity=" + quantity + "&package_id=" + package_id + "&customers_id=" + data.customers_id + "&payment_method=" + Number(getValue("payment_method")) + "&device=" + deviceType + "&ordercomment=" + encodeURIComponent(ordercomment) + "&urgent_order=" + urgent_order + "&urgent_comment=" + encodeURIComponent(ordercommentText) + "&discount_amount=" + discount_amount + "&coupon_code=" + encodeURIComponent(coupon_code) + "&" + attachData + "&shipping_charge=" + shipping_charge + "&order_by_supplier_id=" + supplier_id + "&new_version=" + 1 + "&selected_customers_id=" + selected_customers_id+"&postappVersion="+postAppversion+"&delivery_date="+delivery_date,
                    url: CONECTION_SERVER(),
                    timeout: 60000,
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'error') {
                            toastMessageLong(dataresult.message, "Error", "OK");
                            return false;
                        } else {
                            if (dataresult.result == 'success') {
                                deleteValue("card_fee");
                                deleteValue("bank_details");
                                deleteValue("payment_method");
                                deleteValue("discount_amount");
                                deleteValue("coupon_code");
                                db.execute("DELETE FROM customers_basket WHERE supplier_id=" + supplier_id, successCB, errorCB);
                                db.execute("DELETE FROM customers_basket_attributes WHERE supplier_id=" + supplier_id, successCB, errorCB);
                                cartCount();
                                var transaction_msg_html = '';
                                if (typeof dataresult.transactionNo_message!="undefined" && dataresult.transactionNo_message != "") {
                                    transaction_msg_html = '<div class="alert alert-success first_messgae"><p>' + dataresult.transactionNo_message + '</p></div>';
                                }

                                $("#checout_details").html('<div id="serverResponse"><div class="alert alert-success first_messgae"><p>' + dataresult.message + '</p></div>' + transaction_msg_html + '</div>');
                                if (typeof dataresult.credit_payment_error!="undefined" && $.trim(dataresult.credit_payment_error) != '') {
                                    addValue("orders_id", dataresult.orders_id);
                                    $("div#serverResponse div.first_messgae").after('<div class="alert alert-error">Payment Error: <p>' + dataresult.credit_payment_error + '</p></div>');
                                }
                                
                                $("#back_from_cart").show();
                                $("#checout_details").trigger('create');
                            }
                        }

                    },
                    error: function(error) {
                        connectionAlert();
                    }
                });
            } else { goToCartPage(supplier_id); }
        }, successCB, errorCB);
    });
}

function Calculate(e) {
    var t = 0;
    for (i = 0; i < e.length; i++) {
        t += parseInt(e.substring(i, i + 1))
    }
    var n = new Array(0, 1, 2, 3, 4, -4, -3, -2, -1, 0);
    for (i = e.length - 1; i >= 0; i -= 2) {
        var
            r = parseInt(e.substring(i, i + 1));
        var s = n[r];
        t += s
    }
    var o = t % 10;
    o = 10 - o;
    if (o == 10) {
        o = 0
    }
    return o
}

function Validate(e) {
    var t = parseInt(e.substring(e.length - 1, e.length));
    var n = e.substring(0, e.length - 1);
    if (Calculate(n) == parseInt(t)) {
        return true
    }
    return false
}

function mutipleErrors(errors) {
    var msg = "Please fix the following errors and try again.";
    for (var i = 0; i < errors.length; i++) {
        var numError = i + 1;
        msg += "\n" + numError + ". " + errors[i];
    }
    showMessage(msg, "Error", "OK");
    return false;
}

function userData() {
    $(".error_user_data").html('');
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            showLoading("Loading account data..");
            var row = results.rows.item(0);
            $.ajax({
                type: "POST",
                data: "action=accountData&customers_id=" + row.customers_id,
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {

                    hideLoading();
                    if (dataresult.result == "error") {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    $("#account_form #firstname").val(outputSting(dataresult.customers_firstname));
                    $("#account_form #lastname").val(outputSting(dataresult.customers_lastname));
                    $("#account_form #email").val(outputSting(dataresult.customers_email_address));
                    $("#account_form #mobile").val(dataresult.sms_mobile);
                    $("#account_form #fax").val(dataresult.customers_fax);
                    $("#account_form #customers_public_note").val(outputSting(dataresult.customers_public_note));


                    if (dataresult.customers_gender == 'm')
                        $("#account_form #gender_a").prop("checked", true).checkboxradio("refresh");
                    else if (dataresult.customers_gender == 'f')
                        $("#account_form #gender_a").prop("checked", true).checkboxradio("refresh");




                    $('#account_form select option[value="' + outputSting(dataresult.building_type) + '"]').prop('selected', true);

                    $('#account_form select option[value="' + outputSting(dataresult.customer_shop) + '"]').prop('selected', true);

                    $('#account_form select').selectmenu('refresh');

                    addressTypeAction(outputSting(dataresult.building_type), "account_form");

                    if (dataresult.customers_center > 0) {
                        messageCenterAction('Yes', "account_form");
                        messageCenterSelectedAction(outputSting(dataresult.customers_center), "account_form");
                        $('#account_form input[name=located_center]').prop("checked", false).checkboxradio("refresh");
                        $("#account_form #located_center_a").prop("checked", true).checkboxradio("refresh");
                        $("#account_form #center").val(dataresult.customers_center);
                        $("#account_form input[name=center_search]").val(outputSting(dataresult.center_name));
                        $("#account_form #shop").val(dataresult.customers_shop_no);
                        $("#account_form #level").val(outputSting(dataresult.customers_level));
                        $("#account_form #best_entry").val(outputSting(dataresult.customers_best_entry));
                        $("#account_form #loading_zone").val(outputSting(dataresult.customers_loading_zone));
                        $("#account_form #info").val(outputSting(dataresult.shopping_center_info));
                    } else {
                        $('#account_form input[name=located_center]').prop("checked", false).checkboxradio("refresh");
                        $("#account_form #located_center_b").prop("checked", true).checkboxradio("refresh");
                        messageCenterAction('No', "account_form");
                        messageCenterSelectedAction('', "account_form");
                    }

                    $("#account_form #telephone").val(dataresult.customers_telephone);
                    $("#account_form #street_address").val(outputSting(dataresult.entry_street_address));
                    $("#account_form #company").val(outputSting(dataresult.entry_company));
                    $("#account_form #business_name").val(outputSting(dataresult.business_name));
                    if (dataresult.abn != '') {
                        var abn_selected = outputSting(dataresult.abn);
                        $("#account_form #abn").val(abn_selected);
                        $("#singup_form #abn_num").val(abn_selected);
                        $('.abn_num_val').val(abn_selected);
                        $('.abn_num_val_update').val(abn_selected);
                        $('.selected_abn').html(abn_selected);
                        $('.abn_search_div').hide();
                        $('.abn_num_div').show();
                    } else {
                        $('.abn_num_val').val('');
                        $('.abn_num_val_update').val('');
                        $('.selected_abn').html('');
                        $('.abn_search_div').show();
                        $('.abn_num_div').hide();
                    }

                    $("#account_form input[name=suburb]").val(dataresult.entry_suburb);
                    $("#account_form #city").val(dataresult.entry_city);
                    $("#account_form input[name=postcode]").val(dataresult.entry_postcode);
                    $("#account_form #state").val(dataresult.entry_state);

                    if (dataresult.customers_check > 0) {
                        $("#account_form #agree").prop("checked", true);
                        $("#account_form #agree").parent("div").removeClass("unchecked").addClass("fa fa-check checked");
                    }
                    if (dataresult.customers_delivery_time != '') {
                        $("#account_form #" + outputSting(dataresult.customers_delivery_time)).prop("checked", true).checkboxradio("refresh");
                    }
                    for (var i = 0; i < dataresult.day.length; i++) {
                        var day = dataresult.day[i];
                        $("#account_form #" + day).prop("checked", true);
                        $("#account_form #" + day).parent("div").removeClass("unchecked").addClass("fa fa-check checked");

                        $("#input_from_" + day).val(dataresult.from[i]);
                        $("#input_to_" + day).val(dataresult.to[i]);
                        $('#select_from_' + day + ' option[value="' + outputSting(dataresult.from_ampm[i]) + '"]').prop('selected', true);
                        $('#select_to_' + day + ' option[value="' + outputSting(dataresult.to_ampm[i]) + '"]').prop('selected', true);

                        $("#input_from1_" + day).val(dataresult.from[i]);
                        $("#input_to1_" + day).val(dataresult.to1[i]);
                        $('#select_from1_' + day + ' option[value="' + outputSting(dataresult.from1_ampm[i]) + '"]').prop('selected', true);
                        $('#select_to1_' + day + ' option[value="' + outputSting(dataresult.to1_ampm[i]) + '"]').prop('selected', true);

                        show(day, 'account_form');
                        $('#account_form select').selectmenu('refresh');
                    }




                },
                error: function(error) {
                    hideLoading();
                    $(".error_user_data").html('<p style="text-align:center;"><img class="error_image" src="img/cannot.png" onClick="userData();" /></p>');
                    $(".error_user_data").trigger('create');
                }
            });

        } else goTO('user_login');
    }, successCB, errorCB);
}

function outputSting(data) {
    if ($.trim(data) != '' && $.trim(data) != null && $.isNumeric(data) == false) {
        var data = data.replace(/\\/g, "");
        return $.trim(data);
    } else {
        return $.trim(data);
    }
}

function step2Process(form) {
    var firstname = $.trim($("#" + form + " #firstname").val());
    var lastname = $.trim($("#" + form + " #lastname").val());
    var email = $.trim($("#" + form + " #email").val());
    var gender = $.trim($("#" + form + " input[name=gender]:checked").val());
    var password = $.trim($("#" + form + " #password").val());
    var postcode = $.trim($("#" + form + " #postcode").val());

    if (firstname.length < 2)
        toastMessage("First Name is required");
    else if (lastname.length < 2)
        toastMessage("Last Name is required");
    else if (validateEmail(email) == false)
        toastMessage("Invalid Email address.");
    /*else if(gender=='')
      toastMessage("Gender is required.");*/
    else if (password.length <= 5 && form == "singup_form")
        toastMessage("Minimum 6 character password required.");
    else if (postcode.length < 2)
        toastMessage('Delivery postcode is required');
    else if (form == "singup_form") {
        showLoading("Verifying your email address");
        $.ajax({
            type: "POST",
            data: "action=emailExist&email=" + email,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                hideLoading();
                if (dataresult.result == "error") {
                    toastMessage(dataresult.message, "Error", "OK");
                } else {
                    $("#" + form + " #step1_personal_info").slideUp();
                    $("#" + form + " #step2_company_info").slideDown();

                    $(window).scrollTop(0);
                }
            },
            error: function(error) {
                connectionAlert();
            }
        });
    } else {
        $("#" + form + " #step1_personal_info").slideUp();
        $("#" + form + " #step2_company_info").slideDown();
        $(window).scrollTop(0);
    }

}

function addressTypeAction(address_type, form) {
    if (address_type == '1') {
        $('#' + form + ' input[name=located_center]').prop("checked", false).checkboxradio("refresh");
        $('#' + form + ' #located_center_a').prop("checked", true).checkboxradio("refresh");
        $('#' + form + ' .comerical_setting').slideDown();
        $('#' + form + ' .comerical_setting').closest('div.ui-input-text').show();
        $('#' + form + ' #company').val('');
    } else {
        $('#' + form + ' input[name=located_center]').prop("checked", false).checkboxradio("refresh");
        $('#' + form + ' #located_center_b').prop("checked", true).checkboxradio("refresh");
        $('#' + form + ' .comerical_setting').slideUp();
        $('#' + form + ' .comerical_setting').closest('div.ui-input-text').hide();
        var firstname = $.trim($('#' + form + ' #firstname').val());
        var lastname = $.trim($('#' + form + ' #lastname').val());
        $('#' + form + ' #company').val(lastname + ' ' + firstname);
    }
}

function messageCenterAction(located_center, form) {
    if (located_center == "Yes") {
        $("#" + form + " .center_manage").show();
        $("#" + form + " .center_manage").closest('div.ui-input-text').show();
    } else {
        $("#" + form + " #center,#" + form + " input[name=center_search]").val('');
        $("#" + form + " .center_manage").hide();
        $("#" + form + " .center_manage").closest('div.ui-input-text').hide();
        messageCenterSelectedAction('', "account_form");
    }
}

function messageCenterSelectedAction(center_message, form) {
    if (center_message != "") {
        $("#" + form + " .center_manage_select").show();
        $("#" + form + " .center_manage_select").closest('div.ui-input-text').show();
    } else {
        $("#" + form + " .center_manage_select").hide();
        $("#" + form + " .center_manage_select").closest('div.ui-input-text').hide();
    }
}

function step3Process(form) {
    var company = $.trim($("#" + form + " #company").val());
    var telephone = $.trim($("#" + form + " #telephone").val());
    var industry_type = $.trim($("#" + form + " #industry_type option:selected").val());
    var address_type = $.trim($("#" + form + " #address_type option:selected").val());
    var located_center = $.trim($("#" + form + " input[name=located_center]:checked").val());

    if (company.length < 2)
        toastMessage("Trading As (Shop Name) is required");
    else if (industry_type == '')
        toastMessage("Company Type is required");
    else if (located_center == '')
        toastMessage("You must select one from center option.");
    else if (telephone.length <= 5)
        toastMessage("Telephone number is required.");
    else if (address_type == '')
        toastMessage("Address Type is required");
    else {
        if (located_center == "Yes") {
            $("#" + form + " .center_manage").show();
            $("#" + form + " .center_manage").closest('div.ui-input-text').show();
        } else {
            $("#" + form + " #center,#" + form + " input[name=center_search]").val('');
            $("#" + form + " .center_manage").hide();
            $("#" + form + " .center_manage").closest('div.ui-input-text').hide();
        }
        $("#" + form + " #step2_company_info").slideUp();
        $("#" + form + " #step3_address_info").slideDown();
        $(window).scrollTop(0);
    }
}

$(document).on("click", "#not_have_comp", function() {
    if ($(this).is(":checked"))
        $(".company_type_div").hide();
    else
        $(".company_type_div").show();
});

function openaddNewUser(form) {
    $("#invite_first_name").val('');
    $("#manage_invite_email").val('');
    $("#add_new_address, #manage_products_list, #manage_products_list, #access_new_suppliers, #manage_custom_suppliers").prop("checked", false);
    $("#popup_manage_users").popup("open");
}

function addNewUser(form) {
    var first_name              = $.trim($("#invite_first_name").val());
    var email                   = $.trim($("#manage_invite_email").val());
    var save_credit_cards       = $.trim($("#save_credit_cards[name=premissions ]:checked").val());
    var add_new_address         = $.trim($("#add_new_address[name=premissions ]:checked").val());
    var manage_products_list    = $.trim($("#manage_products_list[name=premissions ]:checked").val());
    var access_new_suppliers    = $.trim($("#access_new_suppliers[name=premissions ]:checked").val());
    var manage_custom_suppliers = $.trim($("#manage_custom_suppliers[name=premissions ]:checked").val());

    var user_permission = [];
    if (save_credit_cards) {
        user_permission.push(save_credit_cards);
    }
    if (add_new_address) {
        user_permission.push(add_new_address);
    }
    if (manage_products_list) {
        user_permission.push(manage_products_list);
    }
    if (access_new_suppliers) {
        user_permission.push(access_new_suppliers);
    }
    if (manage_custom_suppliers) {
        user_permission.push(manage_custom_suppliers);
    }

    if (first_name == '') {
        toastMessage("Please enter first name.");
    } else if (validateEmail(email) == false) {
        toastMessage("Invalid Email address.");
    } else {
        showLoading();
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                $.ajax({
                    type: "POST",
                    data: "action=addUser&customers_id=" + row.customers_id + "&user_email=" + email + "&user_permission=" + user_permission + "&user_first_name=" + encodeURIComponent(first_name),
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'Error') {
                            toastMessage(dataresult.errors, "Error", "OK");
                            return false;
                        } else {
                            toastMessage(dataresult.message);
                            $("#popup_manage_users").popup("close");
                        }
                    },
                    error: function(error) {
                        connectionAlert();
                    }
                });
            } else goTO('user_login');
        }, successCB, errorCB);

    }

}

function editUser(id) {
    var user_customers_id       = id;
    var save_credit_cards       = $.trim($("#manage_edit_save_credit_cards" + id + "[name=premissions ]:checked").val());
    var add_new_address         = $.trim($("#manage_edit_add_new_address" + id + "[name=premissions ]:checked").val());
    var manage_products_list    = $.trim($("#manage_edit_manage_products_list" + id + "[name=premissions ]:checked").val());
    var access_new_suppliers    = $.trim($("#manage_edit_access_new_suppliers" + id + "[name=premissions ]:checked").val());
    var manage_custom_suppliers = $.trim($("#manage_edit_manage_custom_suppliers" + id + "[name=premissions ]:checked").val());

    var user_status = $.trim($("#manage_user_status" + id + "[name=manage_user_status ]:checked").val());
    if (user_status == '') user_status = 0;
    var user_permission = [];
    if (save_credit_cards) {
        user_permission.push(save_credit_cards);
    }
    if (add_new_address) {
        user_permission.push(add_new_address);
    }
    if (manage_products_list) {
        user_permission.push(manage_products_list);
    }
    if (access_new_suppliers) {
        user_permission.push(access_new_suppliers);
    }
    if (manage_custom_suppliers) {
        user_permission.push(manage_custom_suppliers);
    }
    showLoading();
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            $.ajax({
                type: "POST",
                data: "action=updateUser&customers_id=" + row.customers_id + "&user_customers_id=" + user_customers_id + "&user_permission=" + user_permission + "&user_status=" + user_status,
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {
                    hideLoading();
                    loadCustomerUsers(row.customers_id);
                    if (dataresult.result == 'error') {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    } else {

                    }
                },
                error: function(error) {
                    connectionAlert();
                }
            });
        } else goTO('user_login');
    }, successCB, errorCB);
}

function switch_Account() {
    goTO('home_page');
    fetchsidebar();
}

function switchAccount(selected_customers_id) {
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            var customers_id = row.customers_id;
            showLoading();
            $.ajax({
                type: "POST",
                data: "action=getSelectedCustomerData&customers_id=" + selected_customers_id + "&user_customers_id=" + row.customers_id,
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {
                    if (dataresult.result == 'error') {
                        hideLoading();
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    } else {

                        if (selected_customers_id != row.customers_id) {
                            addValue("account_type", 'user');
                            var permissions = dataresult.permissions;
                            var use_credit_card = permissions.match(/use_credit_card/g);
                            var add_address = permissions.match(/add_address/g);
                            addValue("account_perm_addr", add_address);
                            addValue("account_perm_card", use_credit_card);
                            $("div.current_entry_company").html("User of " + outputSting(dataresult.entry_company));
                        } else {
                            addValue("account_type", 'customer');
                            $("div.current_entry_company").html(outputSting(dataresult.entry_company));

                        }
                        $("div.current_entry_company").html(outputSting(dataresult.entry_company));
                        addValue("account_id", selected_customers_id);
                        addValue("account_entry", dataresult.entry_company);
                        deleteValue("custom_suppliers");
                        sessionStorage.clear();
                        addValueSession("switch_account", "1");
                        db.execute("DELETE FROM products_list", successCB, errorCB);
                        db.execute("DELETE FROM customers_basket", successCB, errorCB);
                        db.execute("DELETE FROM customers_basket_attributes", successCB, errorCB);
                        if (typeof dataresult.customers_basket != "undefined") {
                            addtoCartArray(dataresult.customers_basket);
                        }
                        if ($.mobile.activePage.attr('id') == 'manage_accounts') {
                            toastMessage("Account switched to " + dataresult.entry_company);
                            getSuppliers();
                            fetchsidebar(true);
                            hideLoading();
                            goTO('home_page');
                        }
                    }
                },
                error: function(error) {
                    connectionAlert();
                }
            });
        } else goTO('user_login');
    }, successCB, errorCB);
}

function login() {
    $.mobile.changePage("#user_login", { transition: "none" });
 
}

function createAccountFirstPageValidation(form) {
    var singup_email = $.trim($("#" + form + " #singup_email").val());
    var password = $.trim($("#" + form + " #password").val());
    var firstname = $.trim($("#" + form + " #singup_firstname").val());
    var lastname = $.trim($("#" + form + " #singup_lastname").val());
    var mobile = $.trim($("#" + form + " #singup_mobile").val());
    var gender = $.trim($(".checkradios-radio.checked").children().children().val());
    var dob = $.trim($("#" + form + " #date_of_birth").val());
    var userAvatar = ''; //document.getElementById('singup_avatar').getAttribute('data-text');
    console.log(form);
    var wrongField = false;
    if (firstname.length < 2 && form == "singup_form") {
        toastMessage("First Name is required");
        wrongField = true;
    } else if (lastname.length < 2 && form == "singup_form") {
        toastMessage("Last Name is required");
        wrongField = true;
    } else if (mobile.length < 2 && form == "singup_form") {
        toastMessage("Mobile is required");
        wrongField = true;
    } else if (validateEmail(singup_email) == false && form == "singup_form") {
        toastMessage("Invalid Email address.");
        wrongField = true;
    }
    /*else if(password.length<=5 && form=="singup_form"){
            toastMessage("Minimum 6 character password required.");
             wrongField = true;
    }*/
    if (!wrongField)
        $.mobile.changePage("#user_singup_company", { transition: "none" });
       

    $('#singup_center').parent().addClass('no-border-bottom');

}

function supplierRegistration(form) {
    var become_a_supplier_first_name = $.trim($("#become_a_supplier_first_name").val());
    var become_a_supplier_last_name = $.trim($("#become_a_supplier_last_name").val());
    var become_a_supplier_mobile = $.trim($("#become_a_supplier_mobile").val());
    var become_a_supplier_user_name = $.trim($("#become_a_supplier_user_name").val());
    var become_a_supplier_postcode = $.trim($("#become_a_supplier_postcode").val());

    if (become_a_supplier_first_name.length < 2) {
        toastMessage("First Name is required.");
    } else if (become_a_supplier_last_name.length < 2) {
        toastMessage("Last Name is required.");
    } else if (become_a_supplier_mobile.length < 8) {
        toastMessage("Mobile Number is required.");
    } else if (validateEmail(become_a_supplier_user_name) == false) {
        toastMessage("Invalid Email address.");
    } else if (become_a_supplier_postcode.length < 2) {
        toastMessage("Postcode is required");
    } else {
        showLoading();
        $.ajax({
            type: "POST",
            data: "action=become_a_supplier_temp&" + $("#" + form).serialize(),
            url: CONECTION_SERVER(),
            crossDomain: true,
            cache: false,
            dataType: "json",
            success: function(dataresult) {
                hideLoading();
                if (dataresult.result == 'error') {
                    toastMessage(dataresult.message, "Error", "OK");
                    return false;
                } else if (dataresult.redirect_page != '') {
                    toastMessage(dataresult.message);
                    $("#" + form + " input").val('');
                    setTimeout(function() {
                        cordova.InAppBrowser.open(dataresult.redirect_page, '_system', 'location=yes');
                    }, 1500);


                }
            },
            error: function(error) {
                connectionAlert();
            }
        });
    }
}

function fastRegistration(form) {
    var fast_singup_firstname = $.trim($("#fast_singup_firstname").val());
    var fast_singup_mobile = $.trim($("#fast_singup_mobile").val());
    var fast_singup_email = $.trim($("#fast_singup_email").val());
    var fast_singup_password = $.trim($("#fast_singup_password").val());
    var fast_industry_type = $.trim($("#fast_industry_type").val());
    var fast_singup_form_postcode = $.trim($("#fast_singup_form_postcode").val());
    var terms_accept = $.trim($("input[name=terms_accept]:checked").val());
    var mailing_list = $.trim($("input[name=mailing_list]:checked").val());
    var abn_num = $.trim($("#" + form + " #abn_num").attr('abn-number'));
    $("#" + form + " #abn_num").val(abn_num);
    var abn_num = $.trim($("#" + form + " #abn_num").val());

    if (fast_singup_firstname.length < 2) {
        toastMessage("First Name is required.");
    } else if (fast_singup_mobile.length < 8) {
        toastMessage("Mobile Number is required.");
    } else if (validateEmail(fast_singup_email) == false) {
        toastMessage("Invalid Email address.");
    } else if (fast_singup_password.length < 6) {
        toastMessage("Minimum 6 character password required.");
    } else if (fast_singup_form_postcode.length < 2) {
        toastMessage("Postcode is required");
    } else if (!fast_industry_type) {
        toastMessage("Company Type is required.");
    } else if (terms_accept == '') {
        toastMessage("You must accept the agreement");
    } else {
        showLoading('Creating your account..');
        $.ajax({
            type: "POST",
            data: "action=createAccount&guest_mode=1&customers_newsletter=mailing_list&" + $("#fast_registration_from").serialize(),
            url: CONECTION_SERVER(),
            crossDomain: true,
            cache: false,
            dataType: "json",
            success: function(dataresult) {
                hideLoading();
                if (dataresult.result == 'error' && dataresult.message != 'Email already exist please try with different email.') {
                    hideLoading();
                    toastMessage(dataresult.message, "Error", "OK");
                    return false;
                } else if (dataresult.message == 'Email already exist please try with different email.') {
                    $.mobile.changePage("#user_login", { transition: "none" });
                    toastMessage('Email already exist please login');
                } else {
                    guestValidate(fast_singup_email);
                }
            },
            error: function(error) {
                connectionAlert();
            }
        });
    }

}

function accountProcess(form, isRegistration) {
    var singup_email = $.trim($("#" + form + " #singup_email").val());
    var password = $.trim($("#" + form + " #password").val());
    var firstname = $.trim($("#" + form + " #singup_firstname").val());
    var lastname = $.trim($("#" + form + " #singup_lastname").val());
    var mobile = $.trim($("#" + form + " #singup_mobile").val());
    var updatefname = $.trim($("#" + form + " #firstname").val());
    var updatelname = $.trim($("#" + form + " #lastname").val());
    var gender = $.trim($("#" + form + " input[name=gender]:checked").val());
    var singup_company = $.trim($("#" + form + " #singup_company").val());
    var singup_telephone = $.trim($("#" + form + " #singup_telephone").val());
    var state = $.trim($("#" + form + " #singup_state").val());
    var ustate = $.trim($("#" + form + " #state").val());
    var not_have_comp = $.trim($("#input[name=not_have_comp]:checked").val());
    var userAvatar = ''; //document.getElementById('singup_avatar').getAttribute('data-text');
    var abn_num = abn_hidden = "";
    var center = $.trim($("#" + form + " #center").val());
    if (isRegistration) {
        var dob = $.trim($("#" + 'singup_form' + " #date_of_birth").val());
        singup_email = $.trim($("#" + 'singup_form' + " #singup_email").val());
        /* password     = $.trim($("#"+'singup_form'+" #password").val());*/
        firstname = $.trim($("#" + 'singup_form' + " #singup_firstname").val());
        lastname = $.trim($("#" + 'singup_form' + " #singup_lastname").val());
        mobile = $.trim($("#" + 'singup_form' + " #singup_mobile").val());
        gender = $.trim($(".checkradios-radio.checked").children().children().val());
        userAvatar = ''; //document.getElementById('singup_avatar').getAttribute('data-text');
        center = $.trim($("#" + form + " #singup_form_center_search").val());
    }
    if (form == "account_form") {
        var business_name = $.trim($("#" + form + " #business_name").val()) || "";
        abn_hidden = $.trim($("#" + form + " #abn").val());
        var company_type = $.trim($("#" + form + " #industry_type").val());
    }
    if (form == "singup_form_company") {
        var business_name = $.trim($("#singup_business_name").val()) || "";
        abn_num = $.trim($("#" + form + " #abn_num").attr('abn-number'));
        var company_type = $.trim($("#" + form + " #singup_industry_type").val());
    }
    var located_center = $.trim($("#" + form + " input[name=located_center]:checked").val());
    var street_address = $.trim($("#" + form + " #singup_street_address").val());
    var suburb = $.trim($("#" + form + " input[name=suburb]").val());
    var postcode = $.trim($("#" + form + " input[name=postcode]").val());
    var delivery_time = $.trim($("#" + form + " input[name=dt2]:checked").val());
    var shop = $.trim($("#" + form + " #shop").val());
    var agree = $.trim($("#" + form + " input[name=agree]:checked").val());

    if (firstname.length < 2 && form == "singup_form_company") {
        toastMessage("First Name is required");
    } else if (lastname.length < 2 && form == "singup_form_company") {
        toastMessage("Last Name is required");
    } else if (mobile.length < 2 && form == "singup_form_company") {
        toastMessage("Mobile is required");
    } else if (suburb.length < 2 && form == "singup_form_company") {
        toastMessage("Suburb is required");
    } else if (postcode.length < 2 && form == "singup_form_company") {
        toastMessage("Postcode is required");
    } else if (state.length < 2 && form == "singup_form_company") {
        toastMessage("State is required");
    } else if (validateEmail(singup_email) == false && form == "singup_form_company") {
        toastMessage("Invalid Email address.");
        /*}else if(password.length<=5 && form=="singup_form_company"){
            toastMessage("Minimum 6 character password required.");*/
    } else if (!business_name && form == "account_form") {
        toastMessage("Business Name is required");
    } else if ((form == "user_singup_company" && not_have_comp == "" && abn_num.length < 2) || (form == "account_form" && abn_hidden == "")) {
        toastMessageLong("Please enter your business name or ABN and press the search icon to select your business.");
        $("#" + form + " input.abn_search").css("border", "1px solid red");
    } else if (singup_company.length <= 2 && form == "singup_form_company") {
        toastMessage("Trading As (Shop Name) is required.");
    } else if (!not_have_comp && !company_type && form == "singup_form_company") {
        toastMessage("Company Type is required.");
    } else if (updatefname.length < 2 && form == "account_form") {
        toastMessage("First Name is required");
    } else if (updatelname.length < 2 && form == "account_form") {
        toastMessage("Last Name is required");
        //}else if(gender==''){
        //toastMessage("Gender is required.");
        //}else if(company.length<2 && form=="singup_form_company"){
        //toastMessage("Company is required");
    } else if (street_address.length < 2 && form == "singup_form_company") {
        toastMessage("Address is required.");
    } else if (suburb.length < 2) {
        toastMessage("Suburb is required.");
    } else if (postcode.length < 2) {
        toastMessage("Postcode is required.");
    } else if (state.length < 2 && form == "singup_form_company") {
        toastMessage("State is required.");
    } else if (ustate.length < 2 && form == "account_form") {
        toastMessage("State is required.");
    } else if (singup_telephone.length <= 5 && form == "singup_form_company") {
        toastMessage("Telephone number is required.");
    } else if (agree == '' && form == "account_form") {
        toastMessage("You must accept the agreement.");
    } else if (form == 'singup_form_company' && !guest_mode) {
        showLoading('Creating your account..');
        $.ajax({
            type: "POST",
            data: "action=createAccount&firstname=" + firstname + "&lastname=" + lastname + "&email=" + singup_email + "&mobile=" + mobile + "&password=" + password + "&gender=" + gender + "&abn=" + abn_num + "&industry_type=" + company_type + "&not_have_comp=" + not_have_comp + "&postcode=" + postcode + "&agree=" + agree + "&street_address=" + street_address + "&suburb=" + suburb + "&state=" + state + "&dob=" + dob + "&avatar_path=" + userAvatar + "&business_name=" + business_name + "&telephone=" + singup_telephone + "&company=" + singup_company,
            url: CONECTION_SERVER(),
            crossDomain: true,
            cache: false,
            dataType: "json",
            success: function(dataresult) {
                hideLoading();
                if (dataresult.result == 'error') {
                    hideLoading();
                    toastMessage(dataresult.message, "Error", "OK");
                    return false;
                } else {
                    toastMessageLong(dataresult.message);
                    $.mobile.changePage("#user_login", { transition: "none" });    
                    
                }
            },
            error: function(error) {
                connectionAlert();
            }
        });
    } else if (form == 'account_form') {
        db.query('SELECT * FROM customers WHERE customers_id>0', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                showLoading("Updating your account...");
                $.ajax({
                    type: "POST",
                    data: "action=updateAccount&customers_id=" + row.customers_id + "&" + $("#account_form").serialize(),
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    cache: false,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'error') {
                            hideLoading();

                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        } else {
                            toastMessage(dataresult.message);
                            updateData(row.customers_id, row.customers_email_address);

                            if (checkout_redirect == true) {
                                checkout_redirect = false;
                                goTO('checkout_page');

                            }
                        }
                    },
                    error: function(error) {
                        connectionAlert();
                    }
                });
            } else goTO('user_login');
        }, successCB, errorCB);

    } else if (form == 'singup_form_company' && guest_mode) {
        db.query('SELECT * FROM customers WHERE customers_id>0', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                showLoading("Updating your account...");
                $.ajax({
                    type: "POST",
                    data: "action=updateAccount&customers_id=" + row.customers_id + "&firstname=" + firstname + "&lastname=" + lastname + "&email=" + singup_email + "&mobile=" + mobile + "&gender=" + gender + "&abn=" + abn_num + "&industry_type=" + company_type + "&not_have_comp=" + not_have_comp + "&postcode=" + postcode + "&agree=" + agree + "&street_address=" + street_address + "&suburb=" + suburb + "&state=" + state + "&dob=" + dob + "&avatar_path=" + userAvatar + "&business_name=" + business_name + "&telephone=" + singup_telephone + "&company=" + singup_company + "&guest_mode=" + 1,

                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    cache: false,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'error') {
                            hideLoading();

                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        } else {
                            toastMessage(dataresult.message);
                            updateData(row.customers_id, row.customers_email_address);
                        }
                    },
                    error: function(error) {
                        connectionAlert();
                    }
                });
            } else goTO('user_login');
        }, successCB, errorCB);

    }

}

function show(id, form) {
    if ($("#" + form + " #" + id).prop('checked') == true)
        $("#" + form + " ." + id).slideDown();
    else
        $("#" + form + " ." + id).slideUp();
}

function backStep1(form) {
    $("#" + form + " #step2_company_info").slideUp();
    $("#" + form + " #step1_personal_info").slideDown();
}

function backStep2(form) {
    $("#" + form + " #step3_address_info").slideUp();
    $("#" + form + " #step2_company_info").slideDown();
}
/* Auto Complete For USER Registration Page*/
$(document).on("pagebeforeshow", "#user_singup", function() {    
    $("#user_singup .hide_collaps").hide();
    $("#user_singup #step1_personal_info").show();

    /* Post Code Filter Registration Form*/
    $("#singup_form_account_autocomplete_postcode").on("filterablebeforefilter", function(e, data) {       
        $("#singup_form_autocomplete_postcode").html('');
        var value = $("#singup_form_postcode").val(); 
        if (value && value.length >= 2) {
            $("#singup_form_account_autocomplete_postcode").html('');            
            $.ajax({                
                url: CONECTION_SERVER(),
                type: "POST",
                data: "action=getpostcodes&postcode_query=" + value,
                dataType: "json",
                crossDomain: true,
                success: function(dataresult) {
                    if (dataresult.result == "error") {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    var html = '';
                    for (var i = 0; i < dataresult.postcode.length; i++) { 
                        html += "<li onClick=\"registrationCenterSearch('" + dataresult.postcode[i] + "','" + dataresult.suburb[i] + "','" + dataresult.city[i] + "','" + dataresult.state[i] + "');\">" + dataresult.postcode[i] + " - " + dataresult.suburb[i] + "</li>";
                    }
                    $("#singup_form_account_autocomplete_postcode").html(html);                
                    $("#singup_form_account_autocomplete_postcode").listview().listview("refresh");               
                },
                error: function(error) {
                    connectionAlert();
                }            
            });        
        }    
    });
    /* Suburb Filter Registration Form*/
    $("#singup_form_account_autocomplete_suburb").on("filterablebeforefilter", function(e, data) {       
        $("#singup_form_account_autocomplete_suburb").html('')
        var value = $("#singup_form_suburb").val(); 
        if (value && value.length >= 3) {           
            $("#singup_form_account_autocomplete_suburb").html('');            
            $.ajax({                
                url: CONECTION_SERVER(),
                type: "POST",
                data: "action=getsuburb&suburb_query=" + value,
                dataType: "json",
                crossDomain: true,
                success: function(dataresult) {
                    if (dataresult.result == "error") {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    var html = '';
                    for (var i = 0; i < dataresult.postcode.length; i++) { 
                        html += "<li onClick=\"registrationCenterSearch('" + dataresult.postcode[i] + "','" + dataresult.suburb[i] + "','" + dataresult.city[i] + "','" + dataresult.state[i] + "');\">" + dataresult.suburb[i] + " - " + dataresult.postcode[i] + "</li>";
                    }
                    $("#singup_form_account_autocomplete_suburb").html(html);                
                    $("#singup_form_account_autocomplete_suburb").listview().listview("refresh");               
                },
                error: function(error) {
                    connectionAlert();

                }            
            })        
        }    
    });
    /* Center Filter Registration Form*/
    $("#singup_form_account_autocomplete_center").on("filterablebeforefilter", function(e, data) {       
        $("#singup_form_account_autocomplete_center").html('')
        var value = $("#singup_form_center_search").val(); 
        if (value && value.length >= 3) {          
            $("#singup_form_account_autocomplete_center").html('');            
            $.ajax({                
                url: CONECTION_SERVER(),
                type: "POST",
                data: "action=getCenter&center_query=" + value,
                dataType: "json",
                crossDomain: true,
                success: function(dataresult) {
                    if (dataresult.result == "error") {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    var html = '';
                    for (var i = 0; i < dataresult.postcode.length; i++) { 
                        html += "<li onClick=\"registrationCenterSearch('" + dataresult.postcode[i] + "','" + dataresult.suburb[i] + "','" + dataresult.city[i] + "','" + dataresult.state[i] + "','" + dataresult.center_id[i] + "','" + dataresult.center_name[i] + "','" + dataresult.street_address[i] + "');\">" + dataresult.center_name[i] + " - " + dataresult.postcode[i] + "</li>";
                    }
                    if (value) {
                        $("#singup_form_company .center_manage").show();
                        $("#singup_form_company .center_manage").closest('div.ui-input-text').show();
                    }

                    messageCenterSelectedAction(value, "singup_form_company");
                    $("#singup_form_account_autocomplete_center").html(html);                
                    $("#singup_form_account_autocomplete_center").listview().listview("refresh");               
                },
                error: function(error) {
                    connectionAlert();

                }            
            })        
        }    
    });

});
/* Auto Complete For USER Account Page*/

$(document).on("pagebeforeshow", "#user_account", function() {    

    $("#user_account .hide_collaps").hide();
    $("#user_account #step1_personal_info").show();

    /* Post Code Filter Account Form*/
    $("#account_form_account_autocomplete_postcode").on("filterablebeforefilter", function(e, data) {
        $("#account_form_autocomplete_postcode").html('')
        var value = $("#account_form_postcode").val(); 
        if (value && value.length >= 2) {
            $("#account_form_account_autocomplete_postcode").html('');            
            $.ajax({                
                url: CONECTION_SERVER(),
                type: "POST",
                data: "action=getpostcodes&postcode_query=" + value,
                dataType: "json",
                crossDomain: true,
                success: function(dataresult) {
                    if (dataresult.result == "error") {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    var html = '';
                    for (var i = 0; i < dataresult.postcode.length; i++) { 
                        html += "<li onClick=\"applyDataAccount('" + dataresult.postcode[i] + "','" + dataresult.suburb[i] + "','" + dataresult.city[i] + "','" + dataresult.state[i] + "');\">" + dataresult.postcode[i] + " - " + dataresult.suburb[i] + "</li>";
                    }
                    $("#account_form_account_autocomplete_postcode").html(html);               
                    $("#account_form_account_autocomplete_postcode").listview().listview("refresh");               
                },
                error: function(error) {
                    connectionAlert();
                }            
            });        
        }    
    });
    /* Suburb Filter Account Form*/
    $("#account_form_account_autocomplete_suburb").on("filterablebeforefilter", function(e, data) {       
        $("#account_form_account_autocomplete_suburb").html('')
        var value = $("#account_form_suburb").val(); 
        if (value && value.length >= 3) {           
            $("#account_form_autocomplete_suburb").html('');            
            $.ajax({                
                url: CONECTION_SERVER(),
                type: "POST",
                data: "action=getsuburb&suburb_query=" + value,
                dataType: "json",
                crossDomain: true,
                success: function(dataresult) {
                    if (dataresult.result == "error") {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    var html = '';
                    for (var i = 0; i < dataresult.postcode.length; i++) { 
                        html += "<li onClick=\"applyDataAccount('" + dataresult.postcode[i] + "','" + dataresult.suburb[i] + "','" + dataresult.city[i] + "','" + dataresult.state[i] + "');\">" + dataresult.suburb[i] + " - " + dataresult.postcode[i] + "</li>";
                    }

                    $("#account_form_account_autocomplete_suburb").html(html);                
                    $("#account_form_account_autocomplete_suburb").listview().listview("refresh");               
                },
                error: function(error) {
                    connectionAlert();

                }            
            })        
        }    
    });
    /* Center Filter Account Form*/
    $("#account_form_account_autocomplete_center").on("filterablebeforefilter", function(e, data) {       
        $("#account_form_account_autocomplete_center").html('')
        var value = $("#account_form_center_search").val(); 
        if (value && value.length >= 3) {          
            $("#account_form_account_autocomplete_center").html('');            
            $.ajax({                
                url: CONECTION_SERVER(),
                type: "POST",
                data: "action=getCenter&center_query=" + value,
                dataType: "json",
                crossDomain: true,
                success: function(dataresult) {
                    if (dataresult.result == "error") {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    var html = '';
                    for (var i = 0; i < dataresult.postcode.length; i++) { 
                        html += "<li onClick=\"applyCenter('" + dataresult.postcode[i] + "','" + dataresult.suburb[i] + "','" + dataresult.city[i] + "','" + dataresult.state[i] + "','" + dataresult.center_id[i] + "','" + dataresult.center_name[i] + "','" + dataresult.street_address[i] + "');\">" + dataresult.center_name[i] + " - " + dataresult.postcode[i] + "</li>";
                    }
                    messageCenterSelectedAction(value, "account_form");
                    $("#account_form_account_autocomplete_center").html(html);                
                    $("#account_form_account_autocomplete_center").listview().listview("refresh");               
                },
                error: function(error) {
                    connectionAlert();

                }
            })
        }    
    });

});
/* Auto Complete For add_edit_address_book Page*/

$(document).on("pagebeforeshow", "#add_edit_address_book", function() {    
    /* Post Code Filter Account Form*/
    $("#address_book_autocomplete_postcode").on("filterablebeforefilter", function(e, data) {       
        $("#address_book_autocomplete_postcode").html('')
        var value = $("#address_book_postcode").val(); 
        if (value && value.length >= 2) {
            $("#address_book_autocomplete_postcode").html('');            
            $.ajax({                
                url: CONECTION_SERVER(),
                type: "POST",
                data: "action=getpostcodes&postcode_query=" + value,
                dataType: "json",
                crossDomain: true,
                success: function(dataresult) {
                    if (dataresult.result == "error") {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    var html = '';
                    for (var i = 0; i < dataresult.postcode.length; i++) { 
                        html += "<li onClick=\"applyAddressBookData('" + dataresult.postcode[i] + "','" + dataresult.suburb[i] + "','" + dataresult.city[i] + "','" + dataresult.state[i] + "');\">" + dataresult.postcode[i] + " - " + dataresult.suburb[i] + "</li>";
                    }
                    $("#address_book_autocomplete_postcode").html(html);                
                    $("#address_book_autocomplete_postcode").listview().listview("refresh");               
                },
                error: function(error) {
                    connectionAlert();
                }            
            });        
        }    
    });
    /* Suburb Filter Account Form*/
    $("#address_book_autocomplete_suburb").on("filterablebeforefilter", function(e, data) {       
        $("#address_book_autocomplete_suburb").html('')
        var value = $("#address_book_suburb").val(); 
        if (value && value.length >= 3) {           
            $("#address_book_autocomplete_suburb").html('');            
            $.ajax({                
                url: CONECTION_SERVER(),
                type: "POST",
                data: "action=getsuburb&suburb_query=" + value,
                dataType: "json",
                crossDomain: true,
                success: function(dataresult) {
                    if (dataresult.result == "error") {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    var html = '';
                    for (var i = 0; i < dataresult.postcode.length; i++) {
                        html += "<li onClick=\"applyAddressBookData('" + dataresult.postcode[i] + "','" + dataresult.suburb[i] + "','" + dataresult.city[i] + "','" + dataresult.state[i] + "');\">" + dataresult.suburb[i] + " - " + dataresult.postcode[i] + "</li>";
                    }
                    $("#address_book_autocomplete_suburb").html(html);                
                    $("#address_book_autocomplete_suburb").listview().listview("refresh");               
                },
                error: function(error) {
                    connectionAlert();

                }
            })        
        }    
    });


});

function applyAddressBookData(postcode, suburb, city, state) {
    $("#address_book_postcode").val(postcode);
    $("#address_book_suburb").val(suburb);
    $("#address_book_form #state").val(state);
    $("#address_book_form #city").val(city);
    $("#address_book_autocomplete_suburb").html('');
    $("#address_book_autocomplete_postcode").html('');
    $("#address_book_postcode").focus();
}

function applyCenter(postcode, suburb, city, state, center, center_search, street_address) {
    var activePage = $.mobile.activePage.attr('id');
    var from = $("#" + activePage + " form").attr('id');
    $("#" + from + "_postcode").val(postcode);
    $("#" + from + "_suburb").val(suburb);
    $("#" + from + " #state").val(state);
    $("#" + from + " #city").val(city);
    $("#" + from + " #center").val(center);
    $("#" + from + "_center_search").val(center_search);
    $("#" + from + " #street_address").val(street_address);
    $("#" + from + "_account_autocomplete_suburb").html('');
    $("#" + from + "_account_autocomplete_postcode").html('');
    $("#" + from + "_account_autocomplete_center").html('');
    $("#" + from + "_center_search").focus();
}

function registrationCenterSearch(postcode, suburb, city, state, center, center_search, street_address) {
    var activePage = $.mobile.activePage.attr('id');
    var from = $("#" + activePage + " form").attr('id');
    $("#singup_form_postcode").val(postcode);
    $("#singup_form_suburb").val(suburb);
    $("#singup_state").val(state);
    //$("#"+from+" #city").val(city);
    $("#singup_center").val(center);
    $("#singup_form_center_search").val(center_search);
    $("#singup_street_address").val(street_address);
    $("#singup_form_account_autocomplete_suburb").html('');
    $("#singup_form_account_autocomplete_postcode").html('');
    $("#singup_form_center_search").focus();
    $("#singup_form_account_autocomplete_center").hide();
}

function applyDataAccount(postcode, suburb, city, state) {
    var activePage = $.mobile.activePage.attr('id');
    var from = $("#" + activePage + " form").attr('id');
    $("#" + from + "_postcode").val(postcode);
    $("#" + from + "_suburb").val(suburb);
    $("#" + from + " #state").val(state);
    $("#" + from + " #city").val(city);
    $("#" + from + "_account_autocomplete_suburb").html('');
    $("#" + from + "_account_autocomplete_postcode").html('');
    $("#" + from + "_account_autocomplete_center").html('');
    $("#" + from + "_postcode").focus();
}

function SearchProdcuManual() {
    var search_product = $.trim($("#search_product").val());
    if (search_product == '')
        toastMessage("Product name is required");
    else
        searchProduct(search_product);
}

function skipInviteFriends() {
    var available_accounts = getValue("available_accounts");

    if (available_accounts > 0) {
        goTO('switch_account_page');
    } else {
        addValue("account_type", 'customer');
        goTO('home_page');
        $('.check-span').removeClass('check-span');
        $('.done-sms-button').attr('disabled', true);
        $('.send-sms-button').attr('disabled', true);
    }


}


function searchProduct(product_name) {

    var dataToSearch = "action=searchProduct&product_name=" + encodeURIComponent(product_name) + "&supplier_id=" + supplierID;

    var isSupplierId = true;
    document.getElementById("category_collaps").innerHTML = "";
    document.getElementById("products_listview").innerHTML = "";
   $(".progress-bar-container").html('');
    $(".supplier_page_tabs").removeClass('active_supplier_option');
    $("#search_product").val(product_name);
    showLoading('Searching products....');
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;

        if (len > 0) {
            var row = results.rows.item(0);
            var customer_id = row.customers_id;
            $.ajax({
                type: "POST",
                data: "action=searchProduct&product_name=" + encodeURIComponent(product_name) + "&supplier_id=" + supplierID + "&customers_id=" + customer_id,
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {
                    if (dataresult.result == 'error') {
                        $('#supplier_products_listview_search').html('');
                        hideLoading();
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    var products_listview_search = $('#supplier_products_listview_search').html('');
                    for (var i = 0; i < dataresult.products_list.length; i++) {

                        if (dataresult.products_suppl_id[i] == supplierID) {

                            var products_html = '';
                            if (dataresult.products_image[i] == "noimage.jpg")
                                var IMAGE_SRC = 'img/noimage.jpg';
                            else
                                var IMAGE_SRC = dataresult.products_image[i];

                            var products_html = '<li><a class="icon-' + dataresult.products_list[i] + ' prdt-icon " href="javascript:moreDetails(' + dataresult.products_list[i] + ',' + dataresult.products_suppl_id[i] + ')"><img class = "product_image" width="80" height="80" src="' + IMAGE_SRC + '" onerror="this.onerror=null;this.src=\'img/noimage.jpg\';"><h3>' + dataresult.products_name[i] + '</h3><p id="listprice' + dataresult.products_list[i] + '">Price $' + Number(dataresult.products_price[i]).toFixed(2) + '</p></a><div id="after' + dataresult.products_list[i] + '" class="more_details"></div><input type="hidden" id="product_name' + dataresult.products_list[i] + '" value="' + dataresult.products_name[i] + '"></li>';
                            products_listview_search.append(products_html);


                        } else if (supplierID == 'all_saved_suppliers') {
                            var products_html = '';
                            if (dataresult.products_image[i] == "noimage.jpg")
                                var IMAGE_SRC = 'img/noimage.jpg';
                            else
                                var IMAGE_SRC = dataresult.products_image[i];

                            var products_html = '<li><a class="icon-' + dataresult.products_list[i] + ' prdt-icon " href="javascript:moreDetails(' + dataresult.products_list[i] + ',' + dataresult.products_suppl_id[i] + ')"><img class = "product_image" width="80" height="80" src="' + IMAGE_SRC + '" onerror="this.onerror=null;this.src=\'img/noimage.jpg\';"><h3>' + dataresult.products_name[i] + '</h3><p id="listprice' + dataresult.products_list[i] + '">Price $' + Number(dataresult.products_price[i]).toFixed(2) + '</p></a><div id="after' + dataresult.products_list[i] + '" class="more_details"></div><input type="hidden" id="product_name' + dataresult.products_list[i] + '" value="' + dataresult.products_name[i] + '"></li>';
                            products_listview_search.append(products_html);
                        } else {
                            isSupplierId = false;
                        }
                        

                    }


                    var products_html = '<li class="loadmore"><a href="javascript:loadMore(\'' + product_name + '\')">Load More....</a></li>';
                    if (isSupplierId) {
                        products_listview_search.append(products_html);
                    }
                    hideLoading();
                    products_listview_search.listview().listview("refresh");
                    if (device.platform != 'browser') {
                        $(".product_image").each(function(index, el) {
                            var target_image =  $(this);
                            if(typeof target_image!="undefined"){
                                ImgCache.isCached(target_image.attr('src'), function(path, success){
                                  if(success){
                                    ImgCache.useCachedFile(target_image);
                                  } else {
                                    ImgCache.cacheFile(target_image.attr('src'), function(){
                                      ImgCache.useCachedFile(target_image);
                                    });
                                  }
                                });
                            }
                        });
                    }
                    var activePage = $.mobile.activePage.attr('id');
                },
                error: function(error) {
                    hideLoading();
                    $("#products_listview_search").html('<p style="text-align:center;"><img   class="error_image" src="img/cannot.png" onClick="searchProduct(\'' + product_name + '\');" /></p>');
                    $("#products_listview_search").trigger('create');
                    var activePage = $.mobile.activePage.attr('id');
                }
            });
        } else goTO('user_login');
    }, successCB, errorCB);
}

function loadMore(product_name) {
    showLoading();
    isLoadMore = true;
    var count = $('#supplier_products_listview_search li').length - 1;
    $.ajax({
        type: "POST",
        data: "action=searchProduct&product_name=" + encodeURIComponent(product_name) + "&next_record=" + count + "&supplier_id=" + supplierID,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            if (dataresult.result == 'error') {
                hideLoading();
                toastMessage(dataresult.message, "Error", "OK");
                $(".loadmore").remove();
                return false;
            }

            $(".loadmore").remove();
            var products_listview_search = $("#supplier_products_listview_search");
            for (var i = 0; i < dataresult.products_list.length; i++) {

                if (dataresult.products_suppl_id[i] == supplierID) {
                    var products_html = '';
                    if (dataresult.products_image[i] == "noimage.jpg")
                        var IMAGE_SRC = 'img/noimage.jpg';
                    else
                        var IMAGE_SRC = dataresult.products_image[i];

                    var products_html = '<li><a class="icon-' + dataresult.products_list[i] + ' prdt-icon " href="javascript:moreDetails(' + dataresult.products_list[i] + ',' + dataresult.products_suppl_id[i] + ')"><img class = "product_image" width="80" height="80" src="' + IMAGE_SRC + '" onerror="this.onerror=null;this.src=\'img/noimage.jpg\';"><h3>' + dataresult.products_name[i] + '</h3><p id="listprice' + dataresult.products_list[i] + '">Price $' + Number(dataresult.products_price[i]).toFixed(2) + '</p></a><div id="after' + dataresult.products_list[i] + '" class="more_details"></div><input type="hidden" id="product_name' + dataresult.products_list[i] + '" value="' + dataresult.products_name[i] + '"></li>';
                    products_listview_search.append(products_html);
                } else {
                    isLoadMore = false;
                }
                

            }
            var products_html = '<li class="loadmore"><a href="javascript:loadMore(\'' + product_name + '\')">Load More....</a></li>';
            if (isLoadMore) {
                products_listview_search.append(products_html);
            }
            hideLoading();
            if (device.platform != 'browser') {
                $(".product_image").each(function(index, el) {
                    var target_image =  $(this);
                    if(typeof target_image!="undefined"){
                        ImgCache.isCached(target_image.attr('src'), function(path, success){
                          if(success){
                            ImgCache.useCachedFile(target_image);
                          } else {
                            ImgCache.cacheFile(target_image.attr('src'), function(){
                              ImgCache.useCachedFile(target_image);
                            });
                          }
                        });
                    }
                });
            }
            products_listview_search.listview().listview("refresh");
        },
        error: function(error) {
            hideLoading();
            connectionAlert();
        }
    });
}
$.fn.scrollView = function() {
    return this.each(function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top - 80
        }, 500);
    });
}

function add_supplier_to_list(supplier_id, btn_id) {
    
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                var customers_id = row.customers_id;
                var activePage = $.mobile.activePage.attr('id');
                showLoading();
                $.ajax({
                    type: "POST",
                    data: "action=addtoSupplierList&supplier_id=" + supplier_id + "&customers_id=" + customers_id,
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'error') {
                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        }
                        var supplier_already_exist = recently_viewed_supp.filter(function(obj) {
                            return obj.supplier_id == supplier_id;
                        });

                        if (supplier_already_exist) {
                            recently_viewed_supp = recently_viewed_supp.filter(function(obj) {
                                return obj.supplier_id != supplier_id;

                            });
                        }

                        sidebar_supplier = [];
                        fetchsidebar();

                        var btn_html;
                        if ($.mobile.activePage.attr('id') == 'supplier_page_intro') {
                            btn_html = '<div onClick="remove_supplier_from_list(' + supplier_id + ',' + btn_id + ');"><div class="checkradios-radio no-company-radio unchecked checked fa fa-check"><input type="radio" class="no-company-radio" data-role="none" name="add_suppl_radio" style="float:left;" checked="checked"></div></div>';
                            $('.no-company-radio').checkradios({
                                checkbox: {
                                    iconClass: 'fa fa-check-circle'
                                },
                                radio: {
                                    iconClass: 'fa fa-check'
                                }
                            });
                            $("#next-step-supplier-intro").removeAttr('disabled');
                        } else if ($.mobile.activePage.attr('id') == 'supplier_info_page') {
                            $(".remove_add_btn").html('<div class="remove_from_list_btn" onClick="remove_supplier_from_list(' + supplier_id + ',0);"> Remove From My List</div>');
                        } else {
                            btn_html = '<a class="action-btn" onClick="remove_supplier_from_list(' + supplier_id + ',' + btn_id + ');" ><img src="img/remove-btn.jpg" alt="" border="0" /></a>';
                        }

                        $('#' + activePage + ' #btn_' + btn_id).html("");
                        $('#' + activePage + ' #btn_' + btn_id).append(btn_html);
                        toastMessage(dataresult.message, "Message");
                        $('#supplier_collaps').trigger('create');

                    },
                    error: function(error) {
                        hideLoading();
                    }
                });
            } else goTO('user_login');
        }, successCB, errorCB);
    
}

function remove_supplier_from_list(supplier_id, btn_id) {
    if (window.navigator && window.navigator.notification) {
        navigator.notification.confirm('Are you sure to delete this supplier?', function(buttonIndex) {
            if (buttonIndex == 2) {
                remove_supplier_from_list_process(supplier_id, btn_id);
            }

        }, 'Confirm', 'No,Yes');
    } else {
        var ask = confirm("Are you sure to delete this supplier?");
        if (ask == true) {
            remove_supplier_from_list_process(supplier_id, btn_id)
        }
    }
}

function remove_supplier_from_list_process(supplier_id, btn_id) {

        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                var customers_id = row.customers_id;
                var activePage = $.mobile.activePage.attr('id');
                showLoading();
                $.ajax({
                    type: "POST",
                    data: "action=removeFromSupplierList&supplier_id=" + supplier_id + "&customers_id=" + customers_id,
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'error') {
                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        }
                        var btn_html;
						var supplier_already_exist = sidebar_supplier.filter(function(obj) {
                            return obj.supplier_id == supplier_id;
                        });
				
                        if (supplier_already_exist) {
							var recently_viewed_supp_already_exist = recently_viewed_supp.filter(function(obj) {
								return obj.supplier_id != supplier_id;
							});
							recently_viewed_supp 	= recently_viewed_supp_already_exist;
							recently_viewed_supp.push(supplier_already_exist[0]);
							
                            
                        }
                        sidebar_supplier = [];
						
						fetchsidebar();
                        if ($.mobile.activePage.attr('id') == 'supplier_page_intro') {

                            btn_html = '<div onClick="add_supplier_to_list(' + supplier_id + ',' + btn_id + ');"><div class="checkradios-radio no-company-radio unchecked"><input type="radio" class="no-company-radio" data-role="none" name="add_suppl_radio" style="float:left;"></div></div>';
                            $('.no-company-radio').checkradios({
                                checkbox: {
                                    iconClass: 'fa fa-check-circle'
                                },
                                radio: {
                                    iconClass: 'fa fa-check'
                                }
                            });

                            if (dataresult.empty_supp_list == 0) $("#next-step-supplier-intro").attr('disabled', true);

                        } else if ($.mobile.activePage.attr('id') == 'supplier_info_page') {
                            $(".remove_add_btn").html('<div class="add_to_list_btn" style="padding-left: 31px;padding-right: 31px;" onClick="add_supplier_to_list(' + supplier_id + ',0);"> Add To My List</div>');
			
                        } else {
                            btn_html = '<a class="action-btn" onClick="add_supplier_to_list(' + supplier_id + ',' + btn_id + ');" ><img src="img/add-to-list-btn.jpg" alt="" border="0" /></a>';
                        }

                        $('#' + activePage + ' #btn_' + btn_id).html("");
                        $('#' + activePage + ' #btn_' + btn_id).append(btn_html);
                        toastMessage(dataresult.message, "Message");
                        $('#supplier_collaps').trigger('create');

                    },
                    error: function(error) {
                        hideLoading();
                    }
                });
            } else goTO('user_login');
        }, successCB, errorCB);

    
}

function goToSupplierPage(supplier_id) {
    supplierID = supplier_id;
    fillSupplierHomePage('get_category');
    //$('#all_products').attr("onClick", "getCategory();");
}

function goToSuppliersPage() {
    supplierID = 'all_saved_suppliers';
    fillSupplierHomePage('all_suppliers');
    getAllCategory();
}
function loadCart(supplier_id) {
    if (supplier_id || supplier_id == 0) {
        supplierID = supplier_id;
    }
    $("#products_listview_container").hide();
    document.getElementById("category_collaps").innerHTML = "";
    document.getElementById("products_listview").innerHTML = "";
    document.getElementById("supplier_products_listview_search").innerHTML = "";
    $(".minimum_shipping.progress-bar-container").html('');
    $(".supplier_page_tabs").removeClass("active_supplier_option");
    $("#cart_page_tab").addClass("active_supplier_option");
    if ($.mobile.activePage.attr('id') != 'supplier_home_page'){
        fillSupplierHomePage();
    }
    $("#cart_page").show();
}

function savedProductsList(supplier_id) {
    if (supplier_id || supplier_id == 0){
        supplierID = supplier_id;
    }
    if ($.mobile.activePage.attr('id') != 'supplier_home_page'){
        fillSupplierHomePage();
    }
    $("#products_listview_container").show();
    $("#cart_page").hide();
    $(".supplier_page_tabs").removeClass("active_supplier_option");
    $("#saved_products").addClass("active_supplier_option");
    document.getElementById("category_collaps").innerHTML = "";
    document.getElementById("products_listview").innerHTML = "";
    document.getElementById("supplier_products_listview_search").innerHTML = "";

    $products_listview =  $("#products_listview");
    $products_listview.html(loading_image);
    setTimeout(function(){
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                var save_products_list = JSON.parse(getValueSession("save_products_list"+supplierID));
                if (save_products_list && Object.keys(save_products_list).length > 0) {
                    //showLoading();
                    genrateSaveProductsList(save_products_list);
                    silentgetSaveProductsList(row.customers_id,row.customers_email_address);
                    
                }else{
                    updateData(row.customers_id,row.customers_email_address,true);
                }
            } else goTO('user_login');

        }, successCB, errorCB);
    }, 1000);
}

function genrateViewfillSupplierHomePage(get_category,dataresult) {
    var supplier = sidebar_supplier.filter(function(obj) {
        return obj.supplier_id == supplierID;
    });
    if (supplier.length == 0) {
        supplier = recently_viewed_supp.filter(function(obj) {
            return obj.supplier_id == supplierID;
        });
    }
    if (supplier.length == 0 && get_category != 'all_suppliers') {
        toastMessage("Sorry currently some technical glitch exist please close your app and try later");

    }else if(get_category != 'all_suppliers'){
        var supplier_data = supplier[0];     
        $(".search_products_value").attr("placeholder", "Search " + supplier_data.name);
        $("#supplier_logo_top").html(supplier_data.name);
    }    
    if (get_category == 'get_category') {
        if (typeof dataresult.saved_products!="undefined" && dataresult.saved_products > 0) {
            savedProductsList();
        } else {
            category_supplier_type = false;
            getCategory();
        }
    } else if (get_category == 'all_suppliers') {
        category_supplier_type = 'all_suppliers';
        $(".search_products_value").attr("placeholder", "Search for All Suppliers");
        $("#supplier_logo_top").html("All Suppliers");
        getAllCategory();
    }
    hideLoading();
    if ($.mobile.activePage.attr('id') != 'supplier_home_page'){
        goTO('supplier_home_page');
    }
    
}

function fillSupplierHomePage(get_category) {
    restoreCustomSupplierChanges();
    $(".search_contents").html('');
    $(".search_products_value").val('');
    $(".minimum-order-container-for-all").remove();
    if(get_category!='all_suppliers'){
        db.query('SELECT * FROM customers',function (tx, results) {
            var len = results.rows.length;
            if(len>0){
                var row = results.rows.item(0);
                var customer_id = row.customers_id;
                
                var getSupplierDetails = JSON.parse(getValueSession("getSupplierDetails"+supplierID+"-"+customer_id));
                if(getSupplierDetails && getSupplierDetails!=null){
                    genrateViewfillSupplierHomePage(get_category,getSupplierDetails);
                }else{
                    showLoading();
                }
                $.ajax({
                    type:"POST",
                    data:"action=getSupplierDetails&supplier_id="+supplierID+"&customer_id="+customer_id,
                    url: CONECTION_SERVER(),
                    crossDomain:true,
                    dataType:"json",
                    success:function(dataresult){
                       if(dataresult.result=='error'){
                             hideLoading();
                            toastMessage(dataresult.message,"Error","OK");
                            return false;
                        }
                        addValueSession("getSupplierDetails"+supplierID+"-"+customer_id,JSON.stringify(dataresult));
                        if(JSON.stringify(getSupplierDetails) != JSON.stringify(dataresult)){
                            genrateViewfillSupplierHomePage(get_category,dataresult);
                        }
                    },
                    error: function(error){
                        hideLoading();
                    }
                });

            }else goTO('user_login');
        },successCB,errorCB);
    }else{
        genrateViewfillSupplierHomePage(get_category);
    }
}

function getSupplierInfo(supplier_id) {
    supplierID = supplier_id;
    goTO('supplier_info_page');
}

function goToSupplierInfoPage(supplier_id) {
    $("#supplier_customer_container,#supplier_info_contents").hide();
    $('.checkboxes-and-radios').checkradios({
        checkbox: {
            iconClass: 'fa fa-check-circle'
        },
        radio: {
            iconClass: 'fa fa-check'
        }
    });
    $('div.checkboxes-and-radios').removeClass('checked').removeClass('fa').removeClass('fa-check');
    $('input.checkboxes-and-radios').removeAttr('checked');
    $("#supplier_info_logo_top").html('');
    $('#supplier_info_featured_products').html('');

    var supplierInfo = JSON.parse(getValueSession("supplierInfo" + supplier_id));
    if (supplierInfo && supplierInfo != null) {
        genrateViewSupplierInfoPage(supplierInfo, supplier_id);
    } else {
        showLoading();
    }
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            var customer_id = row.customers_id;
            $.ajax({
                type: "POST",
                data: "action=getSupplierDetails&supplier_id=" + supplier_id + "&customer_id=" + customer_id,
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {
                    if (dataresult.result == 'error') {
                        hideLoading();
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    addValueSession("supplierInfo" + supplier_id, JSON.stringify(dataresult));
                    if (JSON.stringify(supplierInfo) != JSON.stringify(dataresult)) {
                        genrateViewSupplierInfoPage(dataresult, supplier_id);
                    }
                    hideLoading();
                },
                error: function(error) {
                    hideLoading();
                }
            });

        } else goTO('user_login');
    }, successCB, errorCB);

}

function genrateViewSupplierInfoPage(dataresult, supplier_id) {
    $("#supplier_info_contents").show();
    var is_supplier_customer = dataresult.is_supplier_customer;
    var supplier_name = dataresult.supplier_details.store_name;
    var supplier_desc = dataresult.supplier_details.supplier_aboutus;
    var supplier_address = dataresult.supplier_details.supplier_address;
    var supplier_slider = dataresult.supplier_slider_image;
    var supplier_sm_logo = dataresult.supplier_sm_logo;
    var supplier_exist = sidebar_supplier.filter(function(obj) {
        return obj.supplier_id == supplier_id;
    });
    var supplier_already_exist = recently_viewed_supp.filter(function(obj) {
        return obj.supplier_id == supplier_id;
    });
    if (supplier_exist.length == 0 && supplier_already_exist.length == 0) {
        /*var supplier = {
            extra_charges: dataresult.supplier_details.extra_charges,
            image: supplier_sm_logo,
            message: dataresult.supplier_details.message,
            minimum_amount: dataresult.supplier_details.amount,
            name: supplier_name,
            supplier_id: dataresult.supplier_details.supplier_id,
            order_day: dataresult.order_day,
            buisness_type: dataresult.buisness_type,
        }*/
        if (recently_viewed_supp.length < 3)
            recently_viewed_supp.push(dataresult.supplier_details);
        else {
            recently_viewed_supp.pop();
            recently_viewed_supp.unshift(dataresult.supplier_details);
        }
    }else{
		var supplier_already_exist = recently_viewed_supp.filter(function(obj) {
			return obj.supplier_id != supplier_id;
		});
		recently_viewed_supp = supplier_already_exist;
		recently_viewed_supp.push(dataresult.supplier_details);
	
	}


    $("#supplier_info_logo_top").html(supplier_name);

    if (supplier_name) {
        window.ga.trackView('Supplier ' + supplier_name + ' Info Page');
    }
    if (supplier_slider != "noimage") {
        var IMAGE_SRC = supplier_slider;
    } else {
        var IMAGE_SRC = 'img/noimage.jpg';
    }
    if (supplier_sm_logo != "noimage") {
        var SM_IMAGE_SRC = supplier_sm_logo;
    } else {
        var SM_IMAGE_SRC = 'img/noimage.jpg';
    }
    var supplier_email = 'mailto:' + dataresult.supplier_details.supplier_email;

    $(".supplier_info_logo").html('<img src="' + IMAGE_SRC + '" alt="" onerror="this.onerror=null;this.src=\'img/no-slider.png\';" />');
    $("#supplier_info_sm_logo").html('<img src="' + SM_IMAGE_SRC + '" onerror="this.onerror=null;this.src=\'img/noimage.jpg\';" alt="" />');

   
    $("#suppplier_info_name").html(supplier_name);
    $("#suppplier_info_desc_title").html(supplier_name);
    $("#supplier_buisness_type").html("<img src='img/pointer.png'>" + dataresult.buisness_type);
    var supplier_desc_less = supplier_desc.substring(0, 200);
    $("#supplier_info_desc").html(nl2br(supplier_desc_less));
    $("#supplier_info_desc_more").html(nl2br(supplier_desc));
    $("#supplier_customer_title").html("ARE YOU " + supplier_name + " CUSTOMER?");
    $("#supplier_customer_checkboxes").attr('supplier_id', supplier_id);
    if (is_supplier_customer > 0) {
        $("#supplier_customer_container").hide();
        deleteValue("no_supplier_customer" + supplier_id);
    } else {
        $("#supplier_customer_container").show();
        $("#suppliers_customer").attr('onClick', 'sendEmailToSupplier(' + supplier_id + ')');
        $("#no_suppliers_customer").attr('onClick', 'noSupplierCustomer(' + supplier_id + ')');
    }
    $("#supplier_info_desc_more").hide();
    $(".remove_add_btn").show();
    $("#supplier_info_desc").show();
    $('.readmore a').html('READ MORE');
    $("#goto_supplier_from_supplier_page").html('<div class="add_more_products" onClick="goToSupplierPage(' + supplier_id + ')">See Suppliers Products</div>');
    var no_supplier_customer = getValue("no_supplier_customer" + supplier_id);
    if (no_supplier_customer == '1') {
        $('div.no_customer_supplier_checkbox').addClass('checked').removeClass('fa').removeClass('fa-check');
        $('input.no_customer_supplier_checkbox').attr('checked', 'checked');
    }
    if (dataresult.check_supplier > 0 || supplier_exist.length > 0) {
        $('div.customer_supplier_checkbox').addClass('checked').removeClass('fa').removeClass('fa-check');
        $('input.customer_supplier_checkbox').attr('checked', 'checked');
        $(".remove_add_btn").html('<div class="remove_from_list_btn" onClick="remove_supplier_from_list(' + supplier_id + ',0);"> Remove From My List</div>');
    }
    if (dataresult.check_supplier == 0 || supplier_exist.length == 0) {
        $(".remove_add_btn").html('<div class="add_to_list_btn" style="padding-left: 31px;padding-right: 31px;" onClick="add_supplier_to_list(' + supplier_id + ',0);"> Add To My List</div>');
    }

    $('#supplier_info_featured_products').html('');
    if (dataresult.featured_products.length > 0) {
        products_html = '<div id="featured_title">Featured Products</div><div id="featured_products_contents">';
        for (var i = 0; i < dataresult.featured_products.length; i++) {
            if (dataresult.featured_products[i].products_image == "noimage.jpg") {
                var IMAGE_SRC = 'img/noimage.jpg';
            } else {
                var IMAGE_SRC = dataresult.featured_products[i].products_image;
            }
            products_html += '<div class="featured-suppliers-box" onClick="getProductById(' + dataresult.featured_products[i].products_id + ', ' + supplier_id + ')"><div class="search-product-image">' +
                '<img height=100% src="' + IMAGE_SRC + '" onerror="this.onerror=null;this.src=\'img/noimage.jpg\';"></div>' +
                '<div class="search_product_info"><div >' + dataresult.featured_products[i].products_name + '</div>'+
                '<div style="margin-top: 5px;" class="by_supplier_name">$' + dataresult.featured_products[i].products_price + '</div></div>'+
                '</div>';

        };
        $('#supplier_info_featured_products').append(products_html + '</div><div id="view_more" onClick="goToSupplierPage(' + supplier_id + ')">VIEW MORE</div>');
       
    }
    $("#supplier_info_page").trigger('create');
     if (device.platform != 'browser') {
        var supplier_slider = $(".supplier_info_logo img");
        if(typeof supplier_slider !="undefined"){
            ImgCache.isCached(supplier_slider.attr('src'), function(path, success){
                if(success){
                    ImgCache.useCachedFile(supplier_slider);
                } else {
                    ImgCache.cacheFile(supplier_slider.attr('src'), function(){
                        ImgCache.useCachedFile(supplier_slider);
                    });
                }
            });
        }
        var supplier_small_logo = $("#supplier_info_sm_logo img");
         if(typeof supplier_small_logo !="undefined"){
            ImgCache.isCached(supplier_small_logo.attr('src'), function(path, success){
                if(success){
                    ImgCache.useCachedFile(supplier_small_logo);
                } else {
                    ImgCache.cacheFile(supplier_small_logo.attr('src'), function(){
                        ImgCache.useCachedFile(supplier_small_logo);
                    });
                }
            });
        }
        $(".search-product-image img").each(function(index, el) {
            var target_image = $(this);
            if(typeof target_image !="undefined"){
                ImgCache.isCached(target_image.attr('src'), function(path, success){
                    if(success){
                        ImgCache.useCachedFile(target_image);
                    } else {
                        ImgCache.cacheFile(target_image.attr('src'), function(){
                            ImgCache.useCachedFile(target_image);
                        });
                    }
                });
            }
        });
    }
    $('.checkboxes-and-radios').checkradios({
        checkbox: {
            iconClass: 'fa fa-check-circle'
        },
        radio: {
            iconClass: 'fa fa-check'
        }
    });

    hideLoading();
}

function getUserSuppliersList() {
    
    var recent_suppliers_html = '';
    var saved_suppliers_html = '<div class="saved-suppliers-box" style="margin: 10px 0;"><div style="margin: 10px 0px;font-weight: bold;">SAVED SUPPLIERS</div><div id="saved_suppliers_contents"></div></div>';
    $('#suppliers_page_contents').html(saved_suppliers_html);
    $saved_suppliers_contents = $("#saved_suppliers_contents");

    fetchsidebar();
    if(sidebar_supplier.length>0){
        var allSupplier_list = '<div class="saved-suppliers-list" onClick=goToSuppliersPage()><div class="saved-supplier-image">' + '<div class="supplier_wrapper_img"><img src="img/all_suppliers.png"></div></div>' + '<div class="saved-supplier-info" style="width:70%;"><div class="">All Suppliers</div>' + '<div>Here you can view all your saved supplier`s product`s in one list</div></div><div class="saved-supplier-arrow"><img height=20px src="img/next-arrow.png"></div></div>';
        $saved_suppliers_contents.append(allSupplier_list);
        for (var i = 0; i < sidebar_supplier.length; i++) {
                if (sidebar_supplier[i].image == "") {
                    var IMAGE_SRC = 'img/noimage.jpg';
                } else {
                    var IMAGE_SRC = sidebar_supplier[i].image;
                }
                var order_day_text = '';
                if(sidebar_supplier[i].order_day=='Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday'){
                    var order_day_text = '<div>Order Day: Everyday</div>';
                }else if(sidebar_supplier[i].order_day=='Monday,Tuesday,Wednesday,Thursday,Friday'){
                    var order_day_text = '<div>Order Day: Weekdays</div>';
                }else if(sidebar_supplier[i].order_day!=''){
                    var order_day_text = '<div>Order Day: '+sidebar_supplier[i].order_day+'</div>';
                }
                
                var saved_suppliers_list = '<div onClick=goToSupplierPage(' + sidebar_supplier[i].supplier_id + '); data-supplier-id="'+ sidebar_supplier[i].supplier_id+'" data-supplier-type="saved" id="saved_supplier'+ sidebar_supplier[i].supplier_id+'" class="saved-suppliers-list"><div  class="saved-supplier-image">' +
                    '<div  class="supplier_wrapper_img"><img onerror="this.onerror=null;this.src=\'img/noimage.jpg\';" src="' + IMAGE_SRC + '" class="supplier_list_logo_img"></div></div>' +
                    '<div class="saved-supplier-info"><div class="">' + sidebar_supplier[i].name + '</div>' +
                    '<div>' + sidebar_supplier[i].buisness_type + '</div>'+order_day_text+'</div><div class="supplier-cart-icon" style="height:22px" id="cart_icon'+ sidebar_supplier[i].supplier_id + '"></div><div class="saved-supplier-arrow"><img height=20px src="img/next-arrow.png"></div></div>';
                $(saved_suppliers_list).appendTo($saved_suppliers_contents);
                cartCounterSupplier(sidebar_supplier[i].supplier_id);
                 
             
        }
        
    }else{
        $('<p class="alert alert-info">Sorry currently you have no saved suppliers</p>').hide().appendTo($saved_suppliers_contents).fadeIn("slow");
    }
    if (recently_viewed_supp.length > 0) {
        recent_suppliers_html = '<div class="saved-suppliers-box" style="margin: 10px 0;"><div style="margin: 10px 0px;font-weight: bold;">RECENTLY VIEWED</div><div id="saved_suppliers_contents">';
        for (var i = 0; i < recently_viewed_supp.length; i++) {
            if (recently_viewed_supp[i].image == "") {
                var IMAGE_SRC = 'img/noimage.jpg';
            } else {
                var IMAGE_SRC = recently_viewed_supp[i].image;
            }
			var order_day_text = '';
			if(recently_viewed_supp[i].order_day=='Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday'){
				var order_day_text = '<div>Order Day: Everyday</div>';
			}else if(recently_viewed_supp[i].order_day=='Monday,Tuesday,Wednesday,Thursday,Friday'){
				var order_day_text = '<div>Order Day: Weekdays</div>';
			}else if(recently_viewed_supp[i].order_day!=''){
				var order_day_text = '<div>Order Day: '+recently_viewed_supp[i].order_day+'</div>';
			}
            recent_suppliers_html += '<div onClick=goToSupplierPage(' + recently_viewed_supp[i].supplier_id + ') class="saved-suppliers-list"><div class="saved-supplier-image">' +
                '<div class="supplier_wrapper_img"><img class="supplier_list_logo_img" src="' + IMAGE_SRC + '" onerror="this.onerror=null;this.src=\'img/noimage.jpg\';"></div></div>' +
                '<div class="saved-supplier-info"><div class="">' + recently_viewed_supp[i].name + '</div>' +
                '<div>' + recently_viewed_supp[i].buisness_type + '</div>'+order_day_text+'</div></div><div class="supplier-cart-icon" style="height:22px" id="cart_icon'+ sidebar_supplier[i].supplier_id + '"></div><div class="saved-supplier-arrow"><img height=20px src="img/next-arrow.png"></div></div>';
        }
        $('#suppliers_page_contents').append(recent_suppliers_html + '</div><div>');
    }

    custom_suppliers_html = '<div class="saved-suppliers-box" style="margin: 10px 0;"><div style="margin: 10px 0px;font-weight: bold;">CUSTOM SUPPLIERS</div><div id="custom_suppliers_contents"><div class="saved-suppliers-list" onClick=addCustomSupplier()><div class="saved-supplier-image">' + '<div class="supplier_wrapper_img"><img src="img/icons8-plus-math-50.png"></div></div>' + '<div class="saved-supplier-info" style="width:70%;"><div class="">Add a Supplier</div>' + '<div>Order from any supplier you want.</div></div><div class="saved-supplier-arrow"><img height=20px src="img/next-arrow.png"></div></div></div><div>';
    $('#suppliers_page_contents').append(custom_suppliers_html);
    $custom_suppliers_contents = $("#custom_suppliers_contents");
    var custom_suppliers = JSON.parse(getValue("custom_suppliers"));
    
    if (custom_suppliers && custom_suppliers != null) {
        for (var i = 0; i < custom_suppliers.length; i++) {
                var custom_suppliers_list = '<div onClick=goToCustomSupplierPage(' +custom_suppliers[i].custom_supplier_id + ') data-supplier-id="'+ custom_suppliers[i].custom_supplier_id+'" data-supplier-type="custom" id="custom_supplier'+ custom_suppliers[i].custom_supplier_id+'" class="saved-suppliers-list"><div  class="saved-supplier-image">' +
                    '<div  class="supplier_wrapper_img_text">'+custom_suppliers[i].custom_supplier_company_name.substring(0, 2)+'</div></div>' +
                    '<div class="saved-supplier-info"><div class="">' + custom_suppliers[i].custom_supplier_company_name + '</div>' +
                    '<div><i class="fa fa-phone"></i> '+ custom_suppliers[i].custom_supplier_phone + '</div><div><i class="fa fa fa-at"></i> '+ custom_suppliers[i].custom_supplier_email + '</div></div><div class="supplier-cart-icon" style="height:22px" id="custom-cart_icon'+ custom_suppliers[i].custom_supplier_id + '"></div><div class="saved-supplier-arrow"><img height=20px src="img/next-arrow.png"></div></div>';
                cartCounterCustomSupplier(custom_suppliers[i].custom_supplier_id);
                $(custom_suppliers_list).prependTo($custom_suppliers_contents);
        }

    }
    if (device.platform != 'browser') {
       $(".supplier_list_logo_img").each(function(index, el) {
            var target_image = $(this);
            if(typeof target_image!="undefined"){
                ImgCache.isCached(target_image.attr('src'), function(path, success){
                    if(success){
                        ImgCache.useCachedFile(target_image);
                    } else {
                        ImgCache.cacheFile(target_image.attr('src'), function(){
                            ImgCache.useCachedFile(target_image);
                        });
                    }
                });
            }
        });

    }
    
    $("div.saved-suppliers-list").on("taphold", function (e) {
            var supplier_id     = $(this).data("supplier-id");
            var supplier_type   = $(this).data("supplier-type");
            if(typeof supplier_id!="undefined" && typeof supplier_type!="undefined"){

                if(supplier_type=="saved" && supplier_id!==''){      
                    var options = {
                        androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
                        title: 'What would you like to do?',
                        buttonLabels: ['Remove Saved Supplier'],
                        addCancelButtonWithLabel: 'Cancel',
                        position: [20, 40]
                    };
                    window.plugins.actionsheet.show(options, function(buttonIndex) {
                        setTimeout(function() {
                            if (buttonIndex == 1) {
                                removeSavedSupplier(supplier_id);
                            } 
                        });
                    });
                }else if(supplier_type=="custom" && supplier_id!==''){
                   var custom_supplier_id = supplier_id;
                   var options = {
                        androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
                        title: 'What would you like to do?',
                        buttonLabels: ['Remove Custom Supplier','Edit Custom Supplier'],
                        addCancelButtonWithLabel: 'Cancel',
                        position: [20, 40]
                    };
                    window.plugins.actionsheet.show(options, function(buttonIndex) {
                        setTimeout(function() {
                            if (buttonIndex == 1) {
                                removeCustomSavedSupplier(custom_supplier_id);
                            }else if (buttonIndex == 2) {
                                openUpdateCustomSupplier(custom_supplier_id);
                            } 
                        });
                    });

                }
            }
    });
}
function openUpdateCustomSupplier(custom_supplier_id){
    var suppliers_data = validateCustomSupplier(custom_supplier_id);
    $("#update_custom_supplier_company_name").val(suppliers_data.custom_supplier_company_name);
    $("#update_custom_supplier_phone").val(suppliers_data.custom_supplier_phone);
    $("#update_custom_supplier_email").val(suppliers_data.custom_supplier_email);
    $("#update_custom_supplier_id").val(suppliers_data.custom_supplier_id);
    $("#update_custom_supplier_popup").popup({ positionTo: "window" }).popup('open');
}
function updateCustomSupplier(form){
    var custom_supplier_company_name = $.trim($("#update_custom_supplier_company_name").val());
    var custom_supplier_phone        = $.trim($("#update_custom_supplier_phone").val());
    var custom_supplier_email        = $.trim($("#update_custom_supplier_email").val());
    var custom_supplier_id           = $.trim($("#update_custom_supplier_id").val());
    validateCustomSupplier(custom_supplier_id);
    
    if (custom_supplier_company_name.length < 2) {
        toastMessage("Company Name is required.");
    }else if(!custom_supplier_phone.match(phoneExpression)) {
        toastMessage("Valid Phone Number is required.");
    } else if (validateEmail(custom_supplier_email) == false) {
        toastMessage("Valid email address required.");
    }else {
       getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
            if(data.customers_id>0){
                showLoading();
                $.ajax({
                    type: "POST",
                    data: "action=updateCustomSupplier&customers_id="+data.customers_id+"&"+$("#"+form).serialize(),
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    cache: false,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'error') {
                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        }else if(dataresult.result == 'success' && dataresult.custom_supplier_id>0){
                            var update_custom_suppliers = {
                                "custom_supplier_id":dataresult.custom_supplier_id,
                                "custom_supplier_company_name":custom_supplier_company_name,
                                "custom_supplier_phone":custom_supplier_phone,
                                "custom_supplier_email":custom_supplier_email
                            }
                            var custom_suppliers = JSON.parse(getValue("custom_suppliers"));
                            if (custom_suppliers == null) {
                                custom_suppliers = [];
                            }else{
                                custom_suppliers = custom_suppliers.filter(function(item) { 
                                    return item.custom_supplier_id != dataresult.custom_supplier_id;  
                                });
                            }
                            custom_suppliers.push(update_custom_suppliers);
                            if(typeof custom_suppliers!="undefined" && custom_suppliers.length>0){
                                addValue("custom_suppliers", JSON.stringify(custom_suppliers));
                            }
                            $("#update_custom_supplier_popup").popup('close');
                            getUserSuppliersList();
                            if(typeof dataresult.message!="undefined"){
                                toastMessage(dataresult.message);
                            }
                        }

                    },
                    error: function(error) {
                        connectionAlert();
                    }
                });
            }else{
                technicalError();
            }
        });
    }


}
function removeCustomSavedSupplier(custom_supplier_id){
    getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
        if(data.customers_id>0){
                showLoading();
                $.ajax({
                    type: "POST",
                    data: "action=removeCustomSavedSupplier&custom_supplier_id=" + custom_supplier_id + "&customers_id=" + data.customers_id,
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'error') {
                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        }else if(dataresult.result=='success'){
                            toastMessage(dataresult.message);
                            $("#custom_supplier"+custom_supplier_id).remove();
                            var custom_suppliers = JSON.parse(getValue("custom_suppliers"));
                            var filtered_custom_suppliers = custom_suppliers.filter(function(item) { 
                               return item.custom_supplier_id != custom_supplier_id;  
                            });
                            deleteValueSession("custom_suppliers_products"+custom_supplier_id);
                            deleteValueSession("customorderHistory"+custom_supplier_id);
                            var sql = "DELETE FROM customers_custom_suppliers_basket WHERE supplier_id=" + custom_supplier_id;
                            db.execute(sql, successCB, errorCB);
                            addValue("custom_suppliers", JSON.stringify(filtered_custom_suppliers));
                        }
                    },
                    error: function(error) {
                        connectionAlert();
                    }
                });
        }else{
            technicalError();
        }
    });
}
function removeSavedSupplier(supplier_id){
    getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
        if(data.customers_id>0){
                showLoading();
                $.ajax({
                    type: "POST",
                    data: "action=removeFromSupplierList&supplier_id=" + supplier_id + "&customers_id=" + data.customers_id,
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'error') {
                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        }else if(dataresult.result == 'success'){
                            toastMessage(dataresult.message);
                            $("#saved_supplier"+supplier_id).remove();
                            sidebar_supplier = [];
                            fetchsidebar();
                        }
                    },
                    error: function(error) {
                        connectionAlert();
                    }
                });
        }else{
            technicalError();
        }
    });
}
function restoreCustomSupplierChanges(){
    $('#all_products').attr('onClick', "getCategory();");
    $('#saved_products').attr('onClick', "savedProductsList();");
    $('#saved_products').html('MY SAVED PRODUCTS');
    $('#supplier_history').attr('onClick', "loadPrivousOrderProducts();");
    $('#multiple_checkout_div button').attr('onClick', "goTO('checkout_page');");
    $('#multiple_checkout_div button').html("CHECKOUT");
    $('#cart_page_tab').attr('onClick', "goToCartPage();");
    $("#all_products").show();
    $("#products_listview_container").hide();
    $("#add_custom_product_div").remove();
    $("#supplier_home_page .search_bar_home").show();
}
function addCustomSupplierChanges(custom_supplier_id){
    var suppliers_data = validateCustomSupplier(custom_supplier_id);
    CustomSupplier_ID = custom_supplier_id;
    
    $("#add_custom_product_div").remove();
    document.getElementById("category_collaps").innerHTML = "";
    document.getElementById("products_listview").innerHTML = "";
    document.getElementById("supplier_products_listview_search").innerHTML = "";
    $('#all_products').attr('onClick', "goToCustomSupplierPage(" + custom_supplier_id + ");");
    $('#saved_products').attr('onClick', "goToCustomSupplierPage(" + custom_supplier_id + ");");
    $('#supplier_history').attr('onClick',"loadCustomSupplierOrders(" + custom_supplier_id + ");");
    $('#cart_page_tab').attr('onClick', "goToCustomSupplierCartPage(" + custom_supplier_id + ");");
    $('#multiple_checkout_div button').html("CONFIRM ORDER");
    $('#multiple_checkout_div button').attr('onClick',"customSupplierCheckout(" + custom_supplier_id + ");");

    $("#all_products").hide();
    $("#products_listview_container").show();
    $('#saved_products').html('PRODUCTS');
    $("#supplier_home_page .search_bar_home").hide();
    $(".search_contents").html('');
    $(".search_products_value").val('');
    $(".cart_strip_header").remove();
    $("#cart_page").hide();
    $(".search_products_value").attr("placeholder", "Search " + suppliers_data.custom_supplier_company_name);
    $("#supplier_logo_top").html(suppliers_data.custom_supplier_company_name);
   
}

function goToCustomSupplierPage(custom_supplier_id){
    addCustomSupplierChanges(custom_supplier_id);
    $products_listview   = $("#products_listview");
    $(".supplier_page_tabs").removeClass("active_supplier_option");
    $("#saved_products").addClass("active_supplier_option");
    if ($.mobile.activePage.attr('id') != 'supplier_home_page'){
        goTO('supplier_home_page');
    }
    var add_custom_product  = '<div style="padding-bottom: 120px;" class="add_custom_product" id="add_custom_product_div">'+
                                '<form name="add_custom_product_from" id="add_custom_product_from">'+
                                  '<div class="custom_product_input">'+
                                    '<input data-role="none" placeholder="Code" type="text" style="width:20%" name="products_model">'+
                                    '<input data-role="none" placeholder="Product Name" type="text" style="width:55%" name="products_name">'+
                                    '<input data-role="none" placeholder="Price" pattern="[0-9]*" onkeypress="return isNumberKey(event);" type="number" style="width:19%" name="products_price">'+
                                  '</div>'+
                                  '<div class="save_custom_product_button" onClick="saveCustomProduct('+custom_supplier_id+');"><i class="fa fa-floppy-o fa-4x" aria-hidden="true"></i></div>'+
                                '</form>'+
                            '</div>';
    $products_listview.after(add_custom_product);
    getCustomSupplierProducts(custom_supplier_id);
    
}
function loadCustomSupplierOrders(custom_supplier_id){
    addCustomSupplierChanges(custom_supplier_id);
    $(".supplier_page_tabs").removeClass("active_supplier_option");
    $("#supplier_history").addClass("active_supplier_option");
    if ($.mobile.activePage.attr('id') != 'supplier_home_page'){
        goTO('supplier_home_page');
    }
    $("#products_listview_container").show();
     getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
            if(data.customers_id>0){
               var customorderHistory = JSON.parse(getValueSession("customorderHistory"+custom_supplier_id));
                if (customorderHistory && customorderHistory != null) {
                    genrateViewcustomorderHistory(customorderHistory);
                } else {
                    showLoading("Loading your custom orders data...");
                }
                $.ajax({
                    type: "POST",
                    data: "action=loadCustomSupplierOrders&customers_id=" + data.customers_id+"&custom_supplier_id=" +custom_supplier_id,
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        if (dataresult.result == 'error') {
                            hideLoading();
                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        }
                        addValueSession("customorderHistory"+custom_supplier_id,JSON.stringify(dataresult));
                        if (JSON.stringify(customorderHistory) != JSON.stringify(dataresult)) {
                            genrateViewcustomorderHistory(dataresult);
                        }
                        hideLoading();

                    },
                    error: function(error) {
                        if (customorderHistory == null) {
                            $("#products_listview").html('<p style="text-align:center;"><img class="error_image" src="img/cannot.png" onClick="loadCustomSupplierOrders(' + custom_supplier_id + ');" /></p>');
                            ("#products_listview").listview().listview("refresh");
                        }
                        hideLoading();
                    }
                });
            }else{
                technicalError();
            }
        });

    

}
function genrateViewcustomorderHistory(dataresult){
   document.getElementById("products_listview").innerHTML = "";
   if(typeof dataresult.custom_supplier_orders.length!="undefined"){  
        for (var i = 0; i < dataresult.custom_supplier_orders.length; i++) {
            var show_product_html = "";
            var orders_id = dataresult.custom_supplier_orders[i].orders_id;
            var products_html = '<div class="order-history-box">' +
                '<div><span class="pb-label">Custom Order # :</span> <strong>' + orders_id + '</strong></div>' +
                '<div><span class="pb-label">Custom Supplier :</span> <strong>' + dataresult.custom_supplier_orders[i].custom_supplier_company_name + '</strong></div>' +
                '<div><span class="pb-label">Custom Order Amount :</span>$' + dataresult.custom_supplier_orders[i].order_total_text.toFixed(2); + '</div>' +
                '<div></div>';
            
            for (var k = 0; k < dataresult.custom_supplier_orders[i].product_details.length; k++) {
                show_product_html += '<li>'+dataresult.custom_supplier_orders[i].product_details[k].products_quantity+' &times '+ dataresult.custom_supplier_orders[i].product_details[k].products_name + '</li>';
            }
            products_html += '<div><a href="#" class="action-btn ui-link show-product-btn">Show product</a></div><div class="show-product-content"><ul style="list-style-type:none;margin-left:10px;padding:0;">' + show_product_html + '</ul></div><div class="clear_both"></div></div>';
            $("#products_listview").append(products_html);
            if(dataresult.custom_supplier_orders.length==(i+1)){
                $("#products_listview").listview().listview("refresh");
                hideLoading();
            }
        }
    
    }else{
        hideLoading();
    }

}
function goToCustomSupplierCartPage(custom_supplier_id){
   addCustomSupplierChanges(custom_supplier_id);
   $("#products_listview_container").hide();
   $(".supplier_page_tabs").removeClass("active_supplier_option");
   $("#cart_page_tab").addClass("active_supplier_option");
   $("#cart_page").show();
   if ($.mobile.activePage.attr('id') != 'supplier_home_page'){
        goTO('supplier_home_page');
   }
   var cart_page_tab = $("#cart_page_tab").hasClass('active_supplier_option');
   $("div.cart_html_main").html('');
   $("div.sub_total_div").html('');
   $("div.cart_html_main").html(loading_image);
   getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
        db.query('SELECT * FROM customers_custom_suppliers_basket WHERE supplier_id=' + custom_supplier_id + ' AND customers_id=' + data.customers_id + ' ORDER BY customers_basket_id DESC', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                if (cart_page_tab) {
                    var dataresult = JSON.parse(getValueSession("sidebar_supplier_session"));
                    if(typeof dataresult.customers_address_book!="undefined" && dataresult.customers_address_book.length>0){
                        var customers_shipping_address_header = '<label for="custom_supplier_shipping_address" class="select">Please Select your Shipping Address:</label><div class="search_bar_home"><select class="custom_supplier_shipping_address business_type_filter" name="custom_supplier_shipping_address" id="custom_supplier_shipping_address"></div>';
                       $.each(dataresult.customers_address_book, function(index, address_book) {
                            var selected_default_address_book = '';
                            if(address_book.customers_default_address_id=='1'){
                                selected_default_address_book = 'selected';    
                            }
                            customers_shipping_address_header += '<option '+selected_default_address_book+' value="'+address_book.address_book_id+'" data-customers-id="'+address_book.customers_id+'">'+address_book.entry_street_address+', '+address_book.entry_suburb+' ,'+address_book.entry_postcode+'</option>';
                        });
                       customers_shipping_address_header +='</select>';
                            $("#cart_page div.cart-page-contents div.cart_html_main").html(customers_shipping_address_header);
                        }
                    var cart_html = '<div class="clear_both">&nbsp;</div><div><label for="custom_order_comment">Custom Order Comment:</label><textarea autocomplete="off" data-role="none" name="custom_order_comment" id="custom_order_comment"></textarea></div><div class="clear_both">&nbsp;</div><label for="custom_order_comment">Custom Order Products:</label><table  data-role="none"  width="100%" cellpadding="0" cellspacing="0" border="0"><thead><tr class="cart_html_heading"><td>Product</td><td>Qty</td><td>Unit Price</td><td width="20">Total</td><td></td></tr></thead><tbody></tbody></table>';
                        $("#cart_page div.cart-page-contents div.cart_html_main").append(cart_html);
                }
                
                var cart_date;
                var sub_total = 0;
                for (var i = 0; i < Number(len); i++) {
                    var cart_date = '';
                    var total_price = 0;
                    
                    cart_date = results.rows.item(i);
                    var total_price = cart_date.customers_basket_quantity * cart_date.final_price;

                    sub_total += total_price;
                    if (cart_page_tab) {
                        $("#cart_page div.cart-page-contents table > tbody").append('<tr class="cart_html_body"><td  valign="top">' + cart_date.products_name + '</td><td valign="top" width="40"><input type="number" value="' + cart_date.customers_basket_quantity + '" id="qtyUpdate' + cart_date.products_id + '" class="qtyUpdate" data-role="none" size="4" onChange="updateCustomCart(' + cart_date.products_id + ','+cart_date.supplier_id+');"></td><td valign="top" width="60">$' + (cart_date.final_price).toFixed(2) + '</td><td valign="top"><span id="price' + cart_date.products_id + '">$' + (total_price).toFixed(2) + '</span></td><td valign="top" style="text-align:right;"><a href="javascript:void(0);" onClick="removeCustomCart(' + cart_date.products_id + ','+cart_date.supplier_id+');" class="removeCart" style="position:relative;top:3px;text-align:right;"><img style="width:20px;margin-left:5px;" src="img/close.png"></a></td></tr>');
                    }


                }
                var order_total = (sub_total).toFixed(2);
                if (cart_page_tab) {
                    $("#cart_page div.cart-page-contents div.sub_total_div").html('<div class="add_more_products_wrapper"><div class="add_more_products" onClick="goToCustomSupplierPage(' + custom_supplier_id + ');">Add More Products</div></div><div class="clear_both">&nbsp;</div><div class="cart_total_main"><span class="sub_total">Sub-Total: $' + sub_total.toFixed(2) + '</span></div><br><div class="clear_both"></div><span style="font-size:11px;font-weight:normal;">Note:This Subtotal and total calculated on the base of your added products price.</span><div class="clear_both"></div><span style="color:#5b88c9;font-size:16px;text-align:right;display:block;line-height:16px;">Total: $' + order_total + '</span>');
                    $("#multiple_checkout_div").show();
                }

            } else {
               if (cart_page_tab) {
                    var cart_html = '<table data-role="none" width="100%" cellpadding="0" cellspacing="0" border="0"><tr class="cart_html_body"><td colspan="3" align="left"></td></tr><tr><td class="alert alert-info">Sorry your cart is empty</td></tr></table><div class="clear_both">&nbsp;</div>';
                    $("#cart_page div.cart-page-contents div.cart_html_main").html(cart_html);
                    
                }
                $("#multiple_checkout_div").hide();


            }
           
        }, successCB, errorCB);

    });
    
}
function customSupplierCheckout(custom_supplier_id){
    validateCustomSupplier(custom_supplier_id);
    getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
        db.query('SELECT * FROM customers_custom_suppliers_basket WHERE supplier_id=' + custom_supplier_id + ' AND customers_id=' + data.customers_id + ' ORDER BY customers_basket_id DESC', function(tx, results) {
            var ordercomment        = $("#custom_order_comment").val();
            var delivery_address_id = $("#custom_supplier_shipping_address option:selected").val();
            var len = results.rows.length;
            var products_id     = [];
            var quantity        = [];
            var products_name   = [];
            if (len > 0) {
                for (var i = 0; i < Number(len); i++) {
                    cart_date           = results.rows.item(i);
                    products_id[i]      = cart_date.products_id;
                    quantity[i]         = cart_date.customers_basket_quantity;
                    products_name[i]    = encodeURIComponent(cart_date.products_name);

                }
                var isMobile = {
                    Android: function() {
                        return navigator.userAgent.match(/Android/i);
                    },
                    BlackBerry: function() {
                        return navigator.userAgent.match(/BlackBerry/i);
                    },
                    iOS: function() {
                        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                    },
                    Opera: function() {
                        return navigator.userAgent.match(/Opera Mini/i);
                    },
                    Windows: function() {
                        return navigator.userAgent.match(/IEMobile/i);
                    },
                    any: function() {
                        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                    }
                };
                if (isMobile.any()) {
                    var deviceType = device.platform + ' ' + device.version;
                } else {
                    var deviceType = "computer";
                }
                showLoading("Checkout in process..");
                $.ajax({
                    type: "POST",
                    data: "action=customSuppliercheckoutProcess&custom_supplier_id=" + custom_supplier_id + "&products_id=" + products_id + "&products_name=" + products_name + "&quantity=" + quantity + "&customers_id=" + data.customers_id + "&device=" + deviceType + "&ordercomment=" + encodeURIComponent(ordercomment)+"&delivery_address_id="+delivery_address_id,
                    url: CONECTION_SERVER(),
                    timeout: 60000,
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'error') {
                            toastMessageLong(dataresult.message, "Error", "OK");
                            return false;
                        } else {
                            if (dataresult.result == 'success') {
                                db.execute("DELETE FROM customers_custom_suppliers_basket WHERE supplier_id=" + custom_supplier_id, successCB, errorCB);
                                $("#multiple_checkout_div").hide();
                                $("div.cart_html_main").html('<div id="serverResponse"><div class="alert alert-success first_messgae"><p>' + dataresult.message + '</p></div></div>');
                                $("div.sub_total_div").html('');

                                
                            }
                        }

                    },
                    error: function(error) {
                        connectionAlert();
                    }
                });
            } else { 
                goToCustomSupplierCartPage(custom_supplier_id); 
            }
        }, successCB, errorCB);
    });    
}
function saveCustomProduct(custom_supplier_id){
    
    var products_model = $.trim($("input[name='products_model']").val());
    var products_name  = $.trim($("input[name='products_name']").val());
    var products_price = $.trim($("input[name='products_price']").val());
        products_price = products_price!=''?products_price:0;
    if(products_price!='' && !Number(products_price)){
        toastMessage("Products name is required.");
    }else if(products_name.length < 2) {
        toastMessage("Products name is required.");
    }else {
       getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
            if(data.customers_id>0){
                showLoading();
                $.ajax({
                    type: "POST",
                    data: "action=saveCustomProduct&custom_supplier_id="+custom_supplier_id+"&customers_id="+data.customers_id+"&"+$("#add_custom_product_from").serialize(),
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    cache: false,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'error') {
                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        }else if(dataresult.result == 'success' && dataresult.products_id>0){
                            var add_new_custom_supplier_product = {
                                "products_id":dataresult.products_id,
                                "products_model":products_model,
                                "products_name":products_name,
                                "products_price":products_price
                            }
                            var custom_suppliers_products = JSON.parse(getValueSession("custom_suppliers_products"+custom_supplier_id));
                            if (custom_suppliers_products == null) {
                                var custom_suppliers_products = [];
                            }
                            custom_suppliers_products.push(add_new_custom_supplier_product);
                            if(typeof custom_suppliers_products!="undefined" && custom_suppliers_products.length>0){
                                addValueSession("custom_suppliers_products"+custom_supplier_id, JSON.stringify(custom_suppliers_products));
                            }
                            $("#add_custom_product_from input[type='text']").val('');
                            $("#add_custom_product_from input[type='number']").val('');
                            getCustomSupplierProducts(custom_supplier_id);
                        }

                    },
                    error: function(error) {
                        connectionAlert();
                    }
                });

            }else{
                technicalError();
            }
        });
    }
}
function removeCustomProduct(products_id,custom_supplier_id){
    getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
        if(data.customers_id>0){
            showLoading();
            $.ajax({
                type: "POST",
                data: "action=removeCustomProduct&custom_supplier_id="+custom_supplier_id+"&customers_id="+data.customers_id+"&products_id="+products_id,
                url: CONECTION_SERVER(),
                crossDomain: true,
                cache: false,
                dataType: "json",
                success: function(dataresult) {
                    hideLoading();
                    if (dataresult.result == 'error') {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }else if(dataresult.result == 'success'){
                        $("#custom_list_id-"+products_id).remove();
                        var sql = "DELETE FROM customers_custom_suppliers_basket WHERE supplier_id=" + custom_supplier_id + " AND products_id = " + products_id;
                        db.execute(sql, successCB, errorCB);
                        getCustomSupplierProducts(custom_supplier_id,true);
                    }

                },
                error: function(error) {
                    connectionAlert();
                }
            });

        }else{
            technicalError();
        }
    });
    
}
function getCustomSupplierProducts(custom_supplier_id,slientRefresh){
    getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
        if(data.customers_id>0){
            var custom_suppliers_products = JSON.parse(getValueSession("custom_suppliers_products"+custom_supplier_id));
            if (custom_suppliers_products != null && custom_suppliers_products.length>0 && !slientRefresh) {
                genrateCustomSupplierProducts(custom_suppliers_products);
            }else if(!slientRefresh){
                showLoading();
            }
            $.ajax({
                type: "POST",
                data: "action=getCustomSupplierProducts&custom_supplier_id="+custom_supplier_id+"&customers_id="+data.customers_id,
                url: CONECTION_SERVER(),
                crossDomain: true,
                cache: false,
                dataType: "json",
                success: function(dataresult) {
                    hideLoading();
                    if (dataresult.result == 'error') {
                        toastMessage(dataresult.message, "Error", "OK");
                    }
                    addValueSession("custom_suppliers_products"+custom_supplier_id, JSON.stringify(dataresult.custom_suppliers_products));
                    if (JSON.stringify(custom_suppliers_products) != JSON.stringify(dataresult.custom_suppliers_products)) {
                        genrateCustomSupplierProducts(dataresult.custom_suppliers_products);
                    }
                       
                    
                },
                error: function(error) {
                    connectionAlert();
                }
            })
        }else{
            technicalError();
        }
    });
}
function genrateCustomSupplierProducts(products_list) {
    
    var products_html = '';
    if (typeof products_list !="undefined" && products_list.length>0) {
            for (var i = 0; i < products_list.length; i++) {
                
                    var products_id          = products_list[i].products_id;
                    var products_suppl_id    = products_list[i].custom_supplier_id;
                    
                    products_html += '<li id="custom_list_id-'+products_id+'" data-id="' + products_id + '" class="custom_listview_li custom_listview_customProducts" data-supplier-id="'+products_suppl_id+'">' +
                    '<div class="custom_listview custom_list_image customProducttext">'+products_list[i].products_name.substring(0, 2)+'</div><div class="custom_listview custom_list_name" id="custom_list_name'+ products_id + '"><div class="sortable_custom">' + products_list[i].products_name +'</div>'+
                    '<div class="custom_list_price">$' +Number(products_list[i].products_price).toFixed(2) + '</div></div>'+
                    '<div class="custom_listview custom_list_qty" id="custom_list_qty'+ products_id + '"><input type="number" id="product_qty'+products_id+'" data-role="none" pattern="[0-9]*" class="input_products_list_number" data-product-id="' + products_id + '" data-pro_supplier_id="' + products_suppl_id + '" onkeypress="return isNumberKey(event);"></div>'+
                    '<div class="custom_listview drop_down_custom"><i class="fa fa-angle-right fa-2x" aria-hidden="true"></i></div>'+
                    '<input type="hidden" id="product_name'+products_id+ '" value="' + products_list[i].products_name + '">' +
                    '<input type="hidden" id="product_price'+products_id+ '" value="'+Number(products_list[i].products_price).toFixed(2)+'">' +
                    '<div class="custom_action_button">'+
                        '<button onClick="removeCustomProduct(' +products_id+ ','+products_suppl_id+');" data-role="none" class="custom_item_button custom_item_button_delete"><i class="fa fa-trash"></i> Delete</button>'+
                        '<button data-role="none" class="custom_item_button custom_item_button_cancel"><i class="fa fa-times"></i> Cancel</button>'+
                    '</div>'+
                    '</li>';
                
               
                
                if ((i+1)==products_list.length) {
                    $products_listview.html(products_html);
                    $products_listview.listview("refresh").trigger('create');
                    $products_listview.append('<a href="javascript:customquickCheckout()" class="float_custom_checkout_cart"><img src="img/cart_checkout.png"></a>');
                    
                }
            }
        
            /*Add to Cart*/
            $("li.custom_listview_li .input_products_list_number",$products_listview).on("blur", function(e) {
                if($(this).val()>0){
                    addCartCustomProducts($(this).data("product-id"), $(this).data("pro_supplier_id"),true);
                }
            });
            $("li.custom_listview_li .input_products_list_number",$products_listview).on("keypress", function(e) {
                if($(this).val()>0 && (e.keyCode == 13 || e.keyCode === 10 || e.keyCode==9)){
                    addCartCustomProducts($(this).data("product-id"), $(this).data("pro_supplier_id"),true);
                }
            });
            /*Tap Hold Delete Action*/
            $("li.custom_listview_li",$products_listview).on("taphold", function (e) {
                    var products_id = $(this).data("id");
                    deleteProductsListSlide(products_id,this);
            });
            /*Swipe action Left*/
            $("li.custom_listview_li",$products_listview).on("swipeleft", function (e) {
                event.preventDefault();
                event.stopPropagation();
                var products_id = $(this).data("id");
                var product_qty = $("#product_qty"+products_id).val();
                if(product_qty>0){
                    $("#product_qty"+products_id).val(Number(product_qty)-1);
                    product_qty = $("#product_qty"+products_id).val();
                    if(Number(product_qty)>0){
                        addCartCustomProducts(products_id, $(this).data("supplier-id"),true);
                    }
                    else{
                      removeCustomCart(products_id, $(this).data("supplier-id"),true);  
                    }
                }else{
                    deleteProductsListSlide(products_id,this);
                }
                
            });
            /*Swipe action Right*/
            $("li.custom_listview_li",$products_listview ).on("swiperight", function (e) {
                event.preventDefault();
                event.stopPropagation();
                $(".custom_action_button",this).hide();
                var products_id = $(this).data("id");
                var product_qty = $("#product_qty"+products_id).val();
                $("#product_qty"+products_id).val(Number(product_qty)+1);
                addCartCustomProducts(products_id, $(this).data("supplier-id"),true);
                
            });
                
            /*Cancel Swipe Delete*/
            $(".custom_item_button_cancel").on("tap", function () {
                event.preventDefault();
                event.stopPropagation();
                $(this).parent(".custom_action_button").hide();
            });

            $("li.custom_listview_li",$products_listview).each(function (index) {
                    var products_id         = $(this).data("id");
                    getSingleColumn("customers_basket_quantity", "customers_custom_suppliers_basket", "WHERE supplier_id="+$(this).data("supplier-id")+" AND products_id = " + products_id, function(data) {
                        if(Number(data.customers_basket_quantity)>0){
                            $("#product_qty"+products_id).val(Number(data.customers_basket_quantity));
                            $("#product_qty"+products_id).addClass("input_products_list_color_green");
                            $("#product_qty"+products_id).removeClass("input_products_list_color_white");
                            
                        }else{
                            $("#product_qty"+products_id).addClass("input_products_list_color_white");
                            $("#product_qty"+products_id).removeClass("input_products_list_color_green");
                            $("#product_qty"+products_id).val('');
                        }
                    });
                    
            });
            
    } else {
        setTimeout(function(){ hideLoading(); }, 1000);
        $products_listview .html('<p class="alert alert-info" style="padding: 10px;">Sorry, no products found. Please use below form to add products for your supplier.</p>');
        $products_listview .listview("refresh").trigger('create');
    }
}

function customquickCheckout(){
    validateCustomSupplier(CustomSupplier_ID);
    getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
        db.query('SELECT * FROM customers_custom_suppliers_basket WHERE supplier_id=' + CustomSupplier_ID + ' AND customers_id=' + data.customers_id + ' ORDER BY customers_basket_id DESC', function(tx, results) {
            var len = results.rows.length;
            var custom_listview_qty = $(".input_products_list_number").filter(function() { return $(this).val(); }).length;
            if (len > 0) {
                goToCustomSupplierCartPage(CustomSupplier_ID);
                
            }else{
               var custom_listview_qty = $(".input_products_list_number").filter(function() { return $(this).val(); }).length;
                if(custom_listview_qty<1){
                        toastMessage("Sorry, your cart is empty. Please enter your desired product quantity into the box.");
                }else{
                     customproductsListAddtoCart();     
                }
            }
        }, successCB, errorCB);
    });    
}
function customproductsListAddtoCart(){
    showLoading();
    var count_cart = 1
    $(".custom_listview_customProducts").each(function (index) {
        var custom_listview_qty = $(".input_products_list_number").filter(function() { return $(this).val(); }).length;
        var products_id         = $(this).data("id");
        var custom_supplier_id  = $(this).data("supplier-id");
        var products_qty        = $("#product_qty"+products_id).val();
        if(Number(products_qty)>0){
            addCartCustomProducts(products_id,custom_supplier_id,true);
            if(custom_listview_qty==count_cart){
                 setTimeout(function(){ 
                    hideLoading();
                    goToCustomSupplierCartPage(CustomSupplier_ID); 
                }, 2000);

            }
            count_cart++;
        }else if(Number(products_qty)==0){
            removeCustomCart(products_id,custom_supplier_id,true);
        }
        
     });  
}
function updateCustomCart(products_id,custom_supplier_id){
     var activePage = $.mobile.activePage.attr('id');
    var qtyUpdate = $("#qtyUpdate"+products_id).val();
    if (qtyUpdate == '') {
        toastMessage("Invalid quantity.", "Error", "Ok");
        return false;
    }
    if (Number(qtyUpdate) <= 0 || !Number(qtyUpdate)) {
        toastMessage("Invalid quantity.", "Error", "Ok");
        return false;
    }
    if (Number(qtyUpdate) > 9999) {
        toastMessage("Only 9999 quantity allowed.", "Error", "Ok");
        qtyUpdate = 9999;
        $("#qtyUpdate"+products_id).val(qtyUpdate);
    }
    var sql = "UPDATE customers_custom_suppliers_basket SET customers_basket_quantity = " + Number(qtyUpdate) + " WHERE products_id = " +products_id;
    db.execute(sql, goToCustomSupplierCartPage(custom_supplier_id), errorCB);
}
function removeCustomCart(products_id,custom_supplier_id,silent_remove){
    db.execute("DELETE FROM customers_custom_suppliers_basket WHERE products_id = " + products_id, successCB, errorCB);
    if(!silent_remove){
        goToCustomSupplierCartPage(custom_supplier_id);
    }else{
        $("#product_qty"+products_id).addClass("input_products_list_color_white");
        $("#product_qty"+products_id).removeClass("input_products_list_color_green");
        $("#product_qty"+products_id).val('');
    }
}
function addCartCustomProducts(products_id,custom_supplier_id,slient_add_to_card){
    
    var customers_basket_quantity = $("input#product_qty" + products_id).val();
    var products_name             = $("input#product_name"+ products_id).val();
    var product_price             = $("input#product_price"+ products_id).val();
    var productSupplierID         =  custom_supplier_id;
    db.query('SELECT customers_id FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            getSingleColumn("customers_basket_quantity", "customers_custom_suppliers_basket", "WHERE supplier_id=" + productSupplierID + " AND products_id = " +products_id, function(data) {
                if (data == '') {
                    var sql = "INSERT INTO customers_custom_suppliers_basket (supplier_id, customers_id, products_id, products_name, customers_basket_quantity, final_price) VALUES ("+ productSupplierID + ", " + row.customers_id+", "+products_id+", "+convertField(products_name)+ ", " + customers_basket_quantity+"," + product_price + ")";

                    db.execute(sql,successCB, errorCB);
                    
                    var active_supplier_option = $("#saved_products").hasClass("active_supplier_option");
                    $("#product_qty"+products_id).addClass("input_products_list_color_green");
                    $("#product_qty"+products_id).removeClass("input_products_list_color_white");
                    if(!slient_add_to_card){
                        toastMessage("Product sucessfully added into cart");
                    }
                    
                } else {

                    var sql = "UPDATE customers_custom_suppliers_basket SET customers_basket_quantity = " + Number(customers_basket_quantity) + ", products_name =" + convertField(products_name) + ", final_price = "+product_price + " WHERE supplier_id=" + productSupplierID + " AND products_id = "+products_id;
                    db.execute(sql, successCB, errorCB);
                    $("#product_qty"+products_id).addClass("input_products_list_color_green");
                    $("#product_qty"+products_id).removeClass("input_products_list_color_white");
                }
            });

        } else {
            goTO('user_login');
        }
    }, successCB, errorCB);
}
function cartCounterCustomSupplier(custom_supplier_id) {
    
    getSingleColumn("COUNT(customers_basket_id) as total_products", "customers_custom_suppliers_basket", "WHERE supplier_id=" + custom_supplier_id, function(data) {
        var total_products = data.total_products;
        if (total_products > 0) {
            $('#custom-cart_icon'+ custom_supplier_id).append('<div class="supplier-cart-count"  style="color: #9e9e9e;">' + total_products + '</div><img height=22px src="img/cart_icon_footer.png">');
            $('#custom-cart_icon'+ custom_supplier_id).attr('onClick', "event.preventDefault(); event.stopPropagation(); goToCustomSupplierCartPage(" + custom_supplier_id + ")");
        }
    });

}
function validateCustomSupplier(custom_supplier_id){
    var custom_suppliers = JSON.parse(getValue("custom_suppliers"));
    var custom_suppliers_data = custom_suppliers.filter(function(obj) {
        return obj.custom_supplier_id == custom_supplier_id;
    });
    if (custom_suppliers_data.length == 0) {
        toastMessage("Sorry, currently some technical glitch exist please close your app and try later");
        return false
    }else{
        return custom_suppliers_data[0];
    }
}
function pickCustomSupplierFromContact(){
    toastMessage("Currently in development");
}
function addCustomSupplier(){
    $("#custom_supplier_company_name").val('');
    $("#custom_supplier_phone").val('');
    $("#custom_supplier_email").val('');
    $("#custom_supplier_popup").popup({ positionTo: "window" }).popup('open');
}

function saveCustomSupplier(form){
    var custom_supplier_company_name = $.trim($("#custom_supplier_company_name").val());
    var custom_supplier_phone        = $.trim($("#custom_supplier_phone").val());
    var custom_supplier_email        = $.trim($("#custom_supplier_email").val());
    
    if (custom_supplier_company_name.length < 2) {
        toastMessage("Company Name is required.");
    }else if(!custom_supplier_phone.match(phoneExpression)) {
        toastMessage("Valid Phone Number is required.");
    } else if (validateEmail(custom_supplier_email) == false) {
        toastMessage("Valid email address required.");
    }else {
       getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
            if(data.customers_id>0){
                showLoading();
                $.ajax({
                    type: "POST",
                    data: "action=saveCustomSupplier&customers_id="+data.customers_id+"&"+$("#"+form).serialize(),
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    cache: false,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'error') {
                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        }else if(dataresult.result == 'success' && dataresult.custom_supplier_id>0){
                            var add_new_custom_suppliers = {
                                "custom_supplier_id":dataresult.custom_supplier_id,
                                "custom_supplier_company_name":custom_supplier_company_name,
                                "custom_supplier_phone":custom_supplier_phone,
                                "custom_supplier_email":custom_supplier_email
                            }
                            var custom_suppliers = JSON.parse(getValue("custom_suppliers"));
                            if (custom_suppliers == null) {
                                var custom_suppliers = [];
                            }
                            custom_suppliers.push(add_new_custom_suppliers);
                            if(typeof custom_suppliers!="undefined" && custom_suppliers.length>0){
                                addValue("custom_suppliers", JSON.stringify(custom_suppliers));
                            }
                            $("#custom_supplier_popup").popup('close');
                            getUserSuppliersList();
                            if(typeof dataresult.message!="undefined"){
                                toastMessage(dataresult.message);
                            }
                        }

                    },
                    error: function(error) {
                        connectionAlert();
                    }
                });
            }else{
                technicalError();
            }
        });
    }
}

function cartCounterSupplier(supplier_id) {

    var supplier = sidebar_supplier.filter(function(obj) {
        return obj.supplier_id == supplier_id;
    });

    getSingleColumn("COUNT(customers_basket_id) as total_products", "customers_basket", "WHERE supplier_id=" + supplier_id, function(data) {
        var total_products = data.total_products;
        if (total_products > 0) {

            getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
                db.query('SELECT * FROM customers_basket WHERE supplier_id=' + supplier_id + ' AND customers_id=' + data.customers_id + ' ORDER BY customers_basket_id DESC', function(tx, results) {
                    var len = results.rows.length;
                    if (len > 0) {
                        var minimum_order_total = supplier[0].minimum_amount;
                        var cart_date;
                        var sub_total = 0;
                        var products_tax_total = 0;
                        for (var i = 0; i < Number(len); i++) {
                            cart_date = results.rows.item(i);
                            var total_price = cart_date.customers_basket_quantity * cart_date.final_price;
                            sub_total += total_price;
                            var products_tax = (total_price * cart_date.products_tax) / 100;
                            products_tax_total += products_tax;

                        }
                        var order_total_without_shipping = (sub_total + products_tax_total).toFixed(2);
                        var more_to_go = minimum_order_total - order_total_without_shipping;
                        var free_shipping_text = 'Spend $' + Number(minimum_order_total).toFixed(2) + ' to get FREE SHIPPING, only $' + more_to_go.toFixed(2) + ' to go!';

                        var percentage_spent = ((order_total_without_shipping * 100) / minimum_order_total).toFixed(2);
                        if (order_total_without_shipping >= Number(supplier[0].minimum_amount)) {
                            $('#cart_icon'+ supplier_id + '').append('<div class="supplier-cart-count"  style="color: #5cb85c;">' + total_products + '</div><img height=22px src="img/not_empty_cart_icon.png">');
                            $('#cart_icon'+ supplier_id + '').attr('onClick', "event.preventDefault(); event.stopPropagation(); goToCartPage(" + supplier_id + ")");

                        } else {
                            $('#cart_icon'+ supplier_id + '').append('<div class="supplier-cart-count"  style="color: #FFC746;">' + total_products + '</div><img height=22px src="img/cart_icon_footer_active.png">');
                            $('#cart_icon'+ supplier_id + '').attr('onClick', "event.preventDefault(); event.stopPropagation(); goToCartPage(" + supplier_id + ")");


                        }
                    }
                }, successCB, errorCB);
            });

        }


    });

}
function searchSuppliers(supplier_name) {
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            var customers_id = row.customers_id;
            var activePage = $.mobile.activePage.attr('id');
            $('.search_data').slideDown();
            showLoading('Searching supplier...');
            $.ajax({
                type: "POST",
                data: "action=searchSupplier&customers_id=" + customers_id + "&supplier_name=" + encodeURIComponent(supplier_name),
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {
                    if (dataresult.result == 'error') {
                        hideLoading();
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    $('.search_contents').html('');
                    document.getElementById("home_page_contents").innerHTML = "";
                    document.getElementById('suppliers_products').setAttribute('data-type', 'suppliers');
                    var search_supplier_html = '';
                    search_supplier_html = '<div class="search-info"><span>' + dataresult.supplier_list.length + ' Results</span>' +
                        '<span  style="color: #FFC746!important;float: right;margin-right: 20px;" onClick="searchProducts(\'' + supplier_name + '\')">SUPPLIERS</span></div><div id="search_suppliers_contents">';
                    for (var i = 0; i < dataresult.supplier_list.length; i++) {
                        var products_html = '';
                        var add_remove = '';
                        if (dataresult.supplier_list[i].image == "") {
                            var IMAGE_SRC = 'img/noimage.jpg';
                        } else {
                            var IMAGE_SRC = dataresult.supplier_list[i].image;
                        }
                        search_supplier_html += '<div class="search-suppliers-box" onClick="getSupplierInfo(' + dataresult.supplier_list[i].id + ');"><div class="saved-supplier-image">' +
                            '<img src="' + IMAGE_SRC + '"></div>' +
                            '<div class="supplier_title">' + dataresult.supplier_list[i].supplier_name + '</div>' +
                            '</div>';

                    }

                    $('.search_contents').append(search_supplier_html + '</div>');
                    hideLoading();

                },
                error: function(error) {
                    hideLoading();
                }
            });
        } else goTO('user_login');
    }, successCB, errorCB);
}

function getProductById(product_id, supplier_id) {
    fillSupplierHomePage('get_product');
    supplierID = supplier_id;
    document.getElementById("category_collaps").innerHTML = "";
    document.getElementById("products_listview").innerHTML = "";
    document.getElementById("supplier_products_listview_search").innerHTML = "";
    $(".progress-bar-container").html('');
    $("#products_listview_container").hide();
    var products_listview_search = $('#supplier_products_listview_search');
    showLoading('Searching products....');
    $.ajax({
        type: "POST",
        data: "action=getProductById&product_id=" + product_id,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            if (dataresult.result == 'error') {
                products_listview_search.html('');
                hideLoading();
                toastMessage(dataresult.message, "Error", "OK");
                return false;
            }

            for (var i = 0; i < dataresult.products_list.length; i++) {

                if (dataresult.products_suppl_id[i] == supplierID) {

                    var products_html = '';
                    if (dataresult.products_image[i] == "noimage.jpg")
                        var IMAGE_SRC = 'img/noimage.jpg';
                    else
                        var IMAGE_SRC = dataresult.products_image[i];

                    var products_html = '<li><a class="icon-' + dataresult.products_list[i] + ' prdt-icon " href="javascript:moreDetails(' + dataresult.products_list[i] + ',' + dataresult.products_suppl_id[i] + ')"><img class = "product_image" width="80" height="80" onerror="this.onerror=null;this.src=\'img/noimage.jpg\';" src="' + IMAGE_SRC + '"><h3>' + dataresult.products_name[i] + '</h3><p id="listprice' + dataresult.products_list[i] + '">Price $' + Number(dataresult.products_price[i]).toFixed(2) + '</p></a><div id="after' + dataresult.products_list[i] + '" class="more_details"></div><input type="hidden" id="product_name' + dataresult.products_list[i] + '" value="' + dataresult.products_name[i] + '"></li>';
                    products_listview_search.append(products_html);

                }
            }
            hideLoading();
            products_listview_search.listview().listview("refresh");
            moreDetails(product_id, supplier_id);
            if (device.platform != 'browser') {
              $(".product_image").each(function(index, el) {
                var target_image = $(this);
                if(typeof target_image!="undefined"){
                    ImgCache.isCached(target_image.attr('src'), function(path, success){
                        if(success){
                            ImgCache.useCachedFile(target_image);
                        } else {
                            ImgCache.cacheFile(target_image.attr('src'), function(){
                                ImgCache.useCachedFile(target_image);
                            });
                        }
                    });
                }      
              });
            }

        },
        error: function(error) {
            hideLoading();
        }
    });

}

function searchProductsandSuppliers(product_name) {
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            customers_id = row.customers_id;
            var allSuppliers = JSON.parse(getValueSession("allSuppliers"));
            var supplier_found = [];
            if (allSuppliers && allSuppliers != null) {
               var product_name_array = product_name.split(" ");
                $.each(allSuppliers, function(i, v) {
                   var search_store_name = v.store_name.toLowerCase();
                   $.each(product_name_array, function(word_i, word) {
                        var search_word = word.toLowerCase();
                        if(search_store_name.indexOf(search_word) > -1){
                           if(supplier_found.indexOf(v) <= -1) {
                                 supplier_found.push(v);
                           } 
                        }
                   }); 
                });
            }

            showLoading('Searching....');
            $.ajax({
                type: "POST",
                data: "action=searchProduct&product_name=" + encodeURIComponent(product_name) + "&customers_id=" + customers_id + "&supplier_id=" + 'for_all',
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {
                    if (dataresult.result == 'error' && dataresult.type!="product") {
                        hideLoading();
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    if(typeof dataresult.products_list!="undefined" || supplier_found.length>0){ 
                        var panel_id = $.mobile.activePage.find('.nav-panel-main:visible').attr('id');
                        $("#"+panel_id).panel("close");
                        goTO("home_page");
                        setTimeout(function(){ 
                            $('.search_contents').html('');
                            var total_found = 0;
                            if(typeof dataresult.products_list!="undefined"){ 
                                var total_found = dataresult.products_list.length;
                            }
                            if(supplier_found.length>0){
                                total_found = Number(total_found)+Number(supplier_found.length);
                            }
                            $('.search_contents').append('<div class="search-info"><span>' + total_found + ' Results Found</span><span  style="color: #FFC746!important;float: right;margin-right: 20px;" onClick="getSuppliers();">Clear Search</span></div>');

                            if(supplier_found.length>0){ 
                                var search_supplier_html = '<p>Suppliers Result:</p><div id="search_suppliers_contents">';
                                for (var i = 0; i < supplier_found.length; i++) {
                                    if (supplier_found[i].image == "") {
                                        var IMAGE_SRC = 'img/noimage.jpg';
                                    } else {
                                        var IMAGE_SRC = supplier_found[i].small_logo_link;
                                    }
                                    search_supplier_html += '<div class="search-suppliers-box" onClick="getSupplierInfo(' + supplier_found[i].id + ');"><div class="saved-supplier-image">' +
                                        '<img src="' + IMAGE_SRC + '"></div>' +
                                        '<div class="supplier_title">' + supplier_found[i].store_name + '</div>' +
                                        '</div>';

                                }
                                search_supplier_html += '</div>';
                               
                            }else{
                                var search_supplier_html = '<div><p>Suppliers Result:</p><p class="alert alert-info">Sorry no supplier found againt your query.</p></div>';
                            }
                            $('.search_contents').append(search_supplier_html);
                            
                            if(typeof dataresult.products_list!="undefined"){    
                                var products_html = '<p>Products Result:</p><div id="search_suppliers_contents">';
                                for (var i = 0; i < dataresult.products_list.length; i++) {
                                    if (dataresult.products_image[i] == "noimage.jpg") {
                                        var IMAGE_SRC = 'img/noimage.jpg';
                                    } else {
                                        var IMAGE_SRC = dataresult.products_image[i];
                                    }
                                    products_html += '<div class="search-suppliers-box" onClick="getProductById(' + dataresult.products_list[i] + ',' + dataresult.products_suppl_id[i] + ')"><div class="search-product-image">' +
                                        '<img onerror="this.onerror=null;this.src=\'img/noimage.jpg\';" height=100% src="' + IMAGE_SRC + '"></div>' +
                                        '<div class="search_product_info"><div >' + dataresult.products_name[i] + '</div>' +
                                        '<div style="color: #5b88c9; margin-top: 5px;">$' + dataresult.products_price[i] + '</div>'+
                                        '<div style="margin-top: 5px;" class="by_supplier_name">by ' + dataresult.products_store[i] + '</div></div>' +
                                        '</div>';

                                }
                                products_html += '</div>';
                            }else{
                                var products_html = '<div><p>Products Result:</p><p class="alert alert-info">Sorry no supplier found againt your query.</p></div>';
                               
                            }


                            $('.search_contents').append(products_html);
                            hideLoading();
                        }, 1000);
                    }else{
                        toastMessage(dataresult.message, "Error", "OK");
                        hideLoading();
                    }


                },
                error: function(error) {
                    hideLoading();

                }
            });
        } else {
            goTO('user_login');
        }
    }, successCB, errorCB);
}
$(document).on('tap', '.left-btn', function() {
    $('.menu_data').slideDown();
    $('.search_data').slideUp();
});
$(document).on('tap', '.abn_list_select', function(event) {
    if (event.handled !== true) // This will prevent event triggering more then once
    {
        var abn_selected = $(this).data('abn-company') + ' - ' + $(this).data('abn_num');
        $('.abn_num_val').val(abn_selected);
        $('#abn_num').attr('abn-number', $(this).data('abn_num'))
        $('#business_name').val($(this).data('abn-company'));
        if ($.mobile.activePage.attr('id') == 'user_singup_company') $('#singup_business_name').val($(this).data('abn-company'));
        $("#account_form #abn").val($(this).data('abn_num'));
        $("#singup_form #abn_num").val($(this).data('abn_num'));
        $('.selected_abn').html(abn_selected);
        $('.abn_search_div').hide();
        $('.abn_num_div').show();
        event.handled = true;
    }
    return false;
});

function abn_research() {
    $('.abn_num_val').val('');
    $('.selected_abn').html('');
    $('.abn_search_div').show();
    $('.abn_num_div').hide();
    $("#account_form #abn").val("");
}

function abn_search_list() {
    var activePage = $.mobile.activePage.attr('id');
    var abn_search_string = $('#' + activePage + ' input.abn_search').val();
    if (abn_search_string == '') {
        toastMessage('Please Enter a ABN number or name', "Error", "OK");
        return false;
    }
    showLoading('Searching ABN...');
    $.ajax({
        type: "POST",
        data: "action=searchABN&abn_search_string=" + abn_search_string,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            if (dataresult.result == 'error') {
                $('#' + activePage + ' .abn_search_list').html('');
                hideLoading();
                toastMessage(dataresult.message, "Error", "OK");
                return false;
            }
            $('#' + activePage + ' .abn_search_list').html('');
            var search_abn_html = '';
            for (var i = 0; i < dataresult.abn_list.length; i++) {
                search_abn_html += '<a href="javascript:void(0);" class="abn_list_select" data-abn-company="' + dataresult.abn_list[i].name + '" data-abn_num="' + dataresult.abn_list[i].abn_number + '">' + dataresult.abn_list[i].name + ' - ' + dataresult.abn_list[i].abn_number + '</a>';
            }

            $('#' + activePage + ' .abn_search_list').append(search_abn_html);
            hideLoading();
        },
        error: function(error) {
            hideLoading();
            $('#' + activePage + ' .abn_search_list').html('');
        }
    });

    return false;
}

function addCreditCardProcess(form) {
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            var customers_id = row.customers_id;

            var card_holder_name = $.trim($("#new_card_holder_name").val());
            var credit_card = $.trim($("#new_credit_card").val());
            var month = $.trim($("#new_month").val());
            var year = $.trim($("#new_year").val());
            var card_cvv = $.trim($("#new_card_cvv").val());
            var currentYear = parseInt(new Date().getFullYear().toString().substr(2, 2));
            if (card_holder_name.length == 0)
                toastMessage("Card holder name is required.");
            else if (Validate(credit_card) == false)
                toastMessage("Invalid credit card number.");
            else if (month.length == 0 || !Number(month) || Number(month) > 12)
                toastMessage("Invalid expiry month.");
            else if (year.length == 0 || !Number(year) || Number(year) < currentYear)
                toastMessage("Invalid expiry year.");
            else if (card_cvv.length == 0 || !Number(card_cvv))
                toastMessage("Invalid CVV.");
            else if (form == 'frm_add_credit_card') {
                showLoading();
                $.ajax({
                    type: "POST",
                    data: "action=addCreditCard&customers_id=" + customers_id + "&" + $("#frm_add_credit_card").serialize(),
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    cache: false,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'error') {
                            hideLoading();
                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        } else {
                            toastMessageLong(dataresult.message);
                            goTO("manage_credit_card_page");
                        }
                    },
                    error: function(error) {
                        connectionAlert();
                    }
                });
            }
        } else goTO('user_login');
    }, successCB, errorCB);
}

function noSupplierCustomer(supplier_id) {
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            var customers_id = row.customers_id;
            console.log(supplier_id);
            addValue("no_supplier_customer" + supplier_id, "1");

        } else goTO('user_login');
    }, successCB, errorCB);
}

function sendEmailToSupplier(supplier_id) {

    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            var customers_id = row.customers_id;
            showLoading();
            $.ajax({
                type: "POST",
                data: "action=suppliersCustomer&customers_id=" + customers_id + "&supplier_id=" + supplier_id,
                url: CONECTION_SERVER(),
                crossDomain: true,
                cache: false,
                dataType: "json",
                success: function(dataresult) {
                    hideLoading();
                    if (dataresult.result == 'error') {
                        hideLoading();
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    } else {
                        add_supplier_to_list(supplier_id, 0);
                        deleteValue("no_supplier_customer" + supplier_id, 1);
                    }
                },
                error: function(error) {
                    connectionAlert();
                }
            });

        } else goTO('user_login');
    }, successCB, errorCB);
}

function nl2br(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if ((charCode != 46 || $(evt.target).val().indexOf('.') != -1) && (charCode < 48 || charCode> 57)) {
        event.preventDefault();
    }
    
}
function chatNotificationCount(){
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            var customers_id = row.customers_id;
            $.ajax({
                type: "POST",
                data: "action=chat_notification_count&customers_id=" + customers_id,
                url: CONECTION_SERVER(),
                crossDomain: true,
                cache: false,
                timeout:3000,
                dataType: "json",
                success: function(dataresult) {
                    if (dataresult.result == 'success') {
                        if(dataresult.chat_notification_count>0){
                            $(".chat_notification").html(dataresult.chat_notification_count);
                            $(".chat_notification").addClass('notification_count');
                        }else{
                            $(".chat_notification").html('');
                            $(".chat_notification").removeClass('notification_count');
                        }
                    } 
                }
                
            });

        }
    }, successCB, errorCB);
    
}
function initializeGoogleAutcomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById("singup_street_address"), {
        componentRestrictions: {
            country: "AU"
        }
    });
    google.maps.event.addListener(autocomplete, "place_changed", function() {
        var a = autocomplete.getPlace();
        console.log(a);
        for (var b = 0; b <= a.address_components.length; b++) {
            if ("locality" == a.address_components[b].types[0])
                $("#singup_form_suburb").val(a.address_components[b].short_name);
            if ("postal_code" == a.address_components[b].types[0]) {
                $("#singup_form_postcode").val(a.address_components[b].short_name);
                $(".postcode_alert").show();
            }
            if ("administrative_area_level_2" == a.address_components[b].types[0])
                $("#singup_form_city").val(a.address_components[b].short_name);
            if ("administrative_area_level_1" == a.address_components[b].types[0])
                $("#singup_state").val(a.address_components[b].short_name);
        }
    });
}