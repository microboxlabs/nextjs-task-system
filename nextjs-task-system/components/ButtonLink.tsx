import React from 'react'
import { Button } from "flowbite-react";

interface MyButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    href?: string;
    label: string;
}

const MyButton: React.ForwardRefRenderFunction<
    HTMLButtonElement,
    MyButtonProps
> = ({ onClick, href, label }, ref) => {
    return (
        <Button href={href} onClick={onClick} ref={ref}>
            {label}
        </Button>
    )
}

export const ForwardedMyButton = React.forwardRef(MyButton)