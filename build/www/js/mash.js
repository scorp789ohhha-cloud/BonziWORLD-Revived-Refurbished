
var animFrame =	window.requestAnimationFrame 		||
				window.webkitRequestAnimationFrame 	||
				window.mozRequestAnimationFrame    	||
				window.oRequestAnimationFrame      	||
				window.msRequestAnimationFrame     	||
				null;

var App_Bonzi = {	// it begins
	// HELPER METHODS
	range:	function(begin, end) {
				var array = [];
				for (var i = begin; i <= end; i++)
					array.push(i);
				for (var i = begin; i >= end; i--)
					array.push(i);
				return array;
			},

	guid: 	function() {
				function s4() {
					return Math.floor((1 + Math.random()) * 0x10000)
					  .toString(16)
					  .substring(1);
				}
				return s4() + s4() + s4() + s4();
			},

	replaceAll: function(t, s, r) {
				    return t.replace(new RegExp(s, 'g'), r);
				},
						
	// INITALIZATION/CONSTANTS
	recursiveAnim:		null,
	fps_target:			1000.0 / 60.0,
	
	// PRELOADING
	data:				{},
	data_queue:			[],	
	
	preload: 			null,
	assets: 			null,
	manifest: 			[{
							src:	"./img/bonzi/purple.png",
							id:		"spritesheet_bonzi"
						},{
							src:	"./img/bonzi/peedy.png",
							id:		"spritesheet_peedy"
						},{
							src:	"./js/mash/obj_bonzi.js"
						},{
							src:	"./js/mash/bonzi_data.js"
						},{
							src:	"./js/mash/xp_window.js"
						},{
							src:	"./js/lib/speakjs/speakClient.js"
						}],
	preload_start:		function() {

							if (typeof bonzi_base_url !== "undefined")
								for (var i=0;i<this.manifest.length;i++)
									this.manifest[i].src = bonzi_base_url + this.manifest[i].src;
							else
								bonzi_base_url = ""

							this.base_url = bonzi_base_url;

							this.assets = [];
							this.preload = new createjs.LoadQueue(true, "", true);
							this.preload.installPlugin(createjs.Sound);          
							this.preload.on("fileload", this.preload_filedone);
							this.preload.on("error", this.preload_error);
							this.preload.on("complete", this.preload_done);
							this.preload.loadManifest(this.manifest);
						},
	preload_error:		function(e) {
							console.log("Error!", e.text);
						},
						
	// APP NAME HARDCODED INTO FOLLOWING FUNCTIONS, REFACTORING NECESSARRY UPON NAME CHANGE
	preload_filedone:	function(e) {
							console.log("A file has loaded of type: " + e.item.type);
							App_Bonzi.assets.push(e);
						},
	preload_done:		function(event) {
							console.log("Finished Loading Assets");
							
							for (var i=0;i < App_Bonzi.data_queue.length;i++)
								App_Bonzi.data_queue[i]();
							
							$("#bonzi_speak").click(function(){
								$("#bonzi_speak_window").show();
							});

							$(".xp_menu_root *").each(function(i) {
								$.data($(".xp_menu_root *")[i], "xp_menu", true);
							});
							
							$(".xp_menu_list > *").click(function(e) {
								if (
									!$(e.target).hasClass("xp_menu_option_submenu") &&
									!$(e.target).hasClass("xp_menu_divider")
								)
									$(".xp_menu").each(function(i) {
										$($(".xp_menu")[i]).removeClass('xp_menu_open');
									});
							});
							
							$(".xp_menu_option_submenu").each(function(i) {
								$($(".xp_menu_option_submenu")[i]).attr("id", "xp_menu_option_submenu_" + App_Bonzi.guid());
								$($(".xp_menu_option_submenu")[i]).hover(function(e) {
									var id = "#" + e.delegateTarget.id;
									if (e.type == "mouseenter") {
										$.data($(id)[0], "timeout_enter", eval(" \
											setTimeout(function() { \
												$('" + id + "' + '> .xp_submenu').addClass('xp_menu_open') \
											},500); \
										"));
										clearTimeout($.data($(id)[0], "timeout_leave"));
									} else if (e.type == "mouseleave") {
										$.data($(id)[0], "timeout_leave", eval(" \
											setTimeout(function() { \
												$('" + id + "' + '> .xp_submenu').removeClass('xp_menu_open') \
											},500); \
										"));
										clearTimeout($.data($(id)[0], "timeout_enter"));
									}
								});
							});
							
							$(document).mousedown(function(e) {
								if ((e.which == 1) && !$.data($(e.target)[0], "xp_menu"))
									$(".xp_menu").each(function(i) {
										$($(".xp_menu")[i]).removeClass('xp_menu_open');
									});
								else if (e.target.className == "xp_menu_option_submenu")
									$("#" + e.target.id + " > .xp_submenu").addClass('xp_menu_open');
							});
							
							App_Bonzi.add_obj(App_Bonzi.array_objects, new App_Bonzi.obj_bonzi(), "bonzi");
							App_Bonzi.add_obj(App_Bonzi.array_objects, new App_Bonzi.obj_peedy(), "peedy");
							if (animFrame !== null) {
								App_Bonzi.recursiveAnim = function() {
									App_Bonzi.mainloop();
									animFrame(App_Bonzi.recursiveAnim);
								};
								animFrame(App_Bonzi.recursiveAnim);
							} else {
								setInterval(App_Bonzi.mainloop, App_Bonzi.fps_target);
							}
						},
						
	// END OF HARDCODED NAME, I'M SORRY FOR BEING SUCH A TERRIBLE PROGRAMMER
	content_from_id:	function(id) {
							for (var i = 0; i < this.assets.length; i++)
								if (this.assets[i].item.id == id)
									return this.assets[i].result;
						},
						
	// MAINLOOP
	mainloop:			function() {
							for (var i = 0; i < this.array_objects.length; i++)
								this.array_objects[i].update();
						},
						
	// OBJECTS
	array_objects:		[],
	add_obj:			function(array, obj, tag) {
							obj.tag = tag;
							obj.init();
							array.push(obj);
						},
	find_obj:			function(array, tag) {
							for (var i = 0; i < array.length; i++)
								if (array[i].tag == tag)
									return array[i];
						},
	remove_obj:			function(array, index_or_tag) {}
}				// it concludes

$(document).ready(function() {
	App_Bonzi.preload_start();
});
 
// TEST FUNCTIONS

/* function tmp_1(name, start, end) {
	console.log(
'			' + name + '_fwd: [' + start + ', ' + (end - 1) + ', "' + name + '_still", this.framerate], \n\
			' + name + '_still: ' + end + ', \n\
			' + name + '_back: { \n\
				frames: this.app.range(' + (end - 1) + ', ' + start + '), \n\
				next: "idle", \n\
				speed: this.framerate \n\
			},'
	); 
} */