import React from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import './FilterMenu.scss';

export default function FilterMenu({
                                       firstItem,
                                       menuItems,
                                       selectedValueText,
                                       handleFilterChange,
                                       variant,
                                       rowRenderer,
                                   }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    // const [isChecked, setIsChecked] = useState(true);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleFilterChange && handleFilterChange();
    };

    const handleMenuItemClick = (item) => {
        if (item.onClick) {
            item.onClick();
        }
        handleMenuClose();
    };

    function singleSelectFilter() {
        return (
            <div>
                <Button
                    aria-controls="dropdown-menu"
                    aria-haspopup="true"
                    onClick={handleMenuClick}
                    className={'filter-dropdown-button'}
                    disableRipple
                >
                    <Box>
                        <Box>
                            <Box className="small-labels">{firstItem}</Box>
                            <Box className="body-m">
                                {selectedValueText}
                            </Box>
                        </Box>
                        <Box className="dropdown-menu-arrows"> {open ? <i className="ri-arrow-up-s-line"></i> :
                            <i className="ri-arrow-down-s-line"></i>}</Box>
                    </Box>
                </Button>
                <Menu
                    className="dropdown-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    keepMounted
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    {menuItems.map((item, index) => (
                        item.isVisible && <MenuItem key={index}
                                                    onClick={() => handleMenuItemClick(item)}
                                                    style={index !== menuItems.length - 1 ? { borderBottom: '1px solid var(--neutrals-border-grey)' } : {}}
                        >
                            <div className={`body-m menu-item-content`}>
                                {rowRenderer && rowRenderer(index)}
                            </div>
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        )
    }

    switch (variant) {
        case "single-select-custom-render":
        default:
            return singleSelectFilter();
    }
}
