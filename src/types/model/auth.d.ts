interface Auth {
    token?: string | null
    hash?: string | null
}

interface AuthModel extends Auth {
    isLoggedIn: boolean
}
