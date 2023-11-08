var SERVER_PATH     = "http://1300gloveman.com.au/";
var SERVER_API_PATH = "http://1300gloveman.com.au/webplanex/";
var customerID = '';
var supplierID = 0;
var withoutLogin = new Array("user_singup_company", "reset_pincode_page", "reset_password_page", "popupLogin", "user_login", "change_password_page", "user_singup", "forgot_password_page", "slide01", "slide02", "slide03", "slide04", "slide05","slide06","slide07", "fast_registration_singup", "become_a_supplier_singup");
var sidebar_supplier = [];
var numbersToSend = [];
var customerName;
var emailsToSend = [];
var fullnamesToSend = [];
var userContactsToInvite = [];
var recently_viewed_supp = [];
var supplier_min_amount = 30;
var checkout_redirect = false;
var slider_auto_rotation = '';
var chat_notification_interval = '';
var display_upgrade_popup = false;
var allowLocation = false;
var allowPushNotification = false;
var gloveman_in_list = true;
var customers_mobile;
var customers_name;
var customers_trading_name;
var guest_mode;
var guest_email = '';
var guest_postcode = '';
var guest_company_type = '';
var guest_id;
var category_supplier_type;
var prefix = 'onezoo';
var postAppversion = '4.0.0';
var all_category_count  = 0;
var CustomSupplier_ID = 0;
var loading_image       = '<p style="text-align:center;"><img style="max-height:32px;width:32px;" width="32" height="32" src="img/loading.gif" border="0"></p>';

document.addEventListener("deviceready", function() {
    navigator.splashscreen.show();
    if (window.plugins && window.plugins.insomnia && device.platform != 'browser') {
        window.plugins.insomnia.keepAwake();
    }
    onDeviceReady();
    document.addEventListener("backbutton", backButtonAction, false);
    document.addEventListener("resume", onDeviceResume, false);
    document.addEventListener("pause", onDevicePasue, false);
    window.ga.startTrackerWithId('UA-75925338-2', 30);
    window.ga.trackEvent('Launch', 'Start');
    window.localStorage.setItem('showSideMenu', true);
    deleteValue("goBackSupplier_id");
    initImgCache();

}, false);
$(document).ready(function($) {
    $('.checkboxes-and-radios').checkradios({
        checkbox: {
            iconClass: 'fa fa-check-circle'
        },
        radio: {
            iconClass: 'fa fa-check'
        }
    });
    $('.no-company-radio').checkradios({
        checkbox: {
            iconClass: 'fa fa-check-circle'
        },
        radio: {
            iconClass: 'fa fa-check'
        }
    });
    $('#singup_center').next().addClass('search-center');
    $("#forgot_user_email").on("keypress", function(event) {
        if (event.keyCode === 13 || event.keyCode === 10) {
            forgotPasswordRequest();
            event.preventDefault();
        }
    });
    $("#user_password, #show_password").on("keypress", function(event) {
        if (event.keyCode === 13 || event.keyCode === 10) {
            userValidate();
            event.preventDefault();
        }
    });
    $("#chnage_repeat_password").on("keypress", function(event) {
        if (event.keyCode === 13 || event.keyCode === 10) {
            changePasswordRequest('change');
            event.preventDefault();
        }
    });
    $(".search_value").on("keypress", function(event) {
        if (event.keyCode === 13 || event.keyCode === 10) {
            searchSupp($(this).val());
        }
    });
    $(".abn_keyboard_search").on("keypress", function(event) {
        if (event.keyCode === 13 || event.keyCode === 10) {
            abn_search_list();
        }
    });
    $(".search_products_value").on("keypress", function(event) {
        if (event.keyCode === 13 || event.keyCode === 10) {
            searchHeaderNew($(this).val());
        }
    });
    $(".search_suppliers_value").on("keyup", function(event) {
        var f = $(this).val();
        var regex = new RegExp(f, 'gi');

        $('.saved-suppliers-list').fadeOut()
            .each(function() {
                if($(this).html().match(regex)) {
                    $(this).stop().show();
                }
            });

        
    });
    $("#user_account_show_password").on("tap", function() {
        if ($(this).is(":checked")) {
            $("#user_account_password").attr("type", "text");
        } else {
            $("#user_account_password").attr("type", "password");
        }

    });
    $("#show_password").on("tap", function() {
        if ($(this).is(":checked")) {
            $("#user_password").attr("type", "text");
        } else {
            $("#user_password").attr("type", "password");
        }

    });
    $("#search_product").on("keypress", function(event) {
        if (event.keyCode === 13 || event.keyCode === 10) {
            SearchProdcuManual();
            $("#search_product").focusout();
            event.preventDefault();
        }
    });
    $(".open_web_chat").on("tap", function(event) {
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                showLoading();
                var row = results.rows.item(0);
                $.ajax({
                    type: "POST",
                    data: "action=open_web_chat&customers_id=" + row.customers_id+"&supplier_id="+supplierID,
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == "error") {
                            toastMessage(dataresult.message, "Error", "OK");
                        }else {
                            if(typeof dataresult.open_web_chat!="undefined" && dataresult.open_web_chat!=''){
                                 cordova.InAppBrowser.open(dataresult.open_web_chat, '_system', 'location=yes');
                            }else{
                                toastMessage("Some error occurred. Please try again.", "Error", "OK");
                            }
                           
                        }
                    },error: function(error) {
                        connectionAlert();
                    }

                });
            }else goTO('user_login');
        }, successCB, errorCB);
    });
    
    $("#business_type_filter").on("change", function(event) {
        var business_type = $(this).val();

        if (business_type == 'all' || business_type == '') {
            $(".supplier-list-container").show();
        } else {
            $(".supplier-list-container .supplier-descr").each(function() {

                if ($(this).text() == business_type) {
                    $(this).parent(".supplier-info").parent(".supplier-footer").parent(".supplier-list-container").show();
                } else {
                    $(this).parent(".supplier-info").parent(".supplier-footer").parent(".supplier-list-container").fadeOut();
                }
            });
        }
    });
    $.ajaxSetup({
        timeout: 20000
    });
    setTimeout(function() {
        $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDuHEjtzhCUFVguGDrEeOfqGpXwdH3T0XA&libraries=places")
            .done(function(script, textStatus) {
                initializeGoogleAutcomplete();
            })
            .fail(function(jqxhr, settings, exception) {
                showMessage("Poor internet connection.", new String(), "Ok");
            });
    }, 1000);

    
});
$(document).bind('mobileinit', function() {
    $.mobile.defaultPageTransition = 'none';
    $.mobile.loader.prototype.options.text = "loading";
    $.mobile.loader.prototype.options.textVisible = false;
    $.mobile.loader.prototype.options.theme = "a";
    $.mobile.loader.prototype.options.html = "";
    $.mobile.selectmenu.prototype.options.nativeMenu = false;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.fixedtoolbar.prototype.options.tapToggle = false;
    $.mobile.fixedtoolbar.prototype.options.hideDuringFocus = "";
    $.mobile.transitionFallbacks.slideout = "none";
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
    $.mobile.changePage.defaults.changeHash = false;

});
function CONECTION_SERVER() {
    var selected_customers_id = getValue("account_type") == 'user' ? selected_customers_id = getValue("account_id") : 0;
    var CONECTION_SERVER = SERVER_API_PATH + "API_CONECT.php?API_KEY=23sdfs334232sfs2ff&ACCESS_TOKEN=" + getValue("access_token") + "&app=live" + deviceInfo() + "&Connection=" + checkConnection() + "&debud" + getValue("geoLocation") + getAppInfo() + "&selected_customers_id=" + selected_customers_id;
    return CONECTION_SERVER;
}
function CONECTION_SERVER_UPLOAD() {
    return SERVER_API_PATH + "UPLOAD.php?API_KEY=23sdfs334232sfs2ff&ACCESS_TOKEN=" + getValue("access_token") + "&app=live" + deviceInfo() + "&Connection=" + checkConnection() + "&debud" + getValue("geoLocation") + getAppInfo();
}

function checkConnection() {
    if (typeof(navigator.connection) != "undefined") {
        var networkState = navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN] = 'Unknown Connection';
        states[Connection.ETHERNET] = 'Ethernet Connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'Offline';
        return states[networkState];
    } else {
        return 'Not Available';
    }
}

function AppInfo() {
    cordova.getAppVersion.getVersionNumber(function(version) {
        addValue("GlovemanAPPVersion", version);
    });
    cordova.getAppVersion.getVersionCode(function(versionCode) {
        addValue("GlovemanAPPVersionCode", versionCode);
    });

}

function getAppInfo() {
    AppInfo();
    var Appversion = getValue("GlovemanAPPVersion");
    if(getValue("GlovemanAPPVersion")==null){
        var Appversion = postAppversion;
    }
    return "&GlovemanAPPVersion="+Appversion+ "&GlovemanAPPVersionCode="+getValue("GlovemanAPPVersionCode");
}
function initImgCache(){
    if (device.platform != 'browser') {
        /*ImgCache.options.debug = true;*/
        ImgCache.options.chromeQuota = 50*1024*1024;
        ImgCache.options.usePersistentCache = true;
        ImgCache.options.cordovaFilesystemRoot = cordova.file.dataDirectory;
        ImgCache.options.localCacheFolder = 'CacheImages';
        console.log("Image Cache settings set");
        ImgCache.init(function(){
            console.log("Image Cache Initialized");
        },  
        function(){
            console.log('ImgCache init: error');
        });
        ImgCache.cacheFile();
    }
}
function geoLocation() {
    addValue("geoLocation", "&geoLocation=0");
    //  if(allowPushNotification)$('#next-allow-geo-loc').removeAttr('disabled');
    //  addValue("geoLocation","&geoLocation=0");
    //  allowLocation = true;
    //  if(typeof(navigator.geolocation)!="undefined"){
    //      var nav = navigator.geolocation.getCurrentPosition(
    //          function(position) {
    //            //toastMessage('"ONEzoo" already has access to Your Current Location');
    //            addValue("geoLocation", "&Latitude="+encodeURIComponent(position.coords.latitude)+"&Longitude="+encodeURIComponent(position.coords.longitude)+"&Altitude="+encodeURIComponent(position.coords.altitude)+"&Accuracy="+encodeURIComponent(position.coords.accuracy)+"&Altitude_Accuracy="+encodeURIComponent(position.coords.altitudeAccuracy)+"&Timestamp="+encodeURIComponent(position.timestamp));
    //  }, function(error) {
    //            addValue("geoLocation","&geoLocation=0");
    //      });
    //  }
}

function onNotificationConfirm(buttonIndex) {
    allowPushNotification = true;
    if (allowLocation) $('#next-allow-geo-loc').removeAttr('disabled');
}

function showNotificationConfirm() {
    navigator.notification.confirm(
        '"ONEzoo" Would Like to Send You Notifications ', // message
        onNotificationConfirm, // title
        ["Don" + "'" + "t allow", "OK"] // buttonLabels
    );
}

function onDevicePasue() {
    navigator.splashscreen.show();
    if (window.plugins && window.plugins.insomnia && device.platform != 'browser') {
        window.plugins.insomnia.allowSleepAgain();
    }
}

function onDeviceResume() {
    db.open("gloveman_mobile2", "Gloveman Mobile", "", 5000000);
    createDataBase();
    initialNotificationSetting();
    geoLocation();
    AppInfo();
    if (window.MobileAccessibility) {
        window.MobileAccessibility.usePreferredTextZoom(false);
    }
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            customerID = row.customers_id;
            customerName = row.customers_firstname;
            registerpushNotification();
        } else {
            var activePage = $.mobile.activePage.attr('id');
            if ($.inArray(activePage, withoutLogin) === -1) {
                goTO("home_page");
            }
        }

    }, successCB, errorCB);
    if (window.plugins && window.plugins.insomnia && device.platform != 'browser') {
        window.plugins.insomnia.keepAwake();
    }
    setTimeout(function() { navigator.splashscreen.hide(); }, 1000);
}

function getSupplierFromLocalStorage() {
    var store_supplierID = getValue('supplierID');
    var store_supplier_min_amount = getValue('supplier_min_amount');
    if (store_supplierID != '') {
        supplierID = store_supplierID;
        minimum_order_total = store_supplier_min_amount;
    }
}

function getDeviceContacts(callback) {
    showLoading("Loading Contacts...");
    var options = new ContactFindOptions();
    options.filter = "";
    options.hasPhoneNumber = true;
    options.multiple = true;
    var fields = ["*"];
    navigator.contacts.find(fields, onSuccess, onError, options);

    function onSuccess(contacts) {
        hideLoading();
        var contactsData = [];
        contacts.forEach(function(contact) {
            var contactData = {
                firstName: contact.name.givenName,
                secondName: contact.name.familyName,
                emails: [],
                phoneNumbers: [],
                photos: []
            };
            if (contact.emails) {
                contact.emails.forEach(function(email) {
                    contactData.emails.push(email.value);
                });
            }
            if (contact.phoneNumbers) {
                contact.phoneNumbers.forEach(function(number) {
                    contactData.phoneNumbers.push(number.value);
                });
            }
            if (contact.photos) {
                contact.photos.forEach(function(photo) {
                    contactData.photos.push(photo);
                });
            }
            contactsData.push(contactData);
        });
        callback(contactsData);
    }

    function onError(contactError) {
        hideLoading();
        toastMessage(contactError);
    }
}


function sliderIntroShow() {
    if (window.localStorage.getItem('sliderIntro') != 'true') {
        window.localStorage.setItem('sliderIntro', true);
        $("#button-skip").show();
        $.mobile.changePage("#intro1", { transition: "none" });
        
    } else {
        goTO('home_page');
    }


}
function sendSms(userContactsToInvite) {
    
    var smsCount = 0;
    userContactsToInvite.forEach(function(contact) {
        sendSmsMessage(contact.mobile, 'Hey! I have joined ONEzoo, a platform that connects suppliers with customers and I would like for you to join, you can sign up quickly and easily at supplier.ONEzoo.com.au. Thanks, ' + customerName,
            function() { smsCount++; },
            function() { smsCount--; });
    });
    toastMessage('SMS sent successful ');
    $('.done-sms-button').removeAttr('disabled');
   

    firstSendInvitation = false;
}

function sendSmsMessage(number, message, successCallback, errorCallback) {
    //CONFIGURATION
    var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
            intent: '   ' // send SMS with the native android SMS messaging
            //intent: '' // send SMS without open any other app
        }
    };

    var success = function() { console.log('Message sent successfully ', number); };
    var error = function(e) { console.log('Message Failed:' + e); };
    if (number) sms.send(number, message, options, success, error);
}

