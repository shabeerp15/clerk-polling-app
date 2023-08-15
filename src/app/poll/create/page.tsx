'use client';
import PollCreation from '@/components/PollCreation';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function PollCreationPage() {
   const router = useRouter();
   return (
      <div className='w-full'>
         <Button className='mb-4' onClick={() => router.push('/dashboard')}>
            Go Back
         </Button>
         <PollCreation />
      </div>
   );
}

export default PollCreationPage;
