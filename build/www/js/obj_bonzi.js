
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
		this.sprite = this.sprite_1;
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
		
		setInterval((function() {
			_this.idle();
		}).bind(_this), 10000);
		/*
		setInterval((function() {
			if (this.event_queue.length == 0) {
				if (this.sprite.currentAnimation != "sleep_fwd" && this.sprite.currentAnimation != "sleep_still") {
					_this.run_single_event([{
						type: "anim",
						anim: "sleep_fwd",
						ticks: 120
					}]);
				}
			}
		}).bind(_this), 300 * 1000);
		*/
		/*setInterval((function() {
			_this.talk_to_user();
		}).bind(_this), 120 * 1000);*/
		var _this = this;
		
		generate_event(
			"#xp_menu_hide",
			"click",
			"hide"
		);
		
		generate_event(
			"#xp_menu_animate",
			"click",
			"animate"
		);
	}

	this.event_queue = [];
	this.event_run = true;
	this.event = null;

	this.run_single_event = function(list) {
		if (this.event_queue.length == 0)
			this.event_queue.push(this.event_make(list));
	}
	
	this.joke = function() {
		this.cancel();
		var _this = this;
		setTimeout(function(){
			
			_this.run_single_event(_this.data.event_list_joke);
		
		},100)
	}
	
	this.hide = function() {
		this.run_single_event([{
			type: "anim",
			anim: "surf_away",
			ticks: 30
		}]);
	}
	
	this.idle = function() {
		if (this.sprite.currentAnimation == "idle") {
			
				if (this.event_queue.length == 0) {
					
					var i = Math.floor(Math.random() * 15);
					switch(i){
					case 1:
						this.sprite.gotoAndPlay("taptaptap");
						break;
					case 2:
						this.sprite.gotoAndPlay("look_up");
						break;
					case 3:
						this.sprite.gotoAndPlay("look_down");
						break;
					case 4:
						this.sprite.gotoAndPlay("look_left");
						break;
					case 5:
						this.sprite.gotoAndPlay("look_right");
						break;
					case 9:
						this.sprite.gotoAndPlay("cool");
						break;
					case 10:
						this.sprite.gotoAndPlay("juggle");
						break;
					case 11:
						this.sprite.gotoAndPlay("yawn");
						break;
					case 12:
						this.sprite.gotoAndPlay("banana_eat");
						break;
					case 13:
						this.sprite.gotoAndPlay("banana_eat_miss");
						break;
					case 14:
						this.sprite.gotoAndPlay("write");
						break;
					default:
						this.sprite.gotoAndPlay("breathe");
						break;
				}
					
			}
				
		}
	}
	this.animate = function() {
		var i = Math.floor(Math.random() * 8);
		switch(i){
			case 1:
				this.run_single_event([{
					type: "anim",
					anim: "taptaptap",
					ticks: 120
				}]);
			case 2:
				this.run_single_event([{
					type: "anim",
					anim: "cool",
					ticks: 10
				}]);
			case 3:
				this.run_single_event([{
					type: "anim",
					anim: "look_left",
					ticks: 10
				}]);
			case 4:
				this.run_single_event([{
					type: "anim",
					anim: "look_right",
					ticks: 10
				}]);
			case 5:
				this.run_single_event([{
					type: "anim",
					anim: "surf_across_fwd",
					ticks: 120
				},
				{
					type: "anim",
					anim: "surf_across_back",
					ticks: 10
				}]);
			case 6:
				this.run_single_event([{
					type: "anim",
					anim: "look_up",
					ticks: 10
				}]);
			case 8:
				this.run_single_event([{
					type: "anim",
					anim: "look_down_fwd",
					ticks: 10
				}]);
			default:
				this.run_single_event([{
					type: "anim",
					anim: "breathe",
					ticks: 30
				}]);
				break;
		}
	}

	this.talk_to_user = function() {
		this.cancel();
		var _this = this;
		setTimeout(function(){
			
			_this.run_single_event(_this.data.event_list_talk);
		
		},100)
	};

	this.fact = function() {
		this.cancel();
		var _this = this;
		setTimeout(function(){
			
			_this.run_single_event(_this.data.event_list_fact);
		
		},100)
	}
	
	this.personality = function() {
		this.cancel();
		var _this = this;
		setTimeout(function(){
				
			_this.run_single_event([{
				type: "text",
				text: "<strike>GUERILLAS</strike> GORILLAS HAVE UNREALISTIC EXPECTATIONS",
				say: "GORILLAS HAVE UNREALISTIC EXPECTATIONS"
			}]);
		
		},100)
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
		
		if ((this.event_queue.length != 0) && this.event_run && typeof this.event.cur() != "undefined") {
			switch (this.event.cur().type) {
				case "anim":
					if (this.event.timer == 0)
						this.sprite_1.gotoAndPlay(this.event.cur().anim);
					this.event.timer++;
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
					if ((this.sprite.currentAnimation == "idle" || this.sprite.currentAnimation == "breathe" || this.sprite.currentAnimation == "cool" || this.sprite.currentAnimation == "write" || this.sprite.currentAnimation == "banana_eat" || this.sprite.currentAnimation == "banana_eat_miss" || this.sprite.currentAnimation == "juggle" || this.sprite.currentAnimation == "yawn" || this.sprite.currentAnimation == "taptaptap" || this.sprite.currentAnimation == "look_left" || this.sprite.currentAnimation == "look_right" || this.sprite.currentAnimation == "look_down" || this.sprite.currentAnimation == "look_up") && (this.event.timer === 0))
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
	
	this.talk = async function(text, say) {
		text = App_Bonzi.replaceAll(text, "{NAME}", this.name);
		if (typeof say !== 'undefined')
			say = App_Bonzi.replaceAll(say, "{NAME}", this.name);
		else
			say = text;

		$("#bonzi_xp_bubble")	.html(text)
								.css("display", "block");

		let url = "//www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say) + "&voice=" + encodeURIComponent("Adult Male #2, American English (TruVoice)") + "&pitch=140&speed=157";
		var audio = new Audio(url);
		audio.play();
		audio.onended = function()
		{
			$("#bonzi_xp_bubble").hide();
		}
	}
	
	this.destroy = function() {

	}
}