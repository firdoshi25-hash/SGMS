import { Link } from "react-router-dom";

function AuthLayout({ children }) {
	return (
		<main className="auth-layout">
			<Link className="auth-brand" to="/">SGMS <span>Student Growth</span></Link>
			{children}
		</main>
	);
}

export default AuthLayout;
