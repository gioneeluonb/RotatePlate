;(function(win,$,undefined){

	var extend = function(target){
		var args = arguments
		var argsLen = args.length
		for(var i = 1;i < argsLen;i++){
			var source = args[i]
			for (var key in source) {
				target[key] = source[key]
			}
		}
		return target;
	}

	var defaults = {
		targetClassName:'item',
		targetJsClassName:'JS_item_',
		startClassName:'start',
		activeClassName:'active',
		rotateCirclesNumbers:4,
		isRuning:false,
		url:'',
		callback:function(){}
	}

	function RotatePlate(options){
		this.options = extend({},defaults,options)
		this.itemLength = 0
		this.rotateTimes = 0
		this.currenTime = 0
		this.stages = {}
		this.stageNumber = 5
		this.end = undefined
	}

	RotatePlate.prototype = {
		_setTimeout:function(func,stage){
			setTimeout(func,stage[2],stage)
		},
		init:function(end){

			var self = this;
			self.end = end;
			self.itemLength = $('.'+self.options.targetClassName).length
			self.rotateTimes = self.options.rotateCirclesNumbers * self.itemLength

			var s = self.rotateTimes / 10
			var s1 = parseInt(s)
			var s2 = parseInt(s * 2.5)
			var s3 = parseInt(s * 2.5)
			var s4 = parseInt(s * 2)
			self.stages = {
				stage1:[1,s1,230],
				stage2:[s1+1,s1 + s2,170],
				stage3:[s2+1,s1 + s2 + s3,120],
				stage4:[s3+1,s1 + s2 + s3 + s4,160],
				stage5:[s4+1,self.rotateTimes,220],
				stage6:[self.rotateTimes+1,self.rotateTimes + self.end,250]
			}

			self.stages.stage1.push(self.stages.stage2)
			self.stages.stage2.push(self.stages.stage3)
			self.stages.stage3.push(self.stages.stage4)
			self.stages.stage4.push(self.stages.stage5)
			self.stages.stage5.push(self.stages.stage6)

			$('.'+self.options.startClassName).click(function(){
				if(self.isRuning === true) return
				// $.ajax({
				// 	url:self.url,
				// 	success:function(){
				// 		self.move()
				// 	}
				// })
				setTimeout(function(){
					self.end = 8
					self.stages.stage6[1] = self.rotateTimes + self.end
					self.move()
				},1000)
			})
			
		},
		move:function(){
			var self = this
			self.isRuning = true;
			self._setTimeout(self.rotate.bind(self),self.stages.stage1)
		},
		rotate:function(stage){
			var self = this
			$('.'+self.options.targetJsClassName + ((self.currenTime++)%self.itemLength)).removeClass(self.options.activeClassName)
			$('.'+self.options.targetJsClassName + (self.currenTime%self.itemLength)).addClass(self.options.activeClassName)
			var start = stage[0]
			var end = stage[1]
			var speed = stage[2]
			var nextStage = stage[3]
			if(self.currenTime == end){

				if(self.currenTime == (self.rotateTimes + self.end)){
					self.isRuning = false
					self.currenTime = 0
					self.options.callback(self.end);
					return;
				}
				self._setTimeout(self.rotate.bind(self),nextStage)
			}else{
				self._setTimeout(self.rotate.bind(self),stage)
			}
		}
	}

	win.rp = RotatePlate;
})(window,$);


