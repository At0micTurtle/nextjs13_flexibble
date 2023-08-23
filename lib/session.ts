import { getServerSession } from 'next-auth/next';
import { NextAuthOptions, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import { SessionInterface, UserProfile } from '@/common.type';
import { createUser, getUser } from './actions';
import GoogleProvider from 'next-auth/providers/google';
import jsonwebtoken from 'jsonwebtoken';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),    
  ],
  jwt: {
    encode: ({ secret, token }) => {
      return jsonwebtoken.sign({
        ...token,
        iss: 'grafbase',
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      }, secret);
    },
    decode: async ({ secret, token }) => {
      return jsonwebtoken.verify(token!, secret) as JWT;
    },
  },
  theme: {
    colorScheme: 'light',
    logo: '/logo.svg',
  },
  callbacks: {
    async session({ session }) {
      const email = session?.user?.email as string;

      try {
        const data = await getUser(email) as { user?: UserProfile };
        return {
          ...session,
          user: {
            ...session.user,
            ...data?.user,
          }
        };
      } catch (error: any) {
        console.log('Error retrieving user data: ', error.message);

        return session;
      }
    },
    async signIn({ user }: { user: AdapterUser | User }) {
      try {
        const userExists = await getUser(user?.email as string) as { user?: UserProfile};
        
        if(!userExists.user) {
          await createUser(user.name as string, user.email as string, user.image as string);
        }

        return true;
      } catch (error: any) {
        console.log('Error checking if user exists: ', error.message);
        return false;
      }
    }
  },
};

export async function getCurrentUser() {
  return await getServerSession(authOptions) as SessionInterface;
};
