
var xp_window = { };

$(function(){
	$(".xp_window_bar").mousedown(function(e) {
		if ((e.which == 1) && (e.target.className == "xp_window_bar")) {
			var par = xp_window.element = $($(e.currentTarget).parent()[0]);
			xp_window.drag_start = {
				x: e.pageX - parseInt(par.css("marginLeft")),
				y: e.pageY - parseInt(par.css("marginTop"))
			};
			
			$(window).on("mousemove.xp_window", function(e) {
				var par = xp_window.element;
				par.css("marginLeft", e.pageX - xp_window.drag_start.x);
				par.css("marginTop", e.pageY - xp_window.drag_start.y);
			});
			
			$(window).mouseup(function(e) {
				$(window).unbind("mousemove.xp_window");
			});
		}
	});

	$(".xp_window_close, .xp_window_cancel").mouseup(function(e){
		var par = $($(e.currentTarget).closest(".xp_window")[0]);
		par.hide();
	});
	
	$(window).mousedown(function(e) {
		$(".xp_window").each(function(i) {
			$($(".xp_window")[i]).addClass("xp_window_deselect");
		});
		var par = $(e.target).closest('.xp_window');
		if (par.length)
			$(par[0]).removeClass("xp_window_deselect");
	});
});
