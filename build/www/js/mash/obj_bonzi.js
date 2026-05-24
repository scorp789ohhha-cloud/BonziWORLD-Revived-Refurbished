
App_Bonzi.obj_bonzi = function() {
	this.name = "Bungo";
	this.framerate = 15.0/60.0;
	
	this.event_make = function(list) {
		var e = {
			list: list,
			index: 0,
			timer: 0,
			cur: function() { return this.list[this.index] }
		};
		return e;
	}
	
	this.init = function() {
		this.data = App_Bonzi.data.bonzi;

		//	HTML SETUP
		$("#canvas")	.attr("width", this.data.size.x)
							.attr("height", this.data.size.y);

		$("#bonzi_speak_say").click(function() {
			$("#bonzi_cont").data('parent').run_single_event([{
				type: "text",
				text: $("#bonzi_speak_text").val()
			}]);
		});
							
		// CREATEJS INIT
		this.stage = new createjs.Stage("canvas");
		this.sprite_1_sheet = new createjs.SpriteSheet(this.data.sprite);
		this.sprite_1 = new createjs.Sprite(this.sprite_1_sheet, "idle");
		this.sprite_1.x = 0;
		this.sprite_1.y = 0;
		this.stage.addChild(this.sprite_1);

		this.drag = false;
		this.dragged = false;
		
		$.data($("#bonzi_cont")[0], "parent", this);
		
		var generate_event = function(a, b, c) { // Selector, event, function
			$(a)[b](function(e) {$.data($('#bonzi_cont')[0], 'parent')[c](e)});
		};
		
		generate_event(
			"#canvas",
			"mousedown",
			"mousedown"
		);
		
		generate_event(
			window,
			"mousemove",
			"mousemove"
		);
		
		generate_event(
			window,
			"mouseup",
			"mouseup"
		);
		
		generate_event(
			"#bonzi_joke",
			"click",
			"joke"
		);

		generate_event(
			"#bonzi_fact",
			"click",
			"fact"
		);
		
		generate_event(
			"#bonzi_personality",
			"click",
			"personality"
		);
		
		$("#canvas").on("contextmenu", function(e) {
			e.preventDefault();
			
			$("#bonzi_xp_menu").css({
				top: event.pageY + "px",
				left: event.pageX + "px"
			}).removeClass('xp_menu_open');
			
			setTimeout(function() {
				$("#bonzi_xp_menu").addClass('xp_menu_open');
			},1);
		});
		
		this.run_single_event([{
			type: "anim",
			anim: "surf_intro",
			ticks: 30
		}]);
		var _this = this;
		setInterval((function() {
			_this.stage.update();
		}).bind(_this), 1000.0 / 20.0);
	}
	
	this.mousedown = function(e) {
		if (e.which == 1) {
			this.drag = true;
			this.dragged = false;
			this.drag_start = {
				x: e.pageX - parseInt($("#bonzi_cont").css("marginLeft")),
				y: e.pageY - parseInt($("#bonzi_cont").css("marginTop"))
			};
		}
	}
	
	this.mousemove = function(e) {
		if (this.drag) {
			$("#bonzi_cont").css("marginLeft", e.pageX - this.drag_start.x);
			$("#bonzi_cont").css("marginTop", e.pageY - this.drag_start.y);
			this.dragged = true;
		}
	}
	
	this.mouseup = function(e) {
		if (!this.dragged && this.drag)
			this.cancel();

		this.drag = false;
		this.dragged = false;
	}

	this.event_queue = [];
	this.event_run = true;
	this.event = null;

	this.run_single_event = function(list) {
		if (this.event_queue.length == 0)
			this.event_queue.push(this.event_make(list));
	}
	
	this.joke = function() {
		this.run_single_event(this.data.event_list_joke);
	}

	this.fact = function() {
		this.run_single_event(this.data.event_list_fact);
	}
	
	this.personality = function() {
		this.run_single_event([{
			type: "text",
			text: "GÌ¶UÌ¶EÌ¶RÌ¶IÌ¶LÌ¶LÌ¶AÌ¶SÌ¶ GORILLAS HAVE UNREALISTIC EXPECTATIONS",
			say: "GORILLAS HAVE UNREALISTIC EXPECTATIONS"
		}]);
	}
	
	this.cancel = function() {
		this.event_queue = [this.event_make([{type:"idle"}])];
		$("#bonzi_xp_bubble").css("display", "none");
	}
	
	this.update = function() {
		if (parseInt($("#bonzi_cont").css("marginLeft")) < ($(window).width() / 2))
			$("#bonzi_xp_bubble")	.css("marginLeft", parseInt($("#canvas").css("marginLeft")) + this.data.size.x)
									.removeClass("bubble_xp_rev").addClass("bubble_xp");
		else
			$("#bonzi_xp_bubble")	.css("marginLeft", parseInt($("#canvas").css("marginLeft")) - parseInt($("#bonzi_xp_bubble").width()))
									.removeClass("bubble_xp").addClass("bubble_xp_rev");

		$("#bonzi_xp_bubble").css("marginTop", parseInt($("#canvas").css("marginTop")) + 50);
		
		if ((this.event_queue.length != 0) && (this.event_queue[0].index >= this.event_queue[0].list.length))
			this.event_queue.splice(0,1);
		
		this.event = this.event_queue[0];
		
		if ((this.event_queue.length != 0) && this.event_run) {
			switch (this.event.cur().type) {
				case "anim":
					if (this.event.timer == 0)
						this.sprite_1.gotoAndPlay(this.event.cur().anim);
					this.event.timer += this.framerate;
					if (this.event.timer >= this.event.cur().ticks) {
						this.event_next();
					}
					break;
				
				case "text":
					if (this.event.timer == 0) {
						//this.speech.volume = 1;
						$("#bonzi_xp_bubble").css("display", "block");
						this.event.timer = 1;
						this.talk(this.event.cur().text, this.event.cur().say);
					}
					
					if ($("#bonzi_xp_bubble").css("display") == "none")
						this.event_next();

					break;
				
				case "idle":
					if ((this.sprite_1.currentAnimation == "idle") && (this.event.timer == 0))
						this.event_next();
					else {
						if (this.event.timer == 0) {
							this.tmp_idle_start = this.data.to_idle[this.sprite_1.currentAnimation];
							this.sprite_1.gotoAndPlay(this.tmp_idle_start);
							this.event.timer = 1;
						}
						if (this.tmp_idle_start != this.sprite_1.currentAnimation) {
							if (this.sprite_1.currentAnimation == "idle")
								this.event_next();
							//else
							//	this.event.timer = 0;
						}
					}
					break;
				
				case "add_random":
					var tmp_index = Math.floor(this.event.cur().add.length * Math.random());
					var tmp_event = this.event_make(this.event.cur().add[tmp_index]);
					this.event_next();
					this.event_queue.unshift(tmp_event);
					break;
				
				default:
					this.event.index += 1;
			}
		}
	}
	
	this.event_next = function() {
		this.event.timer = 0;
		this.event.index += 1;
	}
	
	this.talk = function(text, say) {
		text = App_Bonzi.replaceAll(text, "{NAME}", this.name);
		if (typeof say !== 'undefined')
			say = App_Bonzi.replaceAll(say, "{NAME}", this.name);
		else
			say = text;

		$("#bonzi_xp_bubble")	.html(text)
								.css("display", "block");

		var _this = this;
		this.tts = new Audio("https://api.streamelements.com/kappa/v2/speech?voice=Joey&text="+encodeURIComponent(say));
		this.tts.play();
		this.tts.onended = function() {
			$("#bonzi_xp_bubble").hide();
		}
	}
	
	this.destroy = function() {

	}
}


