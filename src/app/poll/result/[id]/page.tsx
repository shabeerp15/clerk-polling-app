'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from './loading';

interface PollResult {
   id: string;
   question: string;
   options: [{ option: string; result: number }];
   total_polls: number;
}

const ResultPage = ({ params }: { params: { id: string } }) => {
   const [loading, setLoading] = useState<Boolean>(true);
   const [pollResult, setPollResult] = useState<PollResult[] | []>();

   useEffect(() => {
      setLoading(true);
      const fetchPollResult = async () => {
         const { data } = await axios.get(`/api/result/${params?.id}`, {
            headers: {
               'Content-Type': 'application/json',
            },
         });
         setPollResult(data.data);
         setLoading(false);
      };
      fetchPollResult();
   }, [params?.id]);

   const router = useRouter();
   return (
      <>
         <div className='flex'>
            <Button onClick={() => router.back()}>Go Back</Button>
         </div>
         <div className='shadow-md mt-3 p-4'>
            {loading && <Loading />}
            {pollResult && (
               <>
                  <Label className='text-2xl font-bold'>{pollResult[0]?.question}</Label>
                  {pollResult[0]?.options.map((i, index) => (
                     <div key={index} className='m-1 mb-3'>
                        <span className=''>{i.option}:</span>
                        <span className='font-bold ml-4'>
                           {(i.result * 100) / pollResult[0].total_polls}%
                           <Progress value={(i.result * 100) / pollResult[0].total_polls} />
                        </span>
                     </div>
                  ))}
               </>
            )}
         </div>
      </>
   );
};

export default ResultPage;
