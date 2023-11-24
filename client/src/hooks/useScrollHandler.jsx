import { useEffect } from "react"

const useScrollHandler = (containerRef, shouldScrollRef, dependencies) => {
    
    //Function to evaluate if user scrolled to the bottom of MessageContainer
    const handleScroll = () => {
        shouldScrollRef.current = containerRef.current.scrollTop === containerRef.current.scrollHeight - containerRef.current.clientHeight
    }

    useEffect(() => {
        if (shouldScrollRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, [dependencies]);


    return handleScroll
}

export default useScrollHandler