function onDeviceReady() {
    db.open("gloveman_mobile2", "Gloveman Mobile", "", 5000000);
    if (device.platform != 'browser') {
        window.cache.clear();
    }
    AppInfo();
    createDataBase();
    checkUserLogin();
    cartCount();
    initialNotificationSetting();
    geoLocation();
    setTimeout(function() { navigator.splashscreen.hide(); }, 1000);
    $(document).on('tap', '#invite_supplier_contacts .ui-icon-delete', function() {
        $('[data-search]').val('');
        $('[data-filter-item]').removeClass('hidden');
    });
    $(".nav-panel-main").on("panelbeforeopen", function(event, ui) {
        var account_type = getValue("account_type");
        var switch_account_sidebar = '</br><span onClick=goTO("manage_accounts"); style="font-size:14px;text-transform: none;"><i class="fa fa-arrows-h"></i> Switch Account</span>';
        if (account_type == "user") {
            $("div.current_entry_company").html('User of ' + outputSting(getValue("account_entry")) + switch_account_sidebar);
        } else if (getValue("available_accounts") > 0) {
            $("div.current_entry_company").html(outputSting(getValue("account_entry")) + switch_account_sidebar);
        } else {
            $("div.current_entry_company").html(outputSting(getValue("account_entry")));
        }
        var check_guest_mode = getValue("guest_mode");
        if (check_guest_mode == 'true') {
            $(".account-setting").css('display', 'none');
            $(".create-account").css('display', 'block');
            addValue("guest_mode", true);
            guest_mode = true;

        } else if (check_guest_mode == 'false') {
            $(".account-setting").css('display', 'block');
            $(".create-account").css('display', 'none');
            addValue("guest_mode", false);
            guest_mode = false;
        } else {
            $(".account-setting").css('display', 'block');
            $(".create-account").css('display', 'none');
            guest_mode = false;
        }
    });
    $(document).on('tap', '.plus-button-click', function() {
        var count = 1;
        $("#invite_supplier_content").html('');
        $('[data-search]').val('');
        $('[data-filter-item]').removeClass('hidden');
        getDeviceContacts(function(data) {

            data.sort(function(a, b) {
                if (a.firstName < b.firstName) return -1;
                if (a.firstName > b.firstName) return 1;
                return 0;
            });
            data.forEach(function(contact) {
                if (contact.phoneNumbers.length) {
                    if (contact.firstName == null && contact.secondName == null) {
                        contact.firstName = 'Unknown';
                        contact.secondName = 'contact';
                    } else if (contact.firstName == null) {
                        contact.firstName = '';
                    } else if (contact.secondName == null) {
                        contact.secondName = '';
                    }
                    var html = '<div style="border-bottom: 1px solid lightgray;padding-bottom: 5px;" id="' + contact.firstName.substring(0, 1).toLowerCase() + '1' + '" data-filter-item data-filter-name="' + contact.firstName.toLowerCase() + ' ' + (contact.secondName ? contact.secondName.toLowerCase() : '') + '" class="search-product-box"><div class="thumb-left" style="float:left;"><img src="' + (contact.photos[0] ? contact.photos[0].value : 'img/defaultImg.png') + '" height="50" alt="" border="0" onerror="this.onerror=null;this.src=\'img/defaultImg.png\';"></div><div class="description-right"><div><h3 class="fullname-p">' + contact.firstName + ' ' + (contact.secondName ? contact.secondName : '') + '</h3><p class="phone-p">' + contact.phoneNumbers[0] + '</p><p class="email-p">' + (contact.emails[0] ? contact.emails[0] : '') + '</p></div><div><div class="send-invite-email-btn" onClick="checkAndSend(this);"><a><span><i class="fa fa-check" aria-hidden="true"></i></span></a></div></div><div class="clear_both"></div></div></div>';
                    $("#invite_supplier_content").append(html);
                }
                count++;
            });
            $.mobile.changePage("#invite_supplier_contacts", { transition: "none" });
            
        });
    });

   $(document).on('tap', '.alphavite-search a', function() {
        var href = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(href).first().offset().top - 130
        });
    });
    $(document).on('tap', '.cancel-btn', function() {
        $("#popupInvite").popup("close");
    });
    if (window.MobileAccessibility) {
        window.MobileAccessibility.usePreferredTextZoom(false);
    }
    
    $(document).on('keyup', '[data-search]', function() {
        var searchVal = $(this).val();
        searchVal = searchVal.toLowerCase();
        var filterItems = $('[data-filter-item]');

        if (searchVal != '') {
            filterItems.addClass('hidden');
            $('[data-filter-item][data-filter-name*="' + searchVal + '"]').removeClass('hidden');
        } else {
            filterItems.removeClass('hidden');
        }
    });
    $(document).on('tap', '.header_cart_icon', function() {
        var activePage = $.mobile.activePage.attr('id');
        if (activePage != 'user_login' && activePage != 'change_password_page' && activePage != 'forgot_password_page') {
            goTO("cart_page");
        }
    });
    $(document).on("change", '#notification_conents select', function() {
        var $this = $(this);
        if ($this.attr("name") == "order_day") {
            var order_day_alert_time = getValue("order_day_alert_time");
            if (order_day_alert_time != null) {
                $("#order_day_alert_time").html(order_day_alert_time);
            } else {
                $("#order_day_alert_time").html("8:00 AM");
            }
            if ($this.val() == "on") {
                $(".alert_time_class").show();
            } else {
                $(".alert_time_class").hide();
            }
        }
        db.query('SELECT * FROM notification_setting  WHERE field_name=' + convertField($this.attr("name")), function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                db.execute("UPDATE notification_setting SET field_name = " + convertField($this.attr("name")) + " ,field_value = " + convertField($this.val()) + " WHERE  field_name=" + convertField($this.attr("name")), updatenotificationtoServer, errorCB);
            } else {
                db.execute("INSERT INTO notification_setting ( field_name ,field_value)  VALUES (" + convertField($this.attr("name")) + "," + convertField($this.val()) + ")", updatenotificationtoServer, errorCB);
            }
        }, successCB, errorCB);

    });

    $(document).on('tap', '#request_pincode', function() {
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) { var row = results.rows.item(0);
                $("div.welcomeuser p").html("Welcome " + outputSting(row.customers_firstname) + ' ' + outputSting(row.customers_lastname));
                goTO('home_page'); } else {
                $.mobile.changePage("#forgot_password_page", { transition: "none" });    
                
            }

        }, successCB, errorCB);
    });
    $(document).on('tap', '#forgot_password', function() {
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) { var row = results.rows.item(0);
                $("div.welcomeuser p").html("Welcome " + outputSting(row.customers_firstname) + ' ' + outputSting(row.customers_lastname));
                goTO('home_page'); } else {
                $("#forgot_user_email").val('');
                $.mobile.changePage("#forgot_password_page", { transition: "none" });
               
            }

        }, successCB, errorCB);
    });
    $(document).on('tap', '#change_password', function() {
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                $("div.welcomeuser p").html("Welcome " + outputSting(row.customers_firstname) + ' ' + outputSting(row.customers_lastname));
                goTO('home_page');
            } else {
                $.mobile.changePage("#change_password_page", { transition: "none" });
               
            }
        }, successCB, errorCB);
    });
    $(document).on('tap', '#open_Account_link', function() {
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) { var row = results.rows.item(0);
                $("div.welcomeuser p").html("Welcome " + outputSting(row.customers_firstname) + ' ' + outputSting(row.customers_lastname));
                goTO('home_page'); } else {
                    $.mobile.changePage("#user_singup", { transition: "none" });
                
            }
        }, successCB, errorCB);
    });
    $(document).on('tap', '#sign-up-button', function() {
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) { var row = results.rows.item(0);
                $("div.welcomeuser p").html("Welcome " + outputSting(row.customers_firstname) + ' ' + outputSting(row.customers_lastname));
                goTO('home_page'); } else {
                var slider_display_setting = getValue('slider_show');
                if (slider_display_setting != 1) {
                    addValue('slider_show', 1);
                }
                $('.stopSlideshow').hide();
                clearSignupForm("user_singup");
                clearSignupForm("user_singup_company");
                $.mobile.changePage("#user_singup", { transition: "none" }); 
               
            }
        }, successCB, errorCB);
    });

    $(document).on('tap', '.create-account', function() {
        updateAcc();
    });
    $(document).on('tap','.bars-button', function() {
        fetchsidebar();
    });

    /*
     * Back to slider function
     */
    
    $(document).on("pagebeforeshow", "#user_login", function() {
        StatusBar.show();
        $('.slide-pagination').hide();
        $('#buttons-create-sign').hide();
        clearInterval(slider_auto_rotation);
        upgrade_avaliable_check();
    });
    $(document).on("pagebeforeshow", "#supplier_home_page", function() {
        emptyProductsList();
        cartCount();
    });
    $(document).on("pagebeforeshow", "#fast_registration_singup", function() {
        StatusBar.show();
        $('.slide-pagination').hide();
        $('.slide-pagination-intro').hide();
        $('#buttons-create-sign').hide();
        clearInterval(slider_auto_rotation);
        upgrade_avaliable_check();
    });
    $(document).on("pagebeforeshow", "#become_a_supplier_singup", function() {
        StatusBar.show();
        $('.slide-pagination').hide();
        $('.slide-pagination-intro').hide();
        $('#buttons-create-sign').hide();
        clearInterval(slider_auto_rotation);
        upgrade_avaliable_check();
    });
   
    $(document).on("pagebeforeshow", "#invite_supplier", function() {
        $('.slide-pagination-intro').hide();
        $('.slide-pagination').hide();
        $('#buttons-create-sign').hide();
        $('html').css('overflow', 'visible');
        clearInterval(slider_auto_rotation);
        upgrade_avaliable_check();
    });
    $(document).on("pageshow", "#slide01,#intro1", function() {
        setTimeout(function() { navigator.splashscreen.hide(); }, 1000);

    });
    
    $(document).on("pagebeforeshow", "#supplier_page", function() {
        
        
        emptyProductsList();
        getSupplierList('supplier_collaps');
    });
    $(document).on("pagebeforeshow", "#supplier_info_page", function() {
        
        
        goToSupplierInfoPage(supplierID);
    });
    
    $(document).on("pageshow", "#supplier_home_page, #suppliers_page, #supplier_info_page", function() {
        chat_notification_interval = setInterval(chatNotificationCount, 5000);
    });
    $(document).on("pagebeforehide", "#supplier_home_page, #suppliers_page, #supplier_info_page, #home_page", function() {
        clearInterval(chat_notification_interval);
    });
    $(document).on("pagebeforeshow", "#home_page", function() {
        StatusBar.show();
        window.ga.trackView('Home');
        
        
        emptyProductsList();
        $('#buttons-create-sign').hide();
        
        
        $('.slide-pagination').hide();
        $('.slide-pagination-intro').hide();
        clearInterval(slider_auto_rotation);
        upgrade_avaliable_check();
        emptyProductsList();
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                $("div.entry-name-welcomeuser").html(outputSting(getValue("account_entry")) + "<div><img src='img/arrows.png'></div>");
                $("div.welcomeuser").html("Welcome " + outputSting(row.customers_firstname) + ' ' + outputSting(row.customers_lastname));
                checkPromotion(row.customers_id);
                getSuppliers();
                fetchsidebar();

            } else {
                goTO('user_login');
            }
        }, successCB, errorCB);
        var chat_notification_interval = 
        setTimeout(function() { navigator.splashscreen.hide(); }, 1000);
        
    });
    $(document).on("pagebeforeshow","#suppliers_page", function() {
        category_supplier_type = false;
        $("#search_suppliers_value").val('');
        $("#search_save_suppliers_contents").html('');
        getUserSuppliersList();
    });
    $(document).on("pagebeforeshow", "#supplier_page_intro", function() {
        getSupplierList('supplier_collaps_intro');
        $("#buttons-create-sign").hide();
    });
    $(document).on("pagebeforeshow", "#user_account", function() {
        emptyProductsList();
        $("#user_account input.abn_search").css("border", "none");
        userData();
    });
    $(document).on("pagebeforeshow", "#checkout_page", function() {
        getSupplierLogo();
        
        
        emptyProductsList();
        checkOut();
    });
    $(document).on("pagebeforeshow", "#setting", function() {
        
        
        getOderDayTime();
        getNotificationSetting();
        if (getValue("account_type") == "user") {
            $("div.entry-name-welcomeuser").html("User of " + outputSting(getValue("account_entry")) + "<div><img src='img/arrows.png'></div>");
        } else {
            $("div.entry-name-welcomeuser").html("Owner/Head Chef of " + outputSting(getValue("account_entry")) + "<div><img src='img/arrows.png'></div>");
        }
        var Appversion = getValue("GlovemanAPPVersion");
        if(getValue("GlovemanAPPVersion")==null){
            var Appversion = postAppversion;
        }
        $('.version_number').text("Version = " +Appversion);
    });
    $(document).on("pagebeforeshow", "#reset_pincode_page", function() {
        $('.email-address-forgot-password').text($.trim($("#forgot_user_email").val()));
    });
    $(document).on("pagebeforeshow", "#address_book", function() {
        
        
        loadAddressBook();
    });
    $(document).on("pagebeforeshow", "#notification", function() {
        
        
        db.query('SELECT * FROM notification_setting', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var rows = results.rows.item(i);
                    $('#' + rows.field_name).val(rows.field_value).flipswitch('refresh');
                }
            }
        }, successCB, errorCB);
    });
    $(document).on("pagebeforeshow", "#feed_page", function() {
        
        
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                laodFeedData(row.customers_id);
            } else
                goTO('user_login');
        }, successCB, errorCB);

    });
    $(document).on("pagebeforeshow", "#manage_users", function() {
        
        
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                loadCustomerUsers(row.customers_id);
            } else
                goTO('user_login');
        }, successCB, errorCB);

    });
    $(document).on("pagebeforeshow", "#manage_accounts", function() {
        
        
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                loadCustomerAccounts(row.customers_id, row.customers_firstname, row.customers_lastname);
            } else
                goTO('user_login');
        }, successCB, errorCB);

    });
    $(document).on("pagebeforeshow", "#switch_account_page", function() {
        
        
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                loadCustomerAccounts(row.customers_id, row.customers_firstname, row.customers_lastname);
            } else
                goTO('user_login');
        }, successCB, errorCB);

    });
    $(document).on("pagebeforeshow", "#manage_credit_card_page", function() {
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                loadManageCreditCardContent(row.customers_id);
            } else
                goTO('user_login');
        }, successCB, errorCB);

    });
    $(document).on("pagebeforeshow", "#slide01", function() {
        StatusBar.hide();
        $('.slide-pagination li.active').removeClass('active');
        $('.slide-pagination li.slide01').addClass('active');
        $('.slide-pagination').show();
        $('#buttons-create-sign').show();
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 2000);
    });
    $(document).on("pagebeforeshow", "#slide02", function() {
        StatusBar.hide();
        $('.slide-pagination li.active').removeClass('active');
        $('.slide-pagination li.slide02').addClass('active');
        $('.slide-pagination').show();
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 2000);
    });
    $(document).on("pagebeforeshow", "#slide03", function() {
        StatusBar.hide();
        $('.slide-pagination li.active').removeClass('active');
        $('.slide-pagination li.slide03').addClass('active');
        $('.slide-pagination').show();
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 2000);
    });
    $(document).on("pagebeforeshow", "#slide04", function() {
        StatusBar.hide();
        $('.slide-pagination li.active').removeClass('active');
        $('.slide-pagination li.slide04').addClass('active');
        $('.slide-pagination').show();
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 2000);
    });
    $(document).on("pagebeforeshow", "#slide05", function() {
        StatusBar.hide();
        $('.slide-pagination li.active').removeClass('active');
        $('.slide-pagination li.slide05').addClass('active');
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 4000);
    });
    $(document).on("pagebeforeshow", "#slide06", function() {
        StatusBar.hide();
        $('.slide-pagination li.active').removeClass('active');
        $('.slide-pagination li.slide06').addClass('active');
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 4000);
    });
    $(document).on("pagebeforeshow", "#slide07", function() {
        StatusBar.hide();
        $('.slide-pagination li.active').removeClass('active');
        $('.slide-pagination li.slide07').addClass('active');
        clearInterval(slider_auto_rotation);

    });

    $(document).on("pagebeforeshow", "#intro1", function() {
        $('.slide-pagination-intro li.active').removeClass('active');
        $('.slide-pagination-intro li.intro1').addClass('active');
        $('.slide-pagination-intro').show();
        $('#btn-skip').text('SKIP');
        $('html').css('overflow', 'hidden');
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 10000);
    });
    $(document).on("pagebeforeshow", "#intro2", function() {
        $('.slide-pagination-intro li.active').removeClass('active');
        $('.slide-pagination-intro li.intro2').addClass('active');
        $('#btn-skip').text('SKIP');
        $('.slide-pagination-intro').show();
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 10000);
    });
    $(document).on("pagebeforeshow", "#intro3", function() {
        $('.slide-pagination-intro li.active').removeClass('active');
        $('.slide-pagination-intro li.intro3').addClass('active');
        $('#btn-skip').text('SKIP');
        $('.slide-pagination-intro').show();
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 10000);
    });
    $(document).on("pagebeforeshow", "#intro4", function() {
        $('.slide-pagination-intro li.active').removeClass('active');
        $('.slide-pagination-intro li.intro4').addClass('active');
        $('#btn-skip').text('SKIP');
        $('.slide-pagination-intro').show();
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 10000);
    });
    $(document).on("pagebeforeshow", "#intro5", function() {
        $('.slide-pagination-intro li.active').removeClass('active');
        $('.slide-pagination-intro li.intro5').addClass('active');
        $('#btn-skip').text('SKIP');
        $('.slide-pagination-intro').show();
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 10000);
    });
    $(document).on("pagebeforeshow", "#intro6", function() {
        $('.slide-pagination-intro li.active').removeClass('active');
        $('.slide-pagination-intro li.intro6').addClass('active');
        $('.button-skip button').text('SKIP');
        $('.slide-pagination-intro').show();
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 10000);
    });
    $(document).on("pagebeforeshow", "#intro7", function() {
        $('.slide-pagination-intro li.active').removeClass('active');
        $('.slide-pagination-intro li.intro7').addClass('active');
        $('#btn-skip').text('SKIP');
        $('.slide-pagination-intro').show();
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 10000);
    });
    $(document).on("pagebeforeshow", "#intro8", function() {
        $('.slide-pagination-intro li.active').removeClass('active');
        $('.slide-pagination-intro li.intro8').addClass('active');
        $('#btn-skip').text('SKIP');
        $('.slide-pagination-intro').show();
        clearInterval(slider_auto_rotation);
        slider_auto_rotation = setInterval(autoSlide, 10000);
    });
    $(document).on("pagebeforeshow", "#intro9", function() {
        $('.slide-pagination-intro li.active').removeClass('active');
        $('.slide-pagination-intro li.intro9').addClass('active');
        $('#btn-skip').text('NEXT');
        $('html').css('overflow', 'hidden');
        clearInterval(slider_auto_rotation);
    });
    $(document).on("pagebeforeshow", "#user_singup", function() {
        $('.slide-pagination').hide();
        clearInterval(slider_auto_rotation);
        $('#buttons-create-sign').hide();
    });
    $(document).on("pagebeforeshow", "#switch_account_page", function() {
        $('switch_account_intro').attr('disabled', true);
    });

    clearPageForm("forgot_password_page");
    clearPageForm("change_password_page");
    clearPageForm("user_login");
    clearPageForm("user_singup");

    $(document).on('tap','.custome_footer_new ul li', function() {
        var pageID = $(this).data("id");
        if (typeof pageID !== 'undefined') {
            goTO(pageID);
        }
    });
    $(document).on('tap', '#manage_users_btn', function() {
        $("#manage_invite_email").val('');
        $("#save_credit_cards[name=premissions ]:checked").prop("checked", false);
        $("#add_new_address[name=premissions ]:checked").prop("checked", false);
        $("#manage_products_list[name=premissions]:checked").prop("checked", false);
    });
    $(document).on('tap', '#mian_page_conents div', function() {
        var pageID = $(this).data("type");
        if (typeof pageID !== 'undefined') {
            goTO(pageID);
        }
    });
    $(document).on('tap', '.custom_sidebar li', function() {
        var pageID = $(this).data("type");
        if (typeof pageID !== 'undefined') {
            goTO(pageID);
        }
    });
    $(document).on('tap', '.account-setting', function() {
        var pageID = $(this).data("type");
        if (typeof pageID !== 'undefined') {
            goTO(pageID);
        }
    });
    $(document).on('tap', '#setting_conents div', function() {
        var pageID = $(this).data("type");
        if (typeof pageID !== 'undefined') {
            if(pageID=="clear-cache-app"){
                clearAppCache();
            }else{
                goTO(pageID);
            }
        }
    });
    $(document).on('tap', '.search_header', function() {
        searchPrompt();
    });

    $(document).on('tap', '.search_icon_header', function() {
        searchHeaderNew($(this).prev().find('input:text').val());
    });
    $(document).on('tap', '.search_home_icon_header', function() {
        searchSupp($(this).prev().find('input:text').val());
    });
    $(document).on('tap', '.search_icon_menu', function() {
        searchSupp($(this).prev().find('input:text').val());
    });
   /* $(document).on('tap', '.search_saved_suppliers_icon_header', function() {
        searchSavedSupp($(this).prev().find('input:text').val());
    });*/
    $(document).on('tap', '.search_suppliers_products_icon_header', function() {
        searchHeaderNew($(this).prev().find('input:text').val());
    });
    $(document).on('tap', '#question_subject .question_subject', function() {
        $("#question_form .question_subject").text('');
        $("#question_form .question_subject").text(this.innerText);
        $("#question_subject").hide();
        $("#question_form").show();
        event.preventDefault();
    });
    $(document).on('tap', '#request_rep_subject .question_subject', function() {
        $("#request_rep_form .question_subject").text('');
        $("#request_rep_form .question_subject").text(this.innerText);
        $("#request_rep_subject").hide();
        $("#request_rep_form").show();
        event.preventDefault();
    });
    $(document).on('tap', '#back_question_popup', function() {
        $("#question_form").hide();
        $("#question_subject").show();

    });
    $(document).on('tap', '#back_request_rep_popup', function() {
        $("#request_rep_form").hide();
        $("#request_rep_subject").show();

    });
    $(document).on('tap', 'div.checkboxes-and-radios-form', function() {
        $('div.checkboxes-and-radios-form').removeClass('checked').removeClass('fa').removeClass('fa-check');
        $('input.checkboxes-and-radios-form').removeAttr('checked');
        $(this).toggleClass('checked');
        $(this).children().children().attr('checked', 'checked');
        $(this).toggleClass('fa');
        $(this).toggleClass('fa-check');
    });

    $(document).on('tap', 'div.no-company-radio-form', function() {
        $(this).children().removeAttr('checked');
        $(this).toggleClass('checked');
        $(this).children().attr('checked', 'checked');
        $(this).toggleClass('fa');
        $(this).toggleClass('fa-check');
    });

    $(function() {
        if ('ontouchstart' in window) {
            var needsClick = FastClick.prototype.needsClick;
            FastClick.prototype.needsClick = function (target) {
                if ((target.className || '').indexOf('pac-item') > -1) {
                    return true;
                } else if ((target.parentNode.className || '').indexOf('pac-item') > -1) {
                    return true;
                } else {
                    return needsClick.apply(this, arguments);
                }
            };

            FastClick.attach(document.body);
        }
    });
    window.addEventListener('native.keyboardshow', function(e){
        var active_page_id = $.mobile.activePage.attr('id');
        $('#'+active_page_id).css('margin-bottom',+e.keyboardHeight+'px');
        if(device.platform == 'iOS'){
            $('[data-role="header"]').addClass("absolute_postion_header");
            $('[data-role="footer"]').addClass("absolute_postion_footer");
        }
    });
    window.addEventListener('native.keyboardhide', function(e){
        var active_page_id = $.mobile.activePage.attr('id');    
        $('#'+active_page_id).css('margin-bottom','0px'); 
        if(device.platform == 'iOS'){
            $('[data-role="header"]').removeClass("absolute_postion_header"); 
            $('[data-role="footer"]').removeClass("absolute_postion_footer");
            var activePage = $.mobile.activePage.attr('id');
            $("#"+activePage+' [data-role="panel"]').removeAttr( 'style' );
        }
    });
    if(device.platform == 'iOS'){
        $(document).on("focus", ".search_value", function () {
            if (!window.indexedDB) {
                var activePage = $.mobile.activePage.attr('id');
                var offset_top = $("#"+activePage+' [data-role="panel"]').offset().top;
                $("#"+activePage+' [data-role="panel"]').css("top", "-"+offset_top+"px");
                $.mobile.silentScroll(0);
            }

        });
    }
    $(document).on("collapsibleexpand", "[data-role=collapsible]", function() {
        var position = $(this).offset().top;
        $.mobile.silentScroll((position - 60));
    });
    $(document).on("focus",".product_qty", function () {
          var position = $(this).offset().top;
          $('html,body').animate({scrollTop: position - 80}, 500); 
    });
    $(document).on("focus",".input_products_list_number", function () {
        var position = $(this).offset().top;
        $('html,body').animate({scrollTop: position - 80}, 500); 
    });
    $(document).on("click", ".sub_category_listing", function() {
        var position = $(this).offset().top;
        $.mobile.silentScroll((position - 60));
    });
    $(window).resize(function() {
        win_height = $(window).height();
        temp = win_height - 80;
        $('.sidebar-main-content').css({ 'height': temp, 'overflow-y': 'auto' });
    });
    

    $(document).on('tap','.ui-panel-dismiss-open.ui-panel-dismiss-position-left',function(){
        var activePage = $.mobile.activePage.attr('id');
        $("#"+activePage+" [data-role=panel]").panel("close");
    });
    $(document).on('tap','.sidebarmenu',function(){
            var newsupplierID = $(this).data('supplier_id');
            var page_ID = $(this).data('pagetype');
            
            var activePage = $.mobile.activePage.attr('id');
            if(activePage == page_ID && supplierID != newsupplierID){
                supplierID = newsupplierID;
                addValue('supplierID',supplierID);
                if(page_ID != 'supplier_home_page'){
                   $.mobile.changePage("#supplier_home_page", { transition: "none" });

                }
            }
            if(supplierID != newsupplierID){
                supplierID = newsupplierID;
                addValue('supplierID',supplierID);
                
            }
            cartCount();
            if(page_ID!=''){
                goTO(page_ID);
            }
            $("#"+activePage+" [data-role=panel]").panel("close");
    });
    if(device.platform!="browser"){
        var push = PushNotification.init({ "android": { "senderID": "657980447754", "forceShow": "true", "icon": "www/img/push_icon.png" }, "ios": { "alert": "true", "badge": "true", "sound": "true" }, "windows": {} });
        push.on('registration', function(data) {
            addValue("gloveman_push_registrationId", data.registrationId);
        });
        push.on('notification', function(data) {
            showMessage(data.message, data.title, "Ok");
        });
        push.on('error', function(e) {

        });
    }


    $(document).on('swipeleft', '.slider_slide', function(event) {
        if (event.handled !== true){
            var nextpage = $.mobile.activePage.next('[data-role="page"]');
            if (nextpage.length > 0) {
                $('.slide-pagination li.active').removeClass('active');
                $('.slide-pagination li.' + nextpage.attr('id')).addClass('active');
                $.mobile.changePage(nextpage, { transition: "none", reverse: false }, true, true);
            }
            event.handled = true;
        }
        return false;
    });

    $(document).on('swiperight', '.slider_slide', function(event) {
        if (event.handled !== true) {
            var prevpage = $(this).prev('[data-role="page"]');
            if (prevpage.length > 0 && prevpage.attr("id") !== 'add_credit_card') {
                $('.slide-pagination li.active').removeClass('active');
                $('.slide-pagination li.' + prevpage.attr('id')).addClass('active');
                $.mobile.changePage(prevpage, { transition: "none", reverse: true }, true, true);
            }
            event.handled = true;
        }
        return false;
    });

}
function confirmPrimaryAddressSwitch(varThis){
    if($(varThis).val()=='add_new_address'){
        addAddressBook();
    }else{
        if (navigator.notification && navigator.notification.confirm) {
            navigator.notification.confirm(
                'Do you really want to switch on new address?', // message
                function(buttonIndex) {
                    if (buttonIndex == 2) {
                       switchPrimaryAddress(varThis);

                    }else{
                        fetchsidebar();
                    }
                },
                'Confirm', 
                'No,Yes' 
            );
        } else {
            var confrimation_ask = confirm("Do you really want to switch on new address?");
            if (confrimation_ask == true) {
               switchPrimaryAddress(varThis);
            }else{
                fetchsidebar();
            }
        }
    }
}
function switchPrimaryAddress(varThis){
    var address_book_id = $(varThis).val();
    var customers_id    = $(varThis).find(':selected').data('customers-id');
    showLoading();
    $.ajax({
        type: "POST",
        data: "action=setPrimaryAddressBook&address_book_id=" + address_book_id + "&customers_id=" + customers_id, 
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            hideLoading();
            if (dataresult.result == 'error') {
                toastMessage(dataresult.message, "Error", "OK");
                return false;
            } else if (dataresult.result == "success") {
               deleteValueSession("allSuppliers");
               deleteValueSession("sidebar_supplier_session");
               getSuppliers();
               fetchsidebar(true);
               goTO('home_page');
               
            }
        },
        error: function(xhr, error) {
            connectionAlert();
        }
    });

}
function genrateViewfetchSidebar(dataresult) {
    $(".customers_shipping_address_header").removeClass('shipping_address_home');
    if (typeof dataresult.supplier_data!="undefined" && dataresult.supplier_data) {
        sidebar_supplier = [];
        sidebar_supplier = dataresult.supplier_data;
    }
    generate_sidebar();

    if(typeof dataresult.customers_address_book!="undefined" && dataresult.customers_address_book.length>0){
        var customers_shipping_address_header = '<select onChange="confirmPrimaryAddressSwitch(this)" data-role="none" class="customers_shipping_select" name="customers_shipping_select">';
       $.each(dataresult.customers_address_book, function(index, address_book) {
            var selected_default_address_book = '';
            if(address_book.customers_default_address_id=='1'){
                selected_default_address_book = 'selected';    
            }
            customers_shipping_address_header += '<option '+selected_default_address_book+' value="'+address_book.address_book_id+'" data-customers-id="'+address_book.customers_id+'">'+address_book.entry_street_address+', '+address_book.entry_suburb+', '+address_book.entry_postcode+'</option>';
        });
       customers_shipping_address_header += '<option value="add_new_address" data-customers-id="'+address_book.customers_id+'">Add New Address</option>';
       customers_shipping_address_header +='</select>';
        if ($.mobile.activePage.attr('id') == 'home_page') {
            $(".customers_shipping_address_header").html(customers_shipping_address_header);
            $(".customers_shipping_address_header").addClass('shipping_address_home');
        }

    }
    
}
function fetchsidebar(reset_sidebar) {
    if (reset_sidebar == true) {
        sidebar_supplier = [];
    }
    $(".cart_outer").hide();
    $('.search_data').html('');
    var sidebar_supplier_session = JSON.parse(getValueSession("sidebar_supplier_session"));
    if (sidebar_supplier_session && sidebar_supplier_session != null) {
        genrateViewfetchSidebar(sidebar_supplier_session);
    }
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            customers_id = row.customers_id;
            $.ajax({
                type: "POST",
                data: "action=getCurrentSupplierList&customers_id=" + customers_id,
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {
                    if (dataresult.result == 'error') {
                        hideLoading();
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    addValueSession("sidebar_supplier_session", JSON.stringify(dataresult));
                    
                    if(typeof dataresult.custom_suppliers!="undefined" && dataresult.custom_suppliers.length>0){
                        addValue("custom_suppliers", JSON.stringify(dataresult.custom_suppliers));
                    }
                    
                    if (JSON.stringify(sidebar_supplier_session) != JSON.stringify(dataresult)) {
                        genrateViewfetchSidebar(dataresult);
                    }
                    if(getValueSession("redirect_supplier_checkout")!=null){
                        cartPageHTML(getValueSession("redirect_supplier_checkout"));
                        checkOut(getValueSession("redirect_supplier_checkout"));
                        deleteValueSession("redirect_supplier_checkout");
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
function autoSlide() {
    var nextpage = $.mobile.activePage.next('[data-role="page"]');
    if (nextpage.length > 0) {
        $('.slide-pagination li.active').removeClass('active');
        $('.slide-pagination li.' + nextpage.attr('id')).addClass('active');
        $.mobile.changePage(nextpage, { transition: "none", reverse: false });
    }
}
function backtoSlider() {
    deleteValue("slider_show");
    $.mobile.changePage("#slide01", { transition: "none" });
    $('#buttons-create-sign').show();
}
function stopSlideshow() {
    var slider_display_setting = getValue('slider_show');
    if (slider_display_setting != 1) {
        addValue('slider_show', 1);
    }
    $('.stopSlideshow').hide();
}
function skipSlideshow() {
    window.localStorage.setItem('has_run', true);
    $('.stopSlideshow').hide();
    $("#button-skip").hide();
    $('#invite_suppliers_back_btn').hide();
    if (getValue('slider_show') != 1) {
        addValue('slider_show', 1);
    }
    if ($.mobile.activePage.attr('id') == 'home_page') {
        getSuppliers();
        fetchsidebar();
    }
    goTO('home_page');

}
function generate_sidebar() {
    win_height = $(window).height();
    temp = win_height - 80;
    $('.sidebar-main-content').css({ 'height': temp, 'overflow-y': 'auto' });
    $('.search_data').hide();
    $('.menu_data').show();
    var activePage = $.mobile.activePage.attr('id');
    var arrow_class = '';
    $('ul.dynamic_menu').html('');
    if (sidebar_supplier.length > 0) {
        for (var i = 0; i < sidebar_supplier.length; i++) {
            if (supplierID == sidebar_supplier[i].supplier_id) {
                var arrow_class = 'arrow-up-img';
                var display_style = 'block';
            } else {

                var arrow_class = 'arrow-down-img';
                var display_style = 'none';
            }
            var golbal_side_menu_sub = '<ul class="custom_sidebar supplier_' + sidebar_supplier[i].supplier_id + '" style="display:' + display_style + ';">';
            golbal_side_menu_sub += '<li onClick="getSupplierInfo(' + sidebar_supplier[i].supplier_id + ');" data-supplier_id="' + sidebar_supplier[i].supplier_id + '" class="sidebarmenu first_page"><a href="#">Home</a></li>';
            golbal_side_menu_sub += '<li onClick="savedProductsList(' + sidebar_supplier[i].supplier_id + ');" data-supplier_id="' + sidebar_supplier[i].supplier_id + '" class="sidebarmenu products_list_page"><a href="#">My List </a></li>';
            golbal_side_menu_sub += '<li onClick="goToSupplierPage(' + sidebar_supplier[i].supplier_id + ');"  data-supplier_id="' + sidebar_supplier[i].supplier_id + '" class="sidebarmenu products_pages"><a href="#">View products</a></li>';
            golbal_side_menu_sub += '<li onClick="goToCartPage(' + sidebar_supplier[i].supplier_id + ');" data-supplier_id="' + sidebar_supplier[i].supplier_id + '" class="sidebarmenu cart_page"><a href="#">Cart</a></li>';
            golbal_side_menu_sub += '</ul>';

            if (sidebar_supplier[i].image == "noimage.jpg")
                var IMAGE_SRC = 'img/noimage.jpg';
            else
                var IMAGE_SRC = sidebar_supplier[i].image;

            $('ul.dynamic_menu').append('<li><a class="custom_list_a" data-supplier_id="' + sidebar_supplier[i].supplier_id + '" data-supplier_min_amt_msg="' + sidebar_supplier[i].message + '" data-supplier_ext_charges="' + sidebar_supplier[i].extra_charges + '" data-supplier_min_amount="' + sidebar_supplier[i].minimum_amount + '" href="#"><img class="small_logo_side_bar" src="' + IMAGE_SRC + '" alt="" border="0"/> ' + sidebar_supplier[i].name + ' <i class="' + arrow_class + '"></i></a>' + golbal_side_menu_sub + '</li>');
           
        }
    }
    if (device.platform != 'browser') {
        $(".small_logo_side_bar").each(function(index, el) {
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
    $('ul.supplier_'+supplierID+' li.' + activePage).addClass('active');
    hideLoading();
}
$(document).on('tap', '.show-product-btn', function() {
    if ($.trim($(this).text()) === 'Show product') {
        $(this).text('Hide product');
    } else {
        $(this).text('Show product');
    }
    $(this).parent('div').siblings('.show-product-content').slideToggle();
});
function loadManageCreditCardContent(customers_id) {
    if (customers_id > 0) {
        showLoading();
        $.ajax({
            type: "POST",
            data: "action=getCreditCard&credit_card_payment_gateway=promisepay&customers_id=" + customers_id,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                if (dataresult.result == 'error') {
                    hideLoading();
                    toastMessage(dataresult.message, "Error", "OK");
                    return false;
                }
                $("#manage_credit_card_page_contents").html('');
                for (var i = 0; i < dataresult.creditcard_token_payments_cards_id.length; i++) {
                    var card_type_icon = '';
                    if (dataresult.creditcard_token_payments_cards_id[i].card_type == 'MasterCard') {
                        card_type_icon = '<img src="img/mastercard.png" border="0">';
                    } else if (dataresult.creditcard_token_payments_cards_id[i].card_type == 'Visa') {
                        card_type_icon = '<img src="img/visa.png" border="0">';
                    } else if (dataresult.creditcard_token_payments_cards_id[i].card_type == 'American Express') {
                        card_type_icon = '<img src="img/americanexpress.png" border="0">';
                    } else {
                        card_type_icon = '<img src="img/credit_card.png" border="0">';
                    }
                    var manage_card_html = '<div class="order-history-box" id="credit_card_div_' + dataresult.creditcard_token_payments_cards_id[i].TokenCustomerID + '">' +
                        '<div><span class="pb-label">Card Holder Name # :</span> <strong>' + dataresult.creditcard_token_payments_cards_id[i].card_holder_name + '</strong></div>' +
                        '<div><span class="pb-label">Credit Number :</span> <strong>*************' + dataresult.creditcard_token_payments_cards_id[i].card_number + '</strong></div>' +
                        '<div><span class="pb-label">Expiry :</span>' + dataresult.creditcard_token_payments_cards_id[i].card_expiry_month + '/' + dataresult.creditcard_token_payments_cards_id[i].card_expiry_year + '</div>' +
                        '<div><span class="pb-label">Card Type :</span>' + card_type_icon +
                        '<div><a href="#" class="action-btn ui-link delete_credit_card" data-customer_token_id="' + dataresult.creditcard_token_payments_cards_id[i].TokenCustomerID + '">Delete</a>';
                    $("#manage_credit_card_page_contents").append(manage_card_html);
                }
                $("#manage_credit_card_page_contents").append('<div style="text-align:right;"><a href="javascript:goTO(\'add_credit_card\');" class="button_blue" data-mini="true" data-inline="true" data-role="button" data-theme="b">Add Credit Card</a></div>');
                $("#manage_credit_card_page_contents").trigger('create');
                $(document).on('tap', '.delete_credit_card', function() {
                    var ask = confirm("Are you sure to delete this card?");
                    if (ask == true) {
                        showLoading();

                        var token_id = $(this).data('customer_token_id');
                        db.query('SELECT * FROM customers', function(tx, results) {
                            var len = results.rows.length;
                            if (len > 0) {
                                var row = results.rows.item(0);
                                var customer_id = row.customers_id;
                                $.ajax({
                                    type: "POST",
                                    data: "action=deleteCreditCard&customers_id=" + customer_id + '&token_id=' + token_id,
                                    url: CONECTION_SERVER(),
                                    crossDomain: true,
                                    dataType: "json",
                                    success: function(dataresult) {
                                        if (dataresult.result == 'error') {
                                            hideLoading();
                                            toastMessage(dataresult.message, "Error", "OK");
                                            return false;
                                        }
                                        toastMessage("Card deleted sucessfully.");
                                        $("#credit_card_div_" + token_id).remove();
                                        loadManageCreditCardContent();
                                    },
                                    error: function(error) {
                                        hideLoading();
                                    }
                                });
                            } else {

                            }
                        }, successCB, errorCB);
                    }
                });
                hideLoading();
            },
            error: function(error) {
                hideLoading();
            }
        });

    } else {
        hideLoading();
    }
}

function OpenURLInAppBrowser(url) {
    SafariViewController.isAvailable(function(available) {
        if (available && device.platform == 'iOS') {
            SafariViewController.show({
                    url: url,
                    hidden: false,
                    animated: false,
                    transition: 'curl',
                    enterReaderModeIfAvailable: false,
                    tintColor: "#00ffff",
                    barColor: "#007526",
                    controlTintColor: "#ffffff"
                },

                function(result) {

                },
                function(msg) {

                });
        } else {
            cordova.InAppBrowser.open(url, '_blank', 'location=yes, hardwareback=no');
        }
    });
}
function addtoCartArray(cartProductsArray) {
    if(typeof cartProductsArray!=undefined){
        $.each(cartProductsArray, function(i, cartProductsArray) {
            var productSupplierID   = cartProductsArray.supplier_id;
            var pattern_products_id = cartProductsArray.products_id;
            var package_id          = cartProductsArray.package_id;
            var package_name = '';
            if (cartProductsArray.package_name != '') {
                if (cartProductsArray.package_qty > 1) {
                    package_name = " - " + cartProductsArray.package_name + " of " + cartProductsArray.package_qty + " $" + Number($.trim(cartProductsArray.package_price)).toFixed(2);
                } else {
                    package_name = " - " + cartProductsArray.package_name + " $" + Number($.trim(cartProductsArray.package_price)).toFixed(2);
                }
            }
            var products_name = cartProductsArray.products_name + package_name;
            getSingleColumn("customers_basket_quantity", "customers_basket", "WHERE supplier_id=" + productSupplierID + " AND products_id = "+ convertField(pattern_products_id), function(data) {
                if (data == '') {
                    var sql = "INSERT INTO customers_basket (supplier_id, customers_id, products_id, products_name, customers_basket_quantity, package_id, package_product_id, final_price, products_tax) VALUES (" + productSupplierID + ", " + customers_id + ", " + convertField(pattern_products_id) + "," + convertField(products_name) + "," + Number(cartProductsArray.products_quantity) + "," + cartProductsArray.package_id + "," + cartProductsArray.package_products_id + "," + Number($.trim(cartProductsArray.price)).toFixed(2) + "," + cartProductsArray.products_tax + ")";
                        
                        db.execute(sql, successCB, errorCB);
                       
                        if (typeof cartProductsArray.products_options != 'undefined') {
                            $.each(cartProductsArray.products_options, function(key, products_options) {
                                var sql = "INSERT INTO customers_basket_attributes (supplier_id, customers_id, products_id, products_options_id, products_options, products_options_value_id, products_options_value) VALUES (" + productSupplierID + ", " + customers_id + ", " + convertField(pattern_products_id) + "," + products_options.products_options_id + "," + convertField(products_options.products_options_name) + "," + products_options.products_options_values_id + "," + convertField(products_options.products_options_values_name) + ")";
                                    
                                    db.execute(sql, successCB, errorCB);
                                   
                            });
                        }

                } else {
                    var sql = "UPDATE customers_basket SET customers_basket_quantity = " + Number(cartProductsArray.products_quantity) + ", products_name =" + convertField(products_name) + ", package_id = " + cartProductsArray.package_id + ", final_price = " + Number($.trim(cartProductsArray.price)).toFixed(2) + ", products_tax = " + cartProductsArray.products_tax + " WHERE supplier_id=" + productSupplierID + " AND products_id = " + convertField(pattern_products_id);
                        db.execute(sql, successCB, errorCB);

                        
                        
                }
            });
            cartCount();
        });
    }
}
function reorderProducts(orders_id, customers_id) {
    if (customers_id > 0 && orders_id > 0) {
        showLoading("Processing your request...");
        $.ajax({
            type: "POST",
            data: "action=reorderProducts&customers_id=" + customers_id + "&orders_id=" + orders_id,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                if (dataresult.result == 'error') {
                    hideLoading();
                    toastMessage(dataresult.message, "Error", "OK");
                    return false;
                } else if (dataresult.result == 'success') {
                    addtoCartArray(dataresult.reorderProducts);
                    setTimeout(function() {
                        toastMessageLong("Re-Order products successfully added into cart", "Success", "Ok");
                        hideLoading();
                        goToCartPage(dataresult.supplier_id);
                    }, 2000);

                } else {
                    hideLoading();
                    toastMessage("Technical error occurred please try again.", "Ok");
                }
            },
            error: function(error) {
                connectionAlert();
            }
        });
    } else {
        toastMessage("Invalid action againts Reorder.", "Error", "OK");
    }
}
function pintInvoicePDF(order_url, orders_id) {
    var orders_id = (typeof orders_id != "undefined") ? orders_id : Date.now();
    showLoading();
    pdf.htmlToPDF({
        url: order_url,
        documentSize: "A4",
        landscape: "portrait",
        type: "share",
        fileName: "invoice-" + orders_id + ".pdf",
    }, hideLoading, function() {
        hideLoading();
        toastMessage("Some error occurred please try again.");
    });
}
function openOrderPDF(order_url, orders_id) {
    var orders_id = (typeof orders_id != "undefined") ? orders_id : Date.now();

    if (pdf.htmlToPDF && device.platform != 'browser') {
        if (getValue("account_type") == 'user') {
            pintInvoicePDF(order_url, orders_id);
        } else {
            var options = {
                androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
                title: 'What would you like to do?',
                buttonLabels: ['View Invoice', 'Print Invoice PDF'],
                addCancelButtonWithLabel: 'Cancel',
                position: [20, 40]
            };
            window.plugins.actionsheet.show(options, function(buttonIndex) {
                setTimeout(function() {
                    if (buttonIndex == 1) {
                        OpenURLInAppBrowser(order_url);
                    } else if (buttonIndex == 2) {
                        pintInvoicePDF(order_url, orders_id);
                    }

                });
            });
        }
    } else {
        OpenURLInAppBrowser(order_url);
    }
}

function laodFeedData(customers_id) {
    if (customers_id > 0) {

        var orderHistory = JSON.parse(getValue("orderHistory" + customers_id));
        if (orderHistory && orderHistory != null) {
            genrateViewLoadFeeData(orderHistory, customers_id);
        } else {
            showLoading("Loading your orders data...");
        }
        $.ajax({
            type: "POST",
            data: "action=orderHistory&customers_id=" + customers_id,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                if (dataresult.result == 'error') {
                    hideLoading();
                    toastMessage(dataresult.message, "Error", "OK");
                    return false;
                }
                addValue("orderHistory" + customers_id, JSON.stringify(dataresult));
                if (JSON.stringify(orderHistory) != JSON.stringify(dataresult)) {
                    genrateViewLoadFeeData(dataresult, customers_id);
                }
                hideLoading();

            },
            error: function(error) {
                if (orderHistory == null) {
                    $("#feed_page_conents").html('<p style="text-align:center;"><img class="error_image" src="img/cannot.png" onClick="laodFeedData(' + customers_id + ');" /></p>');
                    $("#feed_page_conents").trigger('create');
                }
                hideLoading();
            }
        });

    } else {
        hideLoading();
    }
}

function genrateViewLoadFeeData(dataresult, customers_id) {
    document.getElementById("feed_page_conents").innerHTML = loading_image;
    document.getElementById("feed_page_conents").innerHTML = "";
    for (var i = 0; i < dataresult.history_details.length; i++) {
        var show_product_html = "";
        var orders_id = dataresult.history_details[i].orders_id;
        var products_html = '<div class="order-history-box">' +
            '<div><span class="pb-label">Order # :</span> <strong>' + orders_id + '</strong><a data-orders-id="' + orders_id + '" href="javascript:void(0)" onClick="openOrderPDF(\'' + dataresult.history_details[i].invoice_url + '\',\'' + orders_id + '\')" class="order_button ui-link">Invoice</a></div>' +
            '<div><span class="pb-label">Supplier :</span> <strong>' + dataresult.history_details[i].supplier_name + '</strong></div>' +
            '<div><span class="pb-label">Order Amount :</span>' + dataresult.history_details[i].order_total_text + '<a data-orders-id="' + orders_id + '" href="javascript:reorderProducts(' + orders_id + ',' + customers_id + ')" class="order_button ui-link">Re-Order</a></div>' +
            '<div><span class="pb-label">Current Status :</span>  <strong>' + dataresult.history_details[i].current_order_status + '</strong></div>';
        products_html += '<h2>Order Status History: </h2><div class="history_main">';
        for (var j = 0; j < dataresult.history_details[i].status_history.length; j++) {
            var order_date = dataresult.history_details[i].status_history[j].date_added;
            var history_details = '<div class="history_detail"><span class="pb-label">' + dataresult.history_details[i].status_history[j].orders_status_name + '</span> <strong> ' + order_date + ' </strong> </div>';
            products_html += history_details;
        }

        for (var k = 0; k < dataresult.history_details[i].product_details.length; k++) {
            show_product_html += '<li>' + dataresult.history_details[i].product_details[k].products_name + '</li>';
        }
        products_html += '</div><div><a href="#" class="action-btn ui-link show-product-btn">Show product</a></div><div class="show-product-content"><ol style="margin-left:15px;padding:0;">' + show_product_html + '</ol></div><div class="clear_both"></div></div>';
        $("#feed_page_conents").append(products_html);
    }
    hideLoading();
}

function editRemoveUser(user_id) {
    var email = $.trim($("#email" + user_id).text());
    var permissions = $.trim($("#permissions" + user_id).text());
    var user_status = $.trim($("#status" + user_id).css('background-color'));
    var use_credit_card      = permissions.match(/Use Saved Credit Cards/g);
    var add_address          = permissions.match(/Add Address/g);
    var manage_products_list = permissions.match(/Manage Products List/g);
    var username = $("#username" + user_id).text();
    var access_new_suppliers    = permissions.match(/Access New Suppliers/g);
    var manage_custom_suppliers = permissions.match(/Manage Custom Suppliers/g);
    
    $("#user_info_container" + user_id).html('');
    $("#manage_edit_email").text(email);
    $("#manage_edit_email").val(user_id);
    $("#user_edit_btn" + user_id).attr('onClick', "editUser(" + user_id + ")");
    $("#user_edit_btn" + user_id).html('');

    var user_html = '<div style=" margin-bottom: 4px;font-weight: bold;">' + username + '</div>' +
        '<div class="edit-users-label">' +
    '<table align="center" cellspacing="3" cellpadding="3">' +
        '<tr>' +
            '<td class="text-left">' +
                '<input type="checkbox" data-role="none" name="manage_user_status" class="custome_checkbox_css" id="manage_user_status' + user_id + '"  value="1"  >' +
                '<label for="manage_user_status' + user_id + '">ACTIVE</label>' +
            '</td>' +
         '</tr>' +
         '<tr>' +
            '<td class="text-left">' +
                '<input type="checkbox" data-role="none" name="premissions" class="custome_checkbox_css" id="manage_edit_save_credit_cards' + user_id + '" value="use_credit_card" >' +
                '<label for="manage_edit_save_credit_cards' + user_id + '">USE CREDIT CARD</label>' +
             '</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="text-left">' +
                '<input type="checkbox" data-role="none" name="premissions" class="custome_checkbox_css" id="manage_edit_add_new_address' + user_id + '"  value="add_address">' +
                '<label for="manage_edit_add_new_address' + user_id + '">ADD ADDRESS</label>' +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="text-left">' +
                '<input type="checkbox" data-role="none" name="premissions" class="custome_checkbox_css" id="manage_edit_manage_products_list' + user_id + '"  value="manage_products_list">' +
                '<label for="manage_edit_manage_products_list' + user_id + '">MANAGE PRODUCTS LIST</label>' +
             '</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="text-left">' +
                '<input type="checkbox" data-role="none" name="premissions" class="custome_checkbox_css" id="manage_edit_access_new_suppliers' + user_id + '"  value="access_new_suppliers">' +
                '<label for="manage_edit_access_new_suppliers' + user_id + '">ACCESS NEW SUPPLIERS</label>' +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="text-left">' +
                '<input type="checkbox" data-role="none" name="premissions" class="custome_checkbox_css" id="manage_edit_manage_custom_suppliers' + user_id + '"  value="manage_custom_suppliers">' +
                '<label for="manage_edit_manage_custom_suppliers' + user_id + '">MANAGE CUSTOM SUPPLIERS</label>' +
             '</td>' +
          '</tr>' +
      '</table>' +
'</div>';
    var edit_btn_html = '<div class="save-user-btn">SAVE</div>';
    $("#user_info_container" + user_id).append(user_html);
    $("#user_edit_btn" + user_id).append(edit_btn_html);
    if (user_status == 'rgb(0, 128, 0)') {
        $("#manage_user_status" + user_id).prop("checked", true);
    } else {
        $("#manage_user_status" + user_id).prop("checked", false);
    }
    if (use_credit_card) {
        $("#manage_edit_save_credit_cards" + user_id).prop("checked", true);
    } else {
        $("#manage_edit_save_credit_cards" + user_id).prop("checked", false);
    }
    if (add_address) {
        $("#manage_edit_add_new_address" + user_id).prop("checked", true);
    } else {
        $("#manage_edit_add_new_address" + user_id).prop("checked", false);
    }
    if (manage_products_list) {
        $("#manage_edit_manage_products_list" + user_id).prop("checked", true);
    } else {
        $("#manage_edit_manage_products_list" + user_id).prop("checked", false);
    }
    if (access_new_suppliers) {
        $("#manage_edit_access_new_suppliers" + user_id).prop("checked", true);
    } else {
        $("#manage_edit_access_new_suppliers" + user_id).prop("checked", false);
    }
    if (manage_custom_suppliers) {
        $("#manage_edit_manage_custom_suppliers" + user_id).prop("checked", true);
    } else {
        $("#manage_edit_manage_custom_suppliers" + user_id).prop("checked", false);
    }
   
    
}

function loadCustomerUsers(customers_id) {
    if (customers_id > 0) {
        showLoading();
        $.ajax({
            type: "POST",
            data: "action=loadCustomerUsers&customers_id=" + customers_id,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                if (dataresult.result == 'error') {
                    hideLoading();
                    toastMessage(dataresult.message, "Error", "OK");
                    return false;
                }
                $("#manage_users_page_conents").html('');
                for (var i = 0; i < dataresult.manage_users_data.length; i++) {
                    var show_product_html = "";
                    var id = dataresult.manage_users_data[i].user_customers_id;
                    var status_color;
                    var use_credit_card = dataresult.manage_users_data[i].user_permission.match(/use_credit_card/g);
                    var add_address = dataresult.manage_users_data[i].user_permission.match(/add_address/g);
                    var manage_products_list = dataresult.manage_users_data[i].user_permission.match(/manage_products_list/g);
                    var access_new_suppliers = dataresult.manage_users_data[i].user_permission.match(/access_new_suppliers/g);
                    var manage_custom_suppliers = dataresult.manage_users_data[i].user_permission.match(/manage_custom_suppliers/g);

                    var user_permission = [];
                    if (use_credit_card) {
                        use_credit_card = ' Use Saved Credit Cards';
                        user_permission.push(use_credit_card);
                    }
                    if (add_address) {
                        add_address = " Add Address";
                        user_permission.push(add_address);
                    }
                    if (manage_products_list) {
                        manage_products_list = " Manage Products List";
                        user_permission.push(manage_products_list);
                    }
                    if (access_new_suppliers) {
                        access_new_suppliers = " Access New Suppliers";
                        user_permission.push(access_new_suppliers);
                    }
                    if (manage_custom_suppliers) {
                        manage_custom_suppliers = " Manage Custom Suppliers";
                        user_permission.push(manage_custom_suppliers);
                    }


                    if (dataresult.manage_users_data[i].user_status == '1') {
                        status_color = 'green';
                    } else {
                        status_color = 'red';
                    }
                    //
                    var users_html = '<div class="manage-users-box"><div id="status' + id + '" class="user-status" style="background-color:' + status_color + '"></div>' +
                        '<div class="user-avatar-container">';
                    users_html += '<i class="fa fa-user-circle-o fa-5x " aria-hidden="true"></i>';

                    users_html += '</div>';
                    users_html += '<div id="user_info_container' + id + '" class="user-info-container"><div id="username' + id + '" style=" margin-bottom: 4px;margin-top: 10px;font-weight: bold;">' + dataresult.manage_users_data[i].customers_firstname + ' ' + dataresult.manage_users_data[i].customers_lastname + '</div>' +
                        '<div id="email' + id + '">' + dataresult.manage_users_data[i].customers_email_address + '</div>' +
                        '<div style=" margin-bottom: 4px;font-weight: bold;">Permissions:</div>' +
                        '<div  id="permissions' + id + '">' + user_permission + '</div></div>';



                    users_html += '<div id="user_edit_btn' + id + '" class="user-edit" onClick=editRemoveUser(' + dataresult.manage_users_data[i].user_customers_id + ')><i class="fa fa-pencil-square-o fa-2x"></i></div>';
                    $("#manage_users_page_conents").append(users_html);
                }
                hideLoading();
            },
            error: function(error) {
                hideLoading();
            }
        });

    } else {
        hideLoading();
    }
}

function loadCustomerAccounts(customers_id, customers_firstname, customers_lastname) {
    if (customers_id > 0) {
        showLoading();
        $.ajax({
            type: "POST",
            data: "action=loadCustomerAccounts&customers_id=" + customers_id,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                if (dataresult.result == 'error') {
                    hideLoading();
                    toastMessage(dataresult.message, "Error", "OK");
                    return false;
                }
                $(".manage_accounts_page_conents").html('');
                if (typeof dataresult.customers_type != "undefined" && dataresult.customers_type == '1') {
                    var page_conents = '<div class="manage-accounts-box" onClick="updateAcc();">' +
                        '<div class="pb-label pb-label-company">I want to Create</div>' +
                        '<div class="pb-label pb-label-type">Owner/Head Chef Account</div></div>';

                } else {
                    var page_conents = '<div class="manage-accounts-box" onClick=switchAccount(' + customers_id + ')>' +
                        '<div class="pb-label pb-label-company">' + dataresult.customers_company + '</div>' +
                        '<div class="pb-label">' + dataresult.customers_street_address + ', ' + dataresult.customers_suburb + ', ' + dataresult.customers_postcode + '</div>' +
                        '<div class="pb-label pb-label-type">Owner</div></div>';

                }
                $(".manage_accounts_page_conents").append(page_conents);
                for (var i = 0; i < dataresult.manage_accounts_data.length; i++) {
                    var show_page_conents_html = "";
                    var id = dataresult.manage_accounts_data[i].user_customers_id;
                    var show_page_conents_html = '<div class="manage-accounts-box" onClick=switchAccount(' + dataresult.manage_accounts_data[i].customers_id + ')>' +
                        '<div class="pb-label pb-label-company">' + dataresult.manage_accounts_data[i].entry_company + '</div>' +
                        '<div class="pb-label">' + dataresult.manage_accounts_data[i].entry_street_address + ', ' + dataresult.manage_accounts_data[i].entry_suburb + ', ' + dataresult.manage_accounts_data[i].entry_postcode + '</div>' +
                        '<div class="pb-label pb-label-type">USER</div></div>';
                    $(".manage_accounts_page_conents").append(show_page_conents_html);
                }
                hideLoading();
            },
            error: function(error) {
                hideLoading();
            }
        });

    } else {
        hideLoading();
    }
}

function searchPrompt() {
    if (window.navigator && window.navigator.notification) {
        window.navigator.notification.prompt(
            'Please enter product name',
            function(answer) {
                if (answer.buttonIndex === 2 && $.trim(answer.input1) != '') {
                    searchProduct(answer.input1);
                } else if (answer.buttonIndex !== 1) {
                    toastMessage("Product name is required");
                    searchPrompt();
                }
            },
            'Search Product', ['Cancel', 'Search'],
            new String()
        );
    } else {
        var product_name = prompt('Please enter product name ', new String());
        if ($.trim(product_name) != '') {
            searchProduct(product_name);
        } else if ($.trim(product_name) == '' && product_name != null) {
            toastMessage("Product name is required");
            searchPrompt();
        }

    }
}

function searchHeaderNew(searchValue) {
    if ($.trim(searchValue) != '') {
        searchProduct(searchValue);
        $(".search_products_value").blur();
    } else if ($.trim(searchValue) == '' && searchValue != null) {
        toastMessage("Product name is required");
    }
}

/*function searchMenu(searchValue) {
    if ($.trim(searchValue) != '') {
        searchSupplier(searchValue);

    } else if ($.trim(searchValue) == '' && searchValue != null) {
        toastMessage("Supplier name is required");
    }
}*/

function searchSupp(searchValue) {
    if ($.trim(searchValue) != '') {
        searchProductsandSuppliers(searchValue);
        $(".search_home_value").blur();
    }else if ($.trim(searchValue) == '' && searchValue != null) {
        toastMessage("Please enter the value to search.");
    }
}

function clearSignupForm(pageID) {
    $("#" + pageID + " form")[0].reset();
    $("#" + pageID + " form .abn_search_list").html("");
    $("#" + pageID + " input.abn_search").css("border", "none");
    $("#" + pageID + " form .abn_search_div").show();
    $("#" + pageID + " form .abn_num_div").hide();
    $('div.checkboxes-and-radios').removeClass('checked').removeClass('fa').removeClass('fa-check');
    $('input.checkboxes-and-radios').removeAttr('checked');
    document.getElementById('singup_avatar').src = 'img/addPhoto.png';
}

function clearPageForm(pageID) {
    $(document).on("pagecreate", "#" + pageID, function() {
        $("#" + pageID + " form input[type=text],input[type=email],input[type=number],input[type=password],input[type=tel]").val('');
    });
}

function createDataBase() {
    var sql = [
        "CREATE TABLE IF NOT EXISTS customers (customers_id INTEGER NOT NULL PRIMARY KEY,customers_email_address TEXT NOT NULL,customers_firstname TEXT,customers_lastname TEXT, customers_default_address_id INTEGER,verification INTEGER)",

        "CREATE TABLE IF NOT EXISTS products_list (products_id INTEGER NOT NULL,customers_id INTEGER NOT NULL)",

        "CREATE TABLE IF NOT EXISTS customers_basket (customers_basket_id INTEGER NOT NULL PRIMARY KEY, supplier_id INTEGER NOT NULL, customers_id INTEGER NOT NULL, products_id TEXT, products_name TEXT, customers_basket_quantity INTEGER NOT NULL, package_id INTEGER NOT NULL, package_product_id INTEGER NOT NULL, final_price REAL NOT NULL, products_tax REAL NOT NULL)",

        "CREATE TABLE IF NOT EXISTS customers_custom_suppliers_basket (customers_basket_id INTEGER NOT NULL PRIMARY KEY, supplier_id INTEGER NOT NULL, customers_id INTEGER NOT NULL, products_id TEXT NOT NULL, products_name TEXT, customers_basket_quantity INTEGER NOT NULL, package_id INTEGER , package_product_id INTEGER , final_price REAL NOT NULL, products_tax REAL)",

        "CREATE TABLE IF NOT EXISTS customers_basket_attributes (customers_basket_attributes_id INTEGER NOT NULL PRIMARY KEY, supplier_id INTEGER NOT NULL, customers_id INTEGER NOT NULL,products_id TEXT,products_options_id INTEGER NOT NULL, products_options TEXT NOT NULL, products_options_value_id INTEGER NOT NULL, products_options_value TEXT NOT NULL)",

        "CREATE TABLE IF NOT EXISTS notification_setting (field_id INTEGER NOT NULL PRIMARY KEY, field_name VARCHAR NOT NULL, field_value VARCHAR NOT NULL)",
    ];
    db.execute(sql, successCB, errorCB);
    if (db.version() == "") {
        db.changeVersion("", "1", sql, successCB, errorCB);
    }

}

function logoutME() {
    if (navigator.notification && navigator.notification.confirm) {
        navigator.notification.confirm(
            'Do you really want to logout?', // message
            function(buttonIndex) {
                if (buttonIndex == 2) {
                    removeUserData();
                    window.localStorage.setItem('sliderIntro', false);
                    window.localStorage.setItem('showSuppliers', false);

                }
            },
            'Logout', // title
            'No,Yes' // buttonLabels
        );
    } else {
        var confrimation_ask = confirm("Do you really want to logout?");
        if (confrimation_ask == true) {
            removeUserData();
            window.localStorage.setItem('sliderIntro', false);
            window.localStorage.setItem('showSuppliers', false);

        }
    }
}

function getSupplierLogo() {
    $('.supplier_logo').html('<img style="max-height:32px;width:32px;" width="32" height="32" src="img/loading.gif" border="0">');
    $.ajax({
        type: "POST",
        data: "action=getSupplierLogo&supplier_id=" + supplierID,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            var alt_txt = dataresult.supplier_name;
            if (dataresult.supplier_logo == 'img/logo-new.png') {
                var IMAGE_SRC = 'img/logo.png';
                $('.supplier_logo').html('<img src="' + IMAGE_SRC + '"  alt="' + alt_txt + ' border="0">');
            } else if (dataresult.supplier_logo == null) {
                $('.supplier_logo').html('<h3>' + alt_txt + '</h3>');
            } else {
                var IMAGE_SRC = dataresult.supplier_logo;
                $('.supplier_logo').html('<img src="' + IMAGE_SRC + '" alt="' + alt_txt + '" border="0">');
            }

        },
        error: function(xhr, error) {
            $('.supplier_logo').html('<img src="img/logo-new.png" alt="ONEzoo" border="0">');
            connectionAlert();
        }
    });
}

function removeUserData(exit) {
    db.execute("DELETE FROM customers", successCB, errorCB);
    db.execute("DELETE FROM products_list", successCB, errorCB);
    db.execute("DELETE FROM customers_basket", successCB, errorCB);
    db.execute("DELETE FROM customers_basket_attributes", successCB, errorCB);
    localStorage.clear();
    sessionStorage.clear();
    addValue('slider_show', 0);
    sidebar_supplier = [];
    recently_viewed_supp = [];
    customers_name = '';
    customers_mobile = '';
    customers_trading_name = '';
    document.getElementById("home_page_contents").innerHTML = "";
    if (device.platform != 'iOS' && !exit) {
        goTO('user_login');
        navigator.app.exitApp();
    } else
        goTO('user_login');
}

function checkUserLogin(tx) {
    
    available_suppliers_html = '';
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;

        if (len > 0) {
            var row = results.rows.item(0);
            customerID = row.customers_id;
            customerName = row.customers_firstname;
            var activePage = $.mobile.activePage.attr('id');
            switch (activePage) {
                default: registerpushNotification();
                $("div.welcomeuser p").html("Welcome " + outputSting(row.customers_firstname) + ' ' + outputSting(row.customers_lastname));
                if (checkout_redirect == true) {
                    checkout_redirect = false;
                    goTO('checkout_page');
                } else {
                    skipSlideshow();
                }
                break;
            }
        } else {
            goTO("user_login");
        }

    }, successCB, errorCB);

}

function addMyListButton() {
    $(".button_with_search_a,.load_privious_product").remove();
    $("#products_list .ui-filterable").append('<a class="button_with_search_a" href="javascript:loadPrivousOrderProducts()"><img src="img/gray_iocn.png" width="18" style="position:relative!important;width:18px!important;height:auto!important;top:5px!important;right:4px!important;" alt="Previous Orders"></a>');
}
function silentgetSaveProductsList(customers_id, user_email) {
    $.ajax({
        type: "POST",
        data: "action=updateUserData&email=" + user_email + "&customers_id=" + customers_id + "&supplier_id=" + supplierID+"&request_type=silent",
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function (dataresult) {
            if (dataresult.result == 'error') {
                return false;
            }
            db.execute("DELETE FROM products_list", successCB, errorCB);
            if (dataresult.products_list) {
                var insert_value = '';
                for (var i = 0; i < dataresult.products_list.length; i++) {
                    insert_value += "(" + dataresult.customers_id + ", " + dataresult.products_list[i] + ") ,";
                }
                insert_value = insert_value.replace(/,\s*$/, "");
                db.execute("INSERT INTO products_list (customers_id, products_id) VALUES "+insert_value , successCB, errorCB);
            }
            addValueSession("save_products_list"+supplierID, JSON.stringify(dataresult));
        }
    });
}
function updateData(customers_id, user_email, is_product_list,loadingshow) {
    //addMyListButton();
    if (category_supplier_type == 'all_suppliers') supplierID = 'all_saved_suppliers';

    var save_products_list = JSON.parse(getValueSession("save_products_list"+supplierID));
    if (save_products_list && Object.keys(save_products_list).length > 0) {
        genrateSaveProductsList(save_products_list);
    }else {
        loadingshow !== false ? showLoading() : '';
    }
    $.ajax({
        type: "POST",
        data: "action=updateUserData&email=" + user_email + "&customers_id=" + customers_id + "&supplier_id=" + supplierID,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            if (dataresult.result == 'error') {
                hideLoading();
                toastMessage(dataresult.message, "Error", "OK");
                return false;
            }


            if (getValue("account_type") !== "user") {
                addValue("account_entry", dataresult.customers_entry_company);
                $("div.entry-name-welcomeuser").html(outputSting(getValue("account_entry")) + "<div><img src='img/arrows.png'></div>");
                $("div.welcomeuser").html("Welcome " + outputSting(dataresult.customers_firstname) + ' ' + outputSting(dataresult.customers_lastname));
                var sql = "UPDATE customers SET customers_id = " + dataresult.customers_id + ", customers_email_address = " + convertField(dataresult.customers_email_address) + ", customers_firstname = " + convertField(dataresult.customers_firstname) + ",customers_lastname = " + convertField(dataresult.customers_lastname) + " WHERE customers_id = " + dataresult.customers_id + "";
                db.execute(sql, successCB, errorCB);
            }
            db.execute("DELETE FROM products_list", successCB, errorCB);
            if (dataresult.products_list) {
                var insert_value = '';
                for (var i = 0; i < dataresult.products_list.length; i++) {
                    insert_value += "(" + dataresult.customers_id + ", " + dataresult.products_list[i] + ") ,";
                }
                insert_value = insert_value.replace(/,\s*$/, "");
                db.execute("INSERT INTO products_list (customers_id, products_id) VALUES "+insert_value , successCB, errorCB);
            }
            
            addValueSession("save_products_list"+supplierID, JSON.stringify(dataresult));
            if (save_products_list==null || typeof save_products_list.products_list == 'undefined') {
                genrateSaveProductsList(dataresult);
            }
            if (!is_product_list)
                checkUserLogin();
            
            hideLoading();
            


        },
        error: function(error) {
            hideLoading();
            $("#products_listview").html('<p style="text-align:center;"><img class="error_image" src="img/cannot.png" onClick="updateData(' + customers_id + ',\'' + user_email + '\');" /></p>');
            $("#products_listview").trigger('create');

        }
    });

}
function customMoreDetails(products_id) {
    $("#after"+products_id).slideToggle("slow");
    $("#custom_list_id-"+products_id+ " div.drop_down_custom").find('i').toggleClass('fa-angle-down fa-angle-right');
}
function genrateSaveProductsList(dataresult) {
    $products_listview =  $("#products_listview");
    $products_listview.html(''); 
    var products_html = '';
    if (typeof dataresult.products_list !="undefined" && dataresult.products_list.length>0) {
        for (var i = 0; i < dataresult.products_list.length; i++) {
            if (dataresult.products_image[i] == "noimage.jpg"){
                var IMAGE_SRC = 'img/noimage.jpg';
            }
            else{
                var IMAGE_SRC = dataresult.products_image[i];
            }
            var active_supplier_option = $("#saved_products").hasClass("active_supplier_option");
            if (active_supplier_option && supplierID!='all_saved_suppliers') {
                var products_id          = dataresult.products_list[i];
                var products_suppl_id    = dataresult.products_suppl_id[i];
                var products_description = '';
                var products_packages    = '';
                var products_attributes  = '';
                var moreDetails = JSON.parse(dataresult.moreDetails[i]);
                
                if (moreDetails.products_description != '' && moreDetails.products_description != null) {
                    products_description = moreDetails.products_description;
                    products_description = $(products_description).text().replace("Products Description:", "");
                    products_description = '<h3>'+dataresult.products_name[i]+'</h3><h4 style="margin:0px;">Product Description:</h4><span>' + products_description + '</span>';
                }

                if (moreDetails.products_packages != '') {
                    products_packages = moreDetails.products_packages;
                }
                if (moreDetails.products_attributes != '') {
                    products_attributes = moreDetails.products_attributes;
                }
                var addtoCart_icon = '<a data-role="none" href="javascript:addCart(' + products_id + ',' + products_suppl_id + ')" class="add_to_cart" style="color:#fff !important;"><i class="fa fa-cart-plus fa-2x"></i></a>';
                products_html += '<li id="custom_list_id-'+products_id+'" data-id="' + products_id + '" class="custom_listview_li" data-supplier-id="' + products_suppl_id + '">' +
                '<div class="custom_listview custom_list_image">'+
                '<img class = "product_image" width="80" height="80" src="'+IMAGE_SRC+'" onerror="this.onerror=null;this.src=\'img/noimage.jpg\';">'+
                '</div>'+
                '<div class="custom_listview custom_list_name" id="custom_list_name'+ products_id + '"><div class="sortable_custom">' + dataresult.products_name[i] + ' <span id="package_name' + products_id + '"></span></br><i style="font-weight:normal" id="options_name' + products_id + '"></i></div>'+
                '<div id="listprice' + products_id + '" class="custom_list_price">$' +Number(dataresult.products_price[i]).toFixed(2) + '</div>'+
                '</div>'+

                '<div class="custom_listview custom_list_qty" id="custom_list_qty'+ products_id + '"><input type="number" id="product_qty'+products_id+'" data-role="none" pattern="[0-9]*" class="input_products_list_number" data-product-id="' + products_id + '" data-pro_supplier_id="' + products_suppl_id + '" onkeypress="return isNumberKey(event);"></div>'+
                '<div class="custom_listview drop_down_custom" onClick="customMoreDetails(' + products_id + ')"><i class="fa fa-angle-right fa-2x" aria-hidden="true"></i></div>'+
                '<input type="hidden" id="product_name' + dataresult.products_list[i] + '" value="' + dataresult.products_name[i] + '">' +
                '<div id="after'+products_id+'" class="more_details more_details_custom">' +
                '<div class="products_description details_custom">' +products_description+'</div>'+
                '<div class="clear_both"></div><div class="product_question" onClick="productQuestion(' + products_id + ',' + convertField(dataresult.products_name[i]) + ')"><a>ASK A QUESTION ABOUT THIS PRODUCT</a></div>' +
                '<div class="ui-field-contain">' + products_packages + '</div>' +
                '<div class="ui-field-contain">' + products_attributes + '</div>' +
                '<div class="ui-field-contain">' + addtoCart_icon + '</div>' +
                '</div>'+
                '<div class="custom_action_button">'+
                    '<button onClick="removeList(' + dataresult.products_list[i] + ');" data-role="none" class="custom_item_button custom_item_button_delete"><i class="fa fa-trash"></i> Delete</button>'+
                    '<button data-role="none" class="custom_item_button custom_item_button_cancel"><i class="fa fa-times"></i> Cancel</button>'+
                '</div>'+
                '</li>';
            } else {
                products_html += '<li><a class="icon-' + dataresult.products_list[i] + ' prdt-icon" href="javascript:moreDetails(' + dataresult.products_list[i] + ',' + dataresult.products_suppl_id[i] + ')"><img alt="" class= "product_image" width="80" height="80" src="' + IMAGE_SRC + '" onerror="this.onerror=null;this.src=\'img/noimage.jpg\';"><h3>' + dataresult.products_name[i] + '</h3><p id="listprice' + dataresult.products_list[i] + '">Price $' + Number(dataresult.products_price[i]).toFixed(2) + '</p><p id="listprices' + dataresult.products_list[i] + '" class="products_store_name">' + dataresult.products_store_name[i] + '</p></a><div id="after' + dataresult.products_list[i] + '" class="more_details"></div><input type="hidden" id="product_name' + dataresult.products_list[i] + '" value="' + dataresult.products_name[i] + '"></li>';
            }
            
            
            if ((i+1)==dataresult.products_list.length) {
                cartPageHTML();
                $products_listview.append(products_html);
                $products_listview .listview("refresh").trigger('create');
                hideLoading();
                setTimeout(function(){ 
                    if (active_supplier_option && supplierID!='all_saved_suppliers') {
                        MySavedProductsListDemo();
                    }
                }, 1000);
                
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
            }
        }
        
        if (active_supplier_option && supplierID!='all_saved_suppliers') {
            
             /*Add to Cart*/
            $("li.custom_listview_li .input_products_list_number",$products_listview).on("blur", function(e) {
                if($(this).val()>0){
                    addCart($(this).data("product-id"), $(this).data("pro_supplier_id"),false,true);
                }
            });
            $("li.custom_listview_li .input_products_list_number",$products_listview).on("keypress", function(e) {
                if($(this).val()>0 && (e.keyCode == 13 || e.keyCode === 10 || e.keyCode==9)){
                    addCart($(this).data("product-id"), $(this).data("pro_supplier_id"),false,true);
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
                        addCart(products_id,$(this).data("supplier-id"),false,true);
                    }else{
                        var package_id = $("#p" + products_id + " option:selected").val();
                        if (typeof package_id == 'undefined' || package_id == '' || package_id == 0) {
                            package_id = 0;
                        }else {
                            package_id = package_id;
                        }
                        var options_structure_complete = '';
                        var options_structure_text_complete = '';
                        var product_unique_code = '';
                        var products_options_array = [];
                        $('.new_option' + products_id).each(function(i, selected) {
                                var options_structure       = null;
                                var options_structure_text  = null;
                                var options_id          = $(selected).find('input.option_id_hidden').val();
                                var options_text        = $(selected).find('input.option_value_hidden').val();
                                var options_value_id    = $(selected).find('select option:selected').val();
                                var options_value_text  = $(selected).find('select option:selected').text();
                            
                                options_structure = "{" + options_id + "}" + options_value_id;
                            product_unique_code        += options_value_id + "-";
                            options_structure_complete += options_structure;

                            options_structure_text       = "{" + options_text + "}" + options_value_text;
                            options_structure_text_complete += options_structure_text;
                        });
                        var pattern_products_id = $.trim(products_id+options_structure_complete);

                        removeCart(pattern_products_id,true);
                    }
                }else{
                    deleteProductsListSlide(products_id,this);
                }
                
            });
            /*Swipe action Right*/
            $("li.custom_listview_li",$products_listview ).on("swiperight", function (e) {
                event.preventDefault();
                event.stopPropagation();
                $(".custom_action_button", this).hide();
                $("li.custom_listview_li").css( "background-color", "" );
                $("li.custom_listview_li").css( "opacity", "1");
                var products_id = $(this).data("id");
                var product_qty = $("#product_qty"+products_id).val();
                $("#product_qty"+products_id).val(Number(product_qty)+1);
                addCart(products_id, $(this).data("supplier-id"),false,true);
            });
            
            /*Cancel Swipe Delete*/
            $(".custom_item_button_cancel").on("tap", function () {
                event.preventDefault();
                event.stopPropagation();
                $(this).parent(".custom_action_button").hide();
                $("li.custom_listview_li").css( "background-color", "" );
                $("li.custom_listview_li").css( "opacity", "1");
            });

            /*Select default Package and Attribute*/
            var loop_i  = 1;
            $("li.custom_listview_li",$products_listview).each(function (index) {
                
                    var package_name = '';
                    var products_id  = $(this).data("id");
                    var package_id   = getValue("package_id"+products_id);
                    
                    if(package_id>0){
                        $('#p'+products_id+' option[value="'+package_id+'"]').attr("selected","selected");
                        $('#p'+products_id).selectmenu('refresh', true);
                    }
                    package_name = $("#p"+products_id+" option:selected").text();
                    if (package_name !== 'undefined' && package_name !== '') {
                        $("#package_name"+products_id).html(' ('+$.trim(package_name)+')');
                    }
                    var products_options        = JSON.parse(getValue("products_options"+products_id));
                    
                    var options_structure_complete = '';
                    if(products_options!=null && products_options.length>0){
                        for(i=0; i<products_options.length; i++){
                                var options_id       = products_options[i].options_id;
                                var options_value_id = products_options[i].options_value_id;
                                $('.new_option' + products_id).each(function(i, selected) {
                                    $(selected).find('select[name="id['+options_id+']"] option[value="'+options_value_id+'"]').attr("selected","selected");
                                    $(selected).find('select[name="id['+options_id+']"]').selectmenu('refresh', true);
                                });
                                var options_structure       = "{" + options_id + "}" + options_value_id;
                                options_structure_complete += options_structure;
                        }
                    }
                    var options_name = [];
                    $('.new_option' + products_id).each(function(i, selected) {
                        var options_name_text = $(selected).find('select option:selected').text();
                        options_name.push(" "+options_name_text);
                    });
                    if(options_name.length>0){
                        $("#options_name"+products_id).html($.trim(options_name));
                    }
                    
                    var pattern_products_id = $.trim(products_id+options_structure_complete);
                    
                    getSingleColumn("customers_basket_quantity", "customers_basket", "WHERE supplier_id="+supplierID+" AND products_id = " + convertField(pattern_products_id), function(data) {
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
                    if(package_id>0 || (products_options!=null && products_options.length>0)){    
                        (function(loop_i) {
                            setTimeout(function() {
                                addCart(products_id,supplierID,true);
                             }, 500*loop_i);
                        })(loop_i);
                        loop_i++; 
                    }
            });
            
            
            
        }
        /*Open Images in Popup*/
        $(".product_image").on("tap", function () {
            $("#Gallery_image img.popphoto").attr({
                src: $(this).attr('src')
            });
            setTimeout(function(){
                $("#Gallery_image").popup({ positionTo: "window" }).popup('open');
            }, 100);
        });

    } else {
        setTimeout(function(){ hideLoading(); }, 1000);
        $products_listview .html('<p class="alert alert-info" style="padding: 10px;">Sorry currently no products in my saved products list.</p>');
        $products_listview .listview("refresh").trigger('create');
    }
    

}
function MySavedProductsListDemo(){
    if(getValue("MySavedProductsListDemo")==null && $("#products_listview li").length > 0){
        var imagePopupPosition   = $("#products_listview li:first-child").position();
        var products_id          = $("#products_listview li:first-child").data("id");
       
        var package_namePosition = $("#package_name"+products_id).position();
        var productqtyPosition   = $("#custom_list_qty"+products_id).position();
        
        $( "#popupArrowfastCheckout" ).popup("open", { 
            x:(window.innerWidth-50), 
            y:(window.innerHeight-50)
        });
        $("#popupArrowfastCheckout").on("popupafterclose", function( event, ui ) {
             $("#tooltipProductImage" ).popup("open", { 
                x:imagePopupPosition.left, 
                y:imagePopupPosition.top+50
            });  
        });
        $("#tooltipProductImage").on("popupafterclose", function( event, ui ) {
             
             $("#tooltipSlide" ).popup("open", { 
                x:package_namePosition.left, 
                y:imagePopupPosition.top+30
            });  
        });
        $("#tooltipSlide").on("popupafterclose", function( event, ui ) {
            
             $("#tooltipTapholdDelete" ).popup("open", { 
                x:package_namePosition.left+20,
                y:imagePopupPosition.top+30
            });  
        });
        $("#tooltipTapholdDelete").on("popupafterclose", function( event, ui ) {
             $("#tooltipMoreDetails" ).popup("open", { 
                x:productqtyPosition.left+75, 
                y:imagePopupPosition.top+30
            });  
            addValue("MySavedProductsListDemo",1); 
        });
    }
}
function deleteProductsListSlide(products_id,varThis){
    if($("#after"+products_id).is(':hidden')){
        $(".custom_action_button", varThis).show(); 
    }else{
        customMoreDetails(products_id);
        $(".custom_action_button", varThis).show();
    }
    $("li.custom_listview_li").css( "background-color", "" );
    $("li.custom_listview_li").css( "opacity", "1");
}
function genrateViewPrivousOrderProducts(dataresult, customerID) {
  document.getElementById("products_listview").innerHTML = "";
  if(typeof dataresult.history_details.length!="undefined"){  
        for (var i = 0; i < dataresult.history_details.length; i++) {
            var show_product_html = "";
            var orders_id = dataresult.history_details[i].orders_id;
            var products_html = '<div class="order-history-box">' +
                '<div><span class="pb-label">Order # :</span> <strong>' + orders_id + '</strong><a data-orders-id="' + orders_id + '" href="javascript:void(0)" onClick="openOrderPDF(\'' + dataresult.history_details[i].invoice_url + '\',\'' + orders_id + '\')" class="order_button ui-link">Invoice</a></div>' +
                '<div><span class="pb-label">Supplier :</span> <strong>' + dataresult.history_details[i].supplier_name + '</strong></div>' +
                '<div><span class="pb-label">Order Amount :</span>' + dataresult.history_details[i].order_total_text + '<a data-orders-id="' + orders_id + '" href="javascript:reorderProducts(' + orders_id + ',' + customerID + ')" class="order_button ui-link">Re-Order</a></div>' +
                '<div><span class="pb-label">Current Status :</span>  <strong>' + dataresult.history_details[i].current_order_status + '</strong></div>';
            products_html += '<h2>Order Status History: </h2><div class="history_main">';
            for (var j = 0; j < dataresult.history_details[i].status_history.length; j++) {
                var order_date = dataresult.history_details[i].status_history[j].date_added;
                var history_details = '<div class="history_detail"><span class="pb-label">' + dataresult.history_details[i].status_history[j].orders_status_name + '</span> <strong> ' + order_date + ' </strong> </div>';
                products_html += history_details;
            }

            for (var k = 0; k < dataresult.history_details[i].product_details.length; k++) {
                show_product_html += '<li>' + dataresult.history_details[i].product_details[k].products_name + '</li>';
            }
            products_html += '</div><div><a href="#" class="action-btn ui-link show-product-btn">Show product</a></div><div class="show-product-content"><ol style="margin-left:15px;padding:0;">' + show_product_html + '</ol></div><div class="clear_both"></div></div>';
            $("#products_listview").append(products_html);
            if(dataresult.history_details.length==(i+1)){
                $("#products_listview").listview().listview("refresh");
                hideLoading();
            }
        }
    
    }else{
        hideLoading();
    }

    
    
}

function loadPrivousOrderProducts() {
    document.getElementById("category_collaps").innerHTML = "";
    document.getElementById("products_listview").innerHTML = "";
    document.getElementById("supplier_products_listview_search").innerHTML = "";

    $(".minimum_shipping.progress-bar-container").html('');
    $(".supplier_page_tabs").removeClass("active_supplier_option");
    $("#supplier_history").addClass("active_supplier_option");
    $("#products_listview_container").show();
    $("#cart_page").hide();

    if (category_supplier_type == 'all_suppliers') supplierID = 'all_saved_suppliers';
    var orderHistory = JSON.parse(getValueSession("orderHistory" + customerID + "-" + supplierID));
    if (orderHistory && orderHistory != null) {
        genrateViewPrivousOrderProducts(orderHistory, customerID);
    } else {
        showLoading("Loading your orders data...");
    }

    $.ajax({
        type: "POST",
        data: "action=orderHistory&customers_id=" + customerID + "&supplier_id=" + supplierID,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            if (dataresult.result == 'error') {
                hideLoading();
                toastMessage(dataresult.message, "Error", "OK");
                return false;
            }
            addValueSession("orderHistory" + customerID + "-" + supplierID, JSON.stringify(dataresult));
            if (JSON.stringify(orderHistory) != JSON.stringify(dataresult)) {
                genrateViewPrivousOrderProducts(dataresult, customerID);
            }
        },
        error: function(xhr, error) {
            connectionAlert();
        }
    });
}

