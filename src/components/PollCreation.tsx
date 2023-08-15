'use client';
import React, { MouseEvent, useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

const PollCreation: React.FC = () => {
   // const [title, setTitle] = useState('');
   const [options, setOptions] = useState(['']);
   const [expiryDate, setExpiryDate] = useState<Date>();

   const { user } = useUser();
   const { toast } = useToast();
   const router = useRouter();
   const {
      register,
      control,
      handleSubmit,
      formState: { errors },
   } = useForm();

   // const { errors } = formState;

   // const { name, ref, onChange, onBlur } = register('title');

   const handleAddOptions = () => {
      setOptions([...options, '']);
   };

   const handleOptionChange = (index: number, value: string) => {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
   };

   const handleRemoveOption = (index: number) => {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
   };

   // const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
   //    e.preventDefault();

   //    // if (!title) return toast({ title: 'Scheduled: Catch up ' });
   //    if (!expiryDate) return toast({ title: 'Please select expiry date.' });

   //    const formData = {
   //       username: user?.id,
   //       question: title,
   //       options,
   //       expiryDate: expiryDate,
   //    };
   //    const { data } = await axios.post('/api/question', formData, {
   //       headers: {
   //          'Content-Type': 'application/json',
   //       },
   //    });

   //    if (!data.error) {
   //       router.back();
   //    }
   // };

   const onSubmit = async (data: any) => {
      if (!expiryDate) return toast({ title: 'Please select expiry date.' });

      const formData = {
         username: user?.id,
         question: data.title,
         options,
         expiryDate: expiryDate,
      };
      const res = await axios.post('/api/question', formData, {
         headers: {
            'Content-Type': 'application/json',
         },
      });

      if (!res.data.error) {
         router.back();
      }
   };

   return (
      <div className='w-full flex justify-center'>
         <div className='p-6 rounded-md shadow-md w-full'>
            <div className='flex justify-end'>
               <Popover>
                  <PopoverTrigger asChild>
                     <Button variant={'outline'} className={cn('w-[280px] justify-start text-left font-normal', !expiryDate && 'text-muted-foreground')}>
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {expiryDate ? format(expiryDate, 'PPP') : <span>Expiry Date</span>}
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                     <Calendar mode='single' selected={expiryDate} onSelect={setExpiryDate} initialFocus fromDate={new Date()} />
                  </PopoverContent>
               </Popover>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
               <div className='mb-5'>
                  <Label htmlFor='title'>Title</Label>
                  <Input
                     id='title'
                     {...register('title', { required: 'Title is required.' })}
                     // value={title}
                     // onChange={(e) => setTitle(e.target.value)}
                     // placeholder='Type your question here'
                  />
                  <p className='text-red-500 text-sm my-2'>{(errors as any).title?.message}</p>
               </div>
               <div className='mb-5'>
                  <Label htmlFor='option'>Answer Options</Label>
                  {options.map((option, index) => (
                     <div key={index} className='mb-2 relative'>
                        <Input
                           id={`option-${index}`}
                           {...register(`option-${index}`, { required: 'option is not to be empty.' })}
                           value={option}
                           onChange={(e) => handleOptionChange(index, e.target.value)}
                           placeholder={`Option ${index + 1}`}
                        />

                        {options.length > 1 && (
                           <Button type='button' className='p-0 m-0 bg-black hover:bg-white text-red-400 hover:text-red-800 absolute right-2 top-5 h-0' onClick={() => handleRemoveOption(index)}>
                              X
                           </Button>
                        )}
                        <p className='text-red-500 text-sm my-2'>{(errors as any)[`option-${index}`]?.message}</p>
                     </div>
                  ))}
               </div>
               <div className='mb-5'>
                  {options.length < 4 && (
                     <Button type='button' className='bg-gray-200 text-gray-500 hover:bg-gray-300' onClick={handleAddOptions}>
                        + Add option
                     </Button>
                  )}
               </div>
               <div className='flex justify-end'>
                  <Button className='bg-green-500'>Save</Button>
               </div>
            </form>
            <DevTool control={control} />
         </div>
      </div>
   );
};

export default PollCreation;
