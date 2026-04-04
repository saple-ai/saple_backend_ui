const style = () => ({
    '.tileTable': {
        '& table': {
            borderCollapse: 'separate',
            borderSpacing: '0 10px',
            width: '100%'
        },
        '& th': {
            border: 'none'
        },
        '& td': {
            border: '1px solid #dfdfdf',
            padding: '12px',
            borderLeft: 'none',
            borderRight: 'none',
            minWidth: '130px'
        },
        '& tr': {
            marginBottom: '10px'
        },
        '.tableHeader': {
            '& .MuiTableCell-head': {
                background: 'transparent',
                padding :'2px 16px'
            },
            '& .MuiOutlinedInput-input': {
                padding: '6.5px 14px', 
                background: '#F5F6FB' 
            }
        },
        '.tableBody': {
            '& .MuiTableCell-body': {
                borderColor: '#dfdfdf',
                background: '#fff',
                '&:first-child': {
                    borderTopLeftRadius: '6px',
                    borderBottomLeftRadius: '6px',
                    borderLeft: '1px solid #dfdfdf',
                },
                '&:last-child': {
                    borderTopRightRadius: '6px',
                    borderBottomRightRadius: '6px',
                    borderRight: '1px solid #dfdfdf',
                }
            }
        },
        '.userTabel': {
            display: 'flex',
            justifyContent: 'space-around'
        }
    },
    '.stripedTable': {
        '.tableHeader': {
            '& .MuiTableCell-head': {
                background: '#f4f5fe',
                borderBottom: 'none',
                '&:first-child': {
                    borderTopLeftRadius: '6px',
                    borderBottomLeftRadius: '6px'
                },
                '&:last-child': {
                    borderTopRightRadius: '6px',
                    borderBottomRightRadius: '6px'
                }
            }
        },
        '.tableBody': {
            '& .MuiTableCell-body': {
                borderColor: '#f5f5f5'
            }
        },
        '.cellContent': {
            minWidth: '100px'
        }
    }
})
export default style;