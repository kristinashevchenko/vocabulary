import React from 'react';
import { Dropdown } from 'react-bootstrap'

const CustomDropdownItem = (props) => {
    const { onItemClick, itemText } = props;

    const onDropdownItemClick = (event) => {
        const name = event.target.name;
        onItemClick(name);
    }
    return (
        <Dropdown.Item {...props} onClick={onDropdownItemClick}>{itemText}</Dropdown.Item>
    )
}

export default CustomDropdownItem;