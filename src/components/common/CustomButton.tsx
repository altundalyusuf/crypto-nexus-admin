import Button, { ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

// Extend MUI ButtonProps to keep all standard features (onClick, sx, etc.)
// Add specific props for our app logic
interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export default function CustomButton({
  children,
  isLoading,
  disabled,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || isLoading} // Disable automatically if loading
      sx={{
        textTransform: "none", // Modern apps rarely use UPPERCASE buttons anymore
        borderRadius: 2, // Consistent rounded corners
        fontWeight: 600,
        ...props.sx,
      }}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
}