App_Bonzi.obj_peedy = function() {
	this.name = "Bungo";
	this.framerate = 15.0/60.0;
	
	this.event_make = function(list) {
		var e = {
			list: list,
			index: 0,
			timer: 0,
			cur: function() { return this.list[this.index] }
		};
		return e;
	}
	
	this.init = function() {
		this.data = App_Bonzi.data.peedy;

		//	HTML SETUP
		$("#canvas_peedy")	.attr("width", this.data.size.x)
							.attr("height", this.data.size.y);
		$("#peedy_speak_say").click(function() {
			$("#peedy_cont").data('parent').run_single_event([{
				type: "text",
				text: $("#peedy_speak_text").val()
			}]);
		});
							
		// CREATEJS INIT
		this.stage = new createjs.Stage("canvas_peedy");
		this.sprite_1_sheet = new createjs.SpriteSheet(this.data.sprite);
		this.sprite_1 = new createjs.Sprite(this.sprite_1_sheet, "idle");
		this.sprite_1.x = 0;
		this.sprite_1.y = 0;
		this.stage.addChild(this.sprite_1);

		this.drag = false;
		this.dragged = false;
		
		$.data($("#peedy_cont")[0], "parent", this);
		
		var generate_event = function(a, b, c) { // Selector, event, function
			$(a)[b](function(e) {$.data($('#peedy_cont')[0], 'parent')[c](e)});
		};
		
		generate_event(
			"#peedy_cont",
			"mousedown",
			"mousedown"
		);
		
		generate_event(
			window,
			"mousemove",
			"mousemove"
		);
		
		generate_event(
			window,
			"mouseup",
			"mouseup"
		);

		this.run_single_event([{
			type: "anim",
			anim: "surf_intro",
			ticks: 30
		}]);
		var _this = this;
		setInterval((function() {
			_this.stage.update();
		}).bind(_this), 1000.0 / 20.0);
	}
	
	this.mousedown = function(e) {
		if (e.which == 1) {
			this.drag = true;
			this.dragged = false;
			this.drag_start = {
				x: e.pageX - parseInt($("#peedy_cont").css("marginLeft")),
				y: e.pageY - parseInt($("#peedy_cont").css("marginTop"))
			};
		}
	}
	
	this.mousemove = function(e) {
		if (this.drag) {
			$("#peedy_cont").css("marginLeft", e.pageX - this.drag_start.x);
			$("#peedy_cont").css("marginTop", e.pageY - this.drag_start.y);
			this.dragged = true;
		}
	}
	
	this.mouseup = function(e) {
		if (!this.dragged && this.drag)
			this.cancel();

		this.drag = false;
		this.dragged = false;
	}

	this.event_queue = [];
	this.event_run = true;
	this.event = null;

	this.run_single_event = function(list) {
		if (this.event_queue.length == 0)
			this.event_queue.push(this.event_make(list));
	}
	
	this.joke = function() {
		this.run_single_event(this.data.event_list_joke);
	}

	this.fact = function() {
		this.run_single_event(this.data.event_list_fact);
	}
	
	this.personality = function() {
		this.run_single_event([{
			type: "text",
			text: "GÌ¶UÌ¶EÌ¶RÌ¶IÌ¶LÌ¶LÌ¶AÌ¶SÌ¶ GORILLAS HAVE UNREALISTIC EXPECTATIONS",
			say: "GORILLAS HAVE UNREALISTIC EXPECTATIONS"
		}]);
	}
	
	this.cancel = function() {
		this.event_queue = [this.event_make([{type:"idle"}])];
		$("#bonzi_xp_bubble").css("display", "none");
	}
	
	this.update = function() {
		if (parseInt($("#peedy_cont").css("marginLeft")) < ($(window).width() / 2))
			$("#peedy_xp_bubble")	.css("marginLeft", parseInt($("#canvas").css("marginLeft")) + this.data.size.x)
									.removeClass("bubble_xp_rev").addClass("bubble_xp");
		else
			$("#peedy_xp_bubble")	.css("marginLeft", parseInt($("#canvas").css("marginLeft")) - parseInt($("#bonzi_xp_bubble").width()))
									.removeClass("bubble_xp").addClass("bubble_xp_rev");

		$("#peedy_xp_bubble").css("marginTop", parseInt($("#canvas").css("marginTop")) + 50);
		
		if ((this.event_queue.length != 0) && (this.event_queue[0].index >= this.event_queue[0].list.length))
			this.event_queue.splice(0,1);
		
		this.event = this.event_queue[0];
		
		if ((this.event_queue.length != 0) && this.event_run) {
			switch (this.event.cur().type) {
				case "anim":
					if (this.event.timer == 0)
						this.sprite_1.gotoAndPlay(this.event.cur().anim);
					this.event.timer += this.framerate;
					if (this.event.timer >= this.event.cur().ticks) {
						this.event_next();
					}
					break;
				
				case "text":
					if (this.event.timer == 0) {
						//this.speech.volume = 1;
						$("#peedy_xp_bubble").css("display", "block");
						this.event.timer = 1;
						this.talk(this.event.cur().text, this.event.cur().say);
					}
					
					if ($("#peedy_xp_bubble").css("display") == "none")
						this.event_next();

					break;
				
				case "idle":
					if ((this.sprite_1.currentAnimation == "idle") && (this.event.timer == 0))
						this.event_next();
					else {
						if (this.event.timer == 0) {
							this.tmp_idle_start = this.data.to_idle[this.sprite_1.currentAnimation];
							this.sprite_1.gotoAndPlay(this.tmp_idle_start);
							this.event.timer = 1;
						}
						if (this.tmp_idle_start != this.sprite_1.currentAnimation) {
							if (this.sprite_1.currentAnimation == "idle")
								this.event_next();
							//else
							//	this.event.timer = 0;
						}
					}
					break;
				
				case "add_random":
					var tmp_index = Math.floor(this.event.cur().add.length * Math.random());
					var tmp_event = this.event_make(this.event.cur().add[tmp_index]);
					this.event_next();
					this.event_queue.unshift(tmp_event);
					break;
				
				default:
					this.event.index += 1;
			}
		}
	}
	
	this.event_next = function() {
		this.event.timer = 0;
		this.event.index += 1;
	}
	
	this.talk = function(text, say) {
		text = App_Bonzi.replaceAll(text, "{NAME}", this.name);
		if (typeof say !== 'undefined')
			say = App_Bonzi.replaceAll(say, "{NAME}", this.name);
		else
			say = text;

		$("#peedy_xp_bubble")	.html(text)
								.css("display", "block");

		var _this = this;
		this.tts = new Audio("https://api.streamelements.com/kappa/v2/speech?voice=Brian&text="+encodeURIComponent(say));
		this.tts.play();
		this.tts.onended = function() {
			$("#peedy_xp_bubble").hide();
		}
	}
	
	this.destroy = function() {

	}
}