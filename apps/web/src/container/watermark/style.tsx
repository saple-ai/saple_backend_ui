const style = () => ({
    '.watermark': {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        color: 'rgba(0, 0, 0, 0.5)',
        fontSize: '12px',
        zIndex: 9999,
        '@media only screen and (max-width: 900px)': {
            '&.watermark': {
                display: 'block',
                marginTop: '20px',
                position: 'relative',
                zIndex: '0',
            }
        }

    }
})
export default style;