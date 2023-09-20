// components/Modal.tsx

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white relative rounded-lg w-1/2 p-6'>
        <button
          type='button'
          onClick={onClose}
          className='ml-2 absolute right-5 font-bold text-md bg-white border-gray-200 hover:bg-gray-200 text-slate py-2 px-4 rounded focus:outline-none transition duration-200'
        >
          X
        </button>
        <h2 className='text-xl font-semibold mb-4'>{title}</h2>
        {children}
        {/* <div className='mt-4 flex justify-end'>
          <button onClick={onClose} className='text-gray-600 mr-4'>
            Cancel
          </button> */}
          {/* <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Save</button> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Modal;
