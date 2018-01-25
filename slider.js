/**
 * Created by Quyet on 1/22/2018.
 */

/**
 *
 * @param {HTMLElement} root
 */
function initSlider(root) {
    // View offsets
    var viewLargeOffset = parseInt(root.getAttribute("data-view-large-offset"));
    var viewMediumOffset = parseInt(root.getAttribute("data-view-medium-offset"));

    // Page size
    var pageSizeDefault = parseInt(root.getAttribute("data-page-size")) || 1;
    var pageSizeSmall = parseInt(root.getAttribute("data-page-size-small"));
    var pageSizeMedium = parseInt(root.getAttribute("data-page-size-medium"));
    var pageSizeLarge = parseInt(root.getAttribute("data-page-size-large"));

    // Preview left
    var previewLeftDefault = parseFloat(root.getAttribute("data-preview-left")) || 0;
    var previewLeftSmall = parseFloat(root.getAttribute("data-preview-left-small"));
    var previewLeftMedium = parseFloat(root.getAttribute("data-preview-left-medium"));
    var previewLeftLarge = parseFloat(root.getAttribute("data-preview-left-large"));

    // Preview right
    var previewRightDefault = parseFloat(root.getAttribute("data-preview-right")) || 0;
    var previewRightSmall = parseFloat(root.getAttribute("data-preview-right-small"));
    var previewRightMedium = parseFloat(root.getAttribute("data-preview-right-medium"));
    var previewRightLarge = parseFloat(root.getAttribute("data-preview-right-large"));

    // Slide time
    var slideTime = parseInt(root.getAttribute("data-slide-time"));

    // Autorun
    var autorunDelay = parseInt(root.getAttribute("data-autorun-delay"));
    var autorunPauseOnHover = root.getAttribute("data-autorun-pause-on-hover") === "true";

    // Display options
    var displayArrowsDefault = root.getAttribute("data-display-arrows") === "true";
    var displayArrowsLarge = root.getAttribute("data-display-arrows-large");
    var displayArrowsMedium = root.getAttribute("data-display-arrows-medium");
    var displayArrowsSmall = root.getAttribute("data-display-arrows-small");

    var displayNavigatorDefault = root.getAttribute("data-display-navigator") === "true";
    var displayNavigatorLarge = root.getAttribute("data-display-navigator-large");
    var displayNavigatorMedium = root.getAttribute("data-display-navigator-medium");
    var displayNavigatorSmall = root.getAttribute("data-display-navigator-small");

    var displayNavigatorPageNumber = root.getAttribute("data-display-navigator-page-number") === "true";

    //TODO: Handle errors

    if ((!isNaN(viewLargeOffset) && viewLargeOffset < 1) || (!isNaN(viewMediumOffset) && viewMediumOffset < 1)) {
        throw Error("View offsets must be the integers are greater than 0.");
    }
    if ((isNaN(viewLargeOffset) || isNaN(viewMediumOffset)) && !(isNaN(viewLargeOffset) && isNaN(viewMediumOffset)) ) {
        throw Error("View offsets must be provided together, or not together.");
    }
    if (pageSizeDefault < 1
        || (!isNaN(pageSizeSmall) && pageSizeSmall < 1)
        || (!isNaN(pageSizeMedium) && pageSizeMedium < 1)
        || (!isNaN(pageSizeLarge) && pageSizeLarge < 1)
    ) {
        throw Error("Page size must be an integer is greater than 0.");
    }
    if (previewLeftDefault < 0
        || (!isNaN(previewLeftSmall) && previewLeftSmall < 0)
        || (!isNaN(previewLeftMedium) && previewLeftMedium < 0)
        || (!isNaN(previewLeftLarge) && previewLeftLarge < 0)
        || previewRightDefault < 0
        || (!isNaN(previewRightSmall) && previewRightSmall < 0)
        || (!isNaN(previewRightMedium) && previewRightMedium < 0)
        || (!isNaN(previewRightLarge) && previewRightLarge < 0)
    ) {
        throw Error("Previews must be the numbers are not less than 0.");
    }
    if (!isNaN(slideTime) && slideTime < 0) {
        throw Error("Slide time delay must be an integer is not less than 0.");
    }
    if (!isNaN(autorunDelay) && autorunDelay < 100) {
        throw Error("Autorun delay must be an integer is is not less than 100.");
    }

    //TODO: Main code

    if (isNaN(viewLargeOffset)) {
        viewLargeOffset = 900;
        viewMediumOffset = 600;
    }
    if (isNaN(slideTime)) {
        slideTime = 500;
    }

    var pageSize, previewLeft, previewRight, displayArrows, displayNavigator;

    var calcViewWidthBasedValues = function () {
        var viewWidth = root.clientWidth;
        if (viewWidth >= viewLargeOffset) { // Large viewport
            pageSize = isNaN(pageSizeLarge) ? pageSizeDefault : pageSizeLarge;
            previewLeft = isNaN(previewLeftLarge) ? previewLeftDefault : previewLeftLarge;
            previewRight = isNaN(previewRightLarge) ? previewRightDefault : previewRightLarge;
            displayArrows = !/true|false/.test(displayArrowsLarge) ? displayArrowsDefault : displayArrowsLarge === "true";
            displayNavigator = !/true|false/.test(displayNavigatorLarge) ? displayNavigatorDefault : displayNavigatorLarge === "true";
        } else if (viewWidth >= viewMediumOffset) { // Medium viewport
            pageSize = isNaN(pageSizeMedium) ? pageSizeDefault : pageSizeMedium;
            previewLeft = isNaN(previewLeftMedium) ? previewLeftDefault : previewLeftMedium;
            previewRight = isNaN(previewRightMedium) ? previewRightDefault : previewRightMedium;
            displayArrows = !/true|false/.test(displayArrowsMedium) ? displayArrowsDefault : displayArrowsMedium === "true";
            displayNavigator = !/true|false/.test(displayNavigatorMedium) ? displayNavigatorDefault : displayNavigatorMedium === "true";
        } else { // Small viewport
            pageSize = isNaN(pageSizeSmall) ? pageSizeDefault : pageSizeSmall;
            previewLeft = isNaN(previewLeftSmall) ? previewLeftDefault : previewLeftSmall;
            previewRight = isNaN(previewRightSmall) ? previewRightDefault : previewRightSmall;
            displayArrows = !/true|false/.test(displayArrowsSmall) ? displayArrowsDefault : displayArrowsSmall === "true";
            displayNavigator = !/true|false/.test(displayNavigatorSmall) ? displayNavigatorDefault : displayNavigatorSmall === "true";
        }
    };

    calcViewWidthBasedValues();

    root.style = style({
        display: "block"
    });

    var pageWidth = 0, itemWidth = 0;

    var calcWidths = function () {
        pageWidth = root.clientWidth;
        itemWidth = pageWidth / (pageSize + previewLeft + previewRight);
    };
    calcWidths();

    var sliderItems = [].map.call(root.children, function (child) {
        return element(
            "li",
            child.cloneNode(true),
            {
                style: style({
                    display: "block",
                    position: "absolute",
                    margin: 0,
                    padding: 0,
                    border: "none",
                    transition: slideTime + "ms",
                    "list-style": "none"
                })
            }
        );
    });

    var pageCount = 0;
    var calcPageCount = function () {
        pageCount = Math.floor(sliderItems.length / pageSize) + (sliderItems.length % pageSize > 0 ? 1 : 0);
        root.setAttribute("data-page-count", String(pageCount));
    };
    calcPageCount();

    var updateWidths = function () {
        sliderItems.forEach(function (item) {
            item.style.width = itemWidth + "px";
        });
    };
    updateWidths();

    var lastManualDirection = 1;

    var sliderItemsWrapper = element(
        "ul",
        sliderItems,
        {
            style: style({
                display: "block",
                position: "relative",
                width: "100%",
                overflow: "hidden",
                margin: 0,
                padding: 0,
                border: "none"
            })
        }
    );

    // Buttons
    var prevBtn = element(
        "button",
        null,
        {
            type: "button",
            style: style({
                transition: slideTime + "ms"
            }),
            "class": "slider-prev"
        }
    );
    var nextBtn = element(
        "button",
        null,
        {
            type: "button",
            style: style({
                transition: slideTime + "ms"
            }),
            "class": "slider-next"
        }
    );

    // Navigator
    var navItemsWrapper = element("ul", null, {
        style: style({
            display: "block",
            position: "relative",
            width: "100%",
            margin: 0,
            padding: 0,
            border: "none",
            transition: slideTime + "ms",
            "white-space": "nowrap"
        })
    });

    var navItems = [];

    var renderNavItems = function () {
        navItems = [];
        var i;
        for (i = 0; i < pageCount; i++) {
            var navItem = element(
                "li",
                element("span", displayNavigatorPageNumber ? i + 1 : null),
                {
                    style: style({
                        display: "inline-block",
                        position: "relative",
                        margin: 0,
                        padding: 0,
                        border: "none",
                        transition: slideTime + "ms",
                        "list-style": "none"
                    })
                }
            );
            navItem.navIndex = i;
            navItem.onclick = function () {
                updateCurrentIndex(pageSize * this.navIndex);
                updateItemPositions();
                lastManualDirection = 0;
            };
            navItems.push(navItem);
        }
        empty(navItemsWrapper);
        appendChildren(navItemsWrapper, navItems);
    };
    renderNavItems();

    var currentIndex = 0;
    var updateCurrentIndex = function (newIndex) {
        if (newIndex < 0 || sliderItems.length < pageSize) {
            newIndex = 0;
        } else if (newIndex > sliderItems.length - pageSize) {
            newIndex = sliderItems.length - pageSize;
        }
        currentIndex = newIndex;
    };

    var updateNavItemPositions = function () {
        var currentPageIndex = Math.ceil(currentIndex / pageSize);
        var activeItem;
        navItems.forEach(function (item, index) {
            if (index === currentPageIndex) {
                activeItem = item;
                item.navActive = true;
                item.classList.add("active");
            } else {
                item.navActive = false;
                item.classList.remove("active");
            }
        });
        if (activeItem) {
            var container = navItemsWrapper;
            var tx = 0;

            // total width of all of items
            var totalWidth = navItems.reduce(function (total, item) {
                return total + item.offsetWidth;
            }, 0);

            if (totalWidth > container.clientWidth) {
                var containerRect = container.getBoundingClientRect();
                var activeItemRect = activeItem.getBoundingClientRect();
                var a = activeItemRect.left - containerRect.left;
                var b = container.clientWidth / 2 - activeItem.offsetWidth / 2;
                if (a > b) {
                    tx -= a - b;
                }

                // total width of active item and all of items are before active item
                var activeWidth = 0;
                navItems.some(function (item) {
                    activeWidth += item.offsetWidth;
                    if (item.navActive) {
                        return true;
                    }
                });

                var c = activeWidth + container.clientWidth / 2;
                var d = totalWidth + activeItem.offsetWidth / 2;
                if (c > d) {
                    tx += c - d;
                }
            }

            container.style.transform = "translateX(" + tx + "px)";
        }
    };

    var updateItemPositions = function () {
        sliderItems.forEach(function (item, index) {
            // positions
            if (currentIndex === 0) {
                item.translateX = itemWidth * (index - currentIndex);
            } else if (currentIndex === sliderItems.length - pageSize) {
                item.translateX = itemWidth * (index - currentIndex + previewLeft + previewRight);
            } else {
                item.translateX = itemWidth * (index - currentIndex + previewLeft);
            }
            item.style.transform = "translateX(" + item.translateX + "px)";

            // flag class
            if (index >= currentIndex && index < currentIndex + pageSize) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= sliderItems.length - pageSize;
        updateNavItemPositions();
    };

    updateItemPositions();

    var prev = function () {
        var d;
        for (d = pageSize; d > 0; d--) {
            if (currentIndex - d >= 0) {
                updateCurrentIndex(currentIndex - d);
                break;
            }
        }
        updateItemPositions();
    };

    var next = function () {
        var d;
        for (d = pageSize; d > 0; d--) {
            if (currentIndex + d <= sliderItems.length - pageSize) {
                updateCurrentIndex(currentIndex + d);
                break;
            }
        }
        updateItemPositions();
    };

    var autorunPaused = false;
    if (autorunPauseOnHover) {
        root.addEventListener("mouseover", function () {
            autorunPaused = true;
        });
        root.addEventListener("mouseout", function () {
            autorunPaused = false;
        });
    }
    var autorun = null;
    var setAutorun = function () {
        if (!isNaN(autorunDelay) && autorun === null) {
            autorun = setInterval(function () {
                if (!autorunPaused) {
                    if (lastManualDirection === 1) {
                        if (currentIndex >= sliderItems.length - pageSize) {
                            updateCurrentIndex(0);
                            updateItemPositions();
                        } else {
                            next();
                        }
                    } else if (lastManualDirection === -1) {
                        if (currentIndex <= 0) {
                            updateCurrentIndex(sliderItems.length - pageSize);
                            updateItemPositions();
                        } else {
                            prev();
                        }
                    }
                }
            }, autorunDelay);
        }
    };
    var clearAutorun = function () {
        if (autorun !== null) {
            clearInterval(autorun);
            autorun = null;
        }
    };
    setAutorun();

    prevBtn.addEventListener("click", function () {
        prev();
        lastManualDirection = -1;
        clearAutorun();
        setTimeout(setAutorun, slideTime);
    });
    nextBtn.addEventListener("click", function () {
        next();
        lastManualDirection = 1;
        clearAutorun();
        setTimeout(setAutorun, slideTime);
    });

    var renderRootContent = function () {
        empty(root);
        appendChildren(root, [
            element(
                "div",
                displayArrows && pageCount > 1 ? [sliderItemsWrapper, prevBtn, nextBtn] : sliderItemsWrapper,
                {
                    style: style({
                        display: "block",
                        position: "relative",
                        border: "none",
                        width: "100%",
                        margin: 0,
                        padding: 0
                    }),
                    "class": "slider-body"
                }
            ),
            displayNavigator && pageCount > 1
                ? element(
                    "div",
                    navItemsWrapper,
                    {
                        style: style({
                            display: "block",
                            position: "relative",
                            overflow: "hidden"
                        }),
                        "class": "slider-nav"
                    }
                )
                : null
        ]);
    };
    renderRootContent();

    var itemAspectRatio;

    var resetHeights = function () {
        sliderItems.forEach(function (item) {
            item.style.height = "auto";
        });
    };

    // the flag variable to check whether window has loaded or not
    var windowLoaded = false;
    window.addEventListener("load", function () {
        windowLoaded = true;
    });

    var calcItemAspectRatio = function () {
        var already = windowLoaded || sliderItems.every(function (item) {
            return isFinite(item.offsetWidth / item.offsetHeight);
        });

        if (already) {
            itemAspectRatio = sliderItems.reduce(function (minAspectRatio, item) {
                var aspectRatio = item.offsetWidth / item.offsetHeight;
                if (minAspectRatio > aspectRatio) {
                    return aspectRatio;
                }
                return minAspectRatio;
            }, Infinity);
        } else {
            itemAspectRatio = Infinity;
        }
    };

    var updateHeights = function () {
        var itemHeight = itemWidth / itemAspectRatio;
        sliderItemsWrapper.style.height = itemHeight + "px";
        sliderItems.forEach(function (item) {
            item.style.height = itemHeight + "px";
        });
    };

    // @TODO: Set height for the slider items
    resetHeights();
    calcItemAspectRatio();
    updateHeights();

    // Maybe some items have not loaded
    if (itemAspectRatio > 0 && isFinite(itemAspectRatio)) {
        root.classList.add("initialized");
    } else {
        // Make an interval to check if that items have loaded as soon as possible
        var inter = setInterval(function () {
            resetHeights();
            calcItemAspectRatio();
            updateHeights();
            if (windowLoaded || isFinite(itemAspectRatio)) {
                clearInterval(inter);
                root.classList.add("initialized");
            }
        }, 100);
    }

    var onEndResize;
    window.addEventListener("resize", function () {
        sliderItems.forEach(function (item) {
            item.style.transition = "0ms";
        });

        calcViewWidthBasedValues();
        calcPageCount();
        updateCurrentIndex(currentIndex); //normalize index
        renderRootContent();
        
        calcWidths();
        updateWidths();

        resetHeights();
        calcItemAspectRatio();
        updateHeights();
        
        renderNavItems();
        updateItemPositions();

        clearTimeout(onEndResize);
        onEndResize = setTimeout(function() {
            // Run code here, resizing has "stopped"
            sliderItems.forEach(function (item) {
                item.style.transition = slideTime + "ms";
            });
        }, 250);
    });

    //TODO: Swipe with hammer js

    // Firstly, disable drag event for all elements are inside of slider
    [].forEach.call(root.querySelectorAll("*"), function (elm) {
        elm.ondragstart = function() {
            return false;
        };
    });

    // Use hammer js to detect pan gesture
    var hammer = new Hammer(sliderItemsWrapper);
    hammer.on("panstart panleft panright panend pancancel", function (event) {
        if (sliderItems.length > pageSize) {
            sliderItems.forEach(function (item) {
                switch (event.type) {
                    case "panstart":
                        item.style.transition = "0ms";
                        item.translateX0 = item.translateX;
                        break;
                    case "panleft":
                    case "panright":
                        item.translateX = item.translateX0 + event.deltaX;
                        item.style.transform = "translateX(" + item.translateX + "px)";
                        break;
                    case "panend":
                    case "pancancel":
                        item.style.transition = slideTime + "ms";
                        break;
                }
            });

            if (/panstart/.test(event.type)) {
                clearAutorun();
            }

            if (/panend|pancancel/.test(event.type)) {
                if (event.deltaX !== 0) {
                    var a = event.deltaX > 0 ? 0.8 : 0.2;

                    // if swipe quickly
                    if (event.overallVelocityX > 0.5) {
                        a += 0.2;
                    } else if (event.overallVelocityX < -0.5) {
                        a -= 0.2;
                    }
                    // console.log(event.overallVelocityX, a);

                    var posChange = Math.ceil(- a - event.deltaX / pageWidth) * pageSize;
                    updateCurrentIndex(currentIndex + posChange);
                    updateItemPositions();

                    // autorun
                    if (posChange > 0) {
                        lastManualDirection = 1;
                    } else if (posChange < 0) {
                        lastManualDirection = -1;
                    } else {
                        lastManualDirection = 0;
                    }
                    setTimeout(setAutorun, slideTime);
                }
            }
        }
    });

}

function element(nodeName, content, attributes) {
    var node = document.createElement(nodeName);
    appendChildren(node, content);
    setAttributes(node, attributes);
    return node;
}

function appendChildren(node, content) {
    var append = function (t) {
        if (/string|number/.test(typeof t)) {
            node.innerHTML += t;
        } else if (t instanceof HTMLElement) {
            node.appendChild(t);
        }
    };
    if (content instanceof Array) {
        content.forEach(function (item) {
            append(item);
        });
    } else {
        append(content);
    }
}

function setAttributes(node, attributes) {
    if (attributes) {
        var attrName;
        for (attrName in attributes) {
            if (attributes.hasOwnProperty(attrName)) {
                var attrValue = attributes[attrName];
                switch (typeof attrValue) {
                    case "string":
                    case "number":
                        node.setAttribute(attrName, attrValue);
                        break;
                    case "function":
                        node[attrName] = attrValue;
                        break;
                    default:
                }
            }
        }
    }
}

function empty(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function style(obj) {
    var result_array = [];
    var attrName;
    for (attrName in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, attrName)) {
            result_array.push(attrName + ": " + obj[attrName]);
        }
    }
    return result_array.join("; ");
}