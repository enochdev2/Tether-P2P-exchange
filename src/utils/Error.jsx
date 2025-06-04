import { toast } from "react-hot-toast";

const ErrorToast = (message) =>
  toast.custom((t) => (
     <div
      style={{
        position: "fixed",
        top: "70px", // Adjust this to your navbar height
        right: "20%",
        // transform: "translateX(-50%)",
        zIndex: 9999,
      }}
    >
    <div
      id="toast-default"
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } flex items-center w-full max-w-xs p-4 text-gray-200 bg-gray-900 rounded-lg shadow backdrop-blur-lg border-gray-700 border-[1px]`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-400 bg-red-900 rounded-lg">
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
        </svg>
        <span className="sr-only">Error icon</span>
      </div>
      <div className="ms-3 text-medium font-bold text-gray-200">{message}</div>
    </div>
    </div>
  ));

export { ErrorToast };
