webix.protoUI({
	name:"photo",
	$allowsClear:true,
	defaults:{
		width:260,
		height:260,
		template: function(data, view){   
			view.$view.style.backgroundImage = `url(${data.src})`;
			view.$view.style.backgroundRepeat = "no-repeat";
			view.$view.style.backgroundPosition = "center";
			view.$view.style.backgroundSize = "contain";
			view.$view.style.borderRadius = "50%";
			return "";
		}
	},
	$init(config){
		if (config.value){
		this.$ready.push(function(){
			this.setValue(config.value);
		})
		}
	},
	getValue(){
		const data = this.getValues();
		if(data)
		return data.src;
		return null;
	},
	setValue(value){
		this.setValues({src:value});
	}
}, webix.ui.template);