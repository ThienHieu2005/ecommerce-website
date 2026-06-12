import { Modal } from 'antd'
import React from 'react'

const ModalComponent = ({
    title = 'Modal',
    isOpen = false,
    children,
    width = 600,
    onCancel,
    footer,
    ...rests
}) => {
    return (
        <Modal
            title={title}
            open={isOpen}
            centered
            width={width}
            onCancel={onCancel}
            footer={footer}
            {...rests}
        >
            {children}
        </Modal>
    )
}

export default ModalComponent