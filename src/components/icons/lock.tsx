export interface IconProps extends React.SVGProps<SVGSVGElement> {
  strokeWidth?: number;
  size?: string;
}

export function LockIcon({ strokeWidth = 1.5, size = "18px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      {...props}
    >
      <path
        d="M12.75 8.25H5.25C4.14543 8.25 3.25 9.14543 3.25 10.25V14.25C3.25 15.3546 4.14543 16.25 5.25 16.25H12.75C13.8546 16.25 14.75 15.3546 14.75 14.25V10.25C14.75 9.14543 13.8546 8.25 12.75 8.25Z"
        fill="currentColor"
        fillOpacity="0.3"
        data-color="color-2"
        data-stroke="none"
      />
      <path
        d="M5.75 8.25V5C5.75 3.205 7.205 1.75 9 1.75C10.795 1.75 12.25 3.205 12.25 5V8.25"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9 11.75V12.75"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M12.75 8.25H5.25C4.14543 8.25 3.25 9.14543 3.25 10.25V14.25C3.25 15.3546 4.14543 16.25 5.25 16.25H12.75C13.8546 16.25 14.75 15.3546 14.75 14.25V10.25C14.75 9.14543 13.8546 8.25 12.75 8.25Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
