function SearchListPopup() {
}

SearchListPopup.prototype.init = function (dataSourceConfig) {

    var dsConfig = dataSourceConfig || {};
    var isCreated = false;

    //clear listener of refid exist
    var refElem = document.getElementById(dsConfig.refDomId);
    

    var guid = Math.floor(1000 + Math.random() * 9000);
    var searchTextId = `search-${guid}`;
    var selectorId = `selector-${guid}`;
    var selectorContainerId = `selector-container-${guid}`;

    var createUIlistener = function () {
        if (!isCreated) {
            createUI();
            isCreated = true;
        }
    }

    //attach click event    
    if (refElem) {
        refElem.addEventListener("click", createUIlistener);
    }    

    //function clearChild(id) {
    //    var dom = document.getElementById(id);
    //    while (dom.firstChild) {
    //        dom.firstChild.remove()
    //    }
    //}

    function createUI() {
        // Create input element
        let div = document.createElement("div");
        div.id = selectorContainerId;
        div.classList.add("control-container");
        let search = document.createElement("input");
        search.type = "text";
        search.id = searchTextId; // This is for the CSS
        search.placeholder = dsConfig.placeholder;
        search.autocomplete = "off"; // Disable browser autocomplete
        search.addEventListener("keyup", function () {
            searchDB(this, dsConfig, selectorId, selectorContainerId);
        });

        var elem = document.getElementById(dsConfig.domId);
        if (elem && elem.childElementCount == 0) {
            div.appendChild(search);
            elem.appendChild(div);
            elem.classList.add('search-container');
            addListItems(search, dsConfig, selectorId, selectorContainerId);

            //register click outside event
            detectClickOutside(dsConfig, selectorContainerId);
        }
    }

    function addListItems(elem, dsConfig, selectorId, selectorContainerId) {
        var ds = dsConfig.dataSource;

        let selector = document.createElement("ul");
        selector.id = selectorId;
        selector.classList.add('selector');
        elem.parentNode.appendChild(selector);

        ds.forEach(function (item) {
            // If exists, create an item (button)
            createElement(selector, item, dsConfig, selectorContainerId);
        });
    }

    function createElement(selector, item, dsConfig, selectorContainerId) {
        var guid = Math.floor(1000 + Math.random() * 9000);
        var isScrolled = false;

        let opt = document.createElement("li");
        opt.id = `cb-${guid}`;
        opt.classList.add('li-items');
        opt.addEventListener("click", function () {
            insertValue(this, dsConfig, selectorContainerId);
        });
        opt.setAttribute("value", item[dsConfig.valueField]);
        opt.innerHTML = item[dsConfig.textField];

        var refElem = document.getElementById(dsConfig.refDomId);
        if (item[dsConfig.valueField] == refElem.getAttribute('selected-item')) {
            opt.classList.add('selected');
            isScrolled = true;
        }

        selector.appendChild(opt);

        if (isScrolled) {
            opt.parentNode.scrollTop = opt.offsetTop;
            isScrolled = false;
        }
    }


    // Search function
    function searchDB(elem, dsConfig, selectorId, selectorContainerId) {
        var ds = dsConfig.dataSource;
        let selector = document.getElementById(selectorId);
        // Check if input is empty
        if (elem.value.trim() !== "") {

            // Clear everything before new search
            selector.innerHTML = "";

            ds.forEach(function (item) {
                // Join the db elements in one string
                let str = item[dsConfig.textField];
                // If exists, create an item (button)
                if (str.indexOf(elem.value) !== -1) {
                    createElement(selector, item, dsConfig, selectorContainerId);
                }
            });
        }
        // If result is empty, 
        else {
            // Clear everything before new search
            selector.innerHTML = "";

            ds.forEach(function (item) {
                // If exists, create an item (button)
                createElement(selector, item, dsConfig, selectorContainerId);
            });
        }
    }

    // Function to insert the selected item back to the input element
    function insertValue(elem, config, selectorContainerId) {
        if (config.onValueChanged)
            config.onValueChanged({ value: elem.getAttribute('value'), text: elem.innerHTML });
        console.log(`${elem.getAttribute('value')} - ${elem.innerHTML}`);

        // target.setAttribute("selected-item", elem.getAttribute('value'));
        // target.innerText = elem.innerHTML;

        removeDropdown(config.domId, selectorContainerId);
    }


    function removeDropdown(parentDomId, selectorId) {
        let searchList = document.getElementById(parentDomId);
        let dropdown = document.getElementById(selectorId);
        if (dropdown) {
            searchList.removeChild(dropdown);
            isCreated = false;
        }
    }


    function detectClickOutside(config, selectorContainerId) {
        var specifiedElement = document.getElementById(config.domId);

        //"click" but it works with any event
        document.addEventListener('click', function (event) {
            if (specifiedElement) {
                //check inside container clicked
                var isClickInside = specifiedElement.contains(event.target);

                //check whether reference dom clicked
                if (!isClickInside) {
                    var el = document.getElementById(config.refDomId);
                    if (el == event.target) {
                        isClickInside = true;
                    }
                }

                //remove if clicked outside
                if (!isClickInside) {
                    removeDropdown(config.domId, selectorContainerId);
                }
            }
        });
    }

}
