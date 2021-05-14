function SearchList() {
}

SearchList.prototype.init = function (dataSourceConfig) {
    var dsConfig = dataSourceConfig || {};
    //clear if child exist
    clearChild(dsConfig.domId);

    var guid = Math.floor(1000 + Math.random() * 9000);
    var searchTextId = `search-${guid}`;
    var selectorId = `selector-${guid}`;
    
    // Create input element
    let search = document.createElement("input");
    search.type = "text";
    if (dsConfig.defaultItem) {
        search.value = dsConfig.defaultItem[dsConfig.textField];
        search.setAttribute('selected-item', dsConfig.defaultItem[dsConfig.valueField]);
    }
    search.id = searchTextId; // This is for the CSS
    search.placeholder = dsConfig.placeholder;
    search.autocomplete = "off"; // Disable browser autocomplete
    search.classList.add('marginBottomZero');
    search.addEventListener("keyup", function () {
        searchDB(this, dsConfig, selectorId)
    });

    var elem = document.getElementById(dsConfig.domId);
    if (elem) {
        elem.appendChild(search);
        elem.classList.add('search-container');
    }

    search.addEventListener('focus', function () {
        focusInput(this, dsConfig, selectorId, searchTextId);
    });

    //register click outside event
    detectClickOutside(dsConfig.domId, selectorId);

    function clearChild(id) {
        var dom = document.getElementById(id);
        while (dom.firstChild) {
            dom.firstChild.remove()
        }
    }

    function focusInput(elem, dsConfig, selectorId, searchTextId) {
        var ds = dsConfig.dataSource;
        let selector = document.getElementById(selectorId);

        // If the selector div element does not exist, create it
        if (selector == null) {
            selector = document.createElement("ul");
            selector.id = selectorId;
            selector.classList.add('selector');
            elem.parentNode.appendChild(selector);

            ds.forEach(function (item) {
                // If exists, create an item (button)
                createElement(selector, item, dsConfig, searchTextId);
            });
        }
    }

    function createElement(selector, item, dsConfig, searchTextId) {
        var guid = Math.floor(1000 + Math.random() * 9000);

        var searchText = document.getElementById(searchTextId);
        var isScrolled = false;

        let opt = document.createElement("li");
        opt.id = `cb-${guid}`;
        opt.classList.add('li-items');
        opt.addEventListener("click", function () {
            insertValue(this, searchTextId, dsConfig);
        });
        opt.setAttribute("value", item[dsConfig.valueField]);
        opt.innerHTML = item[dsConfig.textField];

        if (item[dsConfig.valueField] == searchText.getAttribute('selected-item') || item[dsConfig.valueField] == dsConfig.defaultItemText) {
            opt.classList.add('selected');
            isScrolled = true;
        }
       
        selector.appendChild(opt);
        if (dsConfig.isColorEnabled) {
            let div = document.createElement("div");
            div.className = "circle-color";
            div.style.backgroundColor = item.Color;
            selector.appendChild(div);
        }

        if (isScrolled) {
            opt.parentNode.scrollTop = opt.offsetTop;
            isScrolled = false;
        }
    }

    // Search function
    function searchDB(elem, dsConfig, selectorId) {
        var ds = dsConfig.dataSource;
        let selector = document.getElementById(selectorId);
        // Check if input is empty
        if (elem.value.trim() !== "") {

            // Clear everything before new search
            selector.innerHTML = "";

            ds.forEach(function (item) {
                console.log(item);
                // Join the db elements in one string
                let str = item[dsConfig.textField];
                // If exists, create an item (button)
                if (str.indexOf(elem.value) !== -1) {
                    createElement(selector, item, dsConfig, searchTextId);
                }
            });
        }
        // If result is empty, 
        else {
            // Clear everything before new search
            selector.innerHTML = "";

            ds.forEach(function (item) {
                // If exists, create an item (button)
                createElement(selector, item, dsConfig, searchTextId);
            });
        }
    }

    // Function to insert the selected item back to the input element
    function insertValue(elem, searchTextId, config) {
        let search = document.getElementById(searchTextId);
        search.value = elem.innerText;
        search.setAttribute('selected-item', elem.getAttribute('value'));
        elem.parentNode.parentNode.removeChild(elem.parentNode);
        if (config.onValueChanged)
            config.onValueChanged({ value: elem.getAttribute('value'), text: elem.innerText });
    }

    function removeDropdown(parentDomId, selectorId) {
        let searchList = document.getElementById(parentDomId);
        let dropdown = document.getElementById(selectorId);
        if (dropdown)
            searchList.removeChild(dropdown);
    }


    function detectClickOutside(domId, selectorId) {
        var specifiedElement = document.getElementById(domId);

        //I'm using "click" but it works with any event
        document.addEventListener('click', function (event) {
            if (specifiedElement) {
                var isClickInside = specifiedElement.contains(event.target);

                if (!isClickInside) {
                    removeDropdown(domId, selectorId);
                }
            }
        });
    }
}