function SearchList() {
}

SearchList.prototype.init = function (dataSourceConfig) {
    var dsConfig = dataSourceConfig || {};

    //dom creation
    console.log("Initialized");

    // Create input element
    let search = document.createElement("input");
    search.id = "search"; // This is for the CSS
    search.autocomplete = "off"; // Disable browser autocomplete
    search.addEventListener("keyup", function () {
        searchDB(this, dsConfig)
    });
    window.onload = function () {
        var elem = document.getElementById(dsConfig.domId);
        elem.appendChild(search);
        elem.classList.add('search-container');
    }
    search.addEventListener('focus', function () {
        focusInput(this, dsConfig);
    });

    //register click outside event
    detectClickOutside(dsConfig.domId);
}

function focusInput(elem, dsConfig) {
    var ds = dsConfig.dataSource;
    console.log("Focus");
    let selector = document.getElementById("selector");

    // If the selector div element does not exist, create it
    if (selector == null) {
        selector = document.createElement("ul");
        selector.id = "selector";
        elem.parentNode.appendChild(selector);

        // Position it below the input element
        selector.style.left = elem.getBoundingClientRect().left + "px";
        selector.style.top = elem.getBoundingClientRect().bottom + "px";
        selector.style.width = elem.getBoundingClientRect().width + "px";

        ds.forEach(function (item) {
            // If exists, create an item (button)
            createElement(selector, item, dsConfig);
        });
    }
}

function createElement(selector, item, dsConfig) {
    let opt = document.createElement("li");
    opt.addEventListener("click", function () {
        insertValue(this);
    });
    opt.setAttribute("value", item[dsConfig.valueField]);
    opt.innerHTML = item[dsConfig.textField];
    selector.appendChild(opt);
}


// Search function
function searchDB(elem, dsConfig) {
    var ds = dsConfig.dataSource;
    let selector = document.getElementById("selector");
    // Check if input is empty
    if (elem.value.trim() !== "") {
        elem.classList.add("dropdown"); // Add dropdown class (for the CSS border-radius)

        // Clear everything before new search
        selector.innerHTML = "";

        ds.forEach(function (item) {
            console.log(item);
            // Join the db elements in one string
            let str = item[dsConfig.textField];
            // If exists, create an item (button)
            if (str.indexOf(elem.value) !== -1) {
                createElement(selector, item, dsConfig);
            }
        });
    }
    // If result is empty, 
    else {
        // Clear everything before new search
        selector.innerHTML = "";

        ds.forEach(function (item) {
            // If exists, create an item (button)
            createElement(selector, item, dsConfig);
        });
    }
}

// Function to insert the selected item back to the input element
function insertValue(elem) {
    let search = document.getElementById("search");
    search.classList.remove("dropdown");
    search.value = elem.innerHTML;
    elem.parentNode.parentNode.removeChild(elem.parentNode);
}

function removeDropdown(parentDomId) {
    let searchList = document.getElementById(parentDomId);
    let dropdown = document.getElementById('selector');
    if (dropdown)
        searchList.removeChild(dropdown);
}


function detectClickOutside(domId) {
    var specifiedElement = document.getElementById(domId);

    //I'm using "click" but it works with any event
    document.addEventListener('click', function (event) {
        var isClickInside = specifiedElement.contains(event.target);

        if (!isClickInside) {
            removeDropdown(domId);
        }
    });
}