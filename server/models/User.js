class User {
	constructor(id, email, username, password, behavior) {
		this.id = id;
		this.email = email;
		this.username = username;
		this.password = password;
		this.behavior = behavior;
	}
}

module.exports = User;