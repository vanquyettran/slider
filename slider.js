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

    var displayNavigatorPageNumber = root.getAttribute("data-display-navigator-page-number") === "true";

    // swipe angle max
    var maxSwipeAngle = parseFloat(root.getAttribute("data-max-swipe-angle")) || 45;

    var itemAspectRatioConf = root.getAttribute("data-item-aspect-ratio");

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
        throw Error("Slide time must be an integer is not less than 0.");
    } else if (slideTime % 10 !== 0) {
        throw Error("Slide time must be the multiple of 10.");
    }
    if (!isNaN(autorunDelay) && autorunDelay < 100) {
        throw Error("Autorun delay must be an integer is is not less than 100.");
    }
    if (maxSwipeAngle > 90 || maxSwipeAngle < 0) {
        throw Error("Max swipe angle mus be in the range [0, 90]");
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
        top: "unset",
        bottom: "unset",
        right: "unset",
        border: "none",
        transition: "unset",
        overflow: "hidden",
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
                            makeMove();
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
                                makeMove();
                            } else if (currentIndex > 0) {
                                setCurrentIndex(0);
                                makeMove();
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
                overflow: "hidden",
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
                overflow: "hidden",
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

    var updateHeights = function (motionDisabled) {
        var lastItemHeight = itemWidth / lastItemAspectRatio;
        var itemHeight = itemWidth / itemAspectRatio;
        if (motionDisabled || slideTime === 0) {
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

    var lastManualDirection = 1;

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
                element("span", displayNavigatorPageNumber ? i + 1 : null),
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
                if (currentIndex !== pageSize * this.navIndex) {
                    setCurrentIndex(pageSize * this.navIndex);
                    makeMove();
                    setTimeout(scrollIntoView, slideTime);
                }
                lastManualDirection = 0;
            };
            navItems.push(navItem);
        }
        empty(navItemsWrapper);
        appendChildren(navItemsWrapper, navItems);
    };
    renderNavItems();

    var currentIndex = 0;
    var setCurrentIndex = function (newIndex) {
        if (newIndex < 0 || sliderItems.length < pageSize) {
            newIndex = 0;
        } else if (newIndex > mainItems.length - (displayThumbnails ? 0 : pageSize)) {
            newIndex = mainItems.length - (displayThumbnails ? 0 : pageSize);
        } else if (displayThumbnails && newIndex > 0 && newIndex < pageSize) {
            newIndex = pageSize;
        }
        currentIndex = newIndex;
    };

    var updateSliderItemActiveStates = function () {
        // flag class
        var thumbnailsDeltaIndex = displayThumbnails ? (pageSize - 1) : 0;
        sliderItems.forEach(function (item, index) {
            if (thumbnailsDeltaIndex + index >= currentIndex
                && thumbnailsDeltaIndex + index < currentIndex + pageSize
            ) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    };

    var updateSliderItemPositions = function (motionDisabled) {
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
        if (motionDisabled || slideTime === 0) {
            container.style.left = container.slideLeft + "px";
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
            rect.top < 0 ||
            rect.left < 0 ||
            rect.bottom > window.innerHeight ||
            rect.right > window.innerWidth
        );
        if (outOfView) {
            var alignToTop = rect.height > window.innerHeight || rect.bottom <= window.innerHeight;
            root.scrollIntoView(alignToTop);
        }
    };

    var updateArrowsState = function () {
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= mainItems.length - (displayThumbnails ? 0 : pageSize);
    };

    var updateWidthBasedValues = function () {
        calcWidths();
        updateWidths();
        renderSliderItems();
    };

    var updateHeightBasedValues = function (motionDisabled, callback) {
        calcItemAspectRatio();
        if (isFinite(itemAspectRatio)) {
            updateHeights(motionDisabled);
            if ("function" === typeof callback) {
                callback();
            }
        } else {
            var inter = setInterval(function () {
                calcItemAspectRatio();
                if (isFinite(itemAspectRatio)) {
                    clearInterval(inter);
                    updateHeights(motionDisabled);
                    if ("function" === typeof callback) {
                        callback();
                    }
                }
            }, 10);
        }
    };

    var isHeightsChangeOnSlide = /adjust-by-active-items|adjust-by-typed-items/.test(itemAspectRatioConf);

    var movingStateTimeout;
    var makeMove = function (motionDisabled) {
        if (motionDisabled || !root.classList.contains("moving")) {
            updateSliderItemActiveStates();
            if (isHeightsChangeOnSlide) {
                updateHeightBasedValues(motionDisabled, function () {
                    updateSliderItemPositions(motionDisabled);
                    updateNavItemPositions();
                    updateArrowsState();
                });
            } else {
                updateSliderItemPositions(motionDisabled);
                updateNavItemPositions();
                updateArrowsState();
            }
        }
        if (!motionDisabled) {
            root.classList.add("moving");
            clearTimeout(movingStateTimeout);
            movingStateTimeout = setTimeout(function () {
                root.classList.remove("moving");
            }, slideTime);
        }
    };

    updateSliderItemActiveStates();
    updateWidthBasedValues();

    var _init = function () {
        updateHeightBasedValues(true, function () {
            updateSliderItemPositions(true);
            updateNavItemPositions();
            updateArrowsState();
            root.classList.add("initialized");
        });
    };

    _init();
    window.addEventListener("load", _init);

    var prev = function () {
        var d;
        for (d = pageSize; d > 0; d--) {
            if (currentIndex - d >= 0) {
                setCurrentIndex(currentIndex - d);
                break;
            }
        }
        makeMove();
    };

    var next = function () {
        var d;
        for (d = pageSize; d > 0; d--) {
            if (currentIndex + d <= mainItems.length - (displayThumbnails ? 0 : pageSize)) {
                setCurrentIndex(currentIndex + d);
                break;
            }
        }
        makeMove();
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
                            setCurrentIndex(0);
                            makeMove();
                        } else {
                            next();
                        }
                    } else if (lastManualDirection === -1) {
                        if (currentIndex <= 0) {
                            setCurrentIndex(sliderItems.length - pageSize);
                            makeMove();
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
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        setTimeout(function () {
            updateArrowsState();
            setAutorun();
            scrollIntoView();
        }, slideTime);
    });
    nextBtn.addEventListener("click", function () {
        next();
        lastManualDirection = 1;
        clearAutorun();
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        setTimeout(function () {
            updateArrowsState();
            setAutorun();
            scrollIntoView();
        }, slideTime);
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
                        overflow: "hidden"
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
        updateWidthBasedValues();
        if (isHeightsChangeOnSlide) {
            calcPageCount();
            setCurrentIndex(currentIndex); //normalize index
            renderRootContent();
            renderNavItems();
            makeMove(true);
        } else {
            updateHeightBasedValues(true, function () {
                calcPageCount();
                setCurrentIndex(currentIndex); //normalize index
                renderRootContent();
                renderNavItems();
                makeMove(true);
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
        // console.log(event.type);
        if (sliderItems.length > pageSize) {
            var container = sliderItemsWrapper;
            var deltaX = Math.floor(event.deltaX * 1000) / 1000;
            switch (event.type) {
                case "panstart":
                    var swipeAngle = Math.abs(event.angle);
                    swipeEnabled = !root.classList.contains("moving")
                        && (swipeAngle < maxSwipeAngle || swipeAngle > 180 - maxSwipeAngle);

                    if (swipeEnabled) {
                        clearAutorun();
                        container.slideLeft0 = container.slideLeft;
                    }
                    break;
                case "panleft":
                case "panright":
                    if (swipeEnabled && deltaX !== 0) {
                        root.classList.add("dragging");
                        container.slideLeft = container.slideLeft0 + deltaX;
                        container.style.left = container.slideLeft + "px";
                    }
                    break;
                case "panend":
                case "pancancel":
                    if (swipeEnabled && deltaX !== 0) {
                        root.classList.remove("dragging");
                        var overallVelocityX = Math.floor(event.overallVelocityX * 1000) / 1000;
                        var a = deltaX > 0 ? 0.9 : 0.1;

                        // if swipe quickly
                        // console.log(overallVelocityX);
                        if (overallVelocityX > 0.5) {
                            a += 0.1;
                        } else if (overallVelocityX < -0.5) {
                            a -= 0.1;
                        }

                        var deltaIndex = Math.ceil(- a - deltaX / pageWidth) * pageSize;
                        if (deltaIndex !== 0) {
                            setCurrentIndex(currentIndex + deltaIndex);
                            setTimeout(scrollIntoView, slideTime);
                        }
                        makeMove();

                        // autorun
                        if (deltaIndex > 0) {
                            lastManualDirection = 1;
                        } else if (deltaIndex < 0) {
                            lastManualDirection = -1;
                        } else {
                            lastManualDirection = 0;
                        }
                        setTimeout(setAutorun, slideTime);
                    }
                    break;
                default:
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