/*

    ==========================
    ---- HEATGRAPH SCRIPT ----
    ==========================

*/
crusty.h = {}


crusty.h.init = function(){
	
	// on press entyer, preview. Check dimensions
	$(document).keypress(function(e) {if(e.which == 13) { crusty.h.preview();}});

	$(document).on(  "change", "input", function(event){ 
		if( event.currentTarget.id == "color_heatmap"){
			$("#color-scale").slideDown(200, function(){
				$("#render").trigger("click");
			});
		} else if ( event.currentTarget.id == "bnw_heatmap" || event.currentTarget.id =="overlay_heatmap" ){
			$("#color-scale").slideUp(200, function(){
				$("#render").trigger("click");	
			});	
		} else {
			//$("#render").trigger("click");	
		}
	});

	// on select, let's change
	$(document).on( "change", "select", crusty.h.preview );
	
}

crusty.h.preview = function(){
	$("#render").trigger("click");
};


crusty.h.combobox ={}
crusty.h.combobox.init = function(){
	$( "#egoSelectMenu" ).combobox().on("selected", crusty.h.preview);
};


/*

    =========================
    ---- COMBOBOX PLUGIN ----
    =========================

*/
(function( $ ) {
	$.widget( "ui.combobox", {
		_create: function() {
			var input,
				self = this,
				select = this.element.hide(),
				selected = select.children( ":selected" ),
				value = "",
				wrapper = this.wrapper = $( "<span>" )
					.addClass( "ui-combobox" )
					.insertAfter( select );

			input = $( "<input>" )
				.appendTo( wrapper )
				.val( value )
				.attr("placeholder","ego mode: select a node")
				.addClass( "ui-state-default ui-combobox-input" )
				.autocomplete({
					delay: 0,
					minLength: 0,
					source: function( request, response ) {
						var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
						response( select.children( "option" ).map(function() {
							var text = $( this ).text();
							if ( this.value && ( !request.term || matcher.test(text) ) )
								return {
									label: text.replace(
										new RegExp(
											"(?![^&;]+;)(?!<[^<>]*)(" +
											$.ui.autocomplete.escapeRegex(request.term) +
											")(?![^<>]*>)(?![^&;]+;)", "gi"
										), "<strong>$1</strong>" ),
									value: text,
									option: this
								};
						}) );
					},
					select: function( event, ui ) {
						ui.item.option.selected = true;
						self._trigger( "selected", event, {
							item: ui.item.option
						});
						crusty.h.preview();

					},
					change: function( event, ui ) {
						if ( !ui.item ) {
							var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
								valid = false;
							select.children( "option" ).each(function() {
								if ( $( this ).text().match( matcher ) ) {
									this.selected = valid = true;
									return false;
								}
							});
							if ( !valid ) {
								// remove invalid value, as it didn't match anything
								$( this ).val( "" );
								select.val( "" );
								input.data( "autocomplete" ).term = "";
								return false;
							} 
						}
					}
				})
				.addClass( "ui-widget ui-widget-content ui-corner-left" );

			input.data( "autocomplete" )._renderItem = function( ul, item ) {
				return $( "<li></li>" )
					.data( "item.autocomplete", item )
					.append( "<a>" + item.label + "</a>" )
					.appendTo( ul );
			};

			$( "#dropdown" )
				.attr( "tabIndex", -1 )
				.attr( "title", "Show All Items" )
				.text("select a node...")
				.removeClass( "ui-corner-all" )
				.addClass( "ui-corner-right ui-combobox-toggle" )
				.click(function() {
					// close if already visible
					if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
						input.autocomplete( "close" );
						return;
					}

					// work around a bug (likely same cause as #5265)
					$( this ).blur();

					// pass empty string as value to search for, displaying all results
					input.autocomplete( "search", "" );
					input.focus();
				});
		},

		destroy: function() {
			this.wrapper.remove();
			this.element.show();
			$.Widget.prototype.destroy.call( this );
		}
	});
})( jQuery );