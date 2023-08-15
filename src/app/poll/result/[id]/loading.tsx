import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
   return (
      <>
         <Skeleton className='w-[500px] h-6 mb-4'></Skeleton>
         {Array.from({ length: 4 }, (item, index) => (
            <div className='m-1 mb-3' key={index}>
               <Skeleton className='w-[250px] h-4 mb-2'></Skeleton>
               <Skeleton className='w-full h-4' />
            </div>
         ))}
      </>
   );
};

export default Loading;