function guestValidate(email) {
    showLoading("Checking your account");
    $.ajax({
        type: "POST",
        data: "action=validateGuest&email=" + email,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {

            if (dataresult.result == "error") {
                hideLoading();
                toastMessage(dataresult.message, "Error", "OK");

            } else {
                removeUserData(true);
                customers_mobile = dataresult.customers_mobile;
                addValue("available_accounts", dataresult.customers_accounts);
                addValue('account_entry', dataresult.customers_entry_company);
                var sql = "INSERT INTO customers (customers_id, customers_email_address,customers_firstname,customers_lastname) VALUES (" + dataresult.customers_id + ", " + convertField(dataresult.customers_email_address) + "," + convertField(dataresult.customers_firstname) + "," + convertField(dataresult.customers_lastname) + ")";
                db.execute(sql, checkUserLogin, errorCB);
                addValue("access_token", dataresult.access_token);
                hideLoading();
            }
        },
        error: function(error) {
            connectionAlert();
        }
    });
}

function userValidate() {
    var user_email = $.trim($("#user_email").val());
    var user_password = $.trim($("#user_password").val());
    if (validateEmail(user_email) == false || user_email == '') {
        toastMessage("Enter valid email address", "Alert", "Ok");
        return false;
    }
    if (user_password == '') {
        toastMessage("Enter your password", "Alert", "Ok");
        return false;
    }
    showLoading("Checking your account");
    $.ajax({
        type: "POST",
        data: "action=validateUser&email=" + user_email + "&password=" + user_password,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            var activePage = $.mobile.activePage.attr('id');
            if (dataresult.result == "error") {
                hideLoading();
                toastMessage(dataresult.message, "Error", "OK");
            } else {
                removeUserData(true);
                customers_mobile = dataresult.customers_mobile;
                addValue("available_accounts", dataresult.customers_accounts);
                addValue('account_entry', dataresult.customers_entry_company);

                var sql = "INSERT INTO customers (customers_id, customers_email_address,customers_firstname,customers_lastname) VALUES (" + dataresult.customers_id + ", " + convertField(dataresult.customers_email_address) + "," + convertField(dataresult.customers_firstname) + "," + convertField(dataresult.customers_lastname) + ")";
                db.execute(sql, checkUserLogin, errorCB);
                //goTO("home_page");
                addValue("access_token", dataresult.access_token);
                hideLoading();

            }
        },
        error: function(error) {
            connectionAlert();
        }
    });
}

