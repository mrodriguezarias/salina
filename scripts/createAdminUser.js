import dbUtils from "../src/utils/db"
import userService from "../src/services/user"

const userData = {
  name: "admin",
  password: "utnfrbadadm",
  admin: true,
}

const createAdminUser = {
  name: "create_admin_user",
  run: async () => {
    await dbUtils.connect(true)
    try {
      await userService.createUser(userData)
      console.info("Created admin user")
      console.info("Username:", userData.name)
      console.info("Password:", userData.password)
    } catch (error) {
      if (error.status === 409) {
        console.error("Error: user already exists")
      } else {
        throw error
      }
    } finally {
      dbUtils.disconnect()
    }
  },
}

export default createAdminUser
