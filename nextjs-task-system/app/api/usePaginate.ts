import { useEffect, useState } from 'react'

export const usePaginate = (initialOffset: number, limit: number, initialPage: number) => {

    const [offset, setOffset] = useState(initialOffset);
    const [page, setPage] = useState(initialPage);


    const onNext = () => {
        setOffset( prev => prev + limit);
        setPage(page + 1);
    }


    const onPrev = () => {

        setOffset( prev => {
            if(prev <= initialOffset){
                setPage(initialPage)
                return initialOffset;
            } else {
                setPage(page-1);
                return prev - limit;
            }
        });
    }


  return {
    offset,
    page,
    onNext,
    onPrev,
    setPage
  }
}