function capturePhoto() {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 75,
        destinationType: Camera.DestinationType.FILE_URI,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 500,
        targetHeight: 500,
        correctOrientation: true
    });
}

function getPhoto(source) {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 75,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
        //allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 500,
        targetHeight: 500,
        correctOrientation: true
    });
}

function onPhotoURISuccess(imageURI) {
    var registrationAvatar = document.getElementById('singup_avatar');
    registrationAvatar.style.display = 'block';
    registrationAvatar.src = imageURI;
    uploadPhoto(imageURI);
}

function gotPhoto(imageUri) {
    window.resolveLocalFileSystemURI(imageUri, function(fileEntry) {
        fileEntry.file(function(fileObj) {

        });
    });
}

function uploadPhoto(imageURI) {
    var options = new FileUploadOptions();
    options.fileKey = "file";
    var userid = 'avatar';
    var imagefilename = userid + Number(new Date()) + ".jpg";
    document.getElementById('singup_avatar').setAttribute('data-text', SERVER_API_PATH + '/imgUpload/' + imagefilename)
    options.fileName = imagefilename;
    options.mimeType = "image/jpg";
    var params = new Object();
    params.imageURI = imageURI;
    options.params = params;
    options.chunkedMode = false;
    var ft = new FileTransfer();
    var url = CONECTION_SERVER_UPLOAD();
    ft.upload(imageURI, url, win, fail, options);
    $.mobile.changePage("#user_singup", { transition: "none" });

}

