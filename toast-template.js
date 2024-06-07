// toast-template.js
export function getToastHTML(toast) {
  return `
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
        <span style="height: 24px; display: flex; justify-content: center; align-items: center; box-sizing: border-box; position: absolute; right: 0; padding: 0.375rem; margin-right: 10px; color: #9ca3af; border-radius: 9999px; cursor: pointer; top: 50%; transform: translateY(-50%); pointer-events: auto;" id="toast-close-button">
  
        <svg style="width: 0.75rem; height: 0.75rem;" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </span>
      
      </span>
    `;
}
