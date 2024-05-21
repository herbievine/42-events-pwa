import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./__root";

export const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	loader: async () => {
		if (localStorage.getItem('token')) {
			redirect({
				to: '/',
			});
		}
	},
	component: LoginPage,
});

function LoginPage() {
	function loginLink() {
		const url = new URL('https://api.intra.42.fr/oauth/authorize');

		const state = Math.random().toString(36).substring(7);

		url.searchParams.append('client_id', import.meta.env.VITE_FORTY_TWO_API_CLIENT);
		url.searchParams.append('redirect_uri', `${import.meta.env.VITE_BASE_URL}/auth/callback`);
		url.searchParams.append('scope', 'public');
		url.searchParams.append('state', state);
		url.searchParams.append('response_type', 'code');

		return url.href;
	}

	return (
    <div className="w-full h-screen flex justify-center items-center">
			<a href={loginLink()}>
				Login with your 42 account
			</a>
		</div>
  );
}
