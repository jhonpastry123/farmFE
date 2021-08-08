const menu_data = [
	{
		id: "dashboard", icon: "mdi mdi-view-dashboard", value: "main", data: [
			{ id: "dashboard1", value: "Dashboard " },
		]
	},
	{
		id: "layouts", icon: "mdi mdi-view-column", value: "analysis", data: [
			{ id: "accordions", value: "an1" },
			{ id: "portlets", value: "an2" }
		]
	},
	{
		id: "tables", icon: "mdi mdi-table", value: "managingFeed", data: [
			{ id: "tables1", value: "manage1" },
			{ id: "tables2", value: "manage2" },
			{ id: "tables3", value: "manage3" }
		]
	},
	{
		id: "uis", icon: "mdi mdi-puzzle", value: "managingFarm", data: [
			{ id: "dataview", value: "DataView" },
			{ id: "list", value: "farm1" },
			{ id: "menu", value: "farm2" },
			{ id: "tree", value: "farm3" },
			{ id: "register-farm", value: "register"},
			{ id: "register-breed", value: "register breed"},
			{ id: "register-worker", value: "register worker"}
		]
	},

];

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