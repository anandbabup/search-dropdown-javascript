function SearchList() {
}

SearchList.prototype.init = function (dataSourceConfig) {
    var dsConfig = dataSourceConfig || {};

    var guid = Math.floor(1000 + Math.random() * 9000);
    var searchTextId = `search-${guid}`;
    var selectorId = `selector-${guid}`;

    //dom creation
    console.log("Initialized");

    // Create input element
    let search = document.createElement("input");
    search.type = "text";
    search.id = searchTextId; // This is for the CSS
    search.autocomplete = "off"; // Disable browser autocomplete
    search.addEventListener("keyup", function () {
        searchDB(this, dsConfig, selectorId)
    });
    // window.onload = function () {
    //     var elem = document.getElementById(dsConfig.domId);
    //     if (elem) {
    //         elem.appendChild(search);
    //         elem.classList.add('search-container');
    //     }
    // }
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

    function focusInput(elem, dsConfig, selectorId, searchTextId) {
        var ds = dsConfig.dataSource;
        let selector = document.getElementById(selectorId);

        // If the selector div element does not exist, create it
        if (selector == null) {
            selector = document.createElement("ul");
            selector.id = selectorId;
            selector.classList.add('selector');
            elem.parentNode.appendChild(selector);

            // // Position it below the input element
            // selector.style.left = elem.getBoundingClientRect().left + "px";
            // selector.style.top = elem.getBoundingClientRect().bottom + "px";
            // selector.style.width = elem.getBoundingClientRect().width + "px";

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
        opt.addEventListener("click", function () {
            insertValue(this, searchTextId);
        });
        opt.setAttribute("value", item[dsConfig.valueField]);
        opt.innerHTML = item[dsConfig.textField];

        if(item[dsConfig.valueField] == searchText.getAttribute('selected-item')){
            opt.classList.add('selected');
            isScrolled = true;
        }        
        selector.appendChild(opt);

        if(isScrolled){
            opt.scrollIntoView();
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
    function insertValue(elem, searchTextId) {
        let search = document.getElementById(searchTextId);
        search.value = elem.innerText;
        search.setAttribute('selected-item',elem.getAttribute('value'));
        elem.parentNode.parentNode.removeChild(elem.parentNode);
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