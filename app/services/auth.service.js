class AuthService {
  constructor(client) {
    this.user = client.db().collection("users");
  }
  // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
  extractUserData(payload) {
    const user = {
      username: payload.username,
      password: payload.password,
    };
    // Remove undefined fields
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }
  async create(payload) {
    const user = this.extractUserData(payload);
    const result = await this.user.insertOne(user);
    return result;
  }

  async findByName(username) {
    return await this.user.findOne({
      username: { $regex: new RegExp(username), $options: "i" },
    });
  }
}

module.exports = AuthService;
