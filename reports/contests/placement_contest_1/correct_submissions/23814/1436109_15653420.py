def firstOccurrence(nums):
    s, e = 0, len(nums)-1
    first = -1
    while( s<=e):
        mid = s+(e-s)//2

        if(nums[mid] == 1):
            first = mid
            e = mid-1
            
        else:
            s = mid+1
            
    # print(first)
    return first