function win(r) {
    //alert("Image uploaded successfully!!");
}

function fail(error) {
    toastMessage("There was an error uploading image");
}

function onFail(message) {
    toastMessage('Failed because: ' + message);
    $.mobile.changePage("#user_singup", { transition: "none" });
}

//FORGOT PASSWORD

function verifyEmail() {
    showLoading();
    $.ajax({
        type: "POST",
        data: "action=emailVerify&guest_email=" + guest_email + "&guest_id=" + guest_id + "&verify_email=" + 1,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            hideLoading();
            if (dataresult.result == "error") {
                toastMessage(dataresult.message, "Error", "OK");
            } else {
                toastMessage(dataresult.message, "Success", "OK");
            }
        },
        error: function(error) {
            connectionAlert();
        }
    });
}

function verifyPincodeRequest() {
    var errors = [];
    var change_user_email = $.trim($("#forgot_user_email").val());
    var change_user_code = $.trim($("#change_user_pincode").val());

    if (change_user_code.length < 1)
        errors[errors.length] = "Invalid pinde code / password .";
    if (errors.length > 0) {
        mutipleErrors(errors);
        return false;
    } else {
        showLoading();
        $.ajax({
            type: "POST",
            data: "action=verifyPincode&change_user_email=" + change_user_email + "&verification_code=" + change_user_code,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                hideLoading();
                if (dataresult.result == "error") {
                    toastMessage(dataresult.message, "Error", "OK");
                } else {
                    toastMessage(dataresult.message, "Success", "OK");
                    $.trim($("#change_user_email").val(change_user_email));
                    $.trim($("#change_user_code").val(change_user_code));
                    //goTO("reset_password_page");
                    $.mobile.changePage("#reset_password_page", { transition: "none" });
                    
                }
            },
            error: function(error) {
                connectionAlert();
            }
        });

    }
}

function changePasswordRequest(purpose) {
    var errors = [];
    var change_user_email = $.trim($("#change_user_email").val());
    var change_user_code = $.trim($("#change_user_code").val());
    if (purpose == 'forgot') {
        var chnage_new_password = $.trim($("#change_new_password").val());
        var chnage_repeat_password = $.trim($("#change_repeat_password").val());
    }
    if (purpose == 'change') {
        var chnage_new_password = $.trim($("#chnage_new_password").val());
        var chnage_repeat_password = $.trim($("#chnage_repeat_password").val());
    }
    if (change_user_email.length == 0 || validateEmail(change_user_email) == false)
        errors[errors.length] = "Enter valid email address";
    if (change_user_code.length < 1)
        errors[errors.length] = "Invalid pinde code / password .";
    if (chnage_new_password.length < 6)
        errors[errors.length] = "Minimum 6 chracter password required.";
    if (chnage_repeat_password.length < 6)
        errors[errors.length] = "Repeat password required.";
    if (chnage_repeat_password !== chnage_new_password)
        errors[errors.length] = "New and Repeat password not match.";
    if (errors.length > 0) {
        mutipleErrors(errors);
        return false;
    } else {
        showLoading();
        $.ajax({
            type: "POST",
            data: "action=changePassword&change_user_email=" + change_user_email + "&verification_code=" + change_user_code + "&newpassword=" + chnage_new_password + "&repeat_newpassword=" + chnage_repeat_password,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                hideLoading();
                if (dataresult.result == "error") {
                    toastMessage(dataresult.message, "Error", "OK");
                } else {
                    toastMessage(dataresult.message, "Success", "OK");
                    $.trim($("#user_email").val(change_user_email));
                    $.trim($("#user_password").val(chnage_new_password));
                    userValidate();
                }
            },
            error: function(error) {
                connectionAlert();
            }
        });

    }

}

$(document).on('tap', '.arrow-go-back', function() {
    $.mobile.changePage("#user_singup", { transition: "none" });
    
});

var COUNT_START = 10 * 1 * 60; // tenths * seconds * hours
var count = COUNT_START;
var playing = false;

function playTimer() {
    playing = true;
}

function resetTimer() {
    playing = false;
    count = COUNT_START;
}

function countdown() {
    displayTime();
    if (count == 0) {
        playing = false;
        $('#resend-button').removeAttr('disabled');
    } else if (playing) {
        setTimeout(countdown, 100);
        count--;
    } else {
        setTimeout(countdown, 100);
    }
}
countdown();

function displayTime() {

    var tenths = count;
    var sec = Math.floor(tenths / 10);
    var hours = Math.floor(sec / 3600);
    sec -= hours * (3600);
    var mins = Math.floor(sec / 60);
    sec -= mins * (60);

    if (hours < 1) {
        $('#time_left').text(LeadingZero(mins) + ':' + LeadingZero(sec));
    } else {
        $('#time_left').text(hours + ':' + LeadingZero(mins) + ':' + LeadingZero(sec));
    }
}

function LeadingZero(Time) {
    return (Time < 10) ? "0" + Time : +Time;
}


function inviteSupplier(userContactsToInvite) {
    userContactsToInvite.forEach(function(userContactToInvite) {
        email = userContactToInvite.email;
        if (email != "undefined" && email != '') {
            db.query('SELECT * FROM customers', function(ts, results) {
                var len = results.rows.length;
                if (len > 0) {
                    var row = results.rows.item(0);
                    var customers_id = row.customers_id;
                    $.ajax({
                        type: "POST",
                        data: "action=inviteSupplierMail&email=" + email + "&customer_id=" + customers_id,
                        url: CONECTION_SERVER(),
                        crossDomain: true,
                        dataType: "json",
                        success: function(dataresult) {
                            toastMessage('E-mail sent');
                            emails = [];
                        },
                        error: function(error) {
                            toastMessage('Error sending email');

                        }
                    });
                }
            });
        } else {
            //toastMessage('No e-mail address');
        }
    })
}

function sendInvitation(form) {
    var invite_email = $.trim($("#" + form + " #invite_email").val());
    var company = $.trim($("#" + form + " #invite_company").val());
    var name = $.trim($("#" + form + " #invite_name").val());
    var invite_mobile = $.trim($("#" + form + " #invite_mobile").val());
    var supplier_info = {
        email: invite_email,
        company: company,
        name: name,
        mobile: invite_mobile
    };

    var wrongField = false;
    if (name.length < 2) {
        toastMessage("Name is required");
        wrongField = true;
    } else if (company.length < 2) {
        toastMessage("Company is required");
        wrongField = true;
    } else if (invite_mobile.length < 2 && invite_email.length < 2) {
        toastMessage("Mobile or email address is required");
        wrongField = true;
    } else if (length.invite_email > 2 && validateEmail(invite_email) == false) {
        toastMessage("Invalid Email address.");
        wrongField = true;
    }
    if (!wrongField) {
        var contactToSave = [];
        contactToSave.push(supplier_info);
        if (invite_mobile.length > 2) sendSms(contactToSave);
        inviteSupplier(contactToSave);
        saveInvitedSupplier(contactToSave);
    }
}

function saveInvitedSupplier(contactsToSave) {
    contactsToSave.forEach(function(contactToSave) {
        var supplier_info = contactToSave;
        db.query('SELECT * FROM customers', function(ts, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                var customers_id = row.customers_id;
                $.ajax({
                    type: "POST",
                    data: "action=saveInvitedSupplier&email=" + supplier_info.email + "&customer_id=" + customers_id + "&mobile=" + supplier_info.mobile + "&company=" + supplier_info.company + "&name=" + supplier_info.name,
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        //toastMessage('E-mail sent');
                        //emails = [];
                    },
                    error: function(error) {
                        connectionAlert();
                        //toastMessage('Save supplier failed');

                    }
                });
            }
        });
    });
}

function forgotPasswordRequest() {
    var user_email = $.trim($("#forgot_user_email").val());
    if (validateEmail(user_email) == false || user_email == '') {
        toastMessage("Enter valid email address", "Alert", "Ok");
        return false;
    }
    showLoading();
    $.ajax({
        type: "POST",
        data: "action=resetPassword&email=" + user_email,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            hideLoading();
            if (dataresult.result == "error") {
                toastMessage(dataresult.message, "Error", "OK");
            } else {
                resetTimer();
                countdown();
                playTimer();
                $.mobile.changePage("#reset_pincode_page", { transition: "none" });
                toastMessageLong(dataresult.message, "Success", "OK");
                $('#reset-button').attr('disabled', 'true');
                $('#resend-button').attr('disabled', 'true');
            }
        },
        error: function(error) {
            connectionAlert();
        }
    });
}



function moreDetails(id, pro_supplier_id) {

    if (pro_supplier_id == "" && pro_supplier_id != 0) {
        pro_supplier_id = supplierID;
    }
    $(".ui-icon-carat-d").removeClass("ui-icon-carat-d").addClass("ui-icon-carat-r");
    if ($("#after" + id).html() != "") {
        $(".icon-" + id).removeClass("ui-icon-delete").removeClass("red-bg").removeClass("ui-icon-carat-d").addClass("ui-icon-carat-r");
        $("#after" + id).slideUp();
        $(".more_details").html('');
        $(".more_details").css({
            padding: '0px'
        });
        return false;
    }
    $(".more_details").html('');

    $(".prdt-icon").removeClass("ui-icon-delete").removeClass("red-bg").removeClass("ui-icon-carat-d").addClass("ui-icon-carat-r");
    showLoading();
    $.ajax({
        type: "POST",
        data: "action=moreDetails&products_id=" + id + "&supplier_id=" + pro_supplier_id + "&new_version=" + 1,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            hideLoading();
            if (dataresult.result == "error") {
                toastMessage(dataresult.message, "Error", "OK");
            } else {

                if (dataresult.products_description != '' && dataresult.products_description != null) {
                    $("#after" + id).append('<div class="collapse-text-container">' + dataresult.products_description + '</div>');
                    if (dataresult.products_description.length > 550) {
                        $('.collapse-text-container').addClass('collapse-text');
                        var textToCollapse = $('#after' + id + ' .products_description');
                        textToCollapse.addClass('three-points-collapse');
                        $('.collapse-text-container').after('<a class="show-more-collapse-text"">Show more...</a>');
                    }
                }
                $("#after" + id).append('<div class="product_question" onClick="productQuestion(' + id + ',' + convertField(dataresult.products_name) + ')"><a>ASK A QUESTION ABOUT THIS PRODUCT</a></div>');
                if (dataresult.products_packages != '') {
                    $("#after" + id).append('<div class="ui-field-contain">' + dataresult.products_packages + '</div>');
                }
                if (dataresult.products_attributes != '') {
                    $("#after" + id).append('<div class="ui-field-contain">' + dataresult.products_attributes + '</div>');
                }

                getSingleColumn("products_id", "products_list", " WHERE products_id = " + id, function(data) {
                    var add_to_list_html = '';
                    if (data == '') {
                        add_to_list_html = '<a style="color:#fff!important;" href="javascript:addList(' + id + ')" class="add_to_list" id="add_to_list' + id + '">Add To List</a>';
                    } else {
                        add_to_list_html = '<a style="color:#fff!important;" href="javascript:removeList(' + id + ')" class="remove_to_list" id="' + id + '">Remove From List</a>';
                    }
                    var product_qty = '<input type="number" data-product-id="' + id + '" data-pro_supplier_id="' + pro_supplier_id + '" data-role="none" class="add_to_cart_quanity product_qty" id="product_qty' + id + '" pattern="[0-9]*" name="product_qty" value=1>';

                    $("#after" + id).append('<p id="customlistprice' + id + '" class="custom-listprice"></p>');
                    $("#after" + id).append('<div class="action_div">' + add_to_list_html + '<a data-product-id="' + id + '" data-package-id="' + pro_supplier_id + '" href="javascript:addCart(' + id + ',' + pro_supplier_id + ')" class="add_to_cart">Add To Cart</a><div style="float:right;">' + product_qty + '</div></div><div class="clear_both"></div>');
                    $(".more_details").trigger('create');
                    $(".icon-" + id).addClass("ui-icon-delete red-bg").removeClass("ui-icon-carat-r");
                    $(".icon-" + id).scrollView();
                    $("#product_qty" + id).bind("tap", function() {
                        if($(this).val()>0){
                            addValueSession("temp_product_qty"+$(this).data("product-id"),$(this).val());
                        }
                        $(this).val('');
                    });
                    $("#product_qty" + id).on("blur keyup", function(e) {
                        if (e.keyCode == 8 || e.keyCode == 46) {
                            $(this).val('');

                        } else {
                            var  temp_product_qty = getValueSession("temp_product_qty"+$(this).data("product-id"));
                            temp_product_qty!=null?temp_product_qty:1;
                            
                            $(this).val() == '' ? $(this).val(temp_product_qty):'';
                            deleteValueSession("temp_product_qty"+$(this).data("product-id"));
                        }
                        if (e.keyCode == 13 || e.keyCode === 10) {
                            addCart($(this).data("product-id"), $(this).data("pro_supplier_id"));
                        }
                    });

                    $("#after" + id).css({
                        padding: '10px'
                    });
                    $(".more_details").slideDown(400);
                    var products_id  = id;
                    var package_name = '';
                    var package_id   = getValue("package_id"+products_id);
                    if(package_id==null && typeof dataresult.last_order_package_id!='undefined' && dataresult.last_order_package_id!=''){
                        package_id   = dataresult.last_order_package_id;
                    }
                    if(package_id>0){
                        $('#p'+products_id+' option[value="'+package_id+'"]').attr("selected","selected");
                        $('#p'+products_id).selectmenu('refresh', true);
                    }
                    
                    var products_options   = JSON.parse(getValue("products_options"+products_id));
                    if(products_options==null && typeof dataresult.last_order_products_options!='undefined' && dataresult.last_order_products_options!=''){
                       products_options  = dataresult.last_order_products_options;
                    }
                    var options_structure_complete = '';
                    if(products_options!=null && products_options.length>0){
                        for(i=0; i<products_options.length; i++){
                                var options_id       = products_options[i].options_id;
                                var options_value_id = products_options[i].options_value_id;
                                $('.new_option' + products_id).each(function(i, selected) {
                                    $(selected).find('select[name="id['+options_id+']"] option[value="'+options_value_id+'"]').attr("selected","selected");
                                    $(selected).find('select[name="id['+options_id+']"]').selectmenu('refresh', true);
                                });
                                var options_structure       = "{" + options_id + "}" + options_value_id;
                                options_structure_complete += options_structure;
                        }

                    }
                    
                    var pattern_products_id = $.trim(products_id+options_structure_complete);
                    
                    getSingleColumn("customers_basket_quantity", "customers_basket", "WHERE supplier_id="+supplierID+" AND products_id = " + convertField(pattern_products_id), function(data) {
                        if(Number(data.customers_basket_quantity)>0){
                            $("#product_qty"+products_id).val(Number(data.customers_basket_quantity));
                            $("#product_qty"+products_id).addClass("input_products_list_color_green");
                            $("#product_qty"+products_id).removeClass("input_products_list_color_white");
                            
                        }else{
                            $("#product_qty"+products_id).addClass("input_products_list_color_white");
                            $("#product_qty"+products_id).removeClass("input_products_list_color_green");
                        }
                    });
                    if(package_id>0 || (products_options!=null && products_options.length>0)){    
                        addCart(products_id,supplierID,true);
                    }
                });


            }
        },
        error: function(error) {
            connectionAlert();
        }
    });
}


