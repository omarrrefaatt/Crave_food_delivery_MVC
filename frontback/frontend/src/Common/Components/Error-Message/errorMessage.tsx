interface ErrorMessageProps {
  text: string;
  isVisible?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  text,
  isVisible = false,
}) => {
  return (
    <p
      className={`${
        isVisible ? "block" : "hidden"
      } text-red-600 p-2 font-sans text-md`}
    >
      {text}
    </p>
  );
};

export default ErrorMessage;
