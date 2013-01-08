/**
 * core dime-shs file.
 * common methods, functionality and so on.
 * shortcut: namespace crusty.*
 */

Object.size = function(obj) {
    var size = 0;
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

Object.values = function(obj){
	var C,d=0,Z=[];for(C in obj){if(!obj.hasOwnProperty(C)){continue;}Z[d++]=obj[C];}return Z;
}


/*

    ======================
    ---- DS CORE INITs----
    ======================
    
*/
crusty = {
	resizables:[], // a dictionary of function names:param . the list will be exectuted with relative params by crusty.resize().  
	initialisables:["crusty.resize"],
	scrollables:["crusty.scrolling.scroll"], // a lit of handlers for $.scroll()
	width:0,
	height:0,
	initialised: false
};

crusty.init = function(){
	crusty.log("[crusty.init…]","ehi dude");
	for( var f in crusty.initialisables ){
		eval( crusty.initialisables[f] )( );	
	}		
	crusty.initialised = true;
	$(window).on("resize",crusty.resize);
}

crusty.resize = function(){
	crusty.width = $(window).width();
	crusty.height = $(window).height();
	crusty.log("[crusty.resize]", crusty.width, crusty.height);
	
	for( var f in crusty.resizables ){
		eval(  crusty.resizables[ f ] )( );	
	}
} 

crusty.scroll = function(){
	for( var f in crusty.scrollables ){
		eval( crusty.scrollables[ f ] )(  );	
	}	
}


/*

    =================
    ---- TOOLTIP ----
    =================

*/
crusty.tooltip = {}
crusty.tooltip.init = function(){
	$('.tip').tooltipsy();
	$('.tip-right').tooltipsy({offset: [10, 0]});
	$('.tip-top-right').tooltipsy({offset: [10, -10]});
	$('.tip-bottom').tooltipsy({offset: [0, 10]});
	crusty.log( "[crusty.tooltip.init]");
}



/*

    =================
    ---- SIDEBAR ----
    =================

*/
crusty.sidebar = {}
crusty.sidebar.resize = function(){
	$("sidebar").height( crusty.height -  $("header").height() - $("footer").height() );
}

/*

    =========================
    ---- COMMON HANDLERS ----
    =========================

*/
crusty.handlers ={}

crusty.handlers.ajax ={}
crusty.handlers.ajax.is_valid = function( result ){ if( result.status == "ok" ){return true;}crusty.log("[crusty.p.handlers.ajax.is_valid] failed, error found:", result.error );return false }

crusty.handlers.magic ={}

crusty.handlers.magic.uninvalidate = function(){ crusty.log("[crusty.handlers.magic.uninvalidate]"); $(".invalid").removeClass("invalid");}

crusty.handlers.magic.invalidate = function( errors, namespace ){ if (!namespace){ namespace = "id";} crusty.log("[crusty.handlers.magic.invalidate] namespace:",namespace, " errors:",errors );
	for (var i in errors){
		if( i.indexOf("_date") != -1  ){
			console.log( "#"+namespace+"_"+i+"_day" );
			$("#"+namespace+"_"+i+"_day").parent().addClass("invalid");	
			continue;
		} else if (i.indexOf("_type") != -1 ){
			$("#"+namespace+"_"+i).parent().addClass("invalid");
			continue;
		} else if( i.indexOf("_hours") != -1 || i.indexOf("_minutes") != -1  ) {
			$("#"+namespace+"_"+i).parent().addClass("invalid");
			continue;	
		}
		$("#"+namespace+"_"+i).addClass("invalid");
	}
}


/*

    ==============
    ---- LOGS ----
    ==============

*/
crusty.log = function(){
	try{
		console.log.apply(console, arguments);
	} catch(e){
			
	}
}


/**
 *
 * SCROLLING STUFFS
 *
 */
crusty.scrolling = {};
crusty.scrolling.init = function(){
	$().UItoTop({text:"hi"});	
}
crusty.scrolling.to = function( value ){
	$('body,html').animate({scrollTop: 0}, 250)
}

crusty.scrolling.scroll = function(){
	if( $( document ).scrollTop() > 50 ){
		$(".item.totop").fadeIn( "fast" );	
	} else {
		$(".item.totop").fadeOut( "fast" );
	}		
}



/**
 * modals resizing 
 */
crusty.modals ={}
crusty.modals.resize = function(){
	crusty.log("[crusty.modals.resize]");
	var $modal = $(".modal");
	// var modal_height = $modal.height( crusty.height- 50);
	// $modal.css({"margin-top": 0, "top": 10});
	// $(".modal-body").css({"height": crusty.height- 150, "overflow-y":"scroll" } );
	
}



/*

    ===============
    ---- TOAST ----
    ===============
*/

crusty.toast = function( message, title, options ){
	// note: require toastmessage plugin
	
	if( !options || !title ){
		options={};
	} 
	if( typeof title == "object" ){
		options = title;
		title = undefined;
	}
	
	if( options.cleanup != undefined )
		$().toastmessage('cleanToast');
		
	var settings = $.extend({
		text: "<div>" + (!title?'<h1>'+ message +'</h1>':"<h1>"+ title +"</h1><p>"+ message +"</p>") +"</div>",
		type: 'notice',
		position:'middle-center',
		inEffectDuration: 200,
		outEffectDuration: 200,
		stayTime:3000
	}, options);
	$().toastmessage('showToast', settings );
}


crusty.f ={}
crusty.f.format_date = function( date ){
	
	var d = date.getDate();
	d = d < 10?"0"+d:d;
	return  d+ " " +crusty.vars.short_months.fr[ date.getMonth() ] + " " +date.getFullYear()		;
}	

crusty.f.format = {};

crusty.f.format.day = function( date ){
	var d = date.getUTCDate();
	var m = date.getUTCMonth() + 1;
	return  ( d < 10?"0"+d:d ) + "." + ( m < 10?"0"+m:m ) + "." +date.getUTCFullYear();
}	
crusty.f.format.minutes = function( date, verbose ){
	
	var d = date.getUTCDate();
	var M = date.getUTCMonth() + 1;
	var h = date.getUTCHours();
	var m = date.getUTCMinutes();
	
	if( verbose )
		return  d + " " + crusty.vars.short_months.fr[ M - 1 ] + " " +date.getUTCFullYear() + ' ' + ( h < 10?"0"+h:h ) + ':' + ( m < 10?"0"+m:m );
	return  ( d < 10?"0"+d:d ) + "/" + ( M < 10?"0"+M:M ) + "/" +date.getUTCFullYear() + ' ' + ( h < 10?"0"+h:h ) + ':' + ( m < 10?"0"+m:m );
}	

crusty.vars = {
	short_months:{
		en:[],
		fr:["Jan","Fév", "Mar","Avr", "Mai","Juin","Juil","Aoû","Sept","Oct","Nov","Déc" ]	
	},
	full_months:{
		en:[],
		fr:["janvier","février", "mars","avril", "mai","juin","juillet","août","septembre","octobre","novembre","décembre" ]	
	}	
}



/*

    ==================================
    ---- LOST IN TRANSLATIONS API ----
    ==================================
    
*/
crusty.i18n = { lang:'fr-FR'};
crusty.i18n.translate = function( key ){
	var l = ds.i18n.lang;
	if ( ds.i18n.dict[l][key] == undefined	)
		return key;
	return 	ds.i18n.dict[l][key];
}

crusty.i18n.dict = {
	'fr-FR':{
		"warning":"Attention",
		"delete selected absence":"Voulez-vous supprimer cette absence?",
		"offline device":"Échec de la connexion.",
		"check internet connection":"Veuillez vérifier la connexion internet de la tablette.",
		"welcome back":"welcome back",
		"loading":"chargement en cours…",
		"form errors":"Erreurs dans le formulaire",
		"error":"Erreur",
		"invalid form":"Veuillez vérifier les champs en rouge.",
		"empty message field":"Le message est vide.",
		"message sent":"Message envoyé",
		"timeout device":"Connexion trop lente.",
		"try again later": "Veuillez réessayer dans quelques instants.",
		"saving":"enregistrement en cours…",
		"changes saved":"Modifications Sauvegardées",
		"changes saved successfully":"Modifications Sauvegardées",
		"password should be at least 8 chars in length":"Le mot de passe doit faire au moins 8 caractères.",
		"password too short":"Le mot de passe est trop court",
		"password changed":"Le mot de passe a été changé",
		"new passwords not match":"Saisissez à nouveau le nouveau mot de passe.",
		"invalid password":"Veuillez vérifier votre ancien mot de passe en respectant les minuscules et les majuscules."
	}	
}







