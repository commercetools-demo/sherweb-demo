import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authenticateCustomer } from '@/lib/commercetools/customers';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const customer = await authenticateCustomer(credentials.email, credentials.password);
          if (customer) {
            const role = customer.custom?.fields?.role ?? credentials.role ?? 'end-customer';
            const businessUnitKey = customer.custom?.fields?.businessUnitKey ?? '';
            const businessUnitName = customer.custom?.fields?.businessUnitName ?? '';
            return {
              id: customer.id,
              email: customer.email,
              name: `${customer.firstName} ${customer.lastName}`,
              role,
              businessUnitKey,
              businessUnitName,
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.businessUnitKey = (user as any).businessUnitKey;
        token.businessUnitName = (user as any).businessUnitName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).businessUnitKey = token.businessUnitKey;
        (session.user as any).businessUnitName = token.businessUnitName;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
