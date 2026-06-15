def firstOccurrence(nums):
    start = 0
    end = len(nums)
    mid = 0
    lt = []

    while (start < end):
        mid = (start+end)//2
        # print (start, mid, end)
        
        if(nums[mid] == 1 ):
            lt.append(mid)
            end = mid
            # print (lt)

        else:
            start = mid+1
        
    if (len(lt) == 0):
        return -1
    
    return (min(lt))