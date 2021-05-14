var list = new SearchList();
var listPopup = new SearchListPopup();

var color = [
	{
		color: "red",
		value: "#f00"
	},
	{
		color: "green",
		value: "#0f0"
	},
	{
		color: "blue",
		value: "#00f"
	},
	{
		color: "cyan",
		value: "#0ff"
	},
	{
		color: "magenta",
		value: "#f0f"
	},
	{
		color: "yellow",
		value: "#ff0"
	},
	{
		color: "black",
		value: "#000"
	}
]
list.init({dataSource:color, valueField:"value", textField:"color", domId:'search-list', placeholder:'Enter'});
listPopup.init({
	dataSource:color, valueField:"value", textField:"color",
	placeholder: 'Select the category', domId: 'addnew-search-dd', refDomId: 'addNew', onValueChanged: function (data) {
		console.log("Add new",data);
	}
});