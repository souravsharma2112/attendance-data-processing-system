import { ToastContainer } from "react-toastify";

const ToasterWrapper = () => {
  return (
    <>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default ToasterWrapper;