/**
 * Copyright IBM Corp. 2021, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Import portions of React that are needed.
import React, { useRef, useState, useEffect } from 'react';
import { useClickOutside } from '../../global/js/hooks';
import { ChevronDown16, ChevronUp16 } from '@carbon/icons-react';

// Other standard imports.
import PropTypes from 'prop-types';
import cx from 'classnames';
import { pkg } from '../../settings';

// Carbon and package components we use.
import {
  Button,
  unstable_Menu as Menu,
  unstable_MenuItem as MenuItem,
  unstable_MenuDivider as MenuDivider,
  unstable_MenuRadioGroup as MenuRadioGroup,
} from 'carbon-components-react';

// The block part of our conventional BEM class names (blockClass__E--M).
const blockClass = `${pkg.prefix}--button-menu`;
const componentName = 'ButtonMenu';

// NOTE: the component SCSS is not imported here: it is rolled up separately.

// Default values for props
const defaults = {
  size: 'default',
  kind: 'primary',
  onClose: () => {},
  onMenuButtonClick: () => {},
};

/**
 * Combining a standard button with the Carbon menu, this component appears
 * as a button and has all the usual carbon Button props and rendering, but
 * acts as an overflow menu when clicked. The ButtonMenu component can contain
 * zero to many ButtonMenuItem, which is identical to the carbon
 * OverflowMenuItem component.
 */
export let ButtonMenu = React.forwardRef(
  (
    {
      // The component props, in alphabetical order (for consistency).

      children,
      className,
      iconDescription,
      kind = defaults.kind,
      label,
      menuOptionsClass,
      renderIcon: Icon,
      onClose = defaults.onClose,
      onMenuButtonClick = defaults.onMenuButtonClick,
      size = defaults.size,

      // Collect any other property values passed in.
      ...rest
    },
    ref
  ) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuCoords, setMenuCoords] = useState({});
    const outerButtonMenuRef = useRef();
    const localRef = ref || outerButtonMenuRef;
    const menuTrigger = useRef();

    useClickOutside(localRef, () => {
      onClose();
    });

    useEffect(() => {
      if (menuTrigger?.current) {
        const triggerCoords = menuTrigger?.current.getBoundingClientRect();
        // console.log(menuTrigger);
        // console.log(triggerCoords, menuTrigger?.current?.offsetHeight);
        setMenuCoords({
          x: triggerCoords.x,
          y: triggerCoords.y,
          height: triggerCoords.height
        });
      }
    }, [menuOpen]);

    // console.log(menuCoords);

    return (
    <div
      {...rest}
      ref={localRef}
      className={cx(
        blockClass, // Apply the block class to the main HTML element
        className, // Apply any supplied class names to the main HTML element.
        {
          [`${blockClass}__${size}`]: size,
        }
      )}
    >
      <Button
        iconDescription={iconDescription}
        size={size}
        kind={kind}
        renderIcon={
          Icon ? Icon : open ? ChevronUp16 : ChevronDown16
        }
        onClick={() => {
          if (!menuOpen) {
            setMenuOpen(true);
          }
          // setMenuOpen(prev => {
          //   console.log(prev);
          //   return !prev;
          // });
          onMenuButtonClick?.()
        }}
        className={cx(`${blockClass}__trigger`)}
        ref={menuTrigger}
      >
        {label}
      </Button>
      <Menu
        open={menuOpen}
        className="testing-wutttttt"
        onClose={() => {
          console.log('close menu fn?');
          setMenuOpen(false);
        }}
        size="md"
        x={menuCoords?.x + 1}
        y={menuCoords?.y + menuCoords?.height}
      >
        <MenuItem label="Share with">
          <MenuRadioGroup
            label="Share with"
            items={['None', 'Product team', 'Organization', 'Company']}
            initialSelectedItem="Product team"
          />
        </MenuItem>
        <MenuDivider />
        <MenuItem label="Cut" shortcut="⌘X" />
        <MenuItem label="Copy" shortcut="⌘C" />
        <MenuItem label="Copy path" shortcut="⌥⌘C" />
        <MenuItem label="Paste" shortcut="⌘V" disabled />
      </Menu>
    </div>
  )}
);

// Return a placeholder if not released and not enabled by feature flag
ButtonMenu = pkg.checkComponentEnabled(ButtonMenu, componentName);

// The display name of the component, used by React. Note that displayName
// is used in preference to relying on function.name.
ButtonMenu.displayName = componentName;

// The types and DocGen commentary for the component props,
// in alphabetical order (for consistency).
// See https://www.npmjs.com/package/prop-types#usage.
ButtonMenu.propTypes = {
  /**
   * Provide the contents of the ButtonMenu. This should be one or more
   * ButtonMenuItem components.
   */
  children: PropTypes.arrayOf(PropTypes.element).isRequired,

  /**
   * Provide an optional class to be applied to the containing node.
   */
  className: PropTypes.string,

  /**
   * If specifying the `renderIcon` prop, provide a description for that icon that can
   * be read by screen readers
   */
  iconDescription: Button.propTypes.iconDescription,

  /**
   * The three types the menu button supports: primary, tertiary and ghost.
   */
  kind: PropTypes.oneOf(['primary', 'tertiary', 'ghost']),

  /**
   * The button label for the menu trigger.
   */
  label: PropTypes.node,

  /**
   * class name applied to the overflow options
   */
  menuOptionsClass: PropTypes.string,

  /**
   * The setter fn for the open state
   */
  onClose: PropTypes.func,

  /**
   * The onClick fn for the menu button
   */
  onMenuButtonClick: PropTypes.func,

  /**
   * Optional prop to allow overriding the icon rendering.
   * Can be a React component class
   */
  renderIcon: Button.propTypes.renderIcon,

  /**
   * The size of the button/button menu items for the menu trigger. The values can be any valid
   * value for the carbon Button component 'size' prop.
   */
  size: Menu.propTypes.size,
};
