export default (state = { loggedIn: null, profile: null }, action) => {
	if (action.type === "SIGN_IN")
		return { ...state, loggedIn: true, profile: action.payload };
	else if (action.type === "SIGN_OUT")
		return { ...state, loggedIn: false, profile: null };
	return state;
};
