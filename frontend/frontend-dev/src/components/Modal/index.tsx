// Source: https://tailwindui.com/components/application-ui/overlays/modals
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../Button";

interface IModalProps {
  title?: string;
  bodyText?: string;
  cancelText?: string;
  okText?: string;
  isOpened: boolean;
  onClose?: (result: boolean) => void;
}

const defaultProps = {
  cancelText: "Cancel",
  okText: "OK",
};

function Modal({
  title,
  bodyText,
  cancelText,
  okText,
  isOpened,
  onClose,
}: IModalProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(isOpened);
  }, [isOpened]);

  const handleCancel = () => {
    onClose && onClose(false);
    setOpen(false);
  };
  const handleConfirm = () => {
    onClose && onClose(true);
    setOpen(false);
  };

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={handleCancel}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    {title && (
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900">
                        {title}
                      </Dialog.Title>
                    )}
                    {bodyText && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{bodyText}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button onClick={handleConfirm}>{okText}</Button>
                <Button
                  variant="hidden"
                  className="mr-2"
                  onClick={handleCancel}
                  ref={cancelButtonRef}>
                  {cancelText}
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

Modal.defaultProps = defaultProps;

export default Modal;
