import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
   return (
      <div className='w-full mt-3'>
         {Array.from({ length: 5 }, (item, index) => (
            <div key={index}>
               <Separator className='mb-5' />
               <div className='relative'>
                  <Skeleton className='absolute right-0 h-8 w-[100px]'></Skeleton>
               </div>
               <div className='mb-5'>
                  <Skeleton className='h-5 w-[800px]'></Skeleton>
                  <div className='m-2 space-y-4'>
                     <div className='flex'>
                        <Skeleton className='h-4 w-4 rounded-full'></Skeleton>
                        <Skeleton className='h-4 w-[250px] ml-3'></Skeleton>
                     </div>
                     <div className='flex'>
                        <Skeleton className='h-4 w-4 rounded-full'></Skeleton>
                        <Skeleton className='h-4 w-[250px] ml-3'></Skeleton>
                     </div>
                     <div className='flex'>
                        <Skeleton className='h-4 w-4 rounded-full'></Skeleton>
                        <Skeleton className='h-4 w-[250px] ml-3'></Skeleton>
                     </div>
                     <div className='flex'>
                        <Skeleton className='h-4 w-4 rounded-full'></Skeleton>
                        <Skeleton className='h-4 w-[250px] ml-3'></Skeleton>
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
};

export default Loading;
