

export interface ToDoButtonInterface {
    handleClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => void;
    text: string;
    invalid?: boolean;
}