$(document).on('tap', '.show-more-collapse-text', function() {
    $(this).prev().toggleClass('collapse-text');
    $(this).text(function(i, v) {
        return v === 'Show more...' ? 'Show less...' : 'Show more...'
    });
});
$(document).on('tap','ul.dynamic_menu li a.custom_list_a', function() {
    var activePage = $.mobile.activePage.attr('id');
    var newsupplierID = $(this).data('supplier_id');
    $('#' + activePage+' ul.dynamic_menu li ul').not(this).each(function(index) {
        if (!$(this).hasClass('supplier_'+ newsupplierID) && $(this).css('display') != 'none') {
            $(this).slideToggle();
            $(this).find('i').toggleClass('arrow-up-img arrow-down-img');
        }
    });
    $(this).siblings('.custom_sidebar').slideToggle();
    $(this).find('i').toggleClass('arrow-up-img arrow-down-img');
    return false;
});

function convertField(data) {
    var data = data.toString().replace(/'/g, "&#39;").replace(/"/g, "&quot;");
    return "'" + $.trim(data.toString().replace(/'/g, "//'")) + "'";
}

function addList(p_id) {
    showLoading();
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            $.ajax({
                type: "POST",
                data: "action=addtoProductList&products_id=" + p_id + "&customers_id=" + row.customers_id + "&supplier_id=" + supplierID,
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {
                    hideLoading();
                    if (dataresult.result == 'error') {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    } else {
                        silentgetSaveProductsList(row.customers_id, row.customers_email_address);
                        toastMessage(dataresult.message, "Message");
                        if (dataresult.result == "success"){
                            $("#add_to_list"+p_id).css("display", "none");
                        }
                    }
                },
                error: function(error) {
                    connectionAlert();
                }
            });
        } else {
            goTO('user_login');
        }
    }, successCB, errorCB);

}

function removeList(p_id) {
    if (window.navigator && window.navigator.notification) {
        navigator.notification.confirm('Do you really want to delete this product?', function(buttonIndex) {
            if (buttonIndex == 2) {
                removeListprocess(p_id);
            }

        }, 'Confirm', 'No,Yes');
    } else {
        var ask = confirm("Do you really want to delete this product?");
        if (ask == true) {
            removeListprocess(p_id);
        }
    }
}

function removeListprocess(p_id) {
    showLoading();
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            $.ajax({
                type: "POST",
                data: "action=removetoProductList&products_id=" + p_id + "&customers_id=" + row.customers_id,
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {
                    hideLoading();
                    if (dataresult.result == 'error') {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    } else if (dataresult.result == "success") {
                        db.execute("DELETE FROM products_list where products_id=" + p_id, successCB, errorCB);
                        silentgetSaveProductsList(row.customers_id, row.customers_email_address);
                        $("#after" + p_id).parent("li").remove();
                        $("#products_listview").listview().listview("refresh");
                    }
                },
                error: function(error) {
                    connectionAlert();
                }
            });
        } else {
            goTO('user_login');
        }
    }, successCB, errorCB);
}

function connectionAlert(id) {
    hideLoading();
    toastMessageLong("Can't connect right now. Please try again later.", "Error", "OK");
}

function closemoreDetails(id) {
    $("#after" + id).slideUp();
    var active_supplier_option = $("#saved_products").hasClass("active_supplier_option");
    if($.mobile.activePage.attr('id')=='supplier_home_page' && !active_supplier_option){ 
        $(".prdt-icon").removeClass("ui-icon-delete").removeClass("red-bg").removeClass("ui-icon-carat-d").addClass("ui-icon-carat-r");
        $("#after" + id).html('');
        $(".icon-" + id).scrollView();
    }
}

function changeprice(id, p_id, s_id) {
    var value = $("#p" + p_id + " option:selected").text().split("$").pop();
    var active_supplier_option = $("#saved_products").hasClass("active_supplier_option");
    if ($.mobile.activePage.attr('id') == 'supplier_home_page' && active_supplier_option && category_supplier_type != 'all_suppliers') {
        $('#listprice' + p_id).html("$" + Number($.trim(value)).toFixed(2));
    } else {
        $('#listprice' + p_id).html("Price $" + Number($.trim(value)).toFixed(2));
    }
    addCart(p_id, s_id, 'true');
}
function showLoading(message, title) {
    hideLoading();
    if (typeof (message) != "undefined" && message != null)
        message = message;
    else
        message = 'Please wait...';
    if (SpinnerPlugin && SpinnerPlugin.activityStart && device.platform != 'browser') {
        var options = {
            dimBackground: true
        };
        SpinnerPlugin.activityStart(message, options);

    } else {
        setTimeout(function () {
            $.mobile.loading('show', {
                text: message,
                textVisible: true,
                theme: 'b',
                html: ""
            })
        }, 1);
    }
}

function hideLoading() {
    if (SpinnerPlugin && SpinnerPlugin.activityStop && device.platform != 'browser') {
        SpinnerPlugin.activityStop();
    } else {
        $.mobile.loading('hide');
    }
}

function emptyCategory() {
    $(".supplier_page_tabs").removeClass("active_supplier_option");
    $("#all_products").addClass("active_supplier_option");

    document.getElementById("category_collaps").innerHTML = "";
    document.getElementById("products_listview").innerHTML = "";
    document.getElementById("supplier_products_listview_search").innerHTML = "";
    $("#products_listview_container, #cart_page").hide();
    $("#supplier_home_page div.ui-content div.minimum_shipping").html('');
    $(".minimum-order-container-for-all").remove();
}

function getCategory() {
    if(category_supplier_type=='all_suppliers'){
        getAllCategory();
        return;
    }
    emptyCategory();
    $("#category_collaps").html(loading_image);
    $("#category_collaps").html(loading_image);
    setTimeout(function(){
        var getCategory = JSON.parse(getValueSession("getCategory"+supplierID));
        if (getCategory && getCategory != null) {
            genrateViewgetCategory(getCategory);
        } else {
            $("#category_collaps").html(loading_image);
        }
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                $.ajax({
                    type: "POST",
                    data: "action=getCategoryNew&supplier_id=" + supplierID,
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        if (dataresult.result == 'error') {
                            hideLoading();
                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        }
                        addValueSession("getCategory" + supplierID, JSON.stringify(dataresult));
                        if (getCategory == null || typeof getCategory.category_tree_arr == 'undefined') {
                            genrateViewgetCategory(dataresult);
                        }

                    },
                    error: function(error) {
                        hideLoading();
                         if (getCategory == null || typeof getCategory.category_tree_arr == 'undefined') {
                            $("#category_collaps").html('<p style="text-align:center;"><img class="error_image" src="img/cannot.png" onClick="getCategory();" /></p>');
                            $("#category_collaps").trigger('create');
                        }

                    }
                });
            } else {
                goTO('user_login');
            }
        }, successCB, errorCB);
    }, 1000);

}

function genrateViewgetCategory(dataresult) {
    emptyCategory();
    var html;
    var category_tree_arr_total = Object.keys(dataresult.category_tree_arr).length;
    var i_category = 0;
    $category_collaps = $("#category_collaps");
    for (var category in dataresult.category_tree_arr) {
        html = '';
       
        if (dataresult.category_tree_arr[category].subcategories) {
             html = "<div data-collapsed-icon='false' style='margin-bottom:1px' data-expanded-icon='false' data-role='collapsible'><h3 class='category-header' data-category-type='sub'> <div class='category-image'><img src=" + dataresult.category_tree_arr[category].categories_image + " onerror=\"this.onerror=null;this.src='img/noimage.jpg';\"></div> <span class='category-title'>" + dataresult.category_tree_arr[category].categories_name + "</span> <div class='saved-supplier-arrow'><img height=20px src='img/next-arrow.png'></div></h3><ul data-role='listview' data-inset='collapsible' id='sub" + dataresult.category_tree_arr[category].categories_id + "'></ul></div>";
            $category_collaps.append(html);
            listSubcategories(dataresult.category_tree_arr[category].subcategories, dataresult.category_tree_arr[category].categories_id);
        } else {
            html = "<div data-collapsed-icon='false' style='margin-bottom:1px' data-expanded-icon='false' data-role='collapsible'><h3 class='category-header' data-category-type='sub' onclick='getCategoryProducts(" + dataresult.category_tree_arr[category].categories_id + ", this)'> <div class='category-image'><img src=" + dataresult.category_tree_arr[category].categories_image + " onerror=\"this.onerror=null;this.src='img/noimage.jpg';\"></div> <span class='category-title'>" + dataresult.category_tree_arr[category].categories_name + "</span> <div class='saved-supplier-arrow'><img height=20px src='img/next-arrow.png'></div></h3><ul data-role='listview' data-inset='collapsible'><div class='products_category_list' id='sub" + dataresult.category_tree_arr[category].categories_id + "'></div></ul></div>";
                $category_collaps.append(html);
         }
        i_category++;
        if (i_category == category_tree_arr_total) {
            if (device.platform != 'browser') {
               $(".category-image img").each(function(index, el) {
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
            $("#category_collaps").trigger('create');
            setTimeout(function() {
                hideLoading();
                cartPageHTML();
            }, 1000);
        }
    }

}

function getAllCategory() {
    document.getElementById("category_collaps").innerHTML = "";
    document.getElementById("products_listview").innerHTML = "";
    document.getElementById("supplier_products_listview_search").innerHTML = "";
    $(".progress-bar-container").html('');
    $(".supplier_page_tabs").removeClass("active_supplier_option");
    $("#all_products").addClass("active_supplier_option");

    $("#products_listview_container, #cart_page").hide();


    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            var customers_id = row.customers_id;
            all_category_count = 0;
            supplier_id = sidebar_supplier[0].supplier_id;
            showLoading();
            $.ajax({
                type: "POST",
                data: "action=getAllCategory&customers_id=" + customers_id + "&supplier_id=" + supplier_id,
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {
                    hideLoading();
                    if (dataresult.result == 'error') {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    var html;
                    all_category_count = 1;
                    for (var category in dataresult.category_tree_arr) {
                        html = '';
                        if (dataresult.category_tree_arr[category].subcategories) {
                            html = "<div data-collapsed-icon='false' style='margin-bottom:1px' data-expanded-icon='false' data-role='collapsible'><h3 class='category-header' data-category-type='sub'> <div class='category-image'><img src=" + dataresult.category_tree_arr[category].categories_image + " onerror=\"this.onerror=null;this.src='img/noimage.jpg';\"></div> <span class='category-title'>" + dataresult.category_tree_arr[category].categories_name + "</span><span class='category-supplier'>" + ' ' + dataresult.category_tree_arr[category].categories_supplier + "</span> <div class='saved-supplier-arrow'><img height=20px src='img/next-arrow.png'></div></h3><ul data-role='listview' data-inset='collapsible' id='sub" + dataresult.category_tree_arr[category].categories_id + "'></ul></div>";
                            $("#category_collaps").append(html);
                            $("#category_collaps").trigger('create');
                            listSubcategories(dataresult.category_tree_arr[category].subcategories, dataresult.category_tree_arr[category].categories_id);
                        } else {
                            html = "<div data-collapsed-icon='false' style='margin-bottom:1px' data-expanded-icon='false' data-role='collapsible'><h3 class='category-header' data-category-type='sub' onclick='getCategoryProducts(" + dataresult.category_tree_arr[category].categories_id + ", this)'> <div class='category-image'><img src=" + dataresult.category_tree_arr[category].categories_image + " onerror=\"this.onerror=null;this.src='img/noimage.jpg';\"></div> <span class='category-title'>" + dataresult.category_tree_arr[category].categories_name + "</span><span class='category-supplier'>" + ' ' + dataresult.category_tree_arr[category].categories_supplier + "</span> <div class='saved-supplier-arrow'><img height=20px src='img/next-arrow.png'></div></h3><ul data-role='listview' data-inset='collapsible'><div class='products_category_list' id='sub" + dataresult.category_tree_arr[category].categories_id + "'></div></ul></div>";
                            $("#category_collaps").append(html);
                            $("#category_collaps").trigger('create');
                        }
                    }
                    var products_html = '<li class="loadmore loadMoreAllCategory" style="margin-bottom:40px;"><a href="javascript:loadMoreAllCategory()">Load More....</a></li>';
                    $("#category_collaps").append(products_html);
                    hideLoading();
                    if (device.platform != 'browser') {
                       $(".category-image img").each(function(index, el) {
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
                    $("#category_collaps").listview().listview("refresh");


                    for (var i = 0; i < sidebar_supplier.length; i++) {
                        minOrderCount(sidebar_supplier[i].supplier_id);
                    }
                },
                error: function(error) {
                    hideLoading();
                    $("#category_collaps").html('<p style="text-align:center;"><img class="error_image" src="img/cannot.png" onClick="getCategory();" /></p>');
                    $("#category_collaps").trigger('create');

                }
            });
        } else {
            goTO('user_login');
        }
    }, successCB, errorCB);

}

function loadMoreAllCategory() {

    $(".loadMoreAllCategory").remove();
    if (all_category_count != sidebar_supplier.length) {
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                var customers_id = row.customers_id;
                var next_record = $('#category_collaps .category-image').length;
                supplier_id = sidebar_supplier[all_category_count].supplier_id;
                showLoading();
                $.ajax({
                    type: "POST",
                    data: "action=getAllCategory&customers_id=" + customers_id + "&supplier_id=" + supplier_id,
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        hideLoading();
                        if (dataresult.result == 'error') {
                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        }

                        var html;
                        all_category_count++;
                        for (var category in dataresult.category_tree_arr) {
                            html = '';
                            if (dataresult.category_tree_arr[category].subcategories && dataresult.category_tree_arr[category].categories_id != 'subcategory') {
                                html = "<div data-collapsed-icon='false' style='margin-bottom:1px' data-expanded-icon='false' data-role='collapsible'><h3 class='category-header' data-category-type='sub'> <div class='category-image'><img src=" + dataresult.category_tree_arr[category].categories_image + " onerror=\"this.onerror=null;this.src='img/noimage.jpg';\"></div> <span class='category-title'>" + dataresult.category_tree_arr[category].categories_name + "</span><span class='category-supplier'>" + ' ' + dataresult.category_tree_arr[category].categories_supplier + "</span> <div class='saved-supplier-arrow'><img height=20px src='img/next-arrow.png'></div></h3><ul data-role='listview' data-inset='collapsible' id='sub" + dataresult.category_tree_arr[category].categories_id + "'></ul></div>";
                                $("#category_collaps").append(html);
                                $("#category_collaps").trigger('create');
                                listSubcategories(dataresult.category_tree_arr[category].subcategories, dataresult.category_tree_arr[category].categories_id);
                            } else if (dataresult.category_tree_arr[category].categories_id != 'subcategory') {
                                html = "<div data-collapsed-icon='false' style='margin-bottom:1px' data-expanded-icon='false' data-role='collapsible'><h3 class='category-header' data-category-type='sub' onclick='getCategoryProducts(" + dataresult.category_tree_arr[category].categories_id + ", this)'> <div class='category-image'><img src=" + dataresult.category_tree_arr[category].categories_image + " onerror=\"this.onerror=null;this.src='img/noimage.jpg';\"></div> <span class='category-title'>" + dataresult.category_tree_arr[category].categories_name + "</span><span class='category-supplier'>" + ' ' + dataresult.category_tree_arr[category].categories_supplier + "</span> <div class='saved-supplier-arrow'><img height=20px src='img/next-arrow.png'></div></h3><ul data-role='listview' data-inset='collapsible'><div class='products_category_list' id='sub" + dataresult.category_tree_arr[category].categories_id + "'></div></ul></div>";
                                $("#category_collaps").append(html);
                                $("#category_collaps").trigger('create');
                            }
                        }
                        var products_html = '<li class="loadmore loadMoreAllCategory" style="margin-bottom:40px;"><a href="javascript:loadMoreAllCategory()">Load More....</a></li>';
                        $("#category_collaps").append(products_html);
                        if (device.platform != 'browser') {
                           $(".category-image img").each(function(index, el) {
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
                        hideLoading();
                        $("#category_collaps").listview().listview("refresh");


                        for (var i = 0; i < sidebar_supplier.length; i++) {
                            minOrderCount(sidebar_supplier[i].supplier_id);
                        }

                    },
                    error: function(error) {
                        hideLoading();
                        $("#category_collaps").html('<p style="text-align:center;"><img class="error_image" src="img/cannot.png" onClick="getCategory();" /></p>');
                        $("#category_collaps").trigger('create');

                    }
                });
            } else {
                goTO('user_login');
            }
        }, successCB, errorCB);
    }
}
/*
 * List subcategories (works but it need review)
 */
function listSubcategories(category, parentId) {
    var html;
    for (var subCat in category) {
        html = '';
        if (category[subCat].categories_name == 'Uncategorised') {
            if (typeof category[subCat].count_p != 'undefined')
                category[subCat].count_p = '(' + category[subCat].count_p + ')';
            else
                category[subCat].count_p = '';

            html = '<li class="special_padinging_category sub_category_listing ui-li-static ui-body-inherit ui-first-child ui-last-child" data-category-type="uncategorised" onClick="getCategoryProducts(' + category[subCat].categories_id + ', this)">' + category[subCat].categories_name + ' ' + category[subCat].count_p + '</li><div class="products_category_list" id="uncategorised' + category[subCat].categories_id + '"></div>';
            $('ul#sub' + category[subCat].categories_id).append(html);
            $('ul#sub'+category[subCat].categories_id).trigger('create');
        }
        if (category[subCat].subcategories) {
            html = "<li class='sub_category_listing'><div data-role='collapsible'><h3 data-category-type='sub'>" + category[subCat].categories_name + "</h3><ul data-role='listview' data-inset='collapsible' id='sub" + category[subCat].categories_id + "'></ul></div></li>";
            $('ul#sub' + category[subCat].parent_id).append(html);
            $('ul#sub'+category[subCat].parent_id).trigger('create');
            listSubcategories(category[subCat].subcategories, category[subCat].categories_id);
        } else {
            if (typeof category[subCat].count_p != 'undefined')
                category[subCat].count_p = '(' + category[subCat].count_p + ')';
            else
                category[subCat].count_p = '';
            html = '<li class="special_padinging_category sub_category_listing ui-li-static ui-body-inherit ui-first-child ui-last-child" data-category-type="sub" onClick="getCategoryProducts(' + category[subCat].categories_id + ', this)">' + category[subCat].categories_name + ' ' + category[subCat].count_p + '</li><div class="products_category_list" id="sub' + category[subCat].categories_id + '"></div>';
            $('ul#sub' + category[subCat].parent_id).append(html);
            $('ul#sub'+category[subCat].parent_id).trigger('create');
        }
    }
}
function getSupplierList(eventLocation) {
    $("#" + eventLocation).html('');
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            var customers_id = row.customers_id;
            showLoading();
            $.ajax({
                type: "POST",
                data: "action=getSupplier&customers_id=" + customers_id + "&gloveman_in_list=" + gloveman_in_list,
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {
                    hideLoading();
                    if (dataresult.result == 'error') {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    if (eventLocation == 'supplier_collaps_intro') {
                        if (dataresult.allUserSuppliers != 0)
                            $("#next-step-supplier-intro").removeAttr('disabled');

                        $("#" + eventLocation).append(dataresult.intro_supplier);
                        $('.no-company-radio').checkradios({
                            checkbox: {
                                iconClass: 'fa fa-check-circle'
                            },
                            radio: {
                                iconClass: 'fa fa-check'
                            }
                        });
                    } else {
                        $("#" + eventLocation).append(dataresult.supplier);
                        $("#" + eventLocation).append('<div class="clear_both"></div><div class="left-btn"><a href="javascript:goBack()"><img border="0" alt="" src="img/back-btn.png"></a></div><div class="right-btn"><a href="#sup_join_supplier_page" data-rel="popup" data-position-to="window" data-transition="pop"><img border="0" alt="" src="img/cant-find-btn.png"></a></div><div class="clear_both"></div>');

                    }
                    $("#" + eventLocation).trigger('create');
                },
                error: function(error) {
                    hideLoading();
                    $("#" + eventLocation).html('<p style="text-align:center;"><img class="error_image" src="img/cannot.png" onClick="getSupplierList();" /></p>');
                    $("#" + eventLocation).trigger('create');
                }
            });
        } else {
            goTO('user_login');
        }
    }, successCB, errorCB);
}

function cartSyncUser() {
    if (getValue("available_accounts") > 0 && getValue("switch_account") != '1') {
        addValue("switch_account", "1");
        goTO("manage_accounts");
    }
    if (getValueSession("sync_cart_server") != '1') {
        addValueSession("sync_cart_server", "1");
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                var customers_id = row.customers_id;
                $.ajax({
                    type: "POST",
                    data: "action=syncCart&customers_id=" + customers_id,
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        if (typeof dataresult.customers_basket != "undefined" && dataresult.customers_basket.length > 0) {
                            addtoCartArray(dataresult.customers_basket);
                        }

                    }
                });
            }
        }, successCB, errorCB);
    }
}

