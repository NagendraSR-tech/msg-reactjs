import React, { useRef, useState, useEffect } from "react";
import { Popover, PopoverHeader, PopoverBody } from "reactstrap";
import { BsInfoCircle } from "react-icons/bs";

const PopoverC = ({ id, content }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const buttonRef = useRef(null);

  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  useEffect(() => {
    window.addEventListener("click", closePopover);

    return () => {
      window.removeEventListener("click", closePopover);
    };
  }, []);

  const handleButtonClick = (event) => {
    event.stopPropagation();
    togglePopover();
  };

  if (!content || content.trim() === "") {
    return null;
  }

  return (
    <>
      <span
        type="button"
        ref={buttonRef}
        id={`popover-${id}`}
        onClick={handleButtonClick}
      >
        <BsInfoCircle />
      </span>
      <Popover
        placement="right"
        isOpen={popoverOpen}
        target={`popover-${id}`}
        toggle={togglePopover}
        trigger="legacy"
        fade={false}
      >
        {/* <PopoverHeader>{useCase.name}</PopoverHeader> */}
        <PopoverHeader>Help</PopoverHeader>
        <PopoverBody>{content}</PopoverBody>
      </Popover>
    </>
  );
};

export default PopoverC;
