function renderAddress(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    
    var repo_rendered = Mustache.render(template_html, collection);
    item_rendered.push(repo_rendered);

    $(container).html(item_rendered.join(''));
}

function renderBanner(banner_template,home_banner,banners){
    var item_list = [];
    var item_rendered = [];
    var banner_template_html = $(banner_template).html();
    Mustache.parse(banner_template_html);   // optional, speeds up future uses
    $.each( banners , function( key, val ) {
        today = new Date();
        start = new Date (val.start_date);
       
        start.setDate(start.getDate());
        if(val.url == "" || val.url === null){
           val.css = "style=cursor:default;";
           val.noLink = "return false";
        }
        if (start <= today){
            if (val.end_date){
                end = new Date (val.end_date);
                end.setDate(end.getDate() + 1);
                if (end >= today){
                    item_list.push(val);  
                }
            } else {
                item_list.push(val);
            }
        }
    });

    $.each( item_list , function( key, val ) {
        var repo_rendered = Mustache.render(banner_template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(home_banner).html(item_rendered.join(''));
}

function renderEvents(container, template, collection, centre){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if (val.eventable_type == "Store") {
            var store_details = getStoreDetailsByID(val.eventable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
        } else {
            val.store_name = centre;
        }
        
        // English Image
        if (val.event_image_url_abs.indexOf('missing.png') > 0){
            val.event_image_url_abs = "https://placehold.it/500x500";
        }
        // French Image
        if (val.event_image2_url_abs.indexOf('missing.png') > 0){
            if (val.event_image_url_abs.indexOf('missing.png') > 0){
                val.event_image2_url_abs = "https://placehold.it/500x500";
            } else {
                val.event_image2_url_abs = val.event_image_url_abs;
            }
        }
        
        // English Description
        if (val.description.length > 200){
            val.description_short = val.description.substring(0,200) + "...";
        } else {
            val.description_short = val.description
        }
        // French Description
        if (val.description_2.length > 200){
            val.description_short_2 = val.description_2.substring(0,200) + "...";
        } else {
            val.description_short_2 = val.description_2
        }
        
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_start = moment(start).locale('fr-ca');
        var french_end = moment(end).locale('fr-ca');
        if (start.format("DMY") == end.format("DMY")){
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM");
            }
        } else {
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D") + " - " + end.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM") + " - " + french_end.format("DD MMM");
            }
        }

        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderEventDetails(container, template, collection, mall_name){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if (val.eventable_type == "Store") {
            var store_details = getStoreDetailsByID(val.eventable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
            val.store_image = store_details.store_front_url_abs;
            val.store_slug = store_details.slug
            if (store_details.website != null && store_details.website.length > 0){
                val.show = "display:block";
                val.website = store_details.website
            } else {
                val.show = "display:none";
            }
            if (store_details.phone != null && store_details.phone.length > 0){
                val.phone_show = "display:block";
                val.phone = store_details.phone
            } else{
                val.phone_show = "display:none";
                val.show = "display:none";
            }
        } else {
            val.store_name = mall_name;
            val.store_image = "https://placehold.it/500x500";
            val.store_show = "display:none";
            val.phone_show = "display:none";
            val.show = "display:none";
            
            // English Image
            if (val.event_image_url_abs.indexOf('missing.png') > 0){
                val.show_img = "display: none"
            } else {
                val.image_url = val.promo_image_url_abs;
            }
            // French Image
            if (val.event_image2_url_abs.indexOf('missing.png') > 0){
                if (val.event_image_url_abs.indexOf('missing.png') > 0){
                    val.show_img = "display: none"
                } else {
                    val.image_url = val.event_image_url_abs;
                }
            } else {
                val.image_url = val.event_image2_url_abs;
            }
        }

        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_start = moment(start).locale('fr-ca');
        var french_end = moment(end).locale('fr-ca');
        if (start.format("DMY") == end.format("DMY")){
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM");
            }
        } else {
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D") + " - " + end.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM") + " - " + french_end.format("DD MMM");
            }
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderFeatureItems(){
    var items = getFeatureList();
    $.each(items, function(i, val){
        if(Cookies.get('current_locale') == "en-CA"){
            $('#feature_' + i).html('<a href="'+ val.url +'"><img src="'+ val.image_url+'" class="hoverer" alt="' +val.name+ '"><h5 class="center_h">'+ val.name +'</h5></a>')
        } else if(Cookies.get('current_locale') == "fr-CA"){
            $('#feature_' + i).html('<a href="'+ val.url +'"><img src="'+ val.image_url+'" class="hoverer" alt="' +val.name_2 + '"><h5 class="center_h">'+ val.name_2 +'</h5></a>');
        }
    })
}

function renderGallery(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.photo_url.indexOf('missing.png') > -1) {
            val.gallery_image = "//codecloud.cdn.speedyrails.net/sites/59c3f9f46e6f646526050000/image/jpeg/1507226103000/billingsbridge_default.jpg";
        } else {
            val.gallery_image = "//www.mallmaverick.com" + val.photo_url;
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderGeneral(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderHomeHours(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);    
    $.each( item_list , function( key, val ) {
        var day = getDay(val.day_of_week);
        val.day = day;
        if (val.open_time && val.close_time && (val.is_closed == false || val.is_closed == null)){
            var open_time = moment(val.open_time).tz(getPropertyTimeZone());
            var close_time = moment(val.close_time).tz(getPropertyTimeZone());

            if(Cookies.get('current_locale') == "en-CA"){
                val.h = val.day + " " + open_time.format("h:mmA") + " - " + close_time.format("h:mmA");
            } else if(Cookies.get('current_locale') == "fr-CA"){
                val.h = val.day + " " + open_time.format("H") + "h" + open_time.format("mm") + " - " + close_time.format("H") + "h" + close_time.format("mm");
            }
        } else {
            if(Cookies.get('current_locale') == "en-CA"){
                val.h = "Closed";
            } else if(Cookies.get('current_locale') == "fr-CA"){
                val.h = "Fermé";    
            }
            $('.hours_dot').css("background", "#cd1629");
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

// function renderHours(container, template, collection, type){
//     var item_list = [];
//     var item_rendered = [];
//     var template_html = $(template).html();
//     Mustache.parse(template_html);   // optional, speeds up future uses
//     if (type == "property_details"){
//         item_list.push(collection);
//         collection = []
//         collection = item_list;
//     }
//     if (type == "reg_hours") {
//         $.each( collection , function( key, val ) {
//             if (!val.store_id && val.is_holiday == false) {
//                 switch(val.day_of_week) {
//                 case 0:
//                     val.day = "Sunday"
//                     break;
//                 case 1:
//                     val.day = "Monday"
//                     break;
//                 case 2:
//                     val.day = "Tuesday"
//                     break;
//                 case 3:
//                     val.day = "Wednesday"
//                     break;
//                 case 4:
//                     val.day = "Thursday"
//                     break;
//                 case 5:
//                     val.day = "Friday"
//                     break;
//                 case 6:
//                     val.day = "Saturday"
//                     break;
//             }
//             if (val.open_time && val.close_time && val.is_closed == false){
//                 var open_time = moment(val.open_time).tz(getPropertyTimeZone());
//                 var close_time = moment(val.close_time).tz(getPropertyTimeZone());
//                 val.h = open_time.format("h:mmA") + " - " + close_time.format("h:mmA");
//             } else {
//                 "Closed"
//             }
//                 item_list.push(val)
//             }
//         });
//         collection = []
//         collection = item_list;
//     }
//     if (type == "holiday_hours") {
//         $.each( collection , function( key, val ) {
//             if (!val.store_id && val.is_holiday == true) {
//                 holiday = moment(val.holiday_date).tz(getPropertyTimeZone());
//                 var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//                 val.formatted_date = holiday.format("ddd, MMM D, YYYY");
                
//                 if (val.open_time && val.close_time && val.is_closed == false){
//                     var open_time = moment(val.open_time).tz(getPropertyTimeZone());
//                     var close_time = moment(val.close_time).tz(getPropertyTimeZone());
//                     if (val.open_time == "0:00 AM"){
//                         val.open_time = "12:00 AM"
//                     }
//                     if (val.close_time == "0:00 AM"){
//                         val.close_time = "12:00 AM"
//                     }
//                     val.h = open_time.format("h:mmA") + " - " + close_time.format("h:mmA");
//                 } else {
//                     val.h = "Closed"
//                 }
//                 if (val.h != "Closed"){
//                     item_list.push(val)
//                 }
//             }
//         });
//         collection = []
//         collection = item_list;
//     }
//     if (type == "closed_hours") {
//         $.each( collection , function( key, val ) {
//             if (!val.store_id && val.is_holiday == true) {
//                 holiday = moment(val.holiday_date).tz(getPropertyTimeZone());
//                 var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//                 val.formatted_date = holiday.format("ddd, MMM D, YYYY");
                
//                 if (val.open_time && val.close_time && val.is_closed == false){
//                     var open_time = moment(val.open_time).tz(getPropertyTimeZone());
//                     var close_time = moment(val.close_time).tz(getPropertyTimeZone());
//                     if (val.open_time == "0:00 AM"){
//                         val.open_time = "12:00 AM"
//                     }
//                     if (val.close_time == "0:00 AM"){
//                         val.close_time = "12:00 AM"
//                     }
//                     val.h = open_time.format("h:mmA") + " to " + close_time.format("h:mmA");
//                 } else {
//                     val.h = "Closed"
//                 }
//                 if (val.h == "Closed") {
//                     item_list.push(val)
//                 }
//             }
//         });
//         collection = []
//         collection = item_list;
//     }
//     $.each( collection , function( key, val ) {
//         var rendered = Mustache.render(template_html,val);
//         item_rendered.push(rendered);
//     });
//     $(container).html(item_rendered.join(''));
// }

function renderHours(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    if (type == "reg_hours") {
        $.each(collection, function(key, val) {
            if (!val.store_id && val.is_holiday == false) {
                var day = getDay(val.day_of_week);
                val.day = day;

                if(Cookies.get('current_locale') == "en-CA"){
                    if (val.open_time && val.close_time && val.is_closed == false){
                        var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                        var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                        val.close_time = close_time.format("h:mma");
                        val.h = open_time.format("h:mma") + " - " + close_time.format("h:mma");
                    } else {
                        val.h = "Closed";
                    }
                }
                if(Cookies.get('current_locale') == "fr-CA"){
                    if (val.open_time && val.close_time && val.is_closed == false){
                        var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                        var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                        val.close_time = close_time.format("h:mma");
                        val.h = open_time.format("H") + "h" + open_time.format("mm") + " à " + close_time.format("H") + "h" + close_time.format("mm");
                    } else {
                        val.h = "Fermé";
                    }
                }
                
                if (val.h == "Closed") {
                    item_list.push(val)
                }
            }
        });
        collection = [];
        collection = item_list;
    }
    if (type == "holiday_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                var holiday = moment(val.holiday_date).tz(getPropertyTimeZone());
                var today = moment().tz(getPropertyTimeZone());
                // if (holiday.format("YYYYMMDD") == today.format("YYYYMMDD")){
                //     val.active_class = "drop-down-row-today";
                // }
                // else{
                //     val.active_class = "";
                // }
                if(Cookies.get('current_locale') == "en-CA"){
                    val.formatted_date = holiday.format("MMM DD");
                    if (val.open_time && val.close_time && val.is_closed == false){
                        var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                        var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                        val.h = open_time.format("h:mma") + " - " + close_time.format("h:mma");   
                    } else {
                        val.h = "Closed";
                    }    
                }
                if(Cookies.get('current_locale') == "fr-CA"){
                    var french_holiday = moment(val.holiday_date).locale('fr-ca');
                    val.formatted_date = french_holiday.format("DD MMM");
                    if (val.open_time && val.close_time && val.is_closed == false){
                        var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                        var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                        val.h = open_time.format("H") + "h" + open_time.format("mm") + " à " + close_time.format("H") + "h" + close_time.format("mm");
                    } else {
                        val.h = "Fermé";
                    }
                }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    $.each( collection , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderJobs(container, template, collection, mall_name){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if(val.jobable_type == "Store"){
            var store_details = getStoreDetailsByID(val.jobable_id)
            val.store_name = store_details.name;
            val.store_slug = store_details.slug;
            val.store_show = "display: inline-block";
            val.mall_show = "display: none"
            if (store_details.store_front_url_abs.indexOf('missing.png') > -1){
                val.img_url = "https://placehold.it/500x500";
            } else {
                val.img_url = val.store_details.store_front_alt_url_abs
            }
        } else {
            val.store_name = mall_name;
            val.img_url = "https://placehold.it/500x500";
            val.store_show = "display: none";
            val.mall_show = "display: inline-block"
        }
        
        if (val.job_type === "Full Time") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "À plein temps";
            }
        } else if (val.job_type === "Part Time") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "À temps partiel";
            }
        } else if (val.job_type === "Part Time/Full Time") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "À temps partiel / À temps plein";
            }
        } else if (val.job_type === "Seasonal") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "Saisonnier";
            }
        }
        
        // English Description
        if (val.description.length > 200){
            val.description_short = val.description.substring(0,200) + "...";
        } else {
            val.description_short = val.description
        }
        // French Description
        if (val.description_2.length > 200){
            val.description_short_2 = val.description_2.substring(0,200) + "...";
        } else {
            val.description_short_2 = val.description_2
        }

        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_end = moment(end).locale('fr-ca');
        if(Cookies.get('current_locale') == "en-CA"){
            val.end_date = end.format("MMM D");
        }
        if(Cookies.get('current_locale') == "fr-CA"){
            val.end_date = french_end.format("D MMM");
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderJobDetails(container, template, collection, mall_name){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if(val.jobable_type == "Store"){
            var store_details = getStoreDetailsByID(val.jobable_id);
            val.store_name = store_details.name;
            if (store_details.store_front_url_abs.indexOf('missing.png') > 0) {
                val.store_image = "https://placehold.it/500x500";
            } else {
                val.store_image = store_details.store_front_url_abs;    
            }
            if (store_details.website != null && store_details.website.length > 0){
                val.website_show = "display: block";
                val.website = store_details.website
            } else {
                val.website_show = "display:none";
            }
            if (store_details.phone != null && store_details.phone.length > 0){
                val.phone_show = "display:block";
                val.phone = store_details.phone
            } else {
                val.phone_show = "display:none";
            }
            
            val.store_slug = store_details.slug
            val.store_link_show = "display: block;";
        } else {
            val.store_name = mall_name;
            val.store_image = "https://placehold.it/500x500";
            val.website_show = "display:none";
            val.phone_show = "display:none";
            val.store_link_show = "display: none";
            val.show = "display:none";
        }
        
        if (val.job_type === "Full Time") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "À plein temps";
            }
        } else if (val.job_type === "Part Time") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "À temps partiel";
            }
        } else if (val.job_type === "Part Time/Full Time") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "À temps partiel / À temps plein";
            }
        } else if (val.job_type === "Seasonal") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "Saisonnier";
            }
        }
        
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_end = moment(end).locale('fr-ca');
        if(Cookies.get('current_locale') == "en-CA"){
            val.end_date = end.format("MMM D");
        }
        if(Cookies.get('current_locale') == "fr-CA"){
            val.end_date = french_end.format("D MMM");
        }
    
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderNewStores(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if((val.store_front_url).indexOf('missing.png') > -1){
            val.alt_store_front_url = "//codecloud.cdn.speedyrails.net/sites/59c3f9f46e6f646526050000/image/jpeg/1507226103000/billingsbridge_default.jpg";
        } else {
            val.alt_store_front_url = getImageURL(val.store_front_url); 
        }
        
        var today = moment();
        var store_opens = moment(val.new_store_open_date);
        if(val.new_store_open_date != null || val.new_store_open_date != undefined){
            if (today.tz(getPropertyTimeZone()) <= store_opens.tz(getPropertyTimeZone())) {
                val.open = "Opens " + moment(val.new_store_open_date).format("MMM DD");
                val.show = "display: inline;";
            } else {
                val.open = "Now Open!"
                val.show = "display: inline;";
            }
        } else {
            val.show = "display: none;";
        }

        if (val.description.length  >= 190) {
            val.description_short = val.description.substring(0, 189) + "...";
        } else {
            val.description_short = val.description;
        }
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPromotions(container, template, collection, mall_name){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if (val.promotionable_type == "Store") {
            var store_details = getStoreDetailsByID(val.promotionable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
            val.store_show = "display: inline-block";
            val.mall_show = "display: none";

            // English Image
            if (val.promo_image_url_abs.indexOf('missing.png') > -1){
                if (store_details.store_front_url_abs.indexOf('missing.png') > 0) {
                    val.promo_image_url_abs = "https://placehold.it/500x500";
                } else {
                    val.promo_image_url_abs = store_details.store_front_url_abs;
                }
            }
            // French Image
            if (val.promo_image2_url_abs.indexOf('missing.png') > -1){
                if (val.promo_image_url_abs.indexOf('missing.png') > -1){
                    if (store_details.store_front_url_abs.indexOf('missing.png') > 0) {
                        val.promo_image_url_abs = "https://placehold.it/500x500";
                    } else {
                        val.promo_image_url_abs = store_details.store_front_url_abs;
                    }
                } else {
                    val.promo_image2_url_abs = val.promo_image_url_abs;
                }
            }
        
            val.store_slug = "/stores/" + store_details.slug
        } else {
            val.store_name = mall_name;
            val.store_slug = "/"
            val.store_show = "display:none;";
            val.mall_show = "display: inline-block";
            
            // English Image
            if (val.promo_image_url_abs.indexOf('missing.png') > -1){
                val.promo_image_url_abs = "https://placehold.it/500x500";
            }
            // French Image
            if (val.promo_image2_url_abs.indexOf('missing.png') > -1){
                if (val.promo_image_url_abs.indexOf('missing.png') > -1){
                    val.promo_image2_url_abs = "https://placehold.it/500x500";
                } else {
                    val.promo_image2_url_abs = val.promo_image_url_abs;
                }
            }
        }
        
        // English Description
        if (val.description.length > 200){
            val.description_short = val.description.substring(0,200) + "...";
        } else {
            val.description_short = val.description
        }
        // French Description
        if (val.description_2.length > 200){
            val.description_short_2 = val.description_2.substring(0,200) + "...";
        } else {
            val.description_short_2 = val.description_2
        }
        
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_start = moment(start).locale('fr-ca');
        var french_end = moment(end).locale('fr-ca');
        if (start.format("DMY") == end.format("DMY")){
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM");
            }
        } else {
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D") + " - " + end.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM") + " - " + french_end.format("DD MMM");
            }
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPromoDetails(container, template, collection, mall_name){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if (val.promotionable_type == "Store") {
            var store_details = getStoreDetailsByID(val.promotionable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
            
            val.store_slug = store_details.slug
            val.store_show = "display:block";
            if (store_details.store_front_url_abs.indexOf('missing') > 0) {
                val.store_image = "https://placehold.it/500x500";
            } else {
                val.store_image = store_details.store_front_url_abs;
            }
            if (store_details.website != null && store_details.website.length > 0){
                val.show = "display:block";
                val.website = store_details.website
            } else {
                val.show = "display:none";
            }
            
            if (store_details.phone != null && store_details.phone.length > 0){
                val.phone_show = "display:block";
                val.phone = store_details.phone
            } else {
                val.phone_show = "display:none";
            }
            
            // English Image
            if (val.promo_image_url_abs.indexOf('missing.png') > 0){
                val.show_img = "display: none"
            } else {
                val.image_url = val.promo_image_url_abs;
            }
            // French Image
            if (val.promo_image2_url_abs.indexOf('missing.png') > 0){
                if (val.promo_image_url_abs.indexOf('missing.png') > 0){
                    val.show_img = "display: none"
                } else {
                    val.image_url = val.promo_image_url_abs;
                }
            } else {
                val.image_url = val.promo_image2_url_abs;
            }
        } else {
            val.store_name = mall_name;
            val.store_image = "https://placehold.it/500x500";
            val.store_show = "display:none";
            val.phone_show = "display:none";
            val.show = "display:none";
            
            // English Image
            if (val.promo_image_url_abs.indexOf('missing.png') > 0){
                val.show_img = "display: none"
            } else {
                val.image_url = val.promo_image_url_abs;
            }
            // French Image
            if (val.promo_image2_url_abs.indexOf('missing.png') > 0){
                if (val.promo_image_url_abs.indexOf('missing.png') > 0){
                    val.show_img = "display: none"
                } else {
                    val.image_url = val.promo_image_url_abs;
                }
            } else {
                val.image_url = val.promo_image2_url_abs;
            }
        }

        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_start = moment(start).locale('fr-ca');
        var french_end = moment(end).locale('fr-ca');
        if (start.format("DMY") == end.format("DMY")){
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM");
            }
        } else {
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D") + " - " + end.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM") + " - " + french_end.format("DD MMM");
            }
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPosts(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/59c3f9f46e6f646526050000/image/jpeg/1507226103000/billingsbridge_default.jpg";
        } else {
            val.post_image = val.image_url;
        }
        
        if(val.body.length > 175){
            val.description_short = val.body.substring(0, 175) + "...";
        } else {
            val.description_short = val.body;
        }
        val.description_short = val.description_short.replace("&amp;", "&");
        
        val.slug = "posts/" + val.slug;
        
        val.twitter_title = val.title + " via @Billings_Bridge";
        
        val.counter = counter;
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter = counter + 1;
    });
    $(container).html(item_rendered.join(''));
}

