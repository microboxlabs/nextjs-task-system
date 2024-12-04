export const Delete = ({ color = "white" }) => {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.75 5.3335V6.07424H6V7.55572H6.75V17.1853C6.75 17.5783 6.90804 17.9551 7.18934 18.2329C7.47064 18.5107 7.85218 18.6668 8.25 18.6668H15.75C16.1478 18.6668 16.5294 18.5107 16.8107 18.2329C17.092 17.9551 17.25 17.5783 17.25 17.1853V7.55572H18V6.07424H14.25V5.3335H9.75ZM8.25 7.55572H15.75V17.1853H8.25V7.55572ZM9.75 9.0372V15.7039H11.25V9.0372H9.75ZM12.75 9.0372V15.7039H14.25V9.0372H12.75Z"
          fill={color}
        />
      </svg>
    );
  };

  export const Edit = ({ color = "white" }) => {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.225 9.84491L14.1244 6.77642L15.1458 5.75359C15.4255 5.47353 15.7691 5.3335 16.1767 5.3335C16.5842 5.3335 16.9276 5.47353 17.2068 5.75359L18.2282 6.77642C18.5078 7.05648 18.6537 7.3945 18.6659 7.79048C18.6781 8.18646 18.5443 8.52424 18.2647 8.80382L17.225 9.84491ZM16.1672 10.9225L8.43393 18.6668H5.33333V15.5618L13.0666 7.81751L16.1672 10.9225Z"
          fill={color}
        />
      </svg>
    );
  };

  export function Loading() {
    return (
      <div className="fixed h-screen w-screen flex items-center justify-center bg-white bg-opacity-40 z-50">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  export function Back() {
    return (
      <svg
        className="w-5 h-5 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    );
  }
  
  export function Forward() {
    return (
      <svg
        className="w-5 h-5 ml-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    );
  }
  

  export function Person({color = "white"}) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="100"
        height="100"
        fill={color}
      >
        <path d="M12 0c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 10c3.33 0 10 1.67 10 5v1h-20v-1c0-3.33 6.67-5 10-5z" />
      </svg>
    );
  }

  export const AngleBotton = ({ color = "black" }) => {
    return (
      <svg
        width="14"
        height="8"
        viewBox="0 0 17 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.22675 9.631C7.86775 9.631 7.50775 9.494 7.23475 9.22L0.41175 2.396C-0.13725 1.848 -0.13725 0.959 0.41175 0.411C0.95775 -0.137 1.84875 -0.137 2.39575 0.411L8.22675 6.242L14.0577 0.411C14.6047 -0.137 15.4958 -0.137 16.0417 0.411C16.5907 0.959 16.5907 1.848 16.0417 2.396L9.21875 9.219C8.94575 9.493 8.58575 9.631 8.22675 9.631Z"
          fill={color}
        />
      </svg>
    );
  };

  export const Search = ({ color = "var(--textButton)" }) => {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.146 12.371 1.888 11.113C0.629333 9.85433 0 8.31667 0 6.5C0 4.68333 0.629333 3.14567 1.888 1.887C3.146 0.629 4.68333 0 6.5 0C8.31667 0 9.85433 0.629 11.113 1.887C12.371 3.14567 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.81267 10.5627 9.688 9.688C10.5627 8.81267 11 7.75 11 6.5C11 5.25 10.5627 4.18733 9.688 3.312C8.81267 2.43733 7.75 2 6.5 2C5.25 2 4.18733 2.43733 3.312 3.312C2.43733 4.18733 2 5.25 2 6.5C2 7.75 2.43733 8.81267 3.312 9.688C4.18733 10.5627 5.25 11 6.5 11Z"
          fill={color}
        />
      </svg>
    );
  };