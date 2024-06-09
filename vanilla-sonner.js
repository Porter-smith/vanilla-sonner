import { getToastHTML } from "./toast-template.js";
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
    config: {
      maxToasts: 3,
      paddingBetweenToasts: 15,
      alwaysExpanded: false,
    },
    configure: function (config) {
      let configChanged = false;

      if (config.maxToasts !== undefined) {
        this.config.maxToasts = config.maxToasts;
        configChanged = true;
      }
      if (config.paddingBetweenToasts !== undefined) {
        this.config.paddingBetweenToasts = config.paddingBetweenToasts;
        configChanged = true;
      }
      if (config.alwaysExpanded !== undefined) {
        this.config.alwaysExpanded = config.alwaysExpanded;
        configChanged = true;
      }

      if (configChanged) {
        // Update UI with reflected changes
        this.updateUI();
      }
    },
    updateUI: function () {
      const positions = [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ];

      positions.forEach((position) => {
        if (this.toastContainers[position]) {
          // Recalculate the height of the toasts container
          this.calculateHeightOfToastsContainer(position);

          // Stack the toasts again to apply the new configuration
          this.stackToasts(position);
        }
      });
    },
    toastContainers: {},
    toastsHovered: false,
    expanded: false,
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
      const container = document.createElement("ol");
      container.id = `toastContainer-${position}`;
      container.style.position = "fixed";
      container.style.display = "block";
      container.style.width = "100%";
      container.style.zIndex = "99";
      container.style.maxWidth = "300px";
      container.style.margin = "24px";
      container.setAttribute("aria-label", "Notifications");
      container.setAttribute("role", "region");
      container.setAttribute("tabindex", "-1");
      container.setAttribute("data-position", position);
      this.setPosition(container, position);
      document.body.appendChild(container);
      this.toastContainers[position] = container;

      // Event listeners for hover expansion
      container.addEventListener("mouseenter", () => {
        if (!this.config.alwaysExpanded) {
          this.toastsHovered = true;
          this.expanded = true;
          this.stackToasts(position);
        }
      });

      container.addEventListener("mouseleave", () => {
        if (!this.config.alwaysExpanded) {
          this.toastsHovered = false;
          this.expanded = false;
          this.stackToasts(position);
        }
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
      if (this.toasts[toast.position].length > this.config.maxToasts) {
        const oldestToast = this.toasts[toast.position].pop();
        this.burnToast(oldestToast.id, toast.position);
      }

      this.renderToast(toast);
    },
    renderToast: function (toast) {
      const toastElement = document.createElement("li");
      toastElement.id = toast.id;
      toastElement.style.position = "absolute";
      toastElement.style.width = "100%";
      toastElement.style.transition = "all 0.3s ease-out";
      toastElement.style.maxWidth = "300px";
      toastElement.setAttribute("role", "status");
      toastElement.setAttribute("aria-live", "polite");
      toastElement.setAttribute("aria-atomic", "true");
      toastElement.setAttribute("tabindex", "0");
      if (!toast.description) {
        toastElement.classList.add("toast-no-description");
      }

      toastElement.innerHTML = getToastHTML(toast);

      const closeButton = toastElement.querySelector("#toast-close-button");
      closeButton.addEventListener("click", () => {
        this.burnToast(toast.id, toast.position);
      });

      this.toastContainers[toast.position].appendChild(toastElement);

      const animationTimeout = 5;
      const durationTimeout = toast.duration;

      if (toast.position.includes("bottom")) {
        toastElement.firstElementChild.style.transform = "translateY(100%)";
        toastElement.firstElementChild.style.opacity = "0";
      } else {
        toastElement.firstElementChild.style.transform = "translateY(-100%)";
        toastElement.firstElementChild.style.opacity = "0";
      }

      setTimeout(() => {
        toastElement.firstElementChild.style.transform = "translateY(0)";
        toastElement.firstElementChild.style.opacity = "1";

        setTimeout(() => {
          this.stackToasts(toast.position);
        }, 10);
      }, animationTimeout);

      setTimeout(() => {
        this.burnToast(toast.id, toast.position);
      }, durationTimeout);
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
      console.log("CALCULATING");
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

      if (this.config.alwaysExpanded || this.expanded) {
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
          this.config.paddingBetweenToasts +
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
          this.config.paddingBetweenToasts +
          (middleToast
            ? middleToast.getBoundingClientRect().height +
              this.config.paddingBetweenToasts
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

      if (this.config.alwaysExpanded || this.expanded) {
        // Calculate the total height of all toasts when expanded
        this.toasts[position].forEach((toast, index) => {
          const toastElement = document.getElementById(toast.id);
          const toastHeight = toastElement.getBoundingClientRect().height;
          totalHeight += toastHeight;

          // Add padding between toasts, but not after the last toast
          if (index < toastsCount - 1) {
            totalHeight += this.config.paddingBetweenToasts;
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

  // Inject styles
  const style = document.createElement("style");
  style.innerHTML = `
    ol[data-position] {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    li[data-sonner-toast] {
      margin-bottom: 14px;
      position: relative;
    }
    #toast-close-button {
      transition: background-color 100ms cubic-bezier(0.4, 0, 0.2, 1), 
                  color 100ms cubic-bezier(0.4, 0, 0.2, 1);
    }
  
    #toast-close-button:hover {
      color: rgb(107, 114, 128);
      background-color: rgb(249, 250, 251);
    }
  
    `;
  document.head.appendChild(style);
  global.toastManager = toastManager;
})(window);
