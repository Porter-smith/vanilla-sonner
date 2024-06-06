(function (global) {
  // Toast constructor function
  function Toast(message, options) {
    this.id = "toast-" + Math.random().toString(16).slice(2);
    this.message = message;
    this.description = options.description || "";
    this.type = options.type || "default";
    this.html = options.html || "";
    this.duration = options.duration || 4000; // Default duration of 4 seconds
  }

  // Toast manager object
  const toastManager = {
    toasts: [],
    toastContainer: null,
    toastsHovered: false,
    expanded: false,
    layout: "default",
    position: "bottom-right",
    paddingBetweenToasts: 15,
    init: function () {
      this.toastContainer = document.createElement("div");
      this.toastContainer.id = "toastContainer";
      this.toastContainer.style.position = "fixed";
      this.toastContainer.style.display = "block";
      this.toastContainer.style.width = "100%";
      this.toastContainer.style.zIndex = "99";
      this.toastContainer.style.maxWidth = "300px";
      this.toastContainer.style.right = "0";
      this.toastContainer.style.bottom = "0";
      this.toastContainer.style.marginRight = "24px";
      this.toastContainer.style.marginBottom = "24px";
      document.body.appendChild(this.toastContainer);

      // Event listeners for hover expansion
      this.toastContainer.addEventListener("mouseenter", () => {
        this.toastsHovered = true;
        this.expanded = true;
        this.stackToasts();
      });

      this.toastContainer.addEventListener("mouseleave", () => {
        this.toastsHovered = false;
        this.expanded = false;
        this.stackToasts();
      });
    },
    createToast: function (message, options) {
      const toast = new Toast(message, options);
      this.toasts.unshift(toast);
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
                        : ""
                    }
                  <p style="font-size: 13px; font-weight: 500; color: #1f2937; margin: 0;">${
                    toast.message
                  }</p>
                </div>
                ${
                  toast.description
                    ? `<p style="margin-top: 6px; font-size: 12px; opacity: 0.7; ${
                        toast.type !== "default" ? "padding-left: 20px;" : ""
                      }">${toast.description}</p>`
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
        this.removeToast(toast.id);
      });

      toastElement.addEventListener("mouseenter", () => {
        closeButton.style.opacity = "1";
      });

      toastElement.addEventListener("mouseleave", () => {
        closeButton.style.opacity = "0";
      });

      this.toastContainer.appendChild(toastElement);

      setTimeout(() => {
        if (this.position.includes("bottom")) {
          toastElement.firstElementChild.style.transform = "translateY(100%)";
          toastElement.firstElementChild.style.opacity = "0";
        } else {
          toastElement.firstElementChild.style.transform = "translateY(-100%)";
          toastElement.firstElementChild.style.opacity = "0";
        }

        setTimeout(() => {
          if (this.position.includes("bottom")) {
            toastElement.firstElementChild.style.transform = "translateY(0)";
            toastElement.firstElementChild.style.opacity = "1";
          } else {
            toastElement.firstElementChild.style.transform = "translateY(0)";
            toastElement.firstElementChild.style.opacity = "1";
          }

          setTimeout(() => {
            this.stackToasts();
          }, 10);
        }, 5);
      }, 50);

      setTimeout(() => {
        setTimeout(() => {
          toastElement.firstElementChild.style.opacity = "0";
          if (this.toasts.length === 1) {
            toastElement.firstElementChild.style.transform =
              "translateY(-100%)";
          }
          setTimeout(() => {
            this.removeToast(toast.id);
          }, 300);
        }, 5);
      }, toast.duration); // Use the toast duration here
    },

    removeToast: function (toastId) {
      const toastElement = document.getElementById(toastId);
      if (toastElement) {
        toastElement.remove();
      }
      this.toasts = this.toasts.filter((toast) => toast.id !== toastId);
      this.stackToasts();
    },

    stackToasts: function () {
      if (this.toasts.length === 0) return;

      this.toasts.forEach((toast, index) => {
        const toastElement = document.getElementById(toast.id);
        if (!toastElement) return;

        toastElement.style.zIndex = 100 - index * 10; // Adjust the zIndex for layering

        if (this.expanded) {
          const yOffset =
            index *
            (toastElement.getBoundingClientRect().height +
              this.paddingBetweenToasts);
          if (this.position.includes("bottom")) {
            toastElement.style.bottom = yOffset + "px";
            toastElement.style.top = "auto";
          } else {
            toastElement.style.top = yOffset + "px";
            toastElement.style.bottom = "auto";
          }
          toastElement.style.transform = "translateY(0)";
        } else {
          if (this.position.includes("bottom")) {
            toastElement.style.bottom = "0px";
            toastElement.style.top = "auto";
            toastElement.style.transform = `translateY(${index * -16}px)`;
          } else {
            toastElement.style.top = "0px";
            toastElement.style.bottom = "auto";
            toastElement.style.transform = `translateY(${index * 16}px)`;
          }
        }
      });

      this.calculateHeightOfToastsContainer();
    },

    positionToasts: function () {
      if (this.toasts.length === 0) return;

      const topToast = document.getElementById(this.toasts[0].id);
      topToast.style.zIndex = "100";
      if (this.expanded) {
        if (this.position.includes("bottom")) {
          topToast.style.top = "auto";
          topToast.style.bottom = "0px";
        } else {
          topToast.style.top = "0px";
        }
      }

      if (this.toasts.length === 1) return;

      const middleToast = document.getElementById(this.toasts[1].id);
      middleToast.style.zIndex = "90";

      if (this.expanded) {
        const middleToastPosition =
          topToast.getBoundingClientRect().height +
          this.paddingBetweenToasts +
          "px";
        if (this.position.includes("bottom")) {
          middleToast.style.top = "auto";
          middleToast.style.bottom = middleToastPosition;
        } else {
          middleToast.style.top = middleToastPosition;
        }
        middleToast.style.transform = "translateY(0px)";
      } else {
        middleToast.style.transform = this.position.includes("bottom")
          ? "translateY(-16px)"
          : "translateY(16px)";
      }

      if (this.toasts.length === 2) return;

      const bottomToast = document.getElementById(this.toasts[2].id);
      bottomToast.style.zIndex = "80";

      if (this.expanded) {
        const bottomToastPosition =
          topToast.getBoundingClientRect().height +
          this.paddingBetweenToasts +
          middleToast.getBoundingClientRect().height +
          this.paddingBetweenToasts +
          "px";
        if (this.position.includes("bottom")) {
          bottomToast.style.top = "auto";
          bottomToast.style.bottom = bottomToastPosition;
        } else {
          bottomToast.style.top = bottomToastPosition;
        }
        bottomToast.style.transform = "translateY(0px)";
      } else {
        bottomToast.style.transform = this.position.includes("bottom")
          ? "translateY(-32px)"
          : "translateY(32px)";
      }

      if (this.toasts.length === 3) return;

      const burnToast = document.getElementById(this.toasts[3].id);
      burnToast.style.zIndex = "70";

      if (this.expanded) {
        const burnToastPosition =
          topToast.getBoundingClientRect().height +
          this.paddingBetweenToasts +
          middleToast.getBoundingClientRect().height +
          this.paddingBetweenToasts +
          bottomToast.getBoundingClientRect().height +
          this.paddingBetweenToasts +
          "px";
        if (this.position.includes("bottom")) {
          burnToast.style.top = "auto";
          burnToast.style.bottom = burnToastPosition;
        } else {
          burnToast.style.top = burnToastPosition;
        }
        burnToast.style.transform = "translateY(0px)";
      } else {
        burnToast.style.transform = "translateY(48px)";
      }

      burnToast.firstElementChild.style.opacity = "0";

      setTimeout(() => {
        this.toasts.pop();
      }, 300);
    },

    calculateHeightOfToastsContainer: function () {
      if (this.toasts.length === 0) {
        this.toastContainer.style.height = "0px";
        return;
      }

      const lastToast = this.toasts[this.toasts.length - 1];
      const lastToastRectangle = document
        .getElementById(lastToast.id)
        .getBoundingClientRect();

      const firstToast = this.toasts[0];
      const firstToastRectangle = document
        .getElementById(firstToast.id)
        .getBoundingClientRect();

      if (this.expanded) {
        if (this.position.includes("bottom")) {
          this.toastContainer.style.height =
            firstToastRectangle.top +
            firstToastRectangle.height -
            lastToastRectangle.top +
            "px";
        } else {
          this.toastContainer.style.height =
            lastToastRectangle.top +
            lastToastRectangle.height -
            firstToastRectangle.top +
            "px";
        }
      } else {
        this.toastContainer.style.height = firstToastRectangle.height + "px";
      }
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
