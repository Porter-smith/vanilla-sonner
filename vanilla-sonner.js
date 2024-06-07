(function (global) {
  // Toast constructor function
  function Toast(message, options) {
    this.id = "toast-" + Math.random().toString(16).slice(2);
    this.message = message;
    this.description = options.description || "";
    this.type = options.type || "default";
    this.html = options.html || "";
    this.duration = options.duration || 4000; // Default duration of 4 seconds
    this.position = options.position || "bottom-right"; // Default position
  }

  // Toast manager object
  const toastManager = {
    toasts: {
      "top-left": [],
      "top-center": [],
      "top-right": [],
      "bottom-left": [],
      "bottom-center": [],
      "bottom-right": [],
    },
    toastContainers: {},
    toastsHovered: false,
    expanded: false,
    paddingBetweenToasts: 15,
    maxToasts: 3, // Maximum number of toasts in a container
    init: function () {
      const positions = [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ];

      positions.forEach((position) => {
        this.toastContainers[position] = null; // Initialize container references
      });
    },
    createContainer: function (position) {
      const container = document.createElement("div");
      container.id = `toastContainer-${position}`;
      container.style.position = "fixed";
      container.style.display = "block";
      container.style.width = "100%";
      container.style.zIndex = "99";
      container.style.maxWidth = "300px";
      container.style.margin = "24px";
      this.setPosition(container, position);
      document.body.appendChild(container);
      this.toastContainers[position] = container;

      // Event listeners for hover expansion
      container.addEventListener("mouseenter", () => {
        this.toastsHovered = true;
        this.expanded = true;
        this.stackToasts(position);
      });

      container.addEventListener("mouseleave", () => {
        this.toastsHovered = false;
        this.expanded = false;
        this.stackToasts(position);
      });

      return container;
    },
    setPosition: function (container, position) {
      container.style.top = "auto";
      container.style.bottom = "auto";
      container.style.left = "auto";
      container.style.right = "auto";

      switch (position) {
        case "top-left":
          container.style.top = "0";
          container.style.left = "0";
          break;
        case "top-center":
          container.style.top = "0";
          container.style.left = "50%";
          container.style.transform = "translateX(-50%)";
          break;
        case "top-right":
          container.style.top = "0";
          container.style.right = "0";
          break;
        case "bottom-left":
          container.style.bottom = "0";
          container.style.left = "0";
          break;
        case "bottom-center":
          container.style.bottom = "0";
          container.style.left = "50%";
          container.style.transform = "translateX(-50%)";
          break;
        case "bottom-right":
        default:
          container.style.bottom = "0";
          container.style.right = "0";
          break;
      }
    },
    createToast: function (message, options) {
      const toast = new Toast(message, options);
      this.toasts[toast.position].unshift(toast);

      // Create container if it doesn't exist
      if (!this.toastContainers[toast.position]) {
        this.createContainer(toast.position);
      }

      // Check if the number of toasts exceeds the maxToasts
      if (this.toasts[toast.position].length > this.maxToasts) {
        const oldestToast = this.toasts[toast.position].pop();
        this.burnToast(oldestToast.id, toast.position);
      }

      this.renderToast(toast);
    },
    renderToast: function (toast) {
      const toastElement = document.createElement("div");
      toastElement.id = toast.id;
      toastElement.style.position = "absolute";
      toastElement.style.width = "100%";
      toastElement.style.transition = "all 0.3s ease-out";
      toastElement.style.maxWidth = "300px";
      toastElement.style.pointerEvents = "none";
      if (!toast.description) {
        toastElement.classList.add("toast-no-description");
      }

      toastElement.innerHTML = `
          <span style="
            position: relative; 
            display: flex; 
            flex-direction: column; 
            align-items: flex-start; 
            box-shadow: 0 5px 15px -3px rgba(0, 0, 0, 0.08); 
            width: 100%; 
            transition: all 0.3s ease-out; 
            background-color: white; 
            border: 1px solid #e2e8f0; 
            border-radius: 0.375rem; 
            ${toast.html ? "padding: 0;" : "padding: 16px;"}
            box-sizing: border-box;
            font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
          ">
            ${
              toast.html
                ? `<div>${toast.html}</div>`
                : `
              <div style="position: relative;">
                <div style="display: flex; align-items: center; ${
                  toast.type === "success"
                    ? "color: #22c55e;"
                    : toast.type === "info"
                    ? "color: #3b82f6;"
                    : toast.type === "warning"
                    ? "color: #fb923c;"
                    : toast.type === "danger"
                    ? "color: #ef4444;"
                    : "color: #4b5563;"
                }">
                    ${
                      toast.type === "success"
                        ? `
                        <svg style="width: 18px; height: 18px; margin-right: 6px; margin-left: -4px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.7744 9.63269C17.1238 9.20501 17.0604 8.57503 16.6327 8.22559C16.2051 7.87615 15.5751 7.93957 15.2256 8.36725L10.6321 13.9892L8.65936 12.2524C8.24484 11.8874 7.61295 11.9276 7.248 12.3421C6.88304 12.7566 6.92322 13.3885 7.33774 13.7535L9.31046 15.4903C10.1612 16.2393 11.4637 16.1324 12.1808 15.2547L16.7744 9.63269Z" fill="currentColor"></path>
                        </svg>
                    `
                        : toast.type === "warning"
                        ? `
                        <svg style="width: 18px; height: 18px; margin-right: 0.375rem; margin-left: -0.25rem;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.44829 4.46472C10.5836 2.51208 13.4105 2.51168 14.5464 4.46401L21.5988 16.5855C22.7423 18.5509 21.3145 21 19.05 21L4.94967 21C2.68547 21 1.25762 18.5516 2.4004 16.5862L9.44829 4.46472ZM11.9995 8C12.5518 8 12.9995 8.44772 12.9995 9V13C12.9995 13.5523 12.5518 14 11.9995 14C11.4473 14 10.9995 13.5523 10.9995 13V9C10.9995 8.44772 11.4473 8 11.9995 8ZM12.0009 15.99C11.4486 15.9892 11.0003 16.4363 10.9995 16.9886L10.9995 16.9986C10.9987 17.5509 11.4458 17.9992 11.9981 18C12.5504 18.0008 12.9987 17.5537 12.9995 17.0014L12.9995 16.9914C13.0003 16.4391 12.5532 15.9908 12.0009 15.99Z" fill="currentColor"></path></svg>
                    `
                        : toast.type === "danger"
                        ? `<svg style="width: 18px; height: 18px; margin-right: 0.375rem; margin-left: -0.25rem;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9996 7C12.5519 7 12.9996 7.44772 12.9996 8V12C12.9996 12.5523 12.5519 13 11.9996 13C11.4474 13 10.9996 12.5523 10.9996 12V8C10.9996 7.44772 11.4474 7 11.9996 7ZM12.001 14.99C11.4488 14.9892 11.0004 15.4363 10.9997 15.9886L10.9996 15.9986C10.9989 16.5509 11.446 16.9992 11.9982 17C12.5505 17.0008 12.9989 16.5537 12.9996 16.0014L12.9996 15.9914C13.0004 15.4391 12.5533 14.9908 12.001 14.99Z" fill="currentColor"></path></svg>`
                        : ""
                    }
                  <p style="font-size: 13px; font-weight: 500; color: #1f2937; margin: 0;">${
                    toast.message
                  }</p>
                </div>
                ${
                  toast.description
                    ? `<div style="margin-top: 6px; font-size: 12px; opacity: 0.7; ${
                        toast.type !== "default" ? "" : ""
                      }">${toast.description}</div>`
                    : ""
                }
              </div>
            `
            }
            <span style="position: absolute; right: 0; padding: 6px; margin-right: 10px; color: #9ca3af; transition: opacity 0.1s ease-in-out; border-radius: 9999px; cursor: pointer; top: 50%; transform: translateY(-50%);">
      
            </span>
          </span>
        `;

      const closeButton = toastElement.querySelector("span");
      closeButton.addEventListener("click", () => {
        this.removeToast(toast.id, toast.position);
      });

      toastElement.addEventListener("mouseenter", () => {
        closeButton.style.opacity = "1";
      });

      toastElement.addEventListener("mouseleave", () => {
        closeButton.style.opacity = "0";
      });

      this.toastContainers[toast.position].appendChild(toastElement);

      const animationTimeout = 5; // Timeout for the animation
      const durationTimeout = toast.duration; // Timeout for the toast duration

      // Initial timeout before starting the animation
      if (toast.position.includes("bottom")) {
        toastElement.firstElementChild.style.transform = "translateY(100%)";
        toastElement.firstElementChild.style.opacity = "0";
      } else {
        toastElement.firstElementChild.style.transform = "translateY(-100%)";
        toastElement.firstElementChild.style.opacity = "0";
      }

      // Timeout for the animation
      setTimeout(() => {
        toastElement.firstElementChild.style.transform = "translateY(0)";
        toastElement.firstElementChild.style.opacity = "1";

        // Timeout to stack toasts after animation
        setTimeout(() => {
          this.stackToasts(toast.position);
        }, 10);
      }, animationTimeout);

      // Timeout for the toast duration
      setTimeout(() => {
        this.burnToast(toast.id, toast.position);
      }, durationTimeout); // Use the toast duration here
    },
    burnToast: function (toastId, position) {
      const fadeOutTimeout = 300; // Timeout for the fade-out animation
      const toastElement = document.getElementById(toastId);
      if (toastElement) {
        toastElement.firstElementChild.style.opacity = "0";
        if (this.toasts[position].length === 1) {
          toastElement.firstElementChild.style.transform = "translateY(-100%)";
        }
        setTimeout(() => {
          this.removeToast(toastId, position);
        }, fadeOutTimeout);
      }
    },
    removeToast: function (toastId, position) {
      const toastElement = document.getElementById(toastId);
      if (toastElement) {
        toastElement.remove();
      }
      this.toasts[position] = this.toasts[position].filter(
        (toast) => toast.id !== toastId
      );
      this.stackToasts(position);

      // Remove container if no more toasts in this position
      if (this.toasts[position].length === 0) {
        const container = this.toastContainers[position];
        if (container) {
          container.remove();
          this.toastContainers[position] = null;
        }
      }
    },
    stackToasts: function (position) {
      // If there are no toasts in the specified position, exit the function
      if (this.toasts[position].length === 0) return;

      // Log the position for debugging purposes
      console.log("position", position);

      // Calculate the height of the container holding the toasts
      console.log("CALCUALTING");
      this.calculateHeightOfToastsContainer(position);

      // Get the top toast and set its zIndex
      let topToast = document.getElementById(this.toasts[position][0].id);
      this.setToastPosition(topToast, position, 100, "0px", "0px");

      // If there's only one toast, no need to proceed further
      if (this.toasts[position].length == 1) return;

      // Get the middle and bottom toasts if they exist
      let middleToast =
        this.toasts[position].length > 1
          ? document.getElementById(this.toasts[position][1].id)
          : null;
      let bottomToast =
        this.toasts[position].length > 2
          ? document.getElementById(this.toasts[position][2].id)
          : null;

      if (this.expanded) {
        this.setExpandedStateStyles(
          topToast,
          middleToast,
          bottomToast,
          position
        );
      } else {
        this.setCollapsedStateStyles(
          topToast,
          middleToast,
          bottomToast,
          position
        );
      }
    },

    setToastPosition: function (toast, position, zIndex, top, bottom) {
      toast.style.zIndex = zIndex;
      if (position.includes("bottom")) {
        toast.style.top = "auto";
        toast.style.bottom = bottom;
      } else {
        toast.style.top = top;
        toast.style.bottom = "auto";
      }
    },

    setExpandedStateStyles: function (
      topToast,
      middleToast,
      bottomToast,
      position
    ) {
      if (middleToast) {
        let middleToastPosition =
          topToast.getBoundingClientRect().height +
          this.paddingBetweenToasts +
          "px";
        this.setToastPosition(
          middleToast,
          position,
          90,
          middleToastPosition,
          middleToastPosition
        );
        middleToast.style.scale = "100%";
        middleToast.style.transform = "translateY(0px)";
      }

      if (bottomToast) {
        let bottomToastPosition =
          topToast.getBoundingClientRect().height +
          this.paddingBetweenToasts +
          (middleToast
            ? middleToast.getBoundingClientRect().height +
              this.paddingBetweenToasts
            : 0) +
          "px";
        this.setToastPosition(
          bottomToast,
          position,
          80,
          bottomToastPosition,
          bottomToastPosition
        );
        bottomToast.style.scale = "100%";
        bottomToast.style.transform = "translateY(0px)";
      }
    },

    setCollapsedStateStyles: function (
      topToast,
      middleToast,
      bottomToast,
      position
    ) {
      if (middleToast) {
        middleToast.style.zIndex = 90;
        middleToast.style.scale = "94%";
        this.alignBottom(topToast, middleToast, position);
        middleToast.style.transform = position.includes("bottom")
          ? "translateY(-16px)"
          : "translateY(16px)";
      }

      if (bottomToast) {
        bottomToast.style.zIndex = 80;
        bottomToast.style.scale = "88%";
        this.alignBottom(topToast, bottomToast, position);
        bottomToast.style.transform = position.includes("bottom")
          ? "translateY(-32px)"
          : "translateY(32px)";
      }
    },

    alignBottom: function (element1, element2, position) {
      // Get the top position and height of the first element
      let top1 = element1.offsetTop;
      let height1 = element1.offsetHeight;

      // Get the height of the second element
      let height2 = element2.offsetHeight;

      // Calculate the top position for the second element
      let top2 = top1 + (height1 - height2);

      // Log the calculated positions for debugging
      console.log("alignBottom", { top1, height1, height2, top2 });

      if (position.includes("bottom")) {
        // For bottom-aligned toasts, set the bottom position instead of top
        let bottom1 = parseInt(window.getComputedStyle(element1).bottom, 10);
        let bottom2 = bottom1 + (height1 - height2);
        element2.style.bottom = bottom2 + "px";
      } else {
        // Apply the calculated top position to the second element
        element2.style.top = top2 + "px";
      }
    },
    calculateHeightOfToastsContainer: function (position) {
      if (this.toasts[position].length === 0) {
        this.toastContainers[position].style.height = "0px";
        return;
      }

      let totalHeight = 0;
      const toastsCount = this.toasts[position].length;

      if (this.expanded) {
        // Calculate the total height of all toasts when expanded
        this.toasts[position].forEach((toast, index) => {
          const toastElement = document.getElementById(toast.id);
          const toastHeight = toastElement.getBoundingClientRect().height;
          totalHeight += toastHeight;

          // Add padding between toasts, but not after the last toast
          if (index < toastsCount - 1) {
            totalHeight += this.paddingBetweenToasts;
          }
        });
      } else {
        // Calculate the height of the container when toasts are collapsed
        this.toasts[position].forEach((toast, index) => {
          const toastElement = document.getElementById(toast.id);
          const toastHeight = toastElement.getBoundingClientRect().height;

          // The top toast is fully visible
          if (index === 0) {
            totalHeight += toastHeight;
          } else {
            // Subsequent toasts are partially visible (for stack effect)
            const overlap = 16; // Adjust this value based on your design for overlap amount
            totalHeight += overlap;
          }
        });
      }

      this.toastContainers[position].style.height = totalHeight + "px";
    },
  };
  // Event listener for the 'toast-show' event
  window.addEventListener("toast-show", function (event) {
    const { message, description, type, position, html, duration } =
      event.detail;
    toastManager.createToast(message, {
      description,
      type,
      position,
      html,
      duration,
    });
  });

  // Initialize toastManager on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function () {
    toastManager.init();
  });
})(window);
