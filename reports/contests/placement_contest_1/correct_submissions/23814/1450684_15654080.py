def firstOccurrence(nums):
    start = 0
    end = len(nums)
    mid = 0
    lt = []

    while(start<end):
        mid = (start+end)//2

        if(nums[mid]==1):
            lt.append(mid)
            # lt.append(nums.index(1))
            end = mid
        else:
            start=mid+1

    if(len(lt)==0):
        return -1
    # return 

    return (min(lt))