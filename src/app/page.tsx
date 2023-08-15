import { SignIn, auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function Home() {
   const { userId } = auth();

   if (userId) {
      redirect('/dashboard');
   } else {
      redirect('/sign-in');
   }
   //  return <h1>test</h1>;
}
