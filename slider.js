/**
 * Created by Quyet on 1/22/2018.
 */


/**
 *
 * @param {HTMLElement} root
 * @param {object?} callbacks
 * @param {function?} callbacks.onInitialized
 * @param {function?} callbacks.onSlideStart
 * @param {function?} callbacks.onSlideEnd
 */
function initSlider(root, callbacks) {
    "use strict";

    var empty = function (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    };

    var style = function (obj) {
        var result_array = [];
        var attrName;
        for (attrName in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, attrName)) {
                result_array.push(attrName + ": " + obj[attrName]);
            }
        }
        return result_array.join("; ");
    };

    var appendChildren = function (node, content) {
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
    };

    var setAttributes = function (node, attributes) {
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
    };

    var element = function (nodeName, content, attributes) {
        var node = document.createElement(nodeName);
        appendChildren(node, content);
        setAttributes(node, attributes);
        return node;
    };
    
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    };

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

    // css transition timing function
    var slideTiming = root.getAttribute("data-slide-timing");
    var swipeTiming = root.getAttribute("data-swipe-timing");

    // fading transition timing and transform
    var fadingInTransforms = root.getAttribute("data-fading-in-transforms");
    var fadingOutTransforms = root.getAttribute("data-fading-out-transforms");
    var fadingInTimings = root.getAttribute("data-fading-in-timings");
    var fadingOutTimings = root.getAttribute("data-fading-out-timings");

    // Autorun
    var autorunDelay = parseInt(root.getAttribute("data-autorun-delay"));
    var autorunPauseOnHover = root.getAttribute("data-autorun-pause-on-hover") === "true";

    // Thumbnails
    var displayThumbnailsDefault = root.getAttribute("data-display-thumbnails") === "true";
    var displayThumbnailsLarge = root.getAttribute("data-display-thumbnails-large");
    var displayThumbnailsMedium = root.getAttribute("data-display-thumbnails-medium");
    var displayThumbnailsSmall = root.getAttribute("data-display-thumbnails-small");

    // Arrows
    var displayArrowsDefault = root.getAttribute("data-display-arrows") === "true";
    var displayArrowsLarge = root.getAttribute("data-display-arrows-large");
    var displayArrowsMedium = root.getAttribute("data-display-arrows-medium");
    var displayArrowsSmall = root.getAttribute("data-display-arrows-small");

    // Navigator
    var displayNavigatorDefault = root.getAttribute("data-display-navigator") === "true";
    var displayNavigatorLarge = root.getAttribute("data-display-navigator-large");
    var displayNavigatorMedium = root.getAttribute("data-display-navigator-medium");
    var displayNavigatorSmall = root.getAttribute("data-display-navigator-small");

    // swipe angle max
    var maxSwipeAngle = parseFloat(root.getAttribute("data-max-swipe-angle")) || 60; // 180 / 3 = 60

    // item aspect ratio
    var itemAspectRatioConf = root.getAttribute("data-item-aspect-ratio");

    // reserve && repeat
    var repeatAtFirst = root.getAttribute("data-repeat-at-first") === "true";
    var repeatAtLast = root.getAttribute("data-repeat-at-last") === "true";

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
    if (!isNaN(slideTime)) {
        if (slideTime < 0) {
            throw Error("Slide time must be an integer is not less than 0.");
        }
        if (slideTime % 10 !== 0) {
            throw Error("Slide time must be the multiple of 10.");
        }
    }
    if (!slideTiming) {
        slideTiming = "linear";
    }
    if (!swipeTiming) {
        swipeTiming = "ease-out";
    }

    var disableFading = !fadingInTimings && !fadingOutTimings && !fadingInTransforms && !fadingOutTransforms;

    if (!disableFading) {
        if (!fadingInTimings) {
            fadingInTimings = "ease";
        }
        if (!fadingOutTimings) {
            fadingOutTimings = "ease";
        }
        if (!fadingInTransforms) {
            fadingInTransforms = "translateX(10%) scale(1.2)";
        }
        if (!fadingOutTransforms) {
            fadingOutTransforms = "translateX(-10%) scale(0.9)";
        }

        fadingInTimings = fadingInTimings.split("|");
        fadingOutTimings = fadingOutTimings.split("|");
        fadingInTransforms = fadingInTransforms.split("|");
        fadingOutTransforms = fadingOutTransforms.split("|");

        if (fadingInTimings.length !== fadingOutTimings.length) {
            throw Error("fading-in-timings and fading-out-timings must have the same size.");
        }
        if (fadingInTransforms.length !== fadingOutTransforms.length) {
            throw Error("fading-in-transforms and fading-out-transforms must have the same size.");
        }
    }


    if (!isNaN(autorunDelay)) {
        if (autorunDelay < 500) {
            throw Error("Autorun delay must be an integer is not less than 500.");
        }
        if (autorunDelay % 10 !== 0) {
            throw Error("Autorun delay must be the multiple of 10.");
        }
    }
    if (maxSwipeAngle > 90 || maxSwipeAngle < 0) {
        throw Error("Max swipe angle must be in the range [0, 90]");
    }

    //TODO: Main code

    var roundDistance = function(d) {
        return Math.round(d);
    };

    var getAverageMotionSpeed = function (d, t) {
        var k = 1000000;
        return Math.round(k * d / t) / k;
    };

    if (isNaN(viewLargeOffset)) {
        viewLargeOffset = 900;
        viewMediumOffset = 600;
    }
    if (isNaN(slideTime)) {
        slideTime = 500;
    }

    var rootChildren = [].map.call(root.children, function (child) {
        child.clickable = child.getAttribute("data-clickable") === "true";
        return child;
    });

    var pageSize, previewLeft, previewRight, displayThumbnails, displayArrows, displayNavigator;

    var calcViewWidthBasedValues = function () {
        var viewWidth = root.clientWidth;
        if (viewWidth >= viewLargeOffset) { // Large viewport
            pageSize = isNaN(pageSizeLarge) ? pageSizeDefault : pageSizeLarge;
            previewLeft = isNaN(previewLeftLarge) ? previewLeftDefault : previewLeftLarge;
            previewRight = isNaN(previewRightLarge) ? previewRightDefault : previewRightLarge;
            displayThumbnails = !/true|false/.test(displayThumbnailsLarge) ? displayThumbnailsDefault : displayThumbnailsLarge === "true";
            displayArrows = !/true|false/.test(displayArrowsLarge) ? displayArrowsDefault : displayArrowsLarge === "true";
            displayNavigator = !/true|false/.test(displayNavigatorLarge) ? displayNavigatorDefault : displayNavigatorLarge === "true";
        } else if (viewWidth >= viewMediumOffset) { // Medium viewport
            pageSize = isNaN(pageSizeMedium) ? pageSizeDefault : pageSizeMedium;
            previewLeft = isNaN(previewLeftMedium) ? previewLeftDefault : previewLeftMedium;
            previewRight = isNaN(previewRightMedium) ? previewRightDefault : previewRightMedium;
            displayThumbnails = !/true|false/.test(displayThumbnailsMedium) ? displayThumbnailsDefault : displayThumbnailsMedium === "true";
            displayArrows = !/true|false/.test(displayArrowsMedium) ? displayArrowsDefault : displayArrowsMedium === "true";
            displayNavigator = !/true|false/.test(displayNavigatorMedium) ? displayNavigatorDefault : displayNavigatorMedium === "true";
        } else { // Small viewport
            pageSize = isNaN(pageSizeSmall) ? pageSizeDefault : pageSizeSmall;
            previewLeft = isNaN(previewLeftSmall) ? previewLeftDefault : previewLeftSmall;
            previewRight = isNaN(previewRightSmall) ? previewRightDefault : previewRightSmall;
            displayThumbnails = !/true|false/.test(displayThumbnailsSmall) ? displayThumbnailsDefault : displayThumbnailsSmall === "true";
            displayArrows = !/true|false/.test(displayArrowsSmall) ? displayArrowsDefault : displayArrowsSmall === "true";
            displayNavigator = !/true|false/.test(displayNavigatorSmall) ? displayNavigatorDefault : displayNavigatorSmall === "true";
        }

        if (rootChildren.length <= pageSize) {
            displayThumbnails = false;
            previewLeft = 0;
            previewRight = 0;
        }
    };

    var moveTypes = {
        immediate: 0,
        translational: 1,
        swiping: 2,
        fading: 3
    };

    calcViewWidthBasedValues();

    root.style = style({
        display: "block",
        "padding-left": 0,
        "padding-right": 0,
        "border-left": "none",
        "border-right": "none"
    });

    var pageWidth = 0, itemWidth = 0;

    var calcWidths = function () {
        pageWidth = root.clientWidth;
        itemWidth = pageWidth / (pageSize + previewLeft + previewRight);
    };
    calcWidths();

    var sliderItemStyle = style({
        display: "block",
        position: "absolute",
        padding: 0,
        margin: 0,
        opacity: 1,
        top: "unset",
        bottom: "unset",
        right: "unset",
        border: "none",
        transition: "unset",
        overflow: "unset",
        "list-style": "none"
    });

    var sliderItems = [];

    var mainItems = [].map.call(rootChildren, function (child, index) {
        return element(
            "li",
            child.cloneNode(true),
            {
                onclick: function () {
                    if (child.clickable) {
                        var newIndex = displayThumbnails ? (index + pageSize) : index;
                        if (newIndex < currentIndex || newIndex >= currentIndex + pageSize) {
                            if (newIndex < currentIndex && newIndex > currentIndex - pageSize) {
                                newIndex = currentIndex - pageSize;
                            }
                            setCurrentIndex(newIndex);
                            makeMove(moveTypes.translational);
                        }
                    }
                },
                style: sliderItemStyle,
                "data-type": "main",
                "class": "slider-item" + (child.clickable ? " clickable" : "")
            }
        );
    });

    var thumbnailsItem = element(
        "li",
        element(
            "div",
            [].map.call(rootChildren, function (child, index) {
                return element(
                    "div",
                    child.cloneNode(true),
                    {
                        onclick: function () {
                            if (child.clickable && currentIndex === 0) {
                                setCurrentIndex(index + pageSize); // why plus `pageSize`? because first element is thumbnails block
                                makeMove(moveTypes.translational);
                            } else if (currentIndex > 0) {
                                setCurrentIndex(0);
                                makeMove(moveTypes.translational);
                            }
                        },
                        "class": "thumbnail" + (child.clickable ? " clickable" : "")
                    }
                );
            }),
            {
                "class": "thumbnails"
            }
        ),
        {
            style: sliderItemStyle,
            "data-type": "thumbnails",
            "class": "slider-item"
        }
    );

    var sliderItemsWrapper = element(
        "ul",
        null,
        {
            style: style({
                display: "block",
                position: "relative",
                width: "100%",
                overflow: "unset",
                margin: 0,
                padding: 0,
                border: "none",
                transition: "unset"
            })
        }
    );

    var swipeable = element(
        "div",
        sliderItemsWrapper,
        {
            style: style({
                display: "block",
                position: "relative",
                width: "100%",
                overflow: "unset",
                margin: 0,
                padding: 0,
                border: "none",
                transition: "unset"
            }),
            "class": "swipeable"
        }
    );

    var renderSliderItems = function() {
        sliderItems = (displayThumbnails ? [thumbnailsItem] : []).concat(mainItems);
        var thumbnailsWidth = displayThumbnails ? (itemWidth * pageSize) : 0;
        mainItems.forEach(function (item, index) {
            item.style.left = (thumbnailsWidth + index * itemWidth) + "px";
        });
        sliderItemsWrapper.style.width = (thumbnailsWidth + mainItems.length * itemWidth) + "px";
        empty(sliderItemsWrapper);
        appendChildren(sliderItemsWrapper, sliderItems);
    };
    renderSliderItems();

    var pageCount = 0;
    var calcPageCount = function () {
        pageCount = Math.floor(mainItems.length / pageSize);
        if (mainItems.length % pageSize > 0) {
            pageCount++;
        }
        if (displayThumbnails) {
            pageCount++;
        }
        root.setAttribute("data-page-count", String(pageCount));
    };
    calcPageCount();

    var updateWidths = function () {
        thumbnailsItem.style.width = (itemWidth * pageSize) + "px";
        mainItems.forEach(function (item) {
            item.style.width = itemWidth + "px";
        });
    };
    updateWidths();

    var itemAspectRatio, lastItemAspectRatio;

    // the flag variable to check whether window has loaded or not
    var windowLoaded = false;
    window.addEventListener("load", function () {
        windowLoaded = true;
    });

    var calcItemAspectRatio = function () {
        lastItemAspectRatio = itemAspectRatio;
        if (isNaN(parseFloat(itemAspectRatioConf))) {
            // clone slider items,
            // we don't use slider item directly
            // because when they change the heights, it will make experience down
            var clonedThumbnailsItems = (displayThumbnails ? [thumbnailsItem] : []).map(function (item) {
                var cloned = item.cloneNode(true);
                cloned.style.visibility = "hidden";
                cloned.style.height = "auto";
                return cloned;
            });
            var clonedMainItems = mainItems.map(function (item) {
                var cloned = item.cloneNode(true);
                cloned.style.visibility = "hidden";
                cloned.style.height = "auto";
                return cloned;
            });
            var clonedSliderItems = clonedThumbnailsItems.concat(clonedMainItems).map(function (cloned) {
                sliderItemsWrapper.appendChild(cloned);
                return cloned;
            });

            // items that we calc aspect ratio from
            var calcItems;
            switch (itemAspectRatioConf) {
                case "adjust-by-active-items":
                    calcItems = clonedSliderItems.filter(function (item) {
                        return item.classList.contains("active");
                    });
                    break;
                case "adjust-by-typed-items":
                    if (displayThumbnails && currentIndex < pageSize) {
                        calcItems = clonedThumbnailsItems;
                    } else {
                        calcItems = clonedMainItems;
                    }
                    break;
                default:
                    calcItems = clonedSliderItems;
            }

            var already = windowLoaded || calcItems.every(function (item) {
                return isFinite(item.offsetWidth / item.offsetHeight);
            });

            if (already) {
                itemAspectRatio = calcItems.reduce(function (minAspectRatio, item) {
                    var aspectRatio = item.offsetWidth / item.offsetHeight;
                    if (item.getAttribute("data-type") === "thumbnails") {
                        // I don't know why??? but it works
                        aspectRatio /= pageSize;
                    }
                    if (minAspectRatio > aspectRatio) {
                        return aspectRatio;
                    }
                    return minAspectRatio;
                }, Infinity);
            } else {
                itemAspectRatio = Infinity;
            }

            // remove cloned slider items
            setTimeout(function () {
                clonedSliderItems.forEach(function (cloned) {
                    if (cloned.parentNode) {
                        cloned.parentNode.removeChild(cloned);
                    }
                });
            }, 100);
        } else {
            itemAspectRatio = parseFloat(itemAspectRatioConf);
            if (itemAspectRatio <= 0) {
                throw Error("Item Aspect Ratio must be greater than 0.");
            }
        }
    };

    // for the case of exact aspect ratio provided
    calcItemAspectRatio();

    var updateHeights = function (moveType) {
        var lastItemHeight = itemWidth / lastItemAspectRatio;
        var itemHeight = itemWidth / itemAspectRatio;
        if (moveType === moveTypes.immediate || slideTime === 0) {
            sliderItemsWrapper.style.height = itemHeight + "px";
            sliderItems.forEach(function (item) {
                item.style.height = itemHeight + "px";
            });
        } else {
            var speed = getAverageMotionSpeed(itemHeight - lastItemHeight, slideTime / 10);
            var height = lastItemHeight;
            var time = 0;
            var inter = setInterval(function () {
                height += speed;
                time += 10;
                sliderItemsWrapper.style.height = roundDistance(height) + "px";
                sliderItems.forEach(function (item) {
                    item.style.height = roundDistance(height) + "px";
                });
                if (time === slideTime) {
                    clearInterval(inter);
                }
            }, 10);
        }
    };

    var lastManualDirection = displayThumbnails ? 0 : 1;

    // Buttons
    var prevBtn = element(
        "button",
        null,
        {
            type: "button",
            "class": "slider-prev"
        }
    );
    var nextBtn = element(
        "button",
        null,
        {
            type: "button",
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
            overflow: "unset",
            transition: slideTime + "ms",
            "line-height": 0,
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
                element("span", null),
                {
                    style: style({
                        display: "inline-block",
                        position: "relative",
                        margin: 0,
                        padding: 0,
                        border: "none",
                        transition: slideTime + "ms",
                        "line-height": "normal",
                        "list-style": "none"
                    })
                }
            );
            navItem.navIndex = i;
            navItem.onclick = function () {
                if (!getIsMoving()) {
                    if (currentIndex !== pageSize * this.navIndex) {
                        setCurrentIndex(pageSize * this.navIndex);
                        makeMove(moveTypes.immediate);
                        setTimeout(scrollIntoView, slideTime);
                    }
                    lastManualDirection = 0;
                }
            };
            navItems.push(navItem);
        }
        empty(navItemsWrapper);
        appendChildren(navItemsWrapper, navItems);
    };
    renderNavItems();

    var getLastSliderItemIndex = function () {
        return mainItems.length - (displayThumbnails ? 0 : pageSize);
    };

    var previousIndex = 0;
    var currentIndex = 0;
    var setCurrentIndex = function (newIndex) {
        var lastIndex = getLastSliderItemIndex();
        if (sliderItems.length < pageSize) {
            newIndex = 0;
        } else if (newIndex < 0) {
            if (currentIndex === 0 && repeatAtFirst) {
                newIndex = lastIndex;
            } else {
                newIndex = 0;
            }
        } else if (newIndex > lastIndex) {
            if (currentIndex === lastIndex && repeatAtLast) {
                newIndex = 0;
            } else {
                newIndex = lastIndex;
            }
        } else if (displayThumbnails && newIndex > 0 && newIndex < pageSize) {
            newIndex = pageSize;
        }
        previousIndex = currentIndex;
        currentIndex = newIndex;
    };

    var sliderItemIsPrevious = function (index) {
        var thumbnailsDeltaIndex = displayThumbnails ? (pageSize - 1) : 0;
        return thumbnailsDeltaIndex + index >= previousIndex
            && thumbnailsDeltaIndex + index < previousIndex + pageSize
    };

    var sliderItemIsActive = function (index) {
        var thumbnailsDeltaIndex = displayThumbnails ? (pageSize - 1) : 0;
        return thumbnailsDeltaIndex + index >= currentIndex
            && thumbnailsDeltaIndex + index < currentIndex + pageSize
    };

    var updateSliderItemActiveStates = function () {
        // flag class
        sliderItems.forEach(function (item, index) {
            if (sliderItemIsActive(index)) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    };

    var updateSliderItemPositions = function (moveType, useCssTransition) {
        // positions
        var container = sliderItemsWrapper;
        var lastSlideLeft = container.slideLeft || 0;
        var maxVisualIndex = mainItems.length - pageSize - previewRight + (displayThumbnails ? pageSize : 0);
        if (currentIndex <= previewLeft) {
            container.slideLeft = 0;
        } else if (currentIndex >= maxVisualIndex) {
            container.slideLeft = itemWidth * (previewLeft - maxVisualIndex);
        } else {
            container.slideLeft = itemWidth * (previewLeft - currentIndex);
        }
        if (moveType === moveTypes.immediate || slideTime === 0) {
            container.style.left = container.slideLeft + "px";
        } else if (moveType === moveTypes.fading && !disableFading) {
            var clonedPreviousSliderItems = [];
            var activeSliderItemIndexes = [];
            sliderItems.forEach(function (item, index) {
                if (sliderItemIsPrevious(index)) {
                    var clonedItem = sliderItems[index].cloneNode(true);
                    clonedPreviousSliderItems.push(clonedItem);
                    sliderItemsWrapper.appendChild(clonedItem);
                }

                // don't use `else if`
                // an item can be both previous and active
                if (sliderItemIsActive(index)) {
                    activeSliderItemIndexes.push(index);
                }
            });

            var fadingTimingRandIndex = getRandomInt(0, fadingInTimings.length - 1);
            var fadingInTiming = fadingInTimings[fadingTimingRandIndex];
            var fadingOutTiming = fadingOutTimings[fadingTimingRandIndex];

            var fadingTransformRandIndex = getRandomInt(0, fadingInTransforms.length - 1);
            var fadingInTransform = fadingInTransforms[fadingTransformRandIndex];
            var fadingOutTransform = fadingOutTransforms[fadingTransformRandIndex];

            setTimeout(function () {
                container.style.left = container.slideLeft + "px";

                clonedPreviousSliderItems.forEach(function (clonedItem, index) {
                    if (displayThumbnails && currentIndex === 0) {
                        clonedItem.style.left = (index * itemWidth) + "px";
                    } else {
                        var activeSliderItemIndex = activeSliderItemIndexes[index];
                        clonedItem.style.left = sliderItems[activeSliderItemIndex].style.left;
                    }
                    setTimeout(function () {
                        clonedItem.style.transition
                            = "opacity " + slideTime + "ms " + fadingOutTiming + " 0ms, "
                            + "transform " + slideTime + "ms " + fadingOutTiming + " 0ms";
                        clonedItem.style.opacity = 0;
                        clonedItem.style.transform = fadingOutTransform;
                    }, 10);
                });

                activeSliderItemIndexes.forEach(function (sliderItemIndex) {
                    var sliderItem = sliderItems[sliderItemIndex];
                    sliderItem.style.opacity = 0;
                    sliderItem.style.transform = fadingInTransform;
                    setTimeout(function () {
                        sliderItem.style.transition
                            = "opacity " + slideTime + "ms " + fadingInTiming + " 0ms, "
                            + "transform " + slideTime + "ms " + fadingInTiming + " 0ms";
                        sliderItem.style.opacity = 1;
                        sliderItem.style.transform = "unset";
                    }, 10);
                });

                setTimeout(function () {
                    clonedPreviousSliderItems.forEach(function (clonedItem) {
                        clonedItem.parentNode.removeChild(clonedItem);
                    });
                    activeSliderItemIndexes.forEach(function (sliderItemIndex) {
                        var sliderItem = sliderItems[sliderItemIndex];
                        sliderItem.style.transition = "unset";
                    });
                }, slideTime);
            }, 100);
        } else {
            if (useCssTransition) {
                var transitionTiming = moveTypes.swiping ? swipeTiming : slideTiming;
                container.style.transition = "left " + slideTime + "ms " + transitionTiming + " 0ms";
                container.style.left = container.slideLeft + "px";
                setTimeout(function () {
                    container.style.transition = "unset";
                }, slideTime);
            } else {
                var speed = getAverageMotionSpeed(container.slideLeft - lastSlideLeft, slideTime / 10);
                var left = 0 + lastSlideLeft;
                var time = 0;
                var inter = setInterval(function () {
                    left += speed;
                    time += 10;
                    container.style.left = roundDistance(left) + "px";
                    if (time === slideTime) {
                        clearInterval(inter);
                    }
                }, 10);
            }
        }
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

    var scrollIntoView = function () {
        var rect = root.getBoundingClientRect();
        var outOfView = (
            rect.top < 0
            // || rect.left < 0
            || rect.bottom > window.innerHeight
            // || rect.right > window.innerWidth
        );
        if (outOfView && rect.height <= window.innerHeight) {
            var alignToTop = rect.height > window.innerHeight || rect.bottom <= window.innerHeight;
            root.scrollIntoView(alignToTop);
        }
    };

    var updateArrowsState = function () {
        var lastIndex = getLastSliderItemIndex();
        prevBtn.disabled = currentIndex < 0 || (!repeatAtFirst && currentIndex === 0);
        nextBtn.disabled = currentIndex > lastIndex || (!repeatAtLast && currentIndex === lastIndex);
    };

    var updateWidthBasedValues = function () {
        calcWidths();
        updateWidths();
        renderSliderItems();
    };

    var updateHeightBasedValues = function (moveType, callback) {
        calcItemAspectRatio();
        if (isFinite(itemAspectRatio)) {
            updateHeights(moveType);
            if ("function" === typeof callback) {
                callback();
            }
        } else {
            var inter = setInterval(function () {
                calcItemAspectRatio();
                if (isFinite(itemAspectRatio)) {
                    clearInterval(inter);
                    updateHeights(moveType);
                    if ("function" === typeof callback) {
                        callback();
                    }
                }
            }, 10);
        }
    };


    var setMovingState = function () {
        root.classList.add("moving");
    };
    var clearMovingState = function () {
        root.classList.remove("moving");
    };
    var getIsMoving = function () {
        return root.classList.contains("moving");
    };
    var fireMovingStart = function () {
        if (callbacks && 'function' === typeof callbacks.onSlideStart) {
            var previousSliderItemIndexes = [];
            var activeSliderItemIndexes = [];

            sliderItems.forEach(function (item, index) {
                if (sliderItemIsPrevious(index)) {
                    previousSliderItemIndexes.push(index);
                }

                // don't use `else if`
                // an item can be both previous and active
                if (sliderItemIsActive(index)) {
                    activeSliderItemIndexes.push(index);
                }
            });

            callbacks.onSlideStart(sliderItems, activeSliderItemIndexes, previousSliderItemIndexes, {
                displayThumbnails: displayThumbnails,
                slideTime: slideTime,
                autorunDelay: autorunDelay
            });
        }
    };
    var fireMovingEnd = function () {
        if (callbacks && 'function' === typeof callbacks.onSlideEnd) {
            var previousSliderItemIndexes = [];
            var activeSliderItemIndexes = [];

            sliderItems.forEach(function (item, index) {
                if (sliderItemIsPrevious(index)) {
                    previousSliderItemIndexes.push(index);
                }

                // don't use `else if`
                // an item can be both previous and active
                if (sliderItemIsActive(index)) {
                    activeSliderItemIndexes.push(index);
                }
            });

            callbacks.onSlideEnd(sliderItems, activeSliderItemIndexes, previousSliderItemIndexes, {
                displayThumbnails: displayThumbnails,
                slideTime: slideTime,
                autorunDelay: autorunDelay
            });
        }
    };

    var movingStateClearer;
    var isHeightsChangeOnSlide = [
            'adjust-by-active-items',
            'adjust-by-typed-items'
        ].indexOf(itemAspectRatioConf) > -1;

    var makeMove = function (moveType) {
        if (moveType === moveTypes.immediate || !getIsMoving()) {
            updateSliderItemActiveStates();
            if (isHeightsChangeOnSlide) {
                updateHeightBasedValues(moveType, function () {
                    updateSliderItemPositions(moveType, true);
                    updateNavItemPositions();
                    updateArrowsState();
                });
            } else {
                updateSliderItemPositions(moveType, true);
                updateNavItemPositions();
                updateArrowsState();
            }
        }
        if (moveType !== moveTypes.immediate) {
            setMovingState();
            fireMovingStart();

            movingStateClearer = setTimeout(function () {
                clearMovingState();
                fireMovingEnd();
            }, slideTime);
        }
    };

    updateSliderItemActiveStates();

    var _init = function () {
        updateWidthBasedValues();
        updateHeightBasedValues(moveTypes.immediate, function () {
            updateSliderItemPositions(moveTypes.immediate, true);
            updateNavItemPositions();
            updateArrowsState();
            root.classList.add('initialized');
            if (callbacks && 'function' === typeof callbacks.onInitialized) {
                var activeIndexes = sliderItems.filter(function (_, index) {
                    return sliderItemIsActive(index);
                }).map(function (_, index) {
                    return index;
                });
                callbacks.onInitialized(sliderItems, activeIndexes, {
                    displayThumbnails: displayThumbnails,
                    slideTime: slideTime,
                    autorunDelay: autorunDelay
                });
            }
        });
    };

    _init();

    var prev = function (moveType) {
        setCurrentIndex(currentIndex - pageSize);
        makeMove(moveType);
    };

    var next = function (moveType) {
        setCurrentIndex(currentIndex + pageSize);
        makeMove(moveType);
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
                    var mainFirstIndex = displayThumbnails ? pageSize : 0;
                    var lastIndex = getLastSliderItemIndex();
                    if (lastManualDirection === 1) {
                        if (currentIndex >= lastIndex) {
                            setCurrentIndex(mainFirstIndex);
                            makeMove(moveTypes.fading);
                        } else {
                            next(moveTypes.fading);
                        }
                    } else if (lastManualDirection === -1) {
                        if (currentIndex <= mainFirstIndex) {
                            setCurrentIndex(lastIndex);
                            makeMove(moveTypes.fading);
                        } else {
                            prev(moveTypes.fading);
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
        if (!getIsMoving()) {
            if (currentIndex === 0) {
                prev(moveTypes.fading);
            } else {
                prev(moveTypes.translational);
            }
            if (displayThumbnails && currentIndex < pageSize) {
                lastManualDirection = 0;
            } else {
                lastManualDirection = -1;
            }
            clearAutorun();
            setTimeout(function () {
                setAutorun();
                scrollIntoView();
            }, slideTime);
        }
    });
    nextBtn.addEventListener("click", function () {
        if (!getIsMoving()) {
            if (currentIndex === getLastSliderItemIndex()) {
                next(moveTypes.fading);
            } else {
                next(moveTypes.translational);
            }
            if (displayThumbnails && currentIndex < pageSize) {
                lastManualDirection = 0;
            } else {
                lastManualDirection = 1;
            }
            clearAutorun();
            setTimeout(function () {
                setAutorun();
                scrollIntoView();
            }, slideTime);
        }
    });

    var renderRootContent = function () {
        empty(root);
        appendChildren(root, [
            element(
                "div",
                displayArrows && pageCount > 1 ? [swipeable, prevBtn, nextBtn] : swipeable,
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
                            overflow: "unset"
                        }),
                        "class": "slider-nav"
                    }
                )
                : null
        ]);
    };
    renderRootContent();

    window.addEventListener("resize", function () {
        calcViewWidthBasedValues();
        calcPageCount();
        setCurrentIndex(currentIndex); //normalize index
        renderRootContent();
        renderNavItems();
        updateWidthBasedValues();
        if (isHeightsChangeOnSlide) {
            makeMove(moveTypes.immediate);
        } else {
            updateHeightBasedValues(moveTypes.immediate, function () {
                makeMove(moveTypes.immediate);
            });
        }
    });

    //TODO: Swipe with hammer js

    // Firstly, disable drag event for all elements are inside of slider
    [].forEach.call(root.querySelectorAll("*"), function (elm) {
        elm.ondragstart = function() {
            return false;
        };
    });

    // Use hammer js to detect pan gesture
    var hammer = new Hammer(swipeable);
    var swipeEnabled = true;
    hammer.on("panstart panleft panright panend pancancel", function (event) {
        if (sliderItems.length > pageSize) {
            var container = sliderItemsWrapper;
            var deltaX = Math.floor(event.deltaX * 1000) / 1000;
            switch (event.type) {
                case "panstart":
                    var swipeAngle = Math.abs(event.angle);
                    swipeEnabled = !getIsMoving()
                        && !event.isFinal
                        && (swipeAngle < maxSwipeAngle || swipeAngle > 180 - maxSwipeAngle);

                    if (swipeEnabled) {
                        root.classList.add("dragging");
                        container.slideLeft0 = container.slideLeft;
                        clearAutorun();
                    }
                    break;
                case "panleft":
                case "panright":
                    if (swipeEnabled && deltaX !== 0) {
                        container.slideLeft = container.slideLeft0 + deltaX;
                        container.style.left = container.slideLeft + "px";
                    }
                    break;
                case "panend":
                case "pancancel":
                    if (swipeEnabled) {
                        root.classList.remove("dragging");
                        if (deltaX !== 0) {
                            var ovBreakpoint = 0.1;
                            var aThreshold = 0.5;

                            var overallVelocityX = Math.floor(event.overallVelocityX * 1000) / 1000;
                            var a = deltaX > 0 ? (1 - aThreshold) : aThreshold;

                            // if swipe quickly
                            if (overallVelocityX > ovBreakpoint) {
                                a += aThreshold;
                            } else if (overallVelocityX < -ovBreakpoint) {
                                a -= aThreshold;
                            }

                            var deltaIndex = Math.ceil(- a - deltaX / pageWidth) * pageSize;
                            if (deltaIndex !== 0) {
                                setCurrentIndex(currentIndex + deltaIndex);
                                setTimeout(scrollIntoView, slideTime);
                            }
                            makeMove(moveTypes.swiping, true);

                            // autorun
                            if (displayThumbnails && currentIndex < pageSize) {
                                lastManualDirection = 0;
                            } else {
                                if (deltaIndex > 0) {
                                    lastManualDirection = 1;
                                } else if (deltaIndex < 0) {
                                    lastManualDirection = -1;
                                } else {
                                    lastManualDirection = 0;
                                }
                            }
                            setTimeout(setAutorun, slideTime);
                        }
                    }
                    break;
                default:
            }
        }
    });

}