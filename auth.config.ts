export const authConfig = {
  providers: [], // configured in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminPage = nextUrl.pathname.startsWith('/admin');
      
      if (isAdminPage) {
        if (isLoggedIn) return auth.user?.email === "info.ozirus@gmail.com";
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
  },
} as any;