export const authConfig = {
  providers: [], // configured in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminPage = nextUrl.pathname.startsWith('/admin');
      
      if (isAdminPage) {
        const allowedEmails = ["info.ozirus@gmail.com", "contact.fotie@gmail.com"];
        if (isLoggedIn) return !!auth.user?.email && allowedEmails.includes(auth.user.email);
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
  },
} as any;