function renderPostDetails(container, template, collection, blog_posts){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    $.each(collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/59c3f9f46e6f646526050000/image/jpeg/1507226103000/billingsbridge_default.jpg";
        } else {
            val.post_image = val.image_url;
        }
        
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        } else {
            val.description_short = val.body;
        }

        var blog_list = [];
        $.each(blog_posts, function(key, val) {
            var slug = val.slug;
            blog_list.push(val.slug);
        });
        var current_slug = val.slug;
        var index = blog_list.indexOf(current_slug);
        if(index >= 0 && index < blog_list.length){
            var next_slug = blog_list[index + 1];
            if(next_slug != undefined || next_slug != null){
                val.next_post = "/posts/" + next_slug;
                val.next_show = "display: block";
            } else {
                val.next_show = "display: none";
            }
        }
        if(index >= 0 && index < blog_list.length){
            var prev_slug = blog_list[index - 1];
            if(prev_slug != undefined || prev_slug != null){
                val.prev_post = "/posts/" + prev_slug;
                val.prev_show = "display: block";
            } else {
                val.prev_show = "display: none";
            }
        }

        val.twitter_title = val.title + " via @Billings_Bridge";
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderSinglePost(container, template, main_post){
    var item_list = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses

    if (main_post.image_url.indexOf('missing.png') > 0) {
        main_post.post_image = "//codecloud.cdn.speedyrails.net/sites/59c3f9f46e6f646526050000/image/jpeg/1507226103000/billingsbridge_default.jpg";
    } else {
        main_post.post_image = main_post.image_url;
    }
        
    if(main_post.body.length > 235){
        main_post.description_short = main_post.body.substring(0,235) + "...";
    } else{
        main_post.description_short = main_post.body;
    }
    main_post.description_short = main_post.description_short.replace("&amp;", "&");
    
    main_post.slug = "posts/" + main_post.slug;
    
    main_post.twitter_title = main_post.title + " via @Billings_Bridge";
    
    var rendered = Mustache.render(template_html, main_post);
    item_list.push(rendered);
    $(container).html(item_list.join(''));
}

