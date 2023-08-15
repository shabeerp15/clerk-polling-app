'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useState, Suspense } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';
import Loading from './Loading';

interface UserPollType {
   question: string;
   selectedOption: string;
}

interface PollData {
   id: number;
   question: string;
   options: string[];
   selected?: string;
}

const Dashboard: React.FC = () => {
   const [pollList, setPollList] = useState<PollData[] | []>();
   const [loading, setLoading] = useState<Boolean>(true);
   const [pollListChanged, setPollListChanged] = useState<boolean>(false);

   const router = useRouter();

   const { user } = useUser();
   const { toast } = useToast();

   const handlePollSubmit = async (pollId: number, selectedOption: any) => {
      const poll = pollList?.find((item, i) => i === pollId);

      if (poll) {
         const userPoll = {
            username: user?.id,
            questionId: poll.id,
            question: poll.question,
            selectedOption: selectedOption,
         };

         const { data } = await axios.post("/api/result", userPoll, {
            headers: {
               "Content-Type": "application/json",
            },
         });

         if (!data.error) {
            toast({ title: "Success!" });
            setPollListChanged(true);
         }
      }
   };

   useEffect(() => {
      setLoading(true);
      const fetchpolls = async () => {
         const { data } = await axios.get(`/api/question`, {
            headers: {
               "Content-Type": "application/json",
            },
         });
         setPollList(data.data);
         setLoading(false);
      };
      fetchpolls();
   }, [pollListChanged]);

   return (
      <>
         <div className="flex">
            <Link href="poll/create" className="ml-auto">
               <Button>Create New</Button>
            </Link>
         </div>
         <h1 className="text-2xl font-bold">Active Polls</h1>
         {loading && <Loading />}
         {!loading && (
            <div className="w-full mt-3">
               {pollList?.map((item, i) => (
                  <div key={i}>
                     <Separator className="mb-5" />
                     <div className="relative">
                        <Button className="absolute right-0" variant="outline" onClick={() => router.push(`/poll/result/${item.id}`)}>
                           View Result
                        </Button>
                     </div>
                     <div className="mb-5" key={i}>
                        <Label className="text-xl">{item.question}</Label>
                        <RadioGroup className="m-2" defaultValue={item.selected} disabled={item.selected ? true : false}>
                           {item.options.map((option, optionindex) => (
                              <div className="flex items-center space-x-2 mb-2" key={optionindex}>
                                 <RadioGroupItem value={option} id={option} onClick={() => handlePollSubmit(i, option)} />
                                 <Label htmlFor={option}>{option}</Label>
                              </div>
                           ))}
                        </RadioGroup>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </>
   );
};

export default Dashboard;
