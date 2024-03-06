import * as React from "react";
import clsx from "classnames";
import { Transition } from "@headlessui/react";
import { Placement } from "@popperjs/core";
import { usePopper } from "react-popper";

export interface TooltipProps {
  children: React.ReactNode[];

  /**
   * The placement of the tooltip relative to the triggering component.
   */
  placement?: Placement;

  /**
   * The element that the tooltip will be constrained to fit within.
   */
  boundary?: HTMLElement;

  /**
   * Whether the tooltip should be hidden when clicked.
   */
  hideOnClick?: boolean;
}

export type Props = TooltipProps & React.HTMLAttributes<HTMLDivElement>;

/**
 * A small component that displays some brief message when hovering on the
 * triggering component.
 */
const Tooltip: React.FC<Props> = ({
  children,
  placement = "bottom-start",
  boundary,
  hideOnClick = false,
  ...rest
}) => {
  if (children.length !== 2) {
    throw new Error("Tooltip must have exactly 2 children");
  }

  const triggerRef = React.useRef(null);
  const popperElRef = React.useRef(null);
  const arrowRef = React.useRef(null);

  const [popperElement, setPopperElement] = React.useState(null);
  const [, setArrowElement] = React.useState(null);
  const { styles, attributes } = usePopper(triggerRef.current, popperElement, {
    modifiers: [
      { name: "arrow", options: { element: arrowRef.current, padding: 10 } },
      { name: "offset", options: { offset: [0, 8] } },
      {
        name: "flip",
        options: {
          boundary: boundary,
        },
      },
    ],
    placement,
  });

  const [isOpen, setIsOpen] = React.useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleClickCapture = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hideOnClick) return;

      if (e.currentTarget === triggerRef.current) {
        if (isOpen) {
          closeModal();
        } else {
          openModal();
        }
      }
    },
    [hideOnClick, isOpen],
  );

  return (
    <>
      <div
        {...rest}
        ref={triggerRef}
        onMouseEnter={openModal}
        onMouseLeave={closeModal}
        onClickCapture={handleClickCapture}
      >
        {children[0]}
      </div>

      {/** see https://github.com/tailwindlabs/headlessui/issues/154 for more
       * details on how React-Popper and HeadlessUI work together
       */}
      <div
        id="tooltip"
        ref={popperElRef}
        style={styles.popper}
        {...attributes.popper}
        className="absolute z-[1002]"
      >
        <Transition
          as={React.Fragment}
          show={isOpen}
          beforeEnter={() => {
            setPopperElement(popperElRef.current);
            setArrowElement(arrowRef.current);
          }}
          afterLeave={() => {
            setPopperElement(null);
            setArrowElement(null);
          }}
          enter="transition-transform ease-out"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition-transform ease-in"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          unmount={false}
        >
          <div
            className={clsx("", {
              "inline-block items-center justify-center": true,
              "whitespace-nowrap text-xs font-bold": true,
              "rounded-lg p-1.5  border": true,
              "bg-zinc-300 dark:bg-zinc-800 ": true,
              "border-zinc-400/50 dark:border-zinc-600 ": true,
              "shadow-zinc-800 dark:shadow-zinc-800/60": true,
            })}
          >
            {children[1]}

            {/**
             * Style for arrow doesn't come with PopperJS. See src/index.css
             * For general styles, see https://popper.js.org/docs/v2/tutorial/#arrow
             */}
            <div
              id="arrow"
              ref={arrowRef}
              style={styles.arrow}
              {...attributes.arrow}
            />
          </div>
        </Transition>
      </div>
    </>
  );
};

export default Tooltip;
