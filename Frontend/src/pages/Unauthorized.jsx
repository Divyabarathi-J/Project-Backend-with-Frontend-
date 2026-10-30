import { Link } from "react-router-dom";

const Unauthorized = () => {

    return (
        <div className="unauthorized">

            <h1>403</h1>

            <h2>Access Denied</h2>

            <p>
                You do not have permission to access this page.
            </p>

            <Link to="/">
                Go to Dashboard
            </Link>

        </div>
    );
};

export default Unauthorized;