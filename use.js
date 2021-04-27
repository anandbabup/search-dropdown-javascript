var list = new SearchList();
var listPopup = new SearchListPopup();

// const db = [
//     { value: "03067", text: "Bake Rolls 100g" },
//     { value: "04089", text: "Potato Chips 70g" },
//     { value: "05612", text: "Ice Coffee 100ml" },
//     { value: "07740", text: "Sparkling Water 1.5l" }
// ];
// list.init({dataSource:db, valueField:"value", textField:"text"});

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
listPopup.init({dataSource:color, valueField:"value", textField:"color", placeholder:'Enter', domId:'search-list-popup', containerId:'container-id'});
