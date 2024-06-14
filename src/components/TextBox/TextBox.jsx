import React, { useEffect, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import './TextBox.scss';
import { bodyM } from "../../styles/insightIq";
import PropTypes from 'prop-types';
import { isEmpty } from "../../utils/util";
import { Icons } from '../../components';

const useStyles = makeStyles(() => ({
    root: ({ height, backgroundColor, borderRadius }) => ({
        '& .MuiInputBase-input': {
            ...bodyM,
        },
        '& .MuiInputBase-input::placeholder': {
            color: 'var(--neutrals-secondary-grey)', // Set the placeholder color
        },
        '& .MuiOutlinedInput-root': {
            height,
            backgroundColor,
            borderRadius,
            paddingRight: '16px',
            paddingLeft: '16px',
            '& fieldset': {
                border: '2px solid var(--neutrals-border-grey)'
            },
            '&:hover fieldset': {
                borderColor: 'var(--main-primary)',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'var(--main-primary)',
            },
            '&.Mui-focused': {
                '& fieldset': {
                    borderColor: 'var(--main-primary)',
                },
                '& .search-icon': {
                    color: 'var(--main-primary)', // Set the color of the search icon when the text box is focused
                },
            },
            '&:hover .search-icon': {
                color: 'var(--main-primary)', // Set the color of the search icon when the text box is focused
            },
        },
        '& .MuiInputAdornment-root': {
            color: 'var(--neutrals-secondary-grey)', // Set the color of icons
        },
    }),
}));

function TextBox({ variant, onEnter, onClear, value, placeholder, containerClass, disableEnterIcon, ...textFieldProps }) {
    const [searchText, setSearchText] = useState(value);

    useEffect(() => {
        setSearchText(value);
    }, [value]);

    let inputProps = {
        endAdornment: (
            <>
                {searchText ? (
                    <span className={'span-end-adornment'}>
                        <Icons.enter_icon onClick={handleSearch} style={ disableEnterIcon ? { display: "none" }: {}} />
                        <i className={'ri-close-line clear-icon'} onClick={handleClear}/>
                    </span>
                ) : null}
            </>
        )
    };
    let inputHeight = '';

    switch (variant) {
        case 'short':
            inputProps = {
                startAdornment: (
                    <InputAdornment position={'start'}>
                        <i className={'ri-search-line search-icon'}></i>
                    </InputAdornment>
                ),
                ...inputProps
            };
            inputHeight = '44px';
            break;
        case 'default-with-search-icon':
            inputProps = {
                startAdornment: (
                    <InputAdornment position={'start'}>
                        <i className={'ri-search-line search-icon'}></i>
                    </InputAdornment>
                ),
                ...inputProps
            };
            inputHeight = '56px';
            break;
        case 'default':
        default:
            inputHeight = '56px';
            break;
    }

    const classes = useStyles({
        height: inputHeight,
        backgroundColor: 'var(--neutrals-white) !important',
        borderRadius: '6px',
    });

    function handleSearch() {
        if (isEmpty(searchText)) {
            handleClear();
        } else {
            onEnter && onEnter(searchText.trim());
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    function handleClear() {
        setSearchText('');
        onClear && onClear();
    }

    return (
        <div className={`text-box-container ${containerClass}`}>
            <TextField
                className={`text-box-text-field ${classes.root}`} // Use makeStyles styles
                value={searchText}
                onChange={(e) => {
                    e.preventDefault()
                    setSearchText(e.target.value)
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                variant={'outlined'}
                InputProps={inputProps}
                {...textFieldProps}
            />
        </div>
    );
}

TextBox.propTypes = {
    variant: PropTypes.oneOf(['short', 'default', 'default-with-search-icon']),
    onEnter: PropTypes.func,
    onClear: PropTypes.func,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    textFieldProps: PropTypes.any,
    containerClass: PropTypes.string,
};

TextBox.defaultProps = {
    variant: 'default',
};

export default TextBox;