function getSuppliers(eventLocation) {
    StatusBar.show();
    var business_type_array = [];
    document.getElementById("home_page_contents").innerHTML = "";
    $home_page_contents = $("#home_page_contents");
    $('.search_contents').html('');
    $('.search_home_value').val('');
    var allSuppliers = JSON.parse(getValueSession("allSuppliers"));
    if (allSuppliers && allSuppliers != null) {
        for (i = 0; i < allSuppliers.length; i++) {
              var supplier_data = allSuppliers[i];
               var home_page_contents_list = '<div class="supplier-list-container" onClick="getSupplierInfo(' + supplier_data.supplier_id + ');"><div class="supplier-main-logo"><img class="supplier-main-logo-img" style="width: 100%;" src="' + supplier_data.banner_image + '"  alt="" border="0" onerror="this.onerror=null;this.src=\'img/no-slider.png\';"></div><div class="supplier-footer" ><div class="supplier-small-logo"><img src="' + supplier_data.small_logo_link + '" onerror="this.onerror=null;this.src=\'img/noimage.jpg\';" ></div><div class="supplier-info"><div class="supplier-title">' + supplier_data.store_name + '</div><div class="supplier-descr"><img src="img/pointer.png"><span>' + supplier_data.business_type + '</span></div></div><div class="supplier-down-arrow"><img width = 15 src="img/down-arrow.png"></div></div></div>';

                if ($.inArray(supplier_data.business_type, business_type_array) < 0 && supplier_data.business_type != null && supplier_data.business_type != '') {
                    business_type_array.push(supplier_data.business_type);
                }
                $(home_page_contents_list).appendTo($home_page_contents);
        }
        
        business_type_array.sort();
        var business_type_filter = '<option value="" disabled="disabled" selected>Filter by Supplier Type</option><option value="all">All</option>';

        if (business_type_array.length > 0) {
            $.each(business_type_array, function(key, value) {
                business_type_filter += '<option value="' + value + '">' + value + '</option>';
            });
        }
        $("#business_type_filter").html(business_type_filter);
        cartSyncUser();
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                var customers_id = row.customers_id;
                var selected_customers_id = 0;
                if (getValue("account_type") == 'user')
                    selected_customers_id = getValue("account_id");
                $.ajax({
                    type: "POST",
                    data: "action=getUserInfo&customers_id=" + customers_id + "&selected_customers_id=" + selected_customers_id,
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        if (dataresult.result == 'error') {
                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        }

                        if (dataresult.guest_mode == 1) {
                            $(".account-setting").css('display', 'none');
                            $(".create-account").css('display', 'block');
                            addValue("guest_mode", true);
                            guest_mode = true;

                        } else {
                            $(".account-setting").css('display', 'block');
                            $(".create-account").css('display', 'none');
                            addValue("guest_mode", false);
                            guest_mode = false;
                        }
                        guest_id = dataresult.guest_id;
                        guest_email = dataresult.guest_email;
                        guest_postcode = dataresult.guest_postcode;
                        guest_company_type = dataresult.guest_company_type;
                        customers_mobile = dataresult.customers_mobile;
                        if (getValue("account_type") != 'user') {
                            addValue("account_entry", dataresult.entry_company);
                            var sql = "UPDATE customers SET customers_id = " + dataresult.customers_id + ", customers_email_address = " + convertField(dataresult.customers_email_address) + ", customers_firstname = " + convertField(dataresult.customers_firstname) + ",customers_lastname = " + convertField(dataresult.customers_lastname) + " WHERE customers_id = " + dataresult.customers_id + "";
                            db.execute(sql, successCB, errorCB);
                        }


                    },
                    error: function(error) {
                        hideLoading();
                        $("#" + eventLocation).html('<p style="text-align:center;"><img class="error_image" src="img/cannot.png" onClick="getSupplierList();" /></p>');
                        $("#" + eventLocation).trigger('create');
                    }
                });
            } else {
                goTO('user_login');
            }
        }, successCB, errorCB);
    } else {

        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                var customers_id = row.customers_id;
                var selected_customers_id = 0;
                if (getValue("account_type") == 'user') selected_customers_id = getValue("account_id");
                $('#home_page_contents').html('<p style="text-align:center;"><img style="max-height:32px;width:32px;" width="32" height="32" src="img/loading.gif" border="0"></p>');
                $.ajax({
                    type: "POST",
                    data: "action=getSuppliers&customers_id=" + customers_id + "&selected_customers_id=" + selected_customers_id,
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {
                        if (dataresult.result == 'error') {
                            hideLoading();
                            toastMessage(dataresult.message, "Error", "OK");
                            return false;
                        }
                        if (dataresult.guest_mode == 1) {
                            $(".account-setting").css('display', 'none');
                            $(".create-account").css('display', 'block');
                            addValue("guest_mode", true);
                            guest_mode = true;

                        } else {
                            $(".account-setting").css('display', 'block');
                            $(".create-account").css('display', 'none');
                            addValue("guest_mode", false);
                            guest_mode = false;
                        }
                        guest_id = dataresult.guest_id;
                        guest_email = dataresult.guest_email;
                        guest_postcode = dataresult.guest_postcode;
                        guest_company_type = dataresult.guest_company_type;
                        customers_mobile = dataresult.customers_mobile;
                        if (getValue("account_type") != 'user') {
                            addValue("account_entry", dataresult.entry_company);
                            var sql = "UPDATE customers SET customers_id = " + dataresult.customers_id + ", customers_email_address = " + convertField(dataresult.customers_email_address) + ", customers_firstname = " + convertField(dataresult.customers_firstname) + ",customers_lastname = " + convertField(dataresult.customers_lastname) + " WHERE customers_id = " + dataresult.customers_id + "";

                            db.execute(sql, successCB, errorCB);
                        }
                        $("#home_page_contents").empty();
                        
                        if(dataresult.allSuppliers!=null && dataresult.allSuppliers.length>0){
                            addValueSession("allSuppliers", JSON.stringify(dataresult.allSuppliers));
                            for (i = 0; i < dataresult.allSuppliers.length; i++) {
                                var supplier_data = dataresult.allSuppliers[i];
                                $("#home_page_contents").append('<div class="supplier-list-container" onClick="getSupplierInfo(' + supplier_data.supplier_id + ');"><div class="supplier-main-logo"><img class="supplier-main-logo-img" style="width: 100%;" src="' + supplier_data.banner_image + '"  alt="" border="0" onerror="this.onerror=null;this.src=\'img/no-slider.png\';"></div><div class="supplier-footer" ><div class="supplier-small-logo"><img src="' + supplier_data.small_logo_link + '" class="supplier-small-logo-img" onerror="this.onerror=null;this.src=\'img/noimage.jpg\';" ></div><div class="supplier-info"><div class="supplier-title">' + supplier_data.store_name + '</div><div class="supplier-descr"><img src="img/pointer.png"><span>' + supplier_data.business_type + '</span></div></div><div class="supplier-down-arrow"><img width = 15 src="img/down-arrow.png"></div></div></div>').show('normal');
                                    

                                if ($.inArray(supplier_data.business_type, business_type_array) < 0 && supplier_data.business_type != null && supplier_data.business_type != '') {
                                    business_type_array.push(supplier_data.business_type);
                                }
                            }
                            business_type_array.sort();
                            var business_type_filter = '<option value="" disabled="disabled" selected>Filter by Supplier Type</option><option value="all">All</option>';

                            if (business_type_array.length > 0) {
                                $.each(business_type_array, function(key, value) {
                                    business_type_filter += '<option value="' + value + '">' + value + '</option>';
                                });
                            }
                            $("#business_type_filter").html(business_type_filter);
                        }else{
                            $("#home_page_contents").html(dataresult.message);
                        }
                        cartSyncUser();

                    },
                    error: function(error) {
                        hideLoading();
                        $("#home_page_contents").html('<p style="text-align:center;"><img class="error_image" src="img/cannot.png" onClick="getSuppliers();fetchsidebar();" /></p>');
                        $("#home_page_contents").trigger('create');

                    }
                });
                
            } else {
                goTO('user_login');
            }
        }, successCB, errorCB);
    }
    if (device.platform != 'browser') {
        $(".supplier-main-logo img").each(function(index, el) {
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
        $(".supplier-small-logo img").each(function(index, el) {
            var target_image = $(this);
            ImgCache.isCached(target_image.attr('src'), function(path, success){
                if(success){
                    ImgCache.useCachedFile(target_image);
                } else {
                    ImgCache.cacheFile(target_image.attr('src'), function(){
                        ImgCache.useCachedFile(target_image);
                    });
                }
            });
        });
    }
    clearInterval(chat_notification_interval);
    chat_notification_interval = setInterval(chatNotificationCount, 5000);
    
}

function getSupplierDetails() {
    db.query('SELECT * FROM customers', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            var row = results.rows.item(0);
            var customer_id = row.customers_id;
            showLoading();
            $.ajax({
                type: "POST",
                data: "action=getSupplierDetails&supplier_id=" + supplierID + "&customer_id=" + customer_id,
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {
                    hideLoading();
                    if (dataresult.result == 'error') {
                        toastMessage(dataresult.message, "Error", "OK");
                        return false;
                    }
                    var supplier_name = dataresult.supplier_details.store_name;
                    var supplier_desc = dataresult.supplier_details.supplier_aboutus;
                    var supplier_address = dataresult.supplier_details.supplier_address;
                    var supplier_logo = dataresult.supplier_logo;
                    var map = '<div style="width: 100%; overflow: hidden; height: 200px;"><iframe src="https://www.google.com/maps/embed/v1/place?q=' + supplier_address + '&key=AIzaSyD4iE2xVSpkLLOXoyqT-RuPwURN3ddScAI" width="100%" height="270" frameborder="0" style="border:0;margin-top: -70px;" allowfullscreen></iframe></div>';
                    var left_box = '';
                    if (supplierID > 0) {
                        if (supplier_logo != "noimage") {
                            var IMAGE_SRC = supplier_logo;
                        } else {
                            var IMAGE_SRC = 'img/noimage.jpg';
                        }
                        var telno = dataresult.supplier_details.supplier_contact;
                        if (telno != "") {
                            var tel = 'tel:' + telno;
                        } else {
                            var tel = 'tel:' + dataresult.supplier_details.supplier_mobile;
                        }

                        var supplier_email = 'mailto:' + dataresult.supplier_details.supplier_email;
                        $(".main_logo").html('<img src="' + IMAGE_SRC + '" alt="" />');
                        $("#supplier_name").html(supplier_name);
                        var supplier_desc_less = supplier_desc.substring(0, 200);
                        $("#supplier_desc").html(supplier_desc_less);
                        $("#supplier_desc_more").html(supplier_desc);
                        $("#supplier_desc_more").hide();
                        $(".remove_add_btn").show();
                        $("#supplier_desc").show();
                        $('.readmore a').html('Read more...');
                        $(".map").html(map);
                        $(".left_box").html(left_box);
                        if (dataresult.check_supplier > 0) $(".remove_add_btn").html('<div class="remove_from_list_btn"><a href="#" onClick="remove_supplier_from_list(' + supplierID + ',0);"><img src="img/close_icon.png" alt="" /> Remove From My List</a></div>');
                        if (dataresult.check_supplier == 0) $(".remove_add_btn").html('<div class="add_to_list_btn"><a href="#" onClick="add_supplier_to_list(' + supplierID + ',0);"><img src="img/plus-25x25.png" alt="" style="height:13px;width:13px;"/> Add To List</a></div>');
                    } else {
                        $(".main_logo").html('<img src="img/logo.png" alt="ONEzoo" />');
                        $("#supplier_name").html(supplier_name);
                        var supplier_desc_less = supplier_desc.substring(0, 200);
                        $("#supplier_desc").html(supplier_desc_less);
                        $("#supplier_desc_more").html(supplier_desc);
                        $("#supplier_desc_more").hide();
                        $("#supplier_desc").show();
                        $('.readmore a').removeClass('moreDetails');
                        $('.readmore a').html('Read more...');
                        $(".map").html('<iframe src="http://www.maps.ie/create-google-map/map.php?key=AIzaSyD4iE2xVSpkLLOXoyqT-RuPwURN3ddScAI&amp;width=100%&amp;height=200&amp;hl=en&amp;q=3%2F64%20cambria%20Rd%2CKeysborough%203173+(One%20Packaging%20Company)&amp;ie=UTF8&amp;t=&amp;z=15&amp;iwloc=B&amp;output=embed" width="100%" height="200" frameborder="0" style="border:0" allowfullscreen></iframe>');
                        $(".left_box").html(left_box);
                        $(".remove_add_btn").hide();
                    }
                    if (window.localStorage.getItem('showSideMenu') != 'true') { $(".nav-panel-main").panel("close"); }
                    window.localStorage.setItem('showSideMenu', false);
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
$(document).on('click', 'a#readSupDesc', function() {
    $('#supplier_desc_more').toggle();
    $('#supplier_desc').toggle();
    if ($(this).hasClass('moreDetails')) {
        $(this).html('Read more...');
    } else {
        $(this).html('Read less...');
    }
    $(this).toggleClass('moreDetails');
});
$(document).on('click', 'a#readSupInfoDesc', function() {
    $('#supplier_info_desc_more').toggle();
    $('#supplier_info_desc').toggle();
    if ($(this).hasClass('moreDetails')) {
        $(this).html('READ MORE');
    } else {
        $(this).html('READ LESS');
    }
    $(this).toggleClass('moreDetails');
});

function find_out_more(supplier_id) {
    getSupplierInfo(supplier_id);
}

function sendJoinRequest() {
    var activePage = $.mobile.activePage.attr('id');
    var sup_name = $.trim($("#" + activePage + " #sup_name").val());
    var sup_company = $.trim($("#" + activePage + " #sup_company").val());
    var sup_email = $.trim($("#" + activePage + " #sup_email").val());
    if (sup_name.length < 2) {
        toastMessage("Supplier Name is required");
    } else if (sup_company.length < 2) {
        toastMessage("Company is required");
    } else if (sup_email.length < 2) {
        toastMessage("Email is required");
    } else if (validateEmail(sup_email) == false) {
        toastMessage("Invalid Email address.");
    } else {
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                var row = results.rows.item(0);
                var customers_id = row.customers_id;
                showLoading();
                $.ajax({
                    type: "POST",
                    data: "action=requestSupplierJoin&customer_id=" + customers_id + "&sup_name=" + sup_name + "&sup_company=" + sup_company + "&sup_email=" + sup_email,
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
                            $("#" + activePage + " #sup_join_" + activePage).popup("close");
                            toastMessage(dataresult.message, "Success", "OK");
                            $("#sup_name").val('');
                            $("#sup_company").val('');
                            $("#sup_email").val('');
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
}

function requestCallBack() {
    var req_name = $.trim($("#req_name").val());
    var req_mobile = $.trim($("#req_mobile").val());
    var req_message = $.trim($("#req_message").val());
    if (req_name.length < 2) {
        toastMessage("Name is required");
    } else if (req_mobile.length < 2) {
        toastMessage("Phone/Mobile is required");
    } else if (req_message.length < 2) {
        toastMessage("Message is required");
    } else {
        db.query('SELECT * FROM customers', function(tx, results) {
            var len = results.rows.length;
            if (len > 0) {
                showLoading();
                $.ajax({
                    type: "POST",
                    data: "action=requestCallBack&req_name=" + req_name + "&req_mobile=" + req_mobile + "&req_message=" + req_message + "&req_supplier_id=" + supplierID,
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
                            $("#requestCallBackPopup").popup("close");
                            toastMessage(dataresult.message, "Success", "OK");
                            $("#req_name").val('');
                            $("#req_mobile").val('');
                            $("#req_message").val('');
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
}

function genrateViewCategoryProducts(dataresult, category_type, categoryid) {
    var products_html = '<ul data-role="listview"   data-inset="true" id="products_listview" data-shadow="false"  data-corners="false">';
    if (typeof dataresult.products_list != 'undefined' && dataresult.products_list.length > 0) {
        for (var i = 0; i < dataresult.products_list.length; i++) {

            if (dataresult.products_image[i] == "noimage.jpg")
                var IMAGE_SRC = 'img/noimage.jpg';
            else
                var IMAGE_SRC = dataresult.products_image[i];

            products_html += '<li><a class="icon-' + dataresult.products_list[i] + ' prdt-icon" href="javascript:moreDetails(' + dataresult.products_list[i] + ',' + dataresult.products_suppl_id[i] + ')"><img class = "product_image" width="80" height="80" src="' + IMAGE_SRC + '" onerror="this.onerror=null;this.src=\'img/noimage.jpg\';"><h3>' + dataresult.products_name[i] + '</h3><p id="listprice' + dataresult.products_list[i] + '">Price $' + Number(dataresult.products_price[i]).toFixed(2) + '</p><div class="clear_both"></div></a><div id="after' + dataresult.products_list[i] + '" class="more_details" style="display:none;"></div><input type="hidden" id="product_name' + dataresult.products_list[i] + '" value="' + dataresult.products_name[i] + '"></li>';
        }
    } else {
        products_html += '<p class="alert alert-info">Sorry there is no product in this category.</p>';
    }
    products_html += '</ul>';
    $('#' + category_type + categoryid).html(products_html);
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
    $('#' + category_type + categoryid).show();
    $('#' + category_type + categoryid).trigger('create');
}

function getCategoryProducts(categoryid, category_type) {
    category_type = $(category_type).attr('data-category-type');
    if ($('#' + category_type + categoryid).html() != "") {
        $('#' + category_type + categoryid).slideUp();
        $('#' + category_type + categoryid).html('');
        return false;
    }
    $('.products_category_list').html('');
    $('.products_category_list').hide();
    var categoryProductsList = JSON.parse(getValueSession("categoryProductsList" + categoryid + "-" + category_type + "-" + supplierID));
    if (categoryProductsList && categoryProductsList != null) {
        genrateViewCategoryProducts(categoryProductsList, category_type, categoryid);
    } else {
        showLoading();
    }
    $.ajax({
        type: "POST",
        data: "action=categoryProductsList&categoryid=" + categoryid + "&category_type=" + category_type + "&supplier_id=" + supplierID,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            hideLoading();
            if (dataresult.result == 'error') {
                toastMessage(dataresult.message, "Error", "OK");
                return false;
            }
            addValueSession("categoryProductsList" + categoryid + "-" + category_type + "-" + supplierID, JSON.stringify(dataresult));
            if (JSON.stringify(categoryProductsList) != JSON.stringify(dataresult)) {
                genrateViewCategoryProducts(dataresult, category_type, categoryid);
            }


        },
        error: function(error) {
            connectionAlert();
        }
    });
}



function checkPromotion(customers_id) {
    if (customers_id > 0) {
        $.ajax({
            type: "POST",
            data: "action=checkPromotion&customers_id=" + customers_id,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                
            }
        });
    }
}
function updatenotificationtoServer() {
    var notification_setting = Array();
    db.query('SELECT * FROM notification_setting', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var rows = results.rows.item(i);
                if (rows.field_value == "on") {
                    notification_setting.push(rows.field_name);
                }

            }
        } else {
            $('#notification_conents select').each(function(index, element) {
                var $this = $(this);
                db.execute("INSERT INTO notification_setting ( field_name ,field_value)  VALUES (" + convertField($this.attr("name")) + ",'on')", successCB, errorCB);
                notification_setting.push($this.attr("name"));
            });
        }
        if (customerID > 0) {
            $.ajax({
                type: "POST",
                data: "action=updatenotificationtoServer&notification_setting=" + notification_setting + "&customers_id=" + customerID,
                url: CONECTION_SERVER(),
                crossDomain: true,
                dataType: "json",
                success: function(dataresult) {}
            });
        }
    }, successCB, errorCB);

}

function registerpushNotification() {
    if (getValue("gloveman_push_registrationId") != null && customerID > 0) {
        $.ajax({
            type: "POST",
            data: "action=registerpushNotification&registrationId=" + getValue("gloveman_push_registrationId") + "&customers_id=" + customerID,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {}
        });
    }
}

function loadAddressBook() {
    if (customerID > 0) {

        var selected_customers_id = 0;
        if (getValue("account_type") == 'user') selected_customers_id = getValue("account_id");
        showLoading();
        $.ajax({
            type: "POST",
            data: "action=loadAddressBook&customers_id=" + customerID + "&selected_customers_id=" + selected_customers_id,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                var $div = $('#address_book_listview').empty();
                if (dataresult.result == 'error') {
                    hideLoading();
                    toastMessage(dataresult.message, "Error", "OK");
                    return false;
                }
                var len = dataresult.address_book_list.address_book_id.length;
                for (var i = 0; i < len; i++) {
                    $div.append('<li id="delete_address_book_' + dataresult.address_book_list.address_book_id[i] + '"><a id="address_book_id_' + dataresult.address_book_list.address_book_id[i] + '">' + dataresult.address_book_list.details[i] + '</a><a onClick="actionAddressBook(' + dataresult.address_book_list.address_book_id[i] + ',' + dataresult.address_book_list.customers_id[i] + ')">Action</a></li>');
                    if ((i + 1) == len) {
                        $("#address_book_listview").listview().listview("refresh");
                        hideLoading();
                    }

                }
            },
            error: function(xhr, error) {
                connectionAlert();
            }
        });
    }

}

function processAddressBook(action, address_book_id) {
    var gender = $.trim($("#address_book_form input[name=gender_address]:checked").val());
    var firstname = $.trim($("#address_book_form input[name=firstname]").val());
    var lastname = $.trim($("#address_book_form input[name=lastname]").val());
    var company = $.trim($("#address_book_form input[name=company]").val());
    var street_address = $.trim($("#address_book_form input[name=street_address]").val());
    var suburb = $.trim($("#address_book_form input[name=suburb]").val());
    var postcode = $.trim($("#address_book_form input[name=postcode]").val());
    var state = $.trim($("#address_book_form input[name=state]").val());
    var email = $.trim($("#address_book_form input[name=email_address]").val());
    if (address_book_id == "") {
        address_book_id = 0;
    }
    if (gender == "")
        toastMessage("Gender is required");
    else if (firstname.length < 2)
        toastMessage("First Name is required");
    else if (lastname.length < 2)
        toastMessage("Last Name is required");
    else if (company.length < 2)
        toastMessage("Company Name is required.");
    else if (street_address.length < 2)
        toastMessage("Street address is required.");
    else if (suburb.length < 2)
        toastMessage("Suburb address is required.");
    else if (postcode.length < 2)
        toastMessage("Postcode is required.");
    else if (state.length < 2)
        toastMessage("State is required.");
    else if (validateEmail(email) == false)
        toastMessage("Invalid Email address.");
    else {
        if (customerID > 0) {

            var selected_customers_id = 0;
            if (getValue("account_type") == 'user') selected_customers_id = getValue("account_id");
            showLoading();
            $.ajax({
                type: "POST",
                data: "action=" + action + "&customers_id=" + customerID + "&address_book_id=" + address_book_id + "&" + $("#address_book_form").serialize() + "&selected_customers_id=" + selected_customers_id,
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
                        toastMessageLong(dataresult.message, "Success", "OK");
                        goBack();
                    }

                },
                error: function(error) {
                    connectionAlert();
                }
            });
        }
    }

}

function actionAddressBook(address_book_id, customers_id) {
    addValue("action_address_book_id", address_book_id);
    addValue("action_customers_id", customers_id);
    var options = {
        'androidTheme': window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT,
        'title': 'What do you want with this Address Book entry?',
        'buttonLabels': ['Edit', 'Make this Primary Address'],
        'addCancelButtonWithLabel': 'Cancel',
        'androidEnableCancelButton': true,
        'winphoneEnableCancelButton': true,
        'addDestructiveButtonWithLabel': 'Delete it'
    };
    window.plugins.actionsheet.show(options, function(buttonIndex) {
        setTimeout(function() {
            switch (buttonIndex) {
                case 1:
                    askdeleteAddressBook(getValue("action_address_book_id"), getValue("action_customers_id"));
                    break;
                case 2:
                    getAddressBook(getValue("action_address_book_id"), getValue("action_customers_id"))
                    break;
                case 3:
                    setPrimaryAddressBook(getValue("action_address_book_id"), getValue("action_customers_id"));
                    break;
                default:
                    break;
            }
            window.plugins.actionsheet.hide({}, function() { deleteValue("action_address_book_id");
                deleteValue("action_customers_id"); }, function() {});
        });

    });
}

function addAddressBook() {
    
    $("#add_edit_address_book_conents p.leftprodimg").html('Add Address Book');
    $("#address_book_form button").attr("onClick", "processAddressBook('add_address_book');");
    $("#address_book_form input[type=text],input[type=number]").val('');

    goTO('add_edit_address_book');
}

function getAddressBook(address_book_id, customers_id) {
    $("#add_edit_address_book_conents p.leftprodimg").html('Edit Address Book');
    $("#address_book_form button").attr("onClick", "processAddressBook('edit_address_book'," + address_book_id + ");");

    $("#address_book_form input[name=firstname]").val($.trim($("#" + address_book_id + "_firstname").text()));
    $("#address_book_form input[name=lastname]").val($.trim($("#" + address_book_id + "_lastname").text()));
    $("#address_book_form input[name=company]").val($.trim($("#" + address_book_id + "_company").text()));
    $("#address_book_form input[name=street_address]").val($.trim($("#" + address_book_id + "_street_address").text()));
    $("#address_book_form input[name=suburb]").val($.trim($("#" + address_book_id + "_suburb").text()));
    $("#address_book_form input[name=postcode").val($.trim($("#" + address_book_id + "_postcode").text()));
    $("#address_book_form input[name=state]").val($.trim($("#" + address_book_id + "_state").text()));
    $("#address_book_form input[name=city]").val($.trim($("#" + address_book_id + "_city").text()));

    goTO('add_edit_address_book');
}

function setPrimaryAddressBook(address_book_id, customers_id) {
    showLoading();
    $.ajax({
        type: "POST",
        data: "action=setPrimaryAddressBook&address_book_id=" + address_book_id + "&customers_id=" + customers_id,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            hideLoading();
            if (dataresult.result == 'error') {
                hideLoading();
                toastMessage(dataresult.message, "Error", "OK");
                return false;
            } else if (dataresult.result == "success") {
                $(".primary_address").html('');
                $("#address_book_id_" + address_book_id + " p i").html(' (Primary Address)');
            }
        },
        error: function(xhr, error) {
            connectionAlert();
        }
    });
}

function askdeleteAddressBook(address_book_id, customers_id) {
    if (window.navigator && window.navigator.notification) {
        navigator.notification.confirm('Do you really want to delete this address book?', function(buttonIndex) {
            if (buttonIndex == 2) {
                deleteAddressBook(address_book_id, customers_id);
            }

        }, 'Confirm', 'No,Yes');
    } else {
        var ask = confirm("Do you really want to delete this address book?");
        if (ask == true) {
            deleteAddressBook(address_book_id, customers_id);
        }
    }
}

function deleteAddressBook(address_book_id, customers_id) {
    showLoading();
    $.ajax({
        type: "POST",
        data: "action=deleteAddressBook&address_book_id=" + address_book_id + "&customers_id=" + customers_id,
        url: CONECTION_SERVER(),
        crossDomain: true,
        dataType: "json",
        success: function(dataresult) {
            hideLoading();
            if (dataresult.result == 'error') {
                hideLoading();
                toastMessage(dataresult.message, "Error", "OK");
                return false;
            } else if (dataresult.result == "success") {
                $("#delete_address_book_" + address_book_id).remove();
                $("#address_book_listview").listview().listview("refresh");
            }
        },
        error: function(xhr, error) {
            connectionAlert();
        }
    });

}

function getNotificationSetting() {
    if (customerID > 0) {
        $.ajax({
            type: "POST",
            data: "action=getNotificationSetting&customers_id=" + customerID,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                if (dataresult.result == "success") {
                    var notification_setting_len = dataresult.notification_setting.length;
                    if (notification_setting_len > 0) {
                        db.query('SELECT * FROM notification_setting', function(tx, results) {
                            var len = results.rows.length;
                            if (len > 0) {
                                for (var i = 0; i < len; i++) {
                                    var rows = results.rows.item(i);
                                    if ($.inArray(rows.field_name, dataresult.notification_setting) === -1)
                                        db.execute("UPDATE notification_setting SET field_value = 'off' WHERE  field_name=" + convertField(rows.field_name));
                                    else
                                        db.execute("UPDATE notification_setting SET field_value = 'on' WHERE  field_name=" + convertField(rows.field_name));
                                }
                            }
                        }, successCB, errorCB);
                    }
                }
            }
        });
    }
}

function getOderDayTime() {
    if (customerID > 0) {
        $.ajax({
            type: "POST",
            data: "action=getOderDayTime&customers_id=" + customerID,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                if (dataresult.result == "success") {
                    if (dataresult.order_day_alert_time != '' && dataresult.order_day_alert_time != null) {
                        addValue("order_day_alert_time", dataresult.order_day_alert_time);
                        $("#order_day_alert_time").html(dataresult.order_day_alert_time);
                    }
                }
            }
        });
    }
}

function changeOderDayTime() {
    var options = {
        date: new Date(),
        mode: 'time'
    };
    datePicker.show(options, function onSuccess(date) {
        if (typeof date != "undefined" && date != null && date != 'NaN') {
            var order_day_alert_time = formatAMPM(date);
            $("#order_day_alert_time").html(order_day_alert_time);
            addValue("order_day_alert_time", order_day_alert_time);
            if (typeof order_day_alert_time != "undefined" && customerID > 0) {
                $.ajax({
                    type: "POST",
                    data: "action=changeOrderDayTime&order_day_alert_time=" + order_day_alert_time + "&customers_id=" + customerID,
                    url: CONECTION_SERVER(),
                    crossDomain: true,
                    dataType: "json",
                    success: function(dataresult) {}
                });
            }
        } else {
            toastMessage("Invalid time only multiple of 30 mint allow.", "Error", "OK");
        }

    });
}
function changeDeliveryDate(){
    var options = {
        date: new Date(),
        mode: 'date',
        windowTitle: 'Select your order delivery date',
        cancelButton: true,
        minDate:new Date().getTime(),
        allowOldDates:false,
        androidTheme:'5'
    };
    datePicker.show(options, function onSuccess(date) {
        if(typeof date!="undefined" && date!=null && date!='NaN'){
            $("#deliveryAlert p.checkout_gray_color").html(moment(date).format('dddd Do of MMMM YYYY'));
            $("#delivery_date").val(moment(date).format('MM/DD/YYYY')); 
        }else{
            toastMessage("Please select a valid delivery date.","Error","OK");
        }

    });
}
function initialNotificationSetting() {
    db.query('SELECT * FROM notification_setting', function(tx, results) {
        var len = results.rows.length;
        if (len > 0) {

        } else {
            $('#notification_conents select').each(function(index, element) {
                var $this = $(this);
                db.execute("INSERT INTO notification_setting ( field_name ,field_value)  VALUES (" + convertField($this.attr("name")) + ",'on')", successCB, errorCB);
            });
        }
    }, successCB, errorCB);
}

function roundMinutes(minutes) {
    if (minutes > 0 && minutes <= 15)
        return '00';
    else if (minutes > 15 && minutes <= 30)
        return 30;
    else if (minutes > 30 && minutes <= 45)
        return 30;
    else if (minutes > 45 || minutes == 00 || minutes == 0)
        return '00';
}

function formatAMPM(date) {
    var date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = roundMinutes(minutes);
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function minOrderCount(supplier_id) {
    var supplier = sidebar_supplier.filter(function(obj) {
        return obj.supplier_id == supplier_id;
    });

    var supplier_data = supplier[0];
    var shipping_charge = min_order_amont = 0.00;
    var shipping_text = 'Free Shipping';
    shipping_html = '<div class="cart_strip_header success"><div class="progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="19" aria-valuemin="0" aria-valuemax="100" style="width:100%;"> <span>' + shipping_text + '</span> </div></div>';
    var supplier_message = '';
    var min_order_amont = parseFloat(supplier_data.min_order);

    getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
        db.query('SELECT * FROM customers_basket WHERE supplier_id=' + supplier_id + ' AND customers_id=' + data.customers_id + ' ORDER BY customers_basket_id DESC', function(tx, results) {
            var order_total_without_shipping = 0;
            var len = results.rows.length;
            if (len > 0) {
                var cart_date;
                var sub_total = 0;
                var products_tax_total = 0;
                for (var k = 0; k < Number(len); k++) {
                    cart_date = results.rows.item(k);
                    var total_price = cart_date.customers_basket_quantity * cart_date.final_price;
                    sub_total += total_price;
                    var products_tax = (total_price * cart_date.products_tax) / 100;
                    products_tax_total += products_tax;

                }
                var order_total_without_shipping = sub_total + products_tax_total;
            }

            if (supplier_data.is_fixed_shipping == '1' && parseFloat(supplier_data.fixed_shipping_charges) > 0) {
                shipping_charge = parseFloat(supplier_data.fixed_shipping_charges);
                shipping_text = 'Fixed Price Shipping $' + shipping_charge.toFixed(2);

            } else if (min_order_amont && min_order_amont > 0) {
                if (order_total_without_shipping >= min_order_amont) {
                    shipping_charge = 0.00;
                    shipping_text = 'Free Shipping.';

                } else if (order_total_without_shipping && order_total_without_shipping > 0) {
                    shipping_charge = parseFloat(supplier_data.extra_charges);
                    var percentage_remaining = (100 - ((order_total_without_shipping * 100) / min_order_amont)).toFixed(0);

                    var percentage_spent = ((order_total_without_shipping * 100) / min_order_amont).toFixed(0);
                    var more_to_go = min_order_amont - order_total_without_shipping;

                    shipping_text = 'Spend $' + min_order_amont.toFixed(2) + ' to get FREE SHIPPING, only $' + more_to_go.toFixed(2) + ' to go!';
                } else {
                    shipping_charge = parseFloat(supplier_data.extra_charges);
                    shipping_text = 'Spend $' + min_order_amont.toFixed(2) + ' to get FREE SHIPPING';

                }

            } else {
                shipping_charge = 0.00;
                shipping_text = 'Free Shipping!';


            }

            var supplier_min_order_html = '<div class="minimum-order-container minimum-order-container-for-all">' +

                '<div class="min_order_image"><div class="min_order_image_wrapper"> <img src="' + supplier_data.image + '"/></div></div>' +
                '<div>' + supplier_data.name + '</div>' +
                '<div>' + shipping_text + '</div>' +
                '<div>Shipping Charge $' + shipping_charge.toFixed(2) + '</div></div>';

            $("#minimum_order_popup").append(supplier_min_order_html);

        }, successCB, errorCB);
    });

    $("#supplier_min_amount_message").html("");
    $("#supplier_how_much_left").html("");
    $("#supplier_shipping_charge").html("");
    $("#min_order_for_free").html("");
    $("#supplier_home_page div.ui-content div.minimum_shipping").html('<div class="cart_strip_header"><div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="19" aria-valuemin="0" aria-valuemax="100" style="width:0%;"> <span>Touch here to see all suppliers shipping details.</span> </div></div>');
}

function goToCartPage(supplier_id) {
    if (!supplier_id && supplier_id != 0)
        supplier_id = supplierID;
    if (supplier_id == 'all_saved_suppliers') {
        goTO("suppliers_page");
        return false;
    }
    supplierID = supplier_id;
    loadCart(supplierID);
    cartPageHTML(supplier_id);

}

function cartPageHTML(supplier_id) {
    if (category_supplier_type == 'all_suppliers') {
        for (var i = 0; i < sidebar_supplier.length; i++) {
            minOrderCount(sidebar_supplier[i].supplier_id);
        }
    }else{

        $(".minimum-order-container-for-all").remove();
        $("div.cart_html_main").html(loading_image);
        $("div.sub_total_div").html('');
        if (supplier_id) supplierID = supplier_id;
        var activePage    = $.mobile.activePage.attr('id');
        var cart_page_tab = $("#cart_page_tab").hasClass('active_supplier_option');
        var supplier = sidebar_supplier.filter(function(obj) {
            return obj.supplier_id == supplierID;
        });
        if (supplier.length == 0) {
            supplier = recently_viewed_supp.filter(function(obj) {
                return obj.supplier_id == supplierID;
            });
        }
        if (supplier.length == 0) {
            toastMessage("Sorry currently some technical glitch exist please close your app and try later");

        }
        var supplier_data = supplier[0];

        var shipping_charge = min_order_amont = 0.00;
        var shipping_text = 'Free Shipping';
        shipping_html = '<div class="cart_strip_header success"><div class="progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="19" aria-valuemin="0" aria-valuemax="100" style="width:100%;"> <span>' + shipping_text + '</span> </div></div>';
        var supplier_message = '';
        var min_order_amont = parseFloat(supplier_data.min_order);
       
        
        getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
            db.query('SELECT * FROM customers_basket WHERE supplier_id=' + supplierID + ' AND customers_id=' + data.customers_id + ' ORDER BY customers_basket_id DESC', function(tx, results) {
                var len = results.rows.length;
                if (len > 0) {
                    if (cart_page_tab) {
                        var cart_html = '<table  data-role="none"  width="100%" cellpadding="0" cellspacing="0" border="0"><thead><tr class="cart_html_heading"><td>Product</td><td>Qty</td><td>Unit Price</td><td width="20">Total<br><span style="font-size:11px">(Inc.GST)</span></td><td></td></tr></thead><tbody></tbody></table>';
                            $("#cart_page div.cart-page-contents div.cart_html_main").html(cart_html);
                    }
                    
                    var cart_date;
                    var sub_total = 0;
                    var products_tax_total = 0;
                    for (var i = 0; i < Number(len); i++) {
                        var cart_date = '';
                        var total_price = 0;
                        var products_tax = 0;
                        var product_price_tax = 0;

                        cart_date = results.rows.item(i);
                        var total_price = cart_date.customers_basket_quantity * cart_date.final_price;

                        var products_tax = (total_price * cart_date.products_tax) / 100;
                        product_price_tax = (total_price + products_tax);
                        products_tax_total += products_tax;
                        sub_total += total_price;
                        if (cart_page_tab) {
                            $("#cart_page div.cart-page-contents table > tbody").append('<tr class="cart_html_body"><td id="attribute' + replaceChsaracters(cart_date.products_id) + '" valign="top">' + cart_date.products_name + '</td><td valign="top" width="40"><input type="number" value="' + cart_date.customers_basket_quantity + '" id="' + replaceChsaracters(cart_date.products_id) + '" class="qtyUpdate" data-role="none" size="4" onChange="updateCart(' + convertField(cart_date.products_id) + ');"></td><td valign="top" width="60">$' + (cart_date.final_price).toFixed(2) + '</td><td valign="top"><span id="price' + replaceChsaracters(cart_date.products_id) + '">$' + (product_price_tax).toFixed(2) + '</span></td><td valign="top" style="text-align:right;"><a href="javascript:void(0);" onClick="removeCart(' + convertField(cart_date.products_id) + ');" class="removeCart" style="position:relative;top:3px;text-align:right;"><img style="width:20px;margin-left:5px;" src="img/close.png"></a></td></tr>');
                        
                            db.query('SELECT * FROM customers_basket_attributes WHERE customers_id=' + data.customers_id + ' AND products_id=' + convertField(cart_date.products_id), function(tx, attribute) {

                                var attribute_len = attribute.rows.length;
                                if (attribute_len > 0) {
                                    var attrib_text = ''
                                    for (var j = 0; j < Number(attribute_len); j++) {
                                        var attribute_data = attribute.rows.item(j);
                                        $("#cart_page div.cart-page-contents table td#attribute" + replaceChsaracters(attribute_data.products_id)).append('</br><b>' + attribute_data.products_options + '</b>:' + attribute_data.products_options_value);
                                    }

                                }
                            }, successCB, errorCB);
                        }


                    }
                    var order_total_without_shipping = sub_total + products_tax_total;
                    shipping_text = '';
                    if (supplier_data.is_fixed_shipping == '1' && parseFloat(supplier_data.fixed_shipping_charges) > 0) {
                            shipping_charge = parseFloat(supplier_data.fixed_shipping_charges);
                            shipping_text = 'Fixed Price Shipping $' + shipping_charge.toFixed(2);
                    } else if (min_order_amont && min_order_amont > 0) {
                        if (order_total_without_shipping >= min_order_amont) {
                            shipping_charge = 0.00;
                        } else {
                            shipping_charge = parseFloat(supplier_data.extra_charges);
                        }
                            shipping_text = 'Free shipping available when you spend $'+min_order_amont.toFixed(2);

                    } else {
                            shipping_charge = 0.00;
                            shipping_text = 'Free Shipping available.';
                    }

                    var order_total = (sub_total + products_tax_total + shipping_charge).toFixed(2);
                    if (cart_page_tab) {
                        $("#cart_page div.cart-page-contents div.sub_total_div").html('<div class="add_more_products_wrapper"><div class="add_more_products" onClick="goToSupplierPage(' + supplier_id + '),addgoBackSupplier(' + supplier_id + ');">Add More Products</div></div><div class="clear_both">&nbsp;</div><div class="cart_total_main"><span class="sub_total">Sub-Total: $' + sub_total.toFixed(2) + '</span><br><span>GST: $' + products_tax_total.toFixed(2) + '</span><br><span>Shipping: $' + shipping_charge.toFixed(2) + '</span></div><br><div class="clear_both"></div><span style="font-size:11px;font-weight:normal;">'+shipping_text+'</span><div class="clear_both"></div><span style="color:#5b88c9;font-size:16px;text-align:right;display:block;line-height:16px;">Total (Including GST): $' + order_total + '</span><span><br/><br/><button class="checkout" onclick="goTO(\'checkout_page\');" type="button"><img height="28" src="img/checkout_btn.png" alt="Checkout->"></button></span>');
                        $("#multiple_checkout_div").show();
                    }

                } else {
                   if (cart_page_tab) {
                        var cart_html = '<table data-role="none" width="100%" cellpadding="0" cellspacing="0" border="0"><tr class="cart_html_body"><td colspan="3" align="left"></td></tr><tr><td class="alert alert-info">Sorry your cart is empty</td></tr></table><div class="clear_both">&nbsp;</div>';
                        $("#cart_page div.cart-page-contents div.cart_html_main").html(cart_html);
                    }
                    $("#multiple_checkout_div").hide();


                }
                if (supplier_data.is_fixed_shipping == '1' && parseFloat(supplier_data.fixed_shipping_charges) > 0) {
                    shipping_charge = parseFloat(supplier_data.fixed_shipping_charges);
                    shipping_text = 'Fixed Price Shipping $' + shipping_charge.toFixed(2);
                    if (supplier_data.fixed_shipping_note != '' && supplier_data.fixed_shipping_note != null) {
                        supplier_message = supplier_data.fixed_shipping_note;
                    }
                    shipping_html = '<div class="cart_strip_header"><div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="19" aria-valuemin="0" aria-valuemax="100" style="width:0%;"> <span>' + shipping_text + '</span> </div></div>';
                } else if (min_order_amont && min_order_amont > 0) {
                    if (order_total_without_shipping >= min_order_amont) {
                        shipping_charge = 0.00;
                        shipping_text = 'Free Shipping.';
                        shipping_html = '<div class="cart_strip_header success"><div class="progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="19" aria-valuemin="0" aria-valuemax="100" style="width:100%;"> <span>' + shipping_text + '</span> </div></div>';
                    } else if (order_total_without_shipping && order_total_without_shipping > 0) {
                        shipping_charge = parseFloat(supplier_data.extra_charges);
                        var percentage_remaining = (100 - ((order_total_without_shipping * 100) / min_order_amont)).toFixed(0);

                        var percentage_spent = ((order_total_without_shipping * 100) / min_order_amont).toFixed(0);
                        var more_to_go = min_order_amont - order_total_without_shipping;

                        shipping_text = 'Spend $' + min_order_amont.toFixed(2) + ' to get FREE SHIPPING, only $' + more_to_go.toFixed(2) + ' to go!';

                        shipping_html = '<div class="cart_strip_header"><div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="19" aria-valuemin="0" aria-valuemax="100" style="width:' + (100 - percentage_remaining) + '%;"> <span>' + shipping_text + '</span> </div></div>';
                    } else {
                        shipping_charge = parseFloat(supplier_data.extra_charges);
                        shipping_text = 'Spend $' + min_order_amont.toFixed(2) + ' to get FREE SHIPPING';
                        shipping_html = '<div class="cart_strip_header"><div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="19" aria-valuemin="0" aria-valuemax="100" style="width:0%;"> <span>' + shipping_text + '</span> </div></div>';
                    }
                } else {
                    shipping_charge = 0.00;
                    shipping_text = 'Free Shipping';
                    shipping_html = '<div class="cart_strip_header success"><div class="progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="19" aria-valuemin="0" aria-valuemax="100" style="width:100%;"> <span>' + shipping_text + '</span> </div></div>';
                }
                addValue("calculate_supplier_extra_charges_"+supplier_id,shipping_charge);
                if (activePage == 'supplier_home_page' && !$("#cart_page").is(':visible')) {
                    $("#supplier_min_amount_message").html(supplier_data.name + " $" + (min_order_amont).toFixed(2));
                    $("#supplier_how_much_left").html(shipping_text);
                    $("#supplier_shipping_charge").html("(Shipping Charge $" + shipping_charge.toFixed(2) + ")");
                    $("#" + activePage + " div.ui-content div.minimum_shipping").html(shipping_html);
                    $(".cart_strip_header").addClass('cart_strip_header_supplier');
                    $(".cart_strip_header").append('<i id="cart_strip_header_cart" class="cart_strip_header_cart" onClick="event.preventDefault(); event.stopPropagation(); quickCheckout('+supplierID+');"><img src="img/cart_checkout.png"></i>');
                   

                } else if(cart_page_tab) {
                    $("#cart_page div.cart-page-contents div.minimum_shipping").html(shipping_html);
                    $(".cart_strip_header").removeClass('cart_strip_header_supplier');
                }
                
                setTimeout(function() {
                    hideLoading();
                }, 500);
            }, successCB, errorCB);


        });
    }

}
function quickCheckout(supplier_id){
    var supplier = sidebar_supplier.filter(function(obj) {
        return obj.supplier_id == supplier_id;
    });
    if (supplier.length == 0) {
        supplier = recently_viewed_supp.filter(function(obj) {
            return obj.supplier_id == supplier_id;
        });
    }
    if (supplier.length == 0) {
        toastMessage("Sorry, currently some technical glitch exist please close your app and try later");
        return false

    }
    getSingleColumn("customers_id", "customers", "WHERE customers_id > 0", function(data) {
        db.query('SELECT * FROM customers_basket WHERE supplier_id=' + supplierID + ' AND customers_id=' + data.customers_id + ' ORDER BY customers_basket_id DESC', function(tx, results) {
            var len = results.rows.length;
            var custom_listview_qty = $(".input_products_list_number").filter(function() { return $(this).val(); }).length;
            if (len > 0) {
                goTO('checkout_page');
                
            }else{
               if($("#saved_products").hasClass('active_supplier_option')){
                    var custom_listview_qty = $(".input_products_list_number").filter(function() { return $(this).val(); }).length;
                    if(custom_listview_qty<1){
                            toastMessage("Sorry, your cart is empty. Please enter your desired product quantity into the box.");
                    }else{
                         productsListAddtoCart();   
                    }
               }else{
                    toastMessage("Sorry, your cart is empty. Please add products for quick checkout.");
               }
               
               
            }
        }, successCB, errorCB);
    });

}
function productsListAddtoCart(){
    var count_cart = 1
    showLoading();
    $(".custom_listview_li").each(function (index) {
        var products_id        = $(this).data("id");
        var productSupplierID  = $(this).data("supplier-id");
        var products_qty       = $("#product_qty"+products_id).val();
        var custom_listview_qty = $(".input_products_list_number").filter(function() { return $(this).val(); }).length;
        if(Number(products_qty)>0){
            var customers_basket_quantity = products_qty;
            var package_id = $("#p" + products_id + " option:selected").val();
            if (typeof package_id == 'undefined' || package_id == '' || package_id == 0) {
                package_id = 0;
            }else {
                package_id = package_id;
            }
            var options_structure_complete = '';
            var options_structure_text_complete = '';
            var product_unique_code = '';
            var products_options_array = [];
            $('.new_option' + products_id).each(function(i, selected) {
                    var options_structure       = null;
                    var options_structure_text  = null;
                    var options_id          = $(selected).find('input.option_id_hidden').val();
                    var options_text        = $(selected).find('input.option_value_hidden').val();
                    var options_value_id    = $(selected).find('select option:selected').val();
                    var options_value_text  = $(selected).find('select option:selected').text();
                
                    options_structure = "{" + options_id + "}" + options_value_id;
                product_unique_code        += options_value_id + "-";
                options_structure_complete += options_structure;

                options_structure_text       = "{" + options_text + "}" + options_value_text;
                options_structure_text_complete += options_structure_text;
            });
            var pattern_products_id = $.trim(products_id + options_structure_complete);
            getSingleColumn("customers_basket_quantity", "customers_basket", "WHERE supplier_id=" + productSupplierID + " AND products_id = " + convertField(pattern_products_id), function(data) {
                if (data == '' || data == customers_basket_quantity) {
                    addCart(products_id,productSupplierID,false,true);
                    $(".input_products_list_number", this).removeClass('input_products_list_color_green');
                    $(".input_products_list_number", this).addClass('input_products_list_color_green');   
                } 
            });
            if(custom_listview_qty==count_cart){
                setTimeout(function() {
                  hideLoading();
                  goTO('checkout_page');
                       
                }, 1500);
            }
            count_cart++;
        }
        
    });
}
function updateCart(products_id) {
    var activePage = $.mobile.activePage.attr('id');
    var qty = $("#" + replaceChsaracters(products_id)).val();
    if (qty == '') {
        toastMessage("Invalid quantity.", "Error", "Ok");
        return false;
    }
    if (Number(qty) <= 0 || !Number(qty)) {
        toastMessage("Invalid quantity.", "Error", "Ok");
        return false;
    }
    if (Number(qty) > 100000) {
        toastMessage("Only 100000 quantity allowed.", "Error", "Ok");
        qty = 100000;
        $("#" + replaceChsaracters(products_id)).val(qty);
    }
    var sql = "UPDATE customers_basket SET customers_basket_quantity = " + Number(qty) + " WHERE products_id = " + convertField(products_id);
    db.execute(sql, successCB, errorCB);
    $("div.cart_html_main").html(loading_image);
    $("div.sub_total_div").html('');
    setTimeout(function() {
        cartPageHTML(supplierID);
        $.ajax({
            type: "POST",
            data: "action=updateCart&customers_id=" + customerID + "&customers_basket_quantity=" + Number(qty) + "&products_id=" + products_id,
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {}
        });


    }, 500);

}

function upgrade_avaliable_check() {
    if (display_upgrade_popup == false) {
        $.ajax({
            type: "POST",
            data: "action=checkupdateavailable",
            url: CONECTION_SERVER(),
            crossDomain: true,
            dataType: "json",
            success: function(dataresult) {
                if (dataresult.result == "success" && dataresult.display_popup == 'yes') {
                    var activePage = $.mobile.activePage.attr('id');
                    $('#' + activePage + ' .upgrade_message').html(dataresult.message);
                    display_upgrade_popup = true;
                    $('#upgrade_me_button_' + activePage).trigger('click');
                }
            }
        });
    }
}

function remind_update_appliacation_later() {
    var activePage = $.mobile.activePage.attr('id');
    $("#upgrade_popup_" + activePage).popup("close");
}

function update_application() {
    var activePage = $.mobile.activePage.attr('id');
    cordova.plugins.market.open('com.cart.gloveman');
    $("#upgrade_popup_" + activePage).popup("close");
}

function onkeyPressSearchHome(event) {
    if (event.keyCode === 13 || event.keyCode === 10) {
        searchSupp($("#search_home_value").val());
    }
}