function renderStoreList(container, template, collection, starter, breaker){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    var store_initial="";
    $.each( collection , function( key, val ) {
        if(!val.store_front_url ||  val.store_front_url.indexOf('missing.png') > -1 || val.store_front_url.length === 0){
            val.alt_store_front_url = "";
        } else {
            val.alt_store_front_url = getImageURL(val.store_front_url);    
        }
        
        if(val.categories != null){
            try {
                val.cat_list = val.categories.join(',');
            } catch(err) {
                console.log(err);
            }
        }
        
        var current_initial = val.name[0];
        if(store_initial.toLowerCase() == current_initial.toLowerCase()){
            val.initial = "";
            val.show = "display:none;";
        } else {
            val.initial = current_initial;
            store_initial = current_initial;
            val.show = "display:block;";
        }
        
        if (val.promotions != null){
            val.promotion_exist = "display:inline-block";
        } else {
            val.promotion_exist = "display:none";
        }
        
        if (val.jobs != null){
            val.job_exist = "display:inline-block";
        } else {
            val.job_exist = "display:none";
        }
        
        val.block = current_initial + '-block';
        var rendered = Mustache.render(template_html,val);
        var upper_current_initial = current_initial.toUpperCase();
        if (upper_current_initial.charCodeAt(0) <= breaker.charCodeAt(0) && upper_current_initial.charCodeAt(0) >= starter.charCodeAt(0)){
            item_rendered.push(rendered);
        }
    });
    $(container).html(item_rendered.join(''));
}

function renderStoreDetails(container, template, collection, slug){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        var store_front_url = getAssetURL(val.id);
        if(store_front_url != "" && store_front_url != undefined && store_front_url != null) {
            val.store_front = "//mallmaverick.com" + store_front_url;
            val.show_img = "display: block";
        } else {
            val.show_img = "display: none";    
        }
        
        if ((val.store_front_url).indexOf('missing.png') > -1){
            val.alt_store_front_url = "//codecloud.cdn.speedyrails.net/sites/59c3f9f46e6f646526050000/image/jpeg/1507226103000/billingsbridge_default.jpg";
        } else {
            val.alt_store_front_url = getImageURL(val.store_front_url); 
        }

        if (val.website != null && val.website.length > 0){
            val.show = "display:block";
        } else {
            val.show = "display:none";
        }
        
        if (val.phone != null && val.phone.length > 0){
            val.phone_show = "display:block";
        } else {
            val.phone_show = "display:none";
        }
        
        val.map_x_coordinate = val.x_coordinate - 19;
        val.map_y_coordinate = val.y_coordinate - 58;
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}