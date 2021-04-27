function SearchListPopup() {
}

SearchListPopup.prototype.init = function (dataSourceConfig) {
    var dsConfig = dataSourceConfig || {};

    var guid = Math.floor(1000 + Math.random() * 9000);
    var searchTextId = `search-${guid}`;
    var selectorId = `selector-${guid}`;
    var selectorContainerId = `selector-container-${guid}`;

    createUI();

    //attach click event
    var targetElem = document.getElementById(dsConfig.domId);
    if (targetElem) {
        targetElem.addEventListener("click", function () {
            createUI();
        });
    }

    function createUI() {
        // Create input element
        let div = document.createElement("div");
        div.id = selectorContainerId;
        let search = document.createElement("input");
        search.type = "text";
        search.id = searchTextId; // This is for the CSS
        search.placeholder = dsConfig.placeholder;
        search.autocomplete = "off"; // Disable browser autocomplete
        search.addEventListener("keyup", function () {
            searchDB(this, dsConfig, selectorId, selectorContainerId);
        });

        var elem = document.getElementById(dsConfig.containerId);
        if (elem) {
            div.appendChild(search);
            elem.appendChild(div);
            elem.classList.add('search-container');
            addListItems(search, dsConfig, selectorId, selectorContainerId);

            //register click outside event
            detectClickOutside(dsConfig.containerId, selectorContainerId);
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

        var searchText = document.getElementById(dsConfig.domId);
        var isScrolled = false;

        let opt = document.createElement("li");
        opt.id = `cb-${guid}`;
        opt.classList.add('li-items');
        opt.addEventListener("click", function () {
            insertValue(this, dsConfig.domId, selectorContainerId);
        });
        opt.setAttribute("value", item[dsConfig.valueField]);
        opt.innerHTML = item[dsConfig.textField];

        if (item[dsConfig.valueField] == searchText.getAttribute('selected-item')) {
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
    function insertValue(elem, targetId, selectorContainerId) {
        let target = document.getElementById(targetId);
        target.setAttribute("selected-item", elem.getAttribute('value'));
        target.innerText = elem.innerHTML;
        //target.value = elem.innerHTML;
        removeDropdown(target.parentNode.id, selectorContainerId);
    }

    function showSelectorList(selectorContainerId) {
        let container = document.getElementById(selectorContainerId);
        if (container) {
            container.style.display = "block";
        }
    }

    // function hideSelectorList(selectorContainerId) {
    //     let container = document.getElementById(selectorContainerId);
    //     if (container) {
    //         container.style.display = "none";
    //     }
    // }

    function removeDropdown(parentDomId, selectorId) {
        let searchList = document.getElementById(parentDomId);
        let dropdown = document.getElementById(selectorId);
        if (dropdown)
            searchList.removeChild(dropdown);
    }


    function detectClickOutside(parentDomId, selectorContainerId) {
        var specifiedElement = document.getElementById(parentDomId);

        //"click" but it works with any event
        document.addEventListener('click', function (event) {
            if (specifiedElement) {
                var isClickInside = specifiedElement.contains(event.target);

                if (!isClickInside) {
                    removeDropdown(parentDomId, selectorContainerId);
                }
            }
        });